import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Compania, User } from '@app/_models';
import { AnalisisHistoricoPD, 
          MacAnalisisCapacidadPago, 
          MacGrupoModeloAnalisis, 
          MacIndicadorGrupoModeloAnalisis, 
          MacInformacionCreditoPersona, 
          MacModeloAnalisis, 
          MacPersona, 
          MacTipoIngresoAnalisis } from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { first, take } from 'rxjs/operators';
import { SrvDatosAnalisisService } from '../servicios/srv-datos-analisis.service';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';
import { Scoring, ScoringParametros } from '@app/_models/Macred/Scoring';
import { MacNivelRiesgo } from '@app/_models/Macred/NivelRiesgo';
import { ScoringHistorico } from '@app/_models/Macred/ScoringHistorico';

// declare var $: any;

@Component({selector: 'app-scoring',
            templateUrl: './scoring.component.html',
            styleUrls: [ '../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class ScoringComponent implements OnInit {

  listTipoAnalisis: MacTipoIngresoAnalisis[];

  @Output() onFCL = new EventEmitter();
  @Output() onScoring = new EventEmitter();

  private userObservable: User;
  private businessObservable: Compania;

  public bordeSuccessScoring = false;
  public bordeErrorScoring = false;

  habilitaBtnEditar: boolean = false;
  habilitaBtnEliminar: boolean = false;
  habilitaBtnRegistrar: boolean = false;
  habilitaBtnGuardar: boolean = false;
  habilitaBtnCalcular: boolean = false;

  habilitaHistoricoScoring: boolean = false;

  public listNivelesRiesgo : MacNivelRiesgo[] = [];

  listModelosScoring: MacModeloAnalisis[] = [];
  listGruposScoring: MacGrupoModeloAnalisis[] = [];
  listIndicadoresModelosScoring: MacIndicadorGrupoModeloAnalisis[] = [];
  listScoringHistorico: ScoringHistorico[] = [];

  habilitaBtnFCL: boolean = false;
  habilitaBtnScoring: boolean = false;


  formScoring: UntypedFormGroup;
  submittedScoringForm: boolean = false;
  get j() { return this.formScoring.controls; }

  oPersona : MacPersona;
  oCredito : MacInformacionCreditoPersona;
  oAnalisis : MacAnalisisCapacidadPago;
  
  objSeleccionadoScoring: Scoring;
  objSeleccionadoHistorico: AnalisisHistoricoPD;

  public today : Date = new Date();

  constructor(private formBuilder: UntypedFormBuilder,
              private macredService: MacredService,
              private accountService: AccountService,
              private alertService: AlertService,
              private dialogo: MatDialog,
              public srvDatosAnalisisService: SrvDatosAnalisisService) {
    this.userObservable = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;

    this.inicializaFormScoring();

    this.getNivelesRiesgos();
    this.getModelosAnalisis();
  }

  ngOnInit(): void {

    this.srvDatosAnalisisService.personaAnalisis$.subscribe(
      persona => { 
        if (persona) { this.oPersona = persona; }
    });
    this.srvDatosAnalisisService.creditoAnalisis$.subscribe(
      credito => { 
        if (credito) { this.oCredito = credito; }
    });

    this.srvDatosAnalisisService.analisisCapacidadPago$.subscribe(
      analisis => { 
        if (analisis && analisis.codigoTipoIngresoAnalisis===1) {
          this.oAnalisis = analisis;
          this.getPuntajePD();
          this.getScoring();
          this.getHistoricoScoring();
        }
    });
  }

  private async getScoring() : Promise<void> {

    try {

      const responseScoring = 
        await firstValueFrom(this.macredService.getScoring(this.oAnalisis.codigoAnalisis).pipe(first()));
    
      if (responseScoring) this.inicializaFormScoring(responseScoring);
      
    } catch (error) { this.alertService.error(error.message); }
  }

  private async getPuntajePD() : Promise<void> {

    try {

      const responseHistorico = 
        await firstValueFrom(this.macredService.getHistoricoPD(this.oAnalisis.codigoAnalisis).pipe(first()));
    
      if (responseHistorico) {
        this.objSeleccionadoHistorico = responseHistorico;
        this.formScoring.patchValue({ pd: this.objSeleccionadoHistorico.pdhDPdFinal });
      }
      
    } catch (error) { this.alertService.error(error.message); }
  }

  private getNivelesRiesgos() {

    this.macredService.getNivelesRiesgos(false)
      .pipe(take(1))
      .subscribe({
        next: (response) => { this.listNivelesRiesgo = response; }
      });
  }

  private getModelosAnalisis() : void {
    this.macredService.getModelosAnalisis(false)
      .pipe(take(1))
      .subscribe({
        next: (response) => { this.listModelosScoring = response; }
    });
  }

  async onModeloScoringChange(): Promise<void> {

    const modeloSeleccionado : MacModeloAnalisis = this.formScoring.get('modeloAnalisisScoring')?.value;

    this.listGruposScoring = 
      await firstValueFrom(this.macredService.getGruposModelosAnalisis(modeloSeleccionado.id).pipe(first()));

    for (const element of this.listGruposScoring) {

      const response = await firstValueFrom(
        this.macredService.getIndicadoresGrupoModAnalisis(element.id)
      );
      this.listIndicadoresModelosScoring.push(...response);
    }
  }

  public async delete() : Promise<void> {

    const dialog = this.dialogo.open(DialogoConfirmacionComponent, {
      data: `Seguro que desea eliminar el Scoring ?`
    });

    const confirmado = await firstValueFrom(dialog.afterClosed());

    if (confirmado) {

      try {

        const response = await firstValueFrom(
          this.macredService.deleteScoring(this.objSeleccionadoScoring.id).pipe(first())
        );

        if (!response.exito) throw new Error(response.responseMesagge);
          
        this.inicializaFormScoring();

        this.formScoring.patchValue({ pd: this.objSeleccionadoHistorico.pdhDPdFinal });
        
        this.alertService.success( response.responseMesagge );
        this.mostrarBordeScoring('success');

      } catch (error) { this.alertService.error(error); this.mostrarBordeScoring('error'); }
    }
  }

  // private habilitaBtnTipoAnalisis() {

  //   if (this.oAnalisis) {
  //     if (this.listTipoAnalisis.find((x) => x.id == this.oAnalisis.codigoTipoIngresoAnalisis)
  //       .descripcion.toLocaleLowerCase() === 'independiente')
  //     {
  //       this.habilitaBtnFCL = true;
  //       this.habilitaBtnScoring = false;
  //     } else {
  //       this.habilitaBtnFCL = false;
  //       this.habilitaBtnScoring = true;
  //     }
  //   }
  // }

  habilitaEditarFormulario() : void {

    this.habilitarCamposPDEditar(true);

    this.habilitaBtnScoring = false;
    this.habilitaBtnEditar = false;
    this.habilitaBtnCalcular = false;
    this.habilitaBtnEliminar = false;
    this.habilitaBtnGuardar = true;
  }

  habilitaBtns(registra : boolean) : void {

    if (registra) {
      this.habilitaBtnEditar = false;
      this.habilitaBtnCalcular = false;
      this.habilitaBtnEliminar = false;
      this.habilitaBtnRegistrar = true;
      this.habilitaBtnGuardar = true;
    } else {
      this.habilitaBtnEditar = true;
      this.habilitaBtnCalcular = true;
      this.habilitaBtnEliminar = true;
      this.habilitaBtnRegistrar = false;
      this.habilitaBtnGuardar = false;
    }
  }

  private inicializaFormScoring(pScoring : Scoring = null) {

    this.submittedScoringForm = false;

    if (pScoring) {

      this.formScoring = this.formBuilder.group({

        modeloAnalisisScoring : [this.listModelosScoring.find((x) => x.id === pScoring.idModeloScoring)],
        
        numeroAtrasoCoope: [pScoring.numeroAtrasoCoope, Validators.required],
        tiempoSolicitudes: [pScoring.tiempoSolicitudes, Validators.required],
        variedadLineas: [pScoring.variedadLineas, Validators.required],
        institucionesUtilizadas: [pScoring.institucionesUtilizadas, Validators.required],
        diasAtrasoSistema: [pScoring.diasAtrasoSistema, Validators.required],
        creditosActivosSistema: [pScoring.creditosActivosSistema, Validators.required],
        cic: [pScoring.cic, Validators.required],
        aniosCreditoCoope: [pScoring.aniosCreditoCoope, Validators.required],
        pd: [pScoring.pd, Validators.required],
        numeroRefinanciamientos: [pScoring.numeroRefinanciamientos, Validators.required],
        puntaje: [pScoring.puntaje],
        calificacion: [pScoring.calificacion]
      });

      this.objSeleccionadoScoring = pScoring;

      this.habilitaBtns(false);
      this.habilitarCamposPDEditar(false);

    } else {

      this.formScoring = this.formBuilder.group({

        modeloAnalisisScoring : [null],

        numeroAtrasoCoope: [null, Validators.required],
        tiempoSolicitudes: [null, Validators.required],
        variedadLineas: [null, Validators.required],
        institucionesUtilizadas: [null, Validators.required],
        diasAtrasoSistema: [null, Validators.required],
        creditosActivosSistema: [null, Validators.required],
        cic: [null, Validators.required],
        aniosCreditoCoope: [null, Validators.required],
        pd: [null, Validators.required],
        numeroRefinanciamientos: [null, Validators.required],
        puntaje: [null],
        calificacion: [null]
      });

      this.objSeleccionadoScoring = undefined;

      this.habilitaBtns(true);
      this.habilitarCamposPDEditar(true);
    }
  }

  habilitarCamposPDEditar(habilita: boolean = true) {

    if (habilita) {
      this.formScoring.get('modeloAnalisisScoring')?.enable();
      this.formScoring.get('numeroAtrasoCoope')?.enable();
      this.formScoring.get('tiempoSolicitudes')?.enable();
      this.formScoring.get('variedadLineas')?.enable();
      this.formScoring.get('institucionesUtilizadas')?.enable();
      this.formScoring.get('diasAtrasoSistema')?.enable();
      this.formScoring.get('creditosActivosSistema')?.enable();
      this.formScoring.get('cic')?.enable();
      this.formScoring.get('aniosCreditoCoope')?.enable();
      this.formScoring.get('numeroRefinanciamientos')?.enable();
    }
    else {
      this.formScoring.get('modeloAnalisisScoring')?.disable();
      this.formScoring.get('numeroAtrasoCoope')?.disable();
      this.formScoring.get('tiempoSolicitudes')?.disable();
      this.formScoring.get('variedadLineas')?.disable();
      this.formScoring.get('institucionesUtilizadas')?.disable();
      this.formScoring.get('diasAtrasoSistema')?.disable();
      this.formScoring.get('creditosActivosSistema')?.disable();
      this.formScoring.get('cic')?.disable();
      this.formScoring.get('aniosCreditoCoope')?.disable();
      this.formScoring.get('numeroRefinanciamientos')?.disable();
    }
  }

  obtenerDatosFormularioScoring(registra : boolean = true) : Scoring {

    this.submittedScoringForm = true;

    if (this.formScoring.invalid) return null;

    const { modeloAnalisisScoring,
            numeroAtrasoCoope,
            tiempoSolicitudes,
            variedadLineas,
            institucionesUtilizadas,
            diasAtrasoSistema,
            creditosActivosSistema,
            cic,
            aniosCreditoCoope,
            pd,
            numeroRefinanciamientos,
            puntaje,
            calificacion
          } = this.formScoring.controls;

    let obj : Scoring = new Scoring;

    obj.idModeloScoring = modeloAnalisisScoring.value.id;

    obj.numeroAtrasoCoope = numeroAtrasoCoope.value;
    obj.tiempoSolicitudes = tiempoSolicitudes.value;
    obj.variedadLineas = variedadLineas.value;
    obj.institucionesUtilizadas = institucionesUtilizadas.value;
    obj.diasAtrasoSistema = diasAtrasoSistema.value;
    obj.creditosActivosSistema = creditosActivosSistema.value;
    obj.cic = cic.value;
    obj.aniosCreditoCoope = aniosCreditoCoope.value;
    obj.pd = pd.value;
    obj.numeroRefinanciamientos = numeroRefinanciamientos.value;
    // obj.puntaje = puntaje.value;
    // obj.calificacion = calificacion.value;

    if (registra) {
      
      obj.idAnalisis = this.oAnalisis.codigoAnalisis;
      obj.idCompania = this.businessObservable.id;
      obj.adicionadoPor = this.userObservable.identificacion;
      obj.fechaAdicion = this.today;

    } else {
      obj.id = this.objSeleccionadoScoring.id;
      obj.modificadoPor = this.userObservable.identificacion;
      obj.fechaModificacion = this.today;
    }
    return obj;
  }

  async post() : Promise<void> {

    const objScoring : Scoring = this.obtenerDatosFormularioScoring();

    if (objScoring) {

      try {

        const response = await this.srvDatosAnalisisService.registrarScoring(objScoring);

        if (response.exito) {

          this.inicializaFormScoring(response.objetoDb);

          this.alertService.success( response.responseMesagge );
          this.mostrarBordeScoring('success'); 
        
        } else { this.alertService.error(response.responseMesagge); this.mostrarBordeScoring('error'); }
      } catch (error) { this.alertService.error(error); this.mostrarBordeScoring('error'); }
    }
  }

  async putPD() : Promise<void> {

    const objScoring : Scoring = this.obtenerDatosFormularioScoring(false);

    if (objScoring) {

      try {

        const response = await this.srvDatosAnalisisService.actualizarScoring(objScoring);

        if (response.exito) {

          this.inicializaFormScoring(response.objetoDb);

          this.alertService.success( response.responseMesagge );
          this.mostrarBordeScoring('success'); 

        } else { this.alertService.error(response.responseMesagge); this.mostrarBordeScoring('error'); }
      } catch (error:any) { this.alertService.error(error); this.mostrarBordeScoring('error'); }
    }
  }

  private crearObjetoScoringParametros(): ScoringParametros {

    let obj : ScoringParametros = new ScoringParametros;

    obj.idPersona = this.oPersona.id.toString();
    obj.IdentificacionPersona = this.oPersona.identificacion;
    obj.CodModeloScoring = this.formScoring.get('modeloAnalisisScoring')?.value.id;
    obj.Estado = true;
    obj.UsuarioCreacion = this.userObservable.identificacion;
    obj.CodAnalisis = this.oAnalisis.codigoAnalisis;
    obj.IdCompania = this.businessObservable.id;

    return obj;
  }

  async calcularScoring(): Promise<void> {

    const objParametros : ScoringParametros = this.crearObjetoScoringParametros();

    if (!objParametros) return null;

    try {

      const response = 
        await firstValueFrom(this.macredService.calculoAnalisisScoring(objParametros));

      if (response.exito) {

        this.getHistoricoScoring();

        this.alertService.success( response.responseMesagge );
        this.mostrarBordeScoring('success'); 

      } else { this.alertService.error(response.responseMesagge); }
    } catch (error) { this.alertService.error(error); }
  }

  private async getHistoricoScoring() : Promise<void> {

    try {

      const responseHistorico = 
        await firstValueFrom(this.macredService.getHistoricoScoring(this.oAnalisis.codigoAnalisis).pipe(first()));
    
      if (responseHistorico) {

        this.habilitaHistoricoScoring = true;

        this.listScoringHistorico = responseHistorico;

        const puntajeFinal = this.listScoringHistorico[0].puntajeFinal;
        const tipoCalificacion = this.listScoringHistorico[0].tipoCalificacion;

        this.formScoring.patchValue({ puntaje: puntajeFinal });
        this.formScoring.patchValue({ calificacion: tipoCalificacion });

        for (const element of this.listScoringHistorico) {
          element.descRiesgoAsignado
            = this.listNivelesRiesgo.find(x => x.id === element.riesgoAsignado)?.descripcion ?? '';
        }
      }
    } catch (error) { this.alertService.error(error.message); }
  }

  handleOnFCL() { this.onFCL.emit(); }
  handleOnScoring() { this.onScoring.emit(); }

  private mostrarBordeScoring(tipo: 'success' | 'error') {
    this.bordeSuccessScoring = tipo === 'success';
    this.bordeErrorScoring = tipo === 'error';
    setTimeout(() => { this.bordeSuccessScoring = false; this.bordeErrorScoring = false; }, 2000);
  }
}