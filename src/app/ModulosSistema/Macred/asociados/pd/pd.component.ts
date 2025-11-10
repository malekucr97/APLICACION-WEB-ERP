import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { User } from '@app/_models';
import { AnalisisHistoricoPD, 
          GruposPD, 
          MacAnalisisCapacidadPago, 
          MacEstadoCivil, 
          MacInformacionCreditoPersona, 
          MacPersona, 
          MacTipoIngresoAnalisis, 
          ModelosPD } from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { first } from 'rxjs/operators';
import { SrvDatosAnalisisService } from '../servicios/srv-datos-analisis.service';
import { MacTipoGenero } from '@app/_models/Macred/TipoGenero';
import { MacTipoHabitacion } from '@app/_models/Macred/TipoHabitacion';
import { MacGrupoModeloPD, MacModeloPD } from '@app/_models/Macred/ModeloPD';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';
import { MacCondicionLaboral } from '@app/_models/Macred/CondicionLaboral';

declare var $: any;

@Component({selector: 'app-pd',
            templateUrl: './pd.component.html',
            styleUrls: [ '../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class PdComponent implements OnInit {

  listTipoAnalisis: MacTipoIngresoAnalisis[];

  @Output() onFCL = new EventEmitter();
  @Output() onScoring = new EventEmitter();

  private userObservable: User;

  public bordeSuccessPD = false;
  public bordeErrorPD = false;

  habilitaBtnCargarIPersona: boolean = false;
  habilitaBtnCargarICredito: boolean = false;
  habilitaBtnCargarIAnalisis: boolean = false;

  habilitaBtnEditarPD: boolean = false;
  habilitaBtnEliminarPD: boolean = false;
  habilitaBtnRegistrarPD: boolean = false;
  habilitaBtnGuardarPD: boolean = false;
  habilitaBtnCalcularPD: boolean = false;

  habilitaOpcionesModelosPD: boolean = false;

  habilitaBtnFCL: boolean = false;
  habilitaBtnScoring: boolean = false;

  listTipoGenero: MacTipoGenero[];
  listEstadosCiviles: MacEstadoCivil[];
  listTiposHabitaciones: MacTipoHabitacion[];
  listCondicionesLaborales: MacCondicionLaboral[];

  objSeleccionadoHistorico: AnalisisHistoricoPD;

  modeloPDSeleccionado: ModelosPD = undefined;
  lstGruposPD: GruposPD[] = [];
  grupoPDSeleccionado: GruposPD = undefined;

  formPD: UntypedFormGroup;
  submittedPDForm: boolean = false;
  
  listModelosPD: MacModeloPD[] = [];
  listGruposPD: MacGrupoModeloPD[] = [];

  oPersona : MacPersona;
  oCredito : MacInformacionCreditoPersona;
  oAnalisis : MacAnalisisCapacidadPago;

  get j() { return this.formPD.controls; }
  
  public constante : string;

  public today : Date = new Date();

  constructor(private formBuilder: UntypedFormBuilder,
              private macredService: MacredService,
              private accountService: AccountService,
              private alertService: AlertService,
              private dialogo: MatDialog,
              public srvDatosAnalisisService: SrvDatosAnalisisService) {

    this.userObservable = this.accountService.userValue;

    this.getModelosPD();

    this.listTipoAnalisis = this.srvDatosAnalisisService.listTipoAnalisis;
    this.listTipoGenero = this.srvDatosAnalisisService.listTipoGenero;
    this.listEstadosCiviles = this.srvDatosAnalisisService.listEstadosCiviles;
    this.listTiposHabitaciones = this.srvDatosAnalisisService.listTiposHabitaciones;
    this.listCondicionesLaborales = this.srvDatosAnalisisService.listCondicionesLaborales;

    this.constante = this.srvDatosAnalisisService._constantePD;

    this.inicializaFormPD();
  }

  handleOnFCL() { this.onFCL.emit(); }
  handleOnScoring() { this.onScoring.emit(); }

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
        if (analisis) {
          this.oAnalisis = analisis;
          this.getHistoricoPD();
        }
    });
  }

  private getModelosPD() : void {
    this.macredService.getModelosPD()
      .pipe(first())
      .subscribe(response => { if (response) this.listModelosPD = response; });
  }

  async onModeloPDChange(): Promise<void> {

    const modeloSeleccionado : MacModeloPD = this.formPD.get('modeloAnalisisPD')?.value;

    this.listGruposPD = 
      await firstValueFrom(this.macredService.getGruposModelosPD(modeloSeleccionado.id).pipe(first()));
  }

  public async deletePD() : Promise<void> {

    const dialog = this.dialogo.open(DialogoConfirmacionComponent, {
      data: `Seguro que desea eliminar el Análisis del PD ${this.objSeleccionadoHistorico.pdhCodAnalisisPd} ?`
    });

    const confirmado = await firstValueFrom(dialog.afterClosed());

    if (confirmado) {

      let objPersonaPD: MacPersona = {
        ...this.oPersona,

        codModeloPD: null,
        codGrupoModeloPD: null,
        pdCsd: null,
        montoAprobadoTotal: 0,
        perEndeudamientoTotal: 0,
        
        pdTienePropiedad: false,
        pdTieneVehiculo: false,

        modificadoPor: this.userObservable.identificacion,
        fechaModificacion: this.today
      };

      try {
        
        const responsePersona = await this.srvDatosAnalisisService.actualizarPersona(objPersonaPD);

        if (!responsePersona.exito) throw new Error(responsePersona.responseMesagge);

        this.oPersona = responsePersona.objetoDb;

        const responseHistoricoPD = await firstValueFrom(
          this.macredService.deleteAnalisisPD(this.objSeleccionadoHistorico.pdhCodAnalisisPd).pipe(first())
        );

        if (!responseHistoricoPD.exito) throw new Error(responseHistoricoPD.responseMesagge);
          
        this.inicializaFormPD();
        
        this.alertService.success(
          `Persona: ${responsePersona.responseMesagge} Análisis PD: ${responseHistoricoPD.responseMesagge}`
        );
        this.mostrarBordePD('success');

      } catch (error:any) { this.alertService.error(error); this.mostrarBordePD('error'); }
    }
  }

  private async getHistoricoPD() : Promise<void> {

    try {

      const responseHistorico = 
        await firstValueFrom(this.macredService.getHistoricoPD(this.oAnalisis.codigoAnalisis).pipe(first()));
    
      if (responseHistorico) {
        
        this.listGruposPD = 
          await firstValueFrom(this.macredService.getGruposModelosPD(responseHistorico.codModeloPd).pipe(first()));

        this.inicializaFormPD(responseHistorico);
      }
    } catch (error:any) { this.alertService.error(error.message); }
  }
  private habilitaBtnTipoAnalisis() {

    if (this.oAnalisis) {
      if (this.listTipoAnalisis.find((x) => x.id == this.oAnalisis.codigoTipoIngresoAnalisis)
        .descripcion.toLocaleLowerCase() === 'independiente')
      {
        this.habilitaBtnFCL = true;
        this.habilitaBtnScoring = false;
      } else {
        this.habilitaBtnFCL = false;
        this.habilitaBtnScoring = true;
      }
    }
  }

  habilitaEditarFormulario() : void {

    this.habilitarCamposPDEditar(true);

    this.habilitaOpcionesModelosPD = true;

    this.habilitaBtnScoring = false;
    this.habilitaBtnEditarPD = false;
    this.habilitaBtnCalcularPD = false;
    this.habilitaBtnEliminarPD = false;
    this.habilitaBtnGuardarPD = true;
  }

  private inicializaFormPD(pHistorico : AnalisisHistoricoPD = null) {

    this.submittedPDForm = false;

    if (pHistorico) {

      this.formPD = this.formBuilder.group({

        modeloAnalisisPD : [this.listModelosPD.find((x) => x.id === pHistorico.codModeloPd)],
        grupoModeloAnalisisPD : [this.listGruposPD.find((x) => x.id === pHistorico.codGrupoPd)],

        codigoGenero: [
          this.listTipoGenero.find(
            (x) => x.id === pHistorico.codGenero), Validators.required
        ],
        codigoEstadoCivil: [
          this.listEstadosCiviles.find(
            (x) => x.id === pHistorico.codEstadoCivil), Validators.required
        ],
        codigoTipoHabitacion: [
          this.listTiposHabitaciones.find(
            (x) => x.id === pHistorico.datoHabitacasa), Validators.required
        ],
        edad: [pHistorico.edadAsociado],
        tienePropiedades: [this.oPersona.pdTienePropiedad],
        tieneVehiculo: [this.oPersona.pdTieneVehiculo],
        numeroHijos: [pHistorico.cantidadHijos, Validators.required],
        numeroFianzas: [this.oCredito.cantidadFianzas, Validators.required],
        creditosActivos: [pHistorico.nCreditosVigentes ?? 0, Validators.required],
        csd: [this.oAnalisis.indicadorCsd ?? 0],
        segmento: [this.oPersona.perSegmentoAsociado ?? 0, Validators.required],
        
        salarioBruto: [pHistorico.salarioBruto],

        montoAprobadoTotal: [this.oPersona.montoAprobadoTotal, Validators.required],
        endeudamientoTotalCIC: [this.oPersona.perEndeudamientoTotal, Validators.required],
        constante: [this.constante],

        modeloAnalisis: [this.listModelosPD?.find((x) => x.id === pHistorico.codModeloPd).descripcion ?? null],
        modeloAnalisisConglomerado: [this.listGruposPD?.find((x) => x.id === pHistorico.codGrupoPd).descripcion ?? null],

        zScore: [pHistorico.pdhDZscore ?? 0],
        pdResult: [pHistorico.pdhDPdFinal ?? 0],
      });

      this.objSeleccionadoHistorico = pHistorico;

      this.habilitaOpcionesModelosPD = false;

      this.habilitaBtnEditarPD = true;
      this.habilitaBtnCalcularPD = true;
      this.habilitaBtnEliminarPD = true;
      this.habilitaBtnRegistrarPD = false;
      this.habilitaBtnGuardarPD = false;

      this.habilitarCamposPDEditar(false);

    } else {

      let persona : MacPersona = this.srvDatosAnalisisService.getPersonaAnalisis();
      let credito : MacInformacionCreditoPersona = this.srvDatosAnalisisService.getCreditoAnalisis();
      let analisis : MacAnalisisCapacidadPago = this.srvDatosAnalisisService.getAnalisisCapacidadPago();

      this.formPD = this.formBuilder.group({

        modeloAnalisisPD : [null, Validators.required],
        grupoModeloAnalisisPD : [null, Validators.required],
        
        codigoGenero: [
          this.listTipoGenero.find(
            (x) => x.id === persona.codigoGenero), Validators.required
        ],
        codigoEstadoCivil: [
          this.listEstadosCiviles.find(
            (x) => x.id === persona.codigoEstadoCivil), Validators.required
        ],
        codigoTipoHabitacion: [
          this.listTiposHabitaciones.find(
            (x) => x.id === persona.codigoTipoHabitacion), Validators.required
        ],

        edad: [persona.edad],
        tienePropiedades: [persona.pdTienePropiedad],
        tieneVehiculo: [persona.pdTieneVehiculo],
        numeroHijos: [persona.cantidadHijos, Validators.required],
        numeroFianzas: [credito.cantidadFianzas, Validators.required],
        creditosActivos: [credito.cantidadCreditosHistorico, Validators.required],
        csd: [analisis.indicadorCsd],
        segmento: [persona.perSegmentoAsociado, Validators.required],
        
        salarioBruto: [persona.salarioBruto],
        
        montoAprobadoTotal: [0, Validators.required],
        endeudamientoTotalCIC: [0, Validators.required],
        constante: [this.constante],

        modeloAnalisis: ['Modelo PD no asignado'],
        modeloAnalisisConglomerado: ['Grupo PD no asignado'],
        zScore: [0],
        pdResult: [0],
      });

      this.objSeleccionadoHistorico = undefined;

      this.habilitaOpcionesModelosPD = true;

      this.habilitaBtnEditarPD = false;
      this.habilitaBtnCalcularPD = false;
      this.habilitaBtnEliminarPD = false;
      this.habilitaBtnRegistrarPD = true;

      this.habilitarCamposPDEditar(true);
    }
    this.habilitaBtnTipoAnalisis();
  }

  habilitarCamposPDEditar(habilita: boolean = true) {

    if (habilita) {
      this.formPD.get('codigoGenero')?.enable();
      this.formPD.get('codigoEstadoCivil')?.enable();
      this.formPD.get('codigoTipoHabitacion')?.enable();

      this.formPD.get('tienePropiedades')?.enable();
      this.formPD.get('tieneVehiculo')?.enable();

      this.formPD.get('numeroHijos')?.enable();

      this.formPD.get('numeroFianzas')?.enable();
      this.formPD.get('creditosActivos')?.enable();
      this.formPD.get('csd')?.enable();
      this.formPD.get('segmento')?.enable();

      this.formPD.get('montoAprobadoTotal')?.enable();
      this.formPD.get('endeudamientoTotalCIC')?.enable();
    }
    else {
      this.formPD.get('codigoGenero')?.disable();
      this.formPD.get('codigoEstadoCivil')?.disable();
      this.formPD.get('codigoTipoHabitacion')?.disable();

      this.formPD.get('tienePropiedades')?.disable();
      this.formPD.get('tieneVehiculo')?.disable();

      this.formPD.get('numeroHijos')?.disable();

      this.formPD.get('numeroFianzas')?.disable();
      this.formPD.get('creditosActivos')?.disable();
      this.formPD.get('csd')?.disable();
      this.formPD.get('segmento')?.disable();

      this.formPD.get('montoAprobadoTotal')?.disable();
      this.formPD.get('endeudamientoTotalCIC')?.disable();
    }
  }

  obtenerDatosFormularioPD(registra : boolean = true) : MacPersona {

    this.submittedPDForm = true;

    if (this.formPD.invalid) return null;

    const { modeloAnalisisPD,
            grupoModeloAnalisisPD,
            codigoGenero,
            codigoEstadoCivil,
            codigoTipoHabitacion,
            edad,
            tienePropiedades,
            tieneVehiculo,
            numeroHijos,
            numeroFianzas,
            creditosActivos,
            csd,
            segmento,
            salarioBruto,
            montoAprobadoTotal,
            endeudamientoTotalCIC } = this.formPD.controls;

    let descEstadoCivil : string = 
      this.listEstadosCiviles.find(x => x.id === codigoEstadoCivil.value.id)?.descripcion;

    let descCondicionLaboral : string = 
      this.listCondicionesLaborales.find(x => x.id === this.oPersona.codigoCondicionLaboral)?.descripcion;

    let descTipoHabitacion : string = 
      this.listTiposHabitaciones.find(x => x.id === codigoTipoHabitacion.value.id)?.descripcion;

    let obj: MacPersona = {
      ...this.oPersona,

      codModeloPD: modeloAnalisisPD.value.id,
      codGrupoModeloPD: grupoModeloAnalisisPD.value.id,

      codigoGenero: codigoGenero.value.id,
      codigoEstadoCivil: codigoEstadoCivil.value.id,
      codigoTipoHabitacion: codigoTipoHabitacion.value.id,
      edad: edad.value,
      cantidadHijos: numeroHijos.value,
      cantidadFianzas: numeroFianzas.value,
      nCreditosVigentes: creditosActivos.value,
      pdCsd: csd.value,
      perSegmentoAsociado: segmento.value,

      salarioBruto: salarioBruto.value,
      montoAprobadoTotal: montoAprobadoTotal.value,
      saldoTotal: montoAprobadoTotal.value,
      perEndeudamientoTotal: endeudamientoTotalCIC.value,
      constante: 1,

      tiempoAfiliacion: this.oCredito.tiempoAfiliacion,
      
      pdTienePropiedad: tienePropiedades.value,
      pdTieneVehiculo: tieneVehiculo.value,

      descEstadoCivil: descEstadoCivil,
      descCondicionLaboral: descCondicionLaboral,
      descTipoHabitacion: descTipoHabitacion,

      modificadoPor: this.userObservable.identificacion,
      fechaModificacion: this.today
    };
    return obj;
  }

  creaObjetoHistorico(ppersonaPD : MacPersona, registra : boolean = true) : AnalisisHistoricoPD {

    let objHistorico : AnalisisHistoricoPD;

    if (registra) {
      
      objHistorico = {
            codAnalisis: this.oAnalisis.codigoAnalisis,
            codPersona: ppersonaPD.id,
            identificacion: ppersonaPD.identificacion,
            
            codModeloPd: ppersonaPD.codModeloPD,
            codGrupoPd: ppersonaPD.codGrupoModeloPD,

            datoHabitacasa: ppersonaPD.codigoTipoHabitacion,
            datoProvincia: ppersonaPD.datoProvincia,

            pdhAnalisisDefinitivo: this.oAnalisis.analisisDefinitivo,
            pdhEstado: true,

            edadAsociado: ppersonaPD.edad,
            cantidadHijos: ppersonaPD.cantidadHijos,
            anosLaborales: ppersonaPD.aniosLaborales ?? 0,
            salarioBruto: ppersonaPD.salarioBruto,

            atrasoMaximo: this.oCredito.atrasoMaximo,
            nCreditosVigentes: ppersonaPD.nCreditosVigentes,
            saldoTotal: ppersonaPD.saldoTotal,

            codGenero: ppersonaPD.codigoGenero,
            codEstadoCivil: ppersonaPD.codigoEstadoCivil,
            codCondicionLaboral: ppersonaPD.codigoCondicionLaboral,
            
            usuarioCreacion: this.userObservable.identificacion,
            fechaCreacion: this.today
          }

    } else {

      objHistorico = {
            pdhCodAnalisisPd: this.objSeleccionadoHistorico.pdhCodAnalisisPd,
            codAnalisis: this.oAnalisis.codigoAnalisis,
            codPersona: ppersonaPD.id,
            identificacion: ppersonaPD.identificacion,
            
            codModeloPd: ppersonaPD.codModeloPD,
            codGrupoPd: ppersonaPD.codGrupoModeloPD,

            datoHabitacasa: ppersonaPD.codigoTipoHabitacion,
            datoProvincia: ppersonaPD.datoProvincia,

            pdhAnalisisDefinitivo: this.oAnalisis.analisisDefinitivo,
            pdhEstado: true,

            edadAsociado: ppersonaPD.edad,
            cantidadHijos: ppersonaPD.cantidadHijos,
            anosLaborales: ppersonaPD.aniosLaborales ?? 0,
            salarioBruto: ppersonaPD.salarioBruto,

            atrasoMaximo: this.oCredito.atrasoMaximo,
            nCreditosVigentes: ppersonaPD.nCreditosVigentes,
            saldoTotal: ppersonaPD.saldoTotal,

            codGenero: ppersonaPD.codigoGenero,
            codEstadoCivil: ppersonaPD.codigoEstadoCivil,
            codCondicionLaboral: ppersonaPD.codigoCondicionLaboral,
            
            usuarioModificacion: this.userObservable.identificacion,
            fechaModificacion: this.today
          }
    }
    return objHistorico;
  }


  async postPD() : Promise<void> {

    const objPersonaPD : MacPersona = this.obtenerDatosFormularioPD();

    if (objPersonaPD) {

      try {

        const objHistorico : AnalisisHistoricoPD = this.creaObjetoHistorico(objPersonaPD, true);

        if (this.oCredito.cantidadFianzas != objPersonaPD.cantidadFianzas) {
          this.oCredito.cantidadFianzas = objPersonaPD.cantidadFianzas;
          const responseCredito = await this.srvDatosAnalisisService.actualizarCredito(this.oCredito);
          if (responseCredito.exito) this.srvDatosAnalisisService.setCreditoAnalisis(this.oCredito);
        }

        if (this.oAnalisis.indicadorCsd != objPersonaPD.pdCsd) {
          this.oAnalisis.indicadorCsd = objPersonaPD.pdCsd;
          const responseAnalisis = await this.srvDatosAnalisisService.actualizarAnalisis(this.oAnalisis);
          if (responseAnalisis.exito) this.srvDatosAnalisisService.setAnalisisCapacidadPago(this.oAnalisis);
        }

        const responseHistorico = await this.srvDatosAnalisisService.registrarHistoricoPD(objHistorico);
        const responsePersona = await this.srvDatosAnalisisService.actualizarPersona(objPersonaPD);

        if (responseHistorico.exito && responsePersona.exito) {

          responsePersona.objetoDb.descEstadoCivil = objPersonaPD.descEstadoCivil;
          responsePersona.objetoDb.descCondicionLaboral = objPersonaPD.descCondicionLaboral;
          responsePersona.objetoDb.descTipoHabitacion = objPersonaPD.descTipoHabitacion;
          
          this.srvDatosAnalisisService.setPersonaAnalisis(responsePersona.objetoDb);

          this.inicializaFormPD(responseHistorico.objetoDb);

          this.alertService.success( responseHistorico.responseMesagge );
          this.mostrarBordePD('success'); 
        
        } else { 
          this.alertService.error(responseHistorico.responseMesagge || responsePersona.responseMesagge); 
          this.mostrarBordePD('error');
        }

      } catch (error:any) { this.alertService.error(error); this.mostrarBordePD('error'); }
    }
  }

  async putPD() : Promise<void> {

    const objPersonaPD : MacPersona = this.obtenerDatosFormularioPD();

    if (objPersonaPD) {

      try {

        const responsePersona = await this.srvDatosAnalisisService.actualizarPersona(objPersonaPD);

        if (responsePersona.exito) {

          if (this.oCredito.cantidadFianzas != objPersonaPD.cantidadFianzas) {
            this.oCredito.cantidadFianzas = objPersonaPD.cantidadFianzas;
            const responseCredito = await this.srvDatosAnalisisService.actualizarCredito(this.oCredito);
            if (responseCredito.exito) this.srvDatosAnalisisService.setCreditoAnalisis(this.oCredito);
          }

          if (this.oAnalisis.indicadorCsd != objPersonaPD.pdCsd) {
            this.oAnalisis.indicadorCsd = objPersonaPD.pdCsd;
            const responseAnalisis = await this.srvDatosAnalisisService.actualizarAnalisis(this.oAnalisis);
            if (responseAnalisis.exito) this.srvDatosAnalisisService.setAnalisisCapacidadPago(this.oAnalisis);
          }

          responsePersona.objetoDb.descEstadoCivil = objPersonaPD.descEstadoCivil;
          responsePersona.objetoDb.descCondicionLaboral = objPersonaPD.descCondicionLaboral;
          responsePersona.objetoDb.descTipoHabitacion = objPersonaPD.descTipoHabitacion;

          const objHistorico : AnalisisHistoricoPD = this.creaObjetoHistorico(objPersonaPD, false);

          const responseHistorico = await this.srvDatosAnalisisService.actualizarHistoricoPD(objHistorico);

          if (responseHistorico.exito) {

            this.srvDatosAnalisisService.setPersonaAnalisis(responsePersona.objetoDb);
            
            this.inicializaFormPD(responseHistorico.objetoDb);

            this.alertService.success( responseHistorico.responseMesagge );
            this.mostrarBordePD('success'); 
          }
          else { this.alertService.error(responseHistorico.responseMesagge); }
          
        } else { 
          this.alertService.error(responsePersona.responseMesagge); 
          this.mostrarBordePD('error');
        }
      } catch (error:any) { this.alertService.error(error); this.mostrarBordePD('error'); }
    }
  }

  async calcularPD(): Promise<void> {

    const objPersonaPD : MacPersona = this.obtenerDatosFormularioPD();

    if (!objPersonaPD) return null;

    try {

      let objHistorico : AnalisisHistoricoPD = this.creaObjetoHistorico(objPersonaPD, false);

      objHistorico.idCreditoPersona = this.oCredito.id;

      const response = await firstValueFrom(this.macredService.calculoAnalisisPD(objHistorico));

      if (response.exito) {
        this.getHistoricoPD();

        this.alertService.success( response.responseMesagge );
        this.mostrarBordePD('success'); 

      } else { this.alertService.error(response.responseMesagge); }
    } catch (error) { this.alertService.error(error); }
  }

  private mostrarBordePD(tipo: 'success' | 'error') {
    this.bordeSuccessPD = tipo === 'success';
    this.bordeErrorPD = tipo === 'error';
    setTimeout(() => { this.bordeSuccessPD = false; this.bordeErrorPD = false; }, 2000);
  }
}