import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MacAnalisisCapacidadPago, 
          MacEscenariosRiesgos, 
          MacPersona, 
          ScoringFlujoCajaLibre } from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { SrvDatosAnalisisService } from '../servicios/srv-datos-analisis.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first, firstValueFrom, take } from 'rxjs';
import { EscenariosFCLParametros } from '@app/_models/Macred/EscenariosFCLParametros';
import { Compania, User } from '@app/_models';
import { EscenariosFCLHistorico } from '@app/_models/Macred/EscenariosFCLHistorico';
import { IndicadoresFCLHistorico } from '@app/_models/Macred/IndicadoresFCLHistorico';
import { MacNivelRiesgo } from '@app/_models/Macred/NivelRiesgo';

@Component({selector: 'app-escenariofcl',
            templateUrl: './escenariofcl.component.html',
            styleUrls: ['../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class EscenariofclComponent implements OnInit {

  private userObservable: User;
  private businessObservable: Compania;

  @Output() onActualizarFormAnalisis_EscenarioFCL = new EventEmitter<{ponderacionLTV: string,
                                                                      capacidadPago: number }>();

  lstEscenariosRiesgo: MacEscenariosRiesgos[] = [];

  oAnalisis : MacAnalisisCapacidadPago;
  oPersona : MacPersona;
  oFCL : ScoringFlujoCajaLibre;

  listEscenariosEstres: MacEscenariosRiesgos[] = [];
  listEscenariosFCLHistorico: EscenariosFCLHistorico[] = [];
  listIndicadoresFCLHistorico: IndicadoresFCLHistorico[] = [];
  public listNivelesRiesgo : MacNivelRiesgo[] = [];

  public bordeSuccessEscenarioFCL = false;
  public bordeErrorEscenarioFCL = false;

  habilitaBtnCalcular: boolean = true;

  habilitaHistoricoFCL: boolean = false;

  public descEscenarioRiesgoSelect: string;

  submittedEscenarioFCLForm: boolean = false;
  formEscenarioFCL: UntypedFormGroup;
  get j() { return this.formEscenarioFCL.controls; }

  formResultadoFCL: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder,
              private macredService: MacredService,
              private accountService: AccountService,
              private alertService: AlertService,
              public srvDatosAnalisisService: SrvDatosAnalisisService) {

    this.userObservable = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;

    this.inicializaFormEscenarioFCL();
    this.inicializaFormResultadosFCL();

    this.getNivelesRiesgos();

    this.listEscenariosEstres = srvDatosAnalisisService.listEscenariosEstres;
  }

  ngOnInit(): void {

    this.srvDatosAnalisisService.analisisCapacidadPago$.subscribe(
      analisis => { 
        if (analisis && analisis.codigoTipoIngresoAnalisis===2) {
          this.oAnalisis = analisis;
          this.getHistoricoEscenariosFCL();
        }
    });

    this.srvDatosAnalisisService.personaAnalisis$.subscribe(
      persona => { 
        if (persona) this.oPersona = persona;
    });

    this.srvDatosAnalisisService.fclAnalisis$.subscribe(
      fcl => { 
        if (fcl) this.oFCL = fcl;
    });
  }

  private getNivelesRiesgos() {
  
      this.macredService.getNivelesRiesgos(false)
        .pipe(take(1))
        .subscribe({
          next: (response) => { this.listNivelesRiesgo = response; }
        });
    }

  private inicializaFormEscenarioFCL() {

    this.formEscenarioFCL = this.formBuilder.group({
      escenariosRiesgos : [null, Validators.required]
    });
  }
  private inicializaFormResultadosFCL(pResultado : ScoringFlujoCajaLibre = null) {

    this.formResultadoFCL = this.formBuilder.group({
      capacidadPagoFCL : [null],
      LTVHoyFCL : [null],
      LTVFuturo : [null]
    });
  }

  async calcularEscenariosFCL() : Promise<void> {

    const objParametros : EscenariosFCLParametros = this.crearObjetoFCLParametros();

    if (!objParametros) return null;

    try {

      const response = 
        await firstValueFrom(this.macredService.calculoEscenariosFCL(objParametros));

      if (response.exito) {

        this.getHistoricoEscenariosFCL();
        this.submittedEscenarioFCLForm = false;

        this.alertService.success( response.responseMesagge );
        this.mostrarBordeEscenarios('success'); 

      } else { this.alertService.error(response.responseMesagge); }
    } catch (error) { this.alertService.error(error); }
  }

  private async getHistoricoEscenariosFCL() : Promise<void> {

    try {

      const responseHistoricoEscenarios = 
        await firstValueFrom(this.macredService.getHistoricoEscenariosFCL(this.oAnalisis.codigoAnalisis).pipe(first()));

      const responseHistoricoIndicadores = 
        await firstValueFrom(this.macredService.getHistoricoIndicadoresFCL(this.oAnalisis.codigoAnalisis).pipe(first()));
    
      if (responseHistoricoEscenarios && responseHistoricoIndicadores) {

        // escenarios
        const index = responseHistoricoEscenarios[0].codEscenario;

        this.habilitaHistoricoFCL = true;

        this.listEscenariosFCLHistorico = responseHistoricoEscenarios;

        this.descEscenarioRiesgoSelect = this.listEscenariosEstres[index-1]?.descripcion ?? '';

        this.formEscenarioFCL.patchValue({ escenariosRiesgos: this.listEscenariosEstres[index-1] });

        // indicadores
        this.listIndicadoresFCLHistorico = responseHistoricoIndicadores;

        for (const element of this.listIndicadoresFCLHistorico) {

          switch (element.scnafclhNivelRiesgo) {
            case 1:   element.descRiesgoAsignado = 'Bajo';    break;
            case 2:   element.descRiesgoAsignado = 'Medio';   break;
            case 3:   element.descRiesgoAsignado = 'Alto';    break;
            default:  element.descRiesgoAsignado = 'Extremo'; break;
          }
        }

        const responseCapacidadPago = 
          await firstValueFrom(this.macredService.getCapacidadPagoAnalisis(this.oAnalisis.codigoAnalisis).pipe(first()));

        this.formResultadoFCL.patchValue({ capacidadPagoFCL: responseCapacidadPago });

        const deudaBase = this.oFCL.saldoTotalDeudaAnoBase;
        const deudaAnioDos = this.oFCL.saldoTotalDeudaAno2;

        const patrimonioBase = this.oFCL.valorPatrimonioActual;
        const patrimonioFuturo = this.oFCL.valorPatrimonioFuturoEstimado;

        let ltvHoy = 0;
        let ltvFuturo = 0;

        if ((deudaBase > 0 && patrimonioBase > 0) && (deudaAnioDos > 0 && patrimonioFuturo > 0)) {
          
          ltvHoy = (deudaBase / patrimonioBase) * 100;
          ltvFuturo = (deudaAnioDos / patrimonioFuturo) * 100;
        }

        this.formResultadoFCL.patchValue({ LTVHoyFCL: ltvHoy });
        this.formResultadoFCL.patchValue({ LTVFuturo: ltvFuturo });

        let actualiza : boolean = false;

        if (this.oAnalisis.ancapCapacidadPago != responseCapacidadPago) {
          actualiza = true;
          this.oAnalisis.ancapCapacidadPago = responseCapacidadPago;
          this.srvDatosAnalisisService.actualizarAnalisis(this.oAnalisis);
        }

        let descPonderacion : string = `LTV Hoy: ${ltvHoy.toFixed(2)}% - LTV Futuro: ${ltvFuturo.toFixed(2)}%`;

        if (this.oAnalisis.descPondLvt != descPonderacion) {
          actualiza = true;
          this.oAnalisis.descPondLvt = descPonderacion;
          this.srvDatosAnalisisService.actualizarAnalisis(this.oAnalisis);
        }

        if (actualiza) {
          this.onActualizarFormAnalisis_EscenarioFCL.emit({
            ponderacionLTV: this.oAnalisis.descPondLvt,
            capacidadPago: this.oAnalisis.ancapCapacidadPago
          });
        }
      }
    } catch (error) { this.alertService.error(error.message); }
  }

  private crearObjetoFCLParametros(): EscenariosFCLParametros {

    this.submittedEscenarioFCLForm = true;

    if (this.formEscenarioFCL.invalid) return null;
  
      let obj : EscenariosFCLParametros = new EscenariosFCLParametros;
  
      obj.idPersona = this.oPersona.id;
      obj.identificacionPersona = this.oPersona.identificacion;
      obj.usuarioConsulta = this.userObservable.identificacion;
      obj.estadoAnalisis = this.oAnalisis.analisisDefinitivo;
      obj.codAnalisis = this.oAnalisis.codigoAnalisis;
      obj.codTipoIngreso = this.oAnalisis.codigoTipoIngresoAnalisis;
      obj.idCompania = this.businessObservable.id;
      obj.idModeloAnalisis = this.oAnalisis.codigoModeloAnalisis;
      obj.idEscenarioModeloAnalisis = this.formEscenarioFCL.get('escenariosRiesgos')?.value.codEscenario;

      return obj;
  }

  generaReporteFCL(){

    const idAnalisis = this.oAnalisis.codigoAnalisis;
    const idEscenario = this.formEscenarioFCL.get('escenariosRiesgos')?.value.codEscenario;
    const idPersona = this.oPersona.id;
    const tipo = 'PDF'; // 'XLSX'

    this.macredService.getReporteFCLHistorico(idAnalisis, idEscenario, idPersona)
    .subscribe({
      next: (resp) => {
        if (!resp?.exito || !resp?.objetoDb) {
          alert(resp?.responseMesagge ?? 'Error al generar reporte');
          return;
        }

        // 1️⃣ Convertir de base64 → Blob
        const byteCharacters = atob(resp.objetoDb);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Tipo MIME
        const mime = tipo === 'PDF'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        const blob = new Blob([byteArray], { type: mime });

        // 2️⃣ Crear URL temporal
        const url = URL.createObjectURL(blob);

        // 3️⃣ Abrir en nueva pestaña
        window.open(url, '_blank');

        // 4️⃣ Forzar descarga automática
        const a = document.createElement('a');
        a.href = url;
        a.download = resp.responseMesagge ?? `ReporteFCL.${tipo === 'PDF' ? 'pdf' : 'xlsx'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // 5️⃣ Liberar memoria
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      },
      error: (err) => {
        alert('Error al recibir el archivo del servidor');
        console.error(err);
      }
    });
  }

  // generaReporteFCL(){

  //   const idAnalisis = this.oAnalisis.codigoAnalisis;
  //   const idEscenario = this.formEscenarioFCL.get('escenariosRiesgos')?.value.codEscenario;
  //   const idPersona = this.oPersona.id;

  //   this.macredService.getReporteFCLHistorico(idAnalisis, idEscenario, idPersona)
  //     .subscribe(resp => {
  //       if (resp.exito && resp.objetoDb) {
  //           const byteArray = Uint8Array.from(atob(resp.objetoDb), c => c.charCodeAt(0));
  //           const blob = new Blob([byteArray], { type: 'application/pdf' });
  //           const url = URL.createObjectURL(blob);
  //           window.open(url);
  //       }
  //     });
  // }

  private mostrarBordeEscenarios(tipo: 'success' | 'error') {
    this.bordeSuccessEscenarioFCL = tipo === 'success';
    this.bordeErrorEscenarioFCL = tipo === 'error';
    setTimeout(() => { this.bordeSuccessEscenarioFCL = false; this.bordeErrorEscenarioFCL = false; }, 2000);
  }
}
