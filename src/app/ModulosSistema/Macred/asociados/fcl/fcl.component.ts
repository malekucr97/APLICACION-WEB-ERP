import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Compania, Module, User } from '@app/_models';
import {
  MacAnalisisCapacidadPago,
  MacPersona,
  ScoringFlujoCajaLibre,
  TipoActividadEconomica
} from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { first, take } from 'rxjs/operators';
import { Output, EventEmitter } from '@angular/core';
import { SrvDatosAnalisisService } from '../servicios/srv-datos-analisis.service';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';

@Component({selector: 'app-fcl',
            templateUrl: './fcl.component.html',
            styleUrls: ['../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class FclComponent implements OnInit {
  //VARIABLES INPUT DEL COMPONENTE PADRE
  // @Input() _analisisCapacidadpago: MacAnalisisCapacidadPago;
  // @Input() oPersona: MacPersona;

  //VARIABLES OUTPUT PARA ENVIAR AL COMPONENTE PADRE
  @Output() onEscenariosFCL = new EventEmitter<ScoringFlujoCajaLibre>();

  // ## -- objetos suscritos -- ## //
  private userObservable: User;
  private companiaObservable: Compania;

  habilitaBtnEditar: boolean = false;
  habilitaBtnEliminar: boolean = false;
  habilitaBtnRegistrar: boolean = false;
  habilitaBtnGuardar: boolean = false;
  // habilitaBtnCalcular: boolean = false;
  habilitaBtnEscenariosFCL: boolean = false;

  // ## -- formularios -- ## //
  formularioFCL: UntypedFormGroup;
  submittedFCLForm: boolean = false;

  get j() { return this.formularioFCL.controls; }

  // ## -- variables -- ## //
  // analisisFlujoCajaLibre: ScoringFlujoCajaLibre = undefined;
  lstTiposActividadEconomica: TipoActividadEconomica[] = [];
  editarCamposFCL: boolean = true;
  habilitarFinalizacion: boolean = false;

  public bordeSuccessFCL = false;
  public bordeErrorFCL = false;

  objSeleccionadoFCL: ScoringFlujoCajaLibre;

  oPersona : MacPersona;
  oAnalisis : MacAnalisisCapacidadPago;

  public today : Date = new Date();

  constructor(private formBuilder: UntypedFormBuilder,
              private macredService: MacredService,
              private accountService: AccountService,
              private alertService: AlertService,
              private dialogo: MatDialog,
              public srvDatosAnalisisService: SrvDatosAnalisisService) {

    this.userObservable = this.accountService.userValue;
    this.companiaObservable = this.accountService.businessValue;

    this.inicializaFormularioFCL();

    this.getActividadesEconomicas();
  }

  ngOnInit(): void {

    this.srvDatosAnalisisService.personaAnalisis$.subscribe(
      persona => { 
        if (persona) this.oPersona = persona;
    });

    this.srvDatosAnalisisService.analisisCapacidadPago$.subscribe(
      analisis => { 
        if (analisis) {
          this.oAnalisis = analisis;
          this.getFCLAnalisis();
        }
    });
  }

  private async getFCLAnalisis() : Promise<void> {
  
    try {

      const response = 
        await firstValueFrom(this.macredService.getFlujoCajaLibreAnalisis(this.oAnalisis.codigoAnalisis).pipe(first()));
    
      if (response) this.inicializaFormularioFCL(response);
      
    } catch (error) { this.alertService.error(error.message); }
  }

  public async delete() : Promise<void> {

    const dialog = this.dialogo.open(DialogoConfirmacionComponent, {
      data: `Seguro que desea eliminar el FCL ?`
    });

    const confirmado = await firstValueFrom(dialog.afterClosed());

    if (confirmado) {

      try {

        const response = await firstValueFrom(
          this.macredService.deletelujoCajaLibre(this.objSeleccionadoFCL.codScoringFlujoCaja).pipe(first())
        );

        if (!response.exito) throw new Error(response.responseMesagge);
          
        this.inicializaFormularioFCL();
        
        this.alertService.success( response.responseMesagge );
        this.mostrarBordeFCL('success');

      } catch (error) { this.alertService.error(error); this.mostrarBordeFCL('error'); }
    }
  }

  private inicializaFormularioFCL(pfcl : ScoringFlujoCajaLibre = null) {

    this.submittedFCLForm = false;

    if (pfcl) {

      this.formularioFCL = this.formBuilder.group({

        actividadEconomica : [pfcl.codActividadEconomica, Validators.required],
        
        proyeccionMeses : [pfcl.mesesProyectarObligaciones, Validators.required],
        ajusteSalario : [pfcl.ajusteSalario, Validators.required],
        flujoEfectivoInicial : [pfcl.flujoEfectivoInicial, Validators.required],
        requerimientoCT : [pfcl.requerimietoCapitalTrabajo, Validators.required],
        ingresosMensuales : [pfcl.ingresosMensualesActividad, Validators.required],
        ingsIngresosIndirectos : [pfcl.otrosIngresosIndirectos, Validators.required],
        ingsMejoradorCrediticio : [pfcl.mejoradorCrediticio, Validators.required],
        ingsAporteEfectivo : [pfcl.aporteEfectivo, Validators.required],
        ingsGastosIndirectos : [pfcl.otrosGastosIndirectos, Validators.required],
        gastosNegocio : [pfcl.gastosNegocio, Validators.required],
        gastosPersonalesFamiliares : [pfcl.gastosPersonalesFamiliares, Validators.required],
        estimacionesSaldoTotalDeudaUno : [pfcl.saldoTotalDeudaAnoBase, Validators.required],
        estimacionesSaldoTotalDeudaDos : [pfcl.saldoTotalDeudaAno2, Validators.required],
        estimacionesValorPatrimonialActual : [pfcl.valorPatrimonioActual, Validators.required],
        estimacionesValorPatrimonialFuturo : [pfcl.valorPatrimonioFuturoEstimado, Validators.required],
        estimacionesCuotaMonedaExtranjeraAnoUno : [pfcl.cuotaMonedaExtraAno1, Validators.required],
        estimacionesCuotaMonedaExtranjeraAnoDos : [pfcl.cuotaMonedaExtraAno2, Validators.required],
        obligacionesCuotasPrestamos : [pfcl.cuotasPrestamosSistema, Validators.required],
        obligacionesNuevaObligacion : [pfcl.nuevaObligacion, Validators.required],
        obligacionAhorroGenerado : [pfcl.ahorroNuevaObligacion, Validators.required],
        observaciones : [pfcl.observacionValorPatrimonio, Validators.required]
      });

      this.objSeleccionadoFCL = pfcl;

      this.habilitaBtns(false);
      this.habilitarCamposFCLEditar(false);

    } else {

      this.formularioFCL = this.formBuilder.group({

        actividadEconomica : [null, Validators.required],
        proyeccionMeses : [12, Validators.required],
        ajusteSalario : [1.8, Validators.required],
        // flujoEfectivoInicial : [null, Validators.required],
        // requerimientoCT : [null, Validators.required],
        // ingresosMensuales : [null, Validators.required],
        // ingsIngresosIndirectos : [null, Validators.required],
        // ingsMejoradorCrediticio : [null, Validators.required],
        // ingsAporteEfectivo : [null, Validators.required],
        // ingsGastosIndirectos : [null, Validators.required],
        // gastosNegocio : [null, Validators.required],
        // gastosPersonalesFamiliares : [null, Validators.required],
        // estimacionesSaldoTotalDeudaUno : [null, Validators.required],
        // estimacionesSaldoTotalDeudaDos : [null, Validators.required],
        // estimacionesValorPatrimonialActual : [null, Validators.required],
        // estimacionesValorPatrimonialFuturo : [null, Validators.required],
        // estimacionesCuotaMonedaExtranjeraAnoUno : [1, Validators.required],
        // estimacionesCuotaMonedaExtranjeraAnoDos : [1, Validators.required],
        // obligacionesCuotasPrestamos : [null, Validators.required],
        // obligacionesNuevaObligacion : [null, Validators.required],
        // obligacionAhorroGenerado : [null, Validators.required],
        flujoEfectivoInicial : [100, Validators.required],
        requerimientoCT : [200, Validators.required],
        ingresosMensuales : [300, Validators.required],
        ingsIngresosIndirectos : [400, Validators.required],
        ingsMejoradorCrediticio : [500, Validators.required],
        ingsAporteEfectivo : [600, Validators.required],
        ingsGastosIndirectos : [700, Validators.required],
        gastosNegocio : [800, Validators.required],
        gastosPersonalesFamiliares : [900, Validators.required],
        estimacionesSaldoTotalDeudaUno : [1000, Validators.required],
        estimacionesSaldoTotalDeudaDos : [2000, Validators.required],
        estimacionesValorPatrimonialActual : [3000, Validators.required],
        estimacionesValorPatrimonialFuturo : [4000, Validators.required],
        estimacionesCuotaMonedaExtranjeraAnoUno : [1, Validators.required],
        estimacionesCuotaMonedaExtranjeraAnoDos : [1, Validators.required],
        obligacionesCuotasPrestamos : [5000, Validators.required],
        obligacionesNuevaObligacion : [6000, Validators.required],
        obligacionAhorroGenerado : [7000, Validators.required],
        observaciones : ['Flujo de Efectivo incial generado el ' + this.today.toLocaleString('es-ES', 
          { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }), Validators.required]
      });

      this.objSeleccionadoFCL = undefined;

      this.habilitaBtns(true);
      this.habilitarCamposFCLEditar(true);
    }
  }

  habilitaBtns(registra : boolean) : void {

    if (registra) {

      this.habilitaBtnEditar = false;
      this.habilitaBtnEliminar = false;
      this.habilitaBtnRegistrar = true;

    } else {

      this.habilitaBtnEscenariosFCL = true;

      this.habilitaBtnEditar = true;
      this.habilitaBtnEliminar = true;
      this.habilitaBtnRegistrar = false;
    }
  }

  habilitaEditarFormulario() : void {

    this.habilitarCamposFCLEditar(true);

    this.habilitaBtnEscenariosFCL = false;

    this.habilitaBtnEditar = false;
    this.habilitaBtnEliminar = false;
    this.habilitaBtnGuardar = true;
  }

  habilitarCamposFCLEditar(habilita: boolean = true) {

    if (habilita) {
      this.formularioFCL.get('actividadEconomica')?.enable();
      this.formularioFCL.get('proyeccionMeses')?.enable();
      this.formularioFCL.get('ajusteSalario')?.enable();
      this.formularioFCL.get('flujoEfectivoInicial')?.enable();
      this.formularioFCL.get('requerimientoCT')?.enable();
      this.formularioFCL.get('ingresosMensuales')?.enable();
      this.formularioFCL.get('ingsIngresosIndirectos')?.enable();
      this.formularioFCL.get('ingsMejoradorCrediticio')?.enable();
      this.formularioFCL.get('ingsAporteEfectivo')?.enable();
      this.formularioFCL.get('ingsGastosIndirectos')?.enable();

      this.formularioFCL.get('gastosNegocio')?.enable();
      this.formularioFCL.get('gastosPersonalesFamiliares')?.enable();

      this.formularioFCL.get('estimacionesSaldoTotalDeudaUno')?.enable();
      this.formularioFCL.get('estimacionesSaldoTotalDeudaDos')?.enable();
      this.formularioFCL.get('estimacionesValorPatrimonialActual')?.enable();
      this.formularioFCL.get('estimacionesValorPatrimonialFuturo')?.enable();
      this.formularioFCL.get('estimacionesCuotaMonedaExtranjeraAnoUno')?.enable();
      this.formularioFCL.get('estimacionesCuotaMonedaExtranjeraAnoDos')?.enable();

      this.formularioFCL.get('obligacionesCuotasPrestamos')?.enable();
      this.formularioFCL.get('obligacionesNuevaObligacion')?.enable();
      this.formularioFCL.get('obligacionAhorroGenerado')?.enable();

      this.formularioFCL.get('observaciones')?.enable();
    }
    else {

      this.formularioFCL.get('actividadEconomica')?.disable();
      this.formularioFCL.get('proyeccionMeses')?.disable();
      this.formularioFCL.get('ajusteSalario')?.disable();
      this.formularioFCL.get('flujoEfectivoInicial')?.disable();
      this.formularioFCL.get('requerimientoCT')?.disable();
      this.formularioFCL.get('ingresosMensuales')?.disable();
      this.formularioFCL.get('ingsIngresosIndirectos')?.disable();
      this.formularioFCL.get('ingsMejoradorCrediticio')?.disable();
      this.formularioFCL.get('ingsAporteEfectivo')?.disable();
      this.formularioFCL.get('ingsGastosIndirectos')?.disable();

      this.formularioFCL.get('gastosNegocio')?.disable();
      this.formularioFCL.get('gastosPersonalesFamiliares')?.disable();

      this.formularioFCL.get('estimacionesSaldoTotalDeudaUno')?.disable();
      this.formularioFCL.get('estimacionesSaldoTotalDeudaDos')?.disable();
      this.formularioFCL.get('estimacionesValorPatrimonialActual')?.disable();
      this.formularioFCL.get('estimacionesValorPatrimonialFuturo')?.disable();
      this.formularioFCL.get('estimacionesCuotaMonedaExtranjeraAnoUno')?.disable();
      this.formularioFCL.get('estimacionesCuotaMonedaExtranjeraAnoDos')?.disable();

      this.formularioFCL.get('obligacionesCuotasPrestamos')?.disable();
      this.formularioFCL.get('obligacionesNuevaObligacion')?.disable();
      this.formularioFCL.get('obligacionAhorroGenerado')?.disable();

      this.formularioFCL.get('observaciones')?.disable();
    }
  }

  obtenerDatosFormularioScoring(registra : boolean = true) : ScoringFlujoCajaLibre {
  
    this.submittedFCLForm = true;

    if (this.formularioFCL.invalid) return null;

    const {
      actividadEconomica,
      proyeccionMeses,
      ajusteSalario,
      flujoEfectivoInicial,
      requerimientoCT,
      ingresosMensuales,
      gastosNegocio,
      gastosPersonalesFamiliares,
      obligacionesCuotasPrestamos,
      obligacionesNuevaObligacion,
      obligacionAhorroGenerado,
      ingsIngresosIndirectos,
      ingsMejoradorCrediticio,
      ingsAporteEfectivo,
      ingsGastosIndirectos,
      estimacionesSaldoTotalDeudaUno,
      estimacionesSaldoTotalDeudaDos,
      estimacionesValorPatrimonialActual,
      estimacionesValorPatrimonialFuturo,
      estimacionesCuotaMonedaExtranjeraAnoUno,
      estimacionesCuotaMonedaExtranjeraAnoDos,
      observaciones
    } = this.formularioFCL.controls;

    let obj : ScoringFlujoCajaLibre = new ScoringFlujoCajaLibre;

    obj.codActividadEconomica = actividadEconomica.value;
    obj.mesesProyectarObligaciones = proyeccionMeses.value;
    obj.ajusteSalario = ajusteSalario.value;
    obj.flujoEfectivoInicial = flujoEfectivoInicial.value;
    obj.requerimietoCapitalTrabajo = requerimientoCT.value;
    obj.ingresosMensualesActividad = ingresosMensuales.value;
    obj.otrosIngresosIndirectos = ingsIngresosIndirectos.value;
    obj.mejoradorCrediticio = ingsMejoradorCrediticio.value;
    obj.aporteEfectivo = ingsAporteEfectivo.value;
    obj.otrosGastosIndirectos = ingsGastosIndirectos.value;
    obj.gastosNegocio = gastosNegocio.value;
    obj.gastosPersonalesFamiliares = gastosPersonalesFamiliares.value;
    obj.saldoTotalDeudaAnoBase = estimacionesSaldoTotalDeudaUno.value;
    obj.saldoTotalDeudaAno2 = estimacionesSaldoTotalDeudaDos.value;
    obj.valorPatrimonioActual = estimacionesValorPatrimonialActual.value;
    obj.valorPatrimonioFuturoEstimado = estimacionesValorPatrimonialFuturo.value;
    obj.cuotaMonedaExtraAno1 = estimacionesCuotaMonedaExtranjeraAnoUno.value;
    obj.cuotaMonedaExtraAno2 = estimacionesCuotaMonedaExtranjeraAnoDos.value;
    obj.cuotasPrestamosSistema = obligacionesCuotasPrestamos.value;
    obj.nuevaObligacion = obligacionesNuevaObligacion.value;
    obj.ahorroNuevaObligacion = obligacionAhorroGenerado.value;
    obj.scofclEstado = true;
    
    obj.observacionValorPatrimonio = observaciones.value;

    if (registra) {

      obj.codAnalisis = this.oAnalisis.codigoAnalisis;
      obj.codPersona = this.oPersona.id;
      obj.idCompania = this.companiaObservable.id;

      obj.scodfclCodDescripcionReporte = 3;
      obj.scofclDescripcion = 'Flujo de Caja Libre Inicial';
      
      obj.usuarioCreacion = this.userObservable.identificacion;
      obj.fechaCreacion = this.today;

    } else {
      obj.codScoringFlujoCaja = this.objSeleccionadoFCL.codScoringFlujoCaja;
      obj.usuarioModificacion = this.userObservable.identificacion;
      obj.fechaModificacion = this.today;
    }
    return obj;
  }

  async post() : Promise<void> {

    const objFCL : ScoringFlujoCajaLibre = this.obtenerDatosFormularioScoring();

    if (objFCL) {
      
      try {

        const response = await this.srvDatosAnalisisService.registrarFCL(objFCL);

        if (response.exito) {

          this.inicializaFormularioFCL(response.objetoDb);

          this.alertService.success( response.responseMesagge );
          this.mostrarBordeFCL('success'); 
        
        } else { this.alertService.error(response.responseMesagge); this.mostrarBordeFCL('error'); }
      } catch (error) { this.alertService.error(error); this.mostrarBordeFCL('error'); }
    }
  }

  async put() : Promise<void> {
    
    const objFCL : ScoringFlujoCajaLibre = this.obtenerDatosFormularioScoring(false);

    if (objFCL) {
      
      try {

        const response = await this.srvDatosAnalisisService.actualizarFCL(objFCL);

        if (response.exito) {

          this.inicializaFormularioFCL(response.objetoDb);

          this.alertService.success( response.responseMesagge );
          this.mostrarBordeFCL('success'); 
        
        } else { this.alertService.error(response.responseMesagge); this.mostrarBordeFCL('error'); }
      } catch (error) { this.alertService.error(error); this.mostrarBordeFCL('error'); }
    }
  }

  OnEscenariosFCL() {

    this.srvDatosAnalisisService.setFclAnalisis(this.objSeleccionadoFCL);

    this.onEscenariosFCL.emit(this.objSeleccionadoFCL);
  }


  private getActividadesEconomicas() {
  
    this.macredService.getTiposActividadesEconomicas(this.companiaObservable.id)
      .pipe(take(1))
      .subscribe({
        next: (response) => { 
          this.lstTiposActividadEconomica = response.filter((x) => x.estado === true); 
        }
      });
  }

  private mostrarBordeFCL(tipo: 'success' | 'error') {
    this.bordeSuccessFCL = tipo === 'success';
    this.bordeErrorFCL = tipo === 'error';
    setTimeout(() => { this.bordeSuccessFCL = false; this.bordeErrorFCL = false; }, 2000);
  }
}
