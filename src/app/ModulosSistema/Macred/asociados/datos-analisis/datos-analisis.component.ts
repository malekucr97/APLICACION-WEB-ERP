import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Compania, Module, User } from '@app/_models';
import {  MacAnalisisCapacidadPago,
          MacModeloAnalisis,
          MacNivelCapacidadPago,
          MacPersona,
          MacTipoFormaPagoAnalisis,
          MacTipoGenerador,
          MacTipoIngresoAnalisis,
          MacTiposMoneda } from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { first } from 'rxjs/operators';
import { SrvDatosAnalisisService } from '../servicios/srv-datos-analisis.service';

declare var $: any;

@Component({selector: 'app-datos-analisis-macred',
            templateUrl: './datos-analisis.component.html',
            styleUrls: [
                '../../../../../assets/scss/app.scss',
                '../../../../../assets/scss/macred/app.scss',
            ],
            standalone: false
})
export class DatosAnalisisComponent implements OnInit {

  //VARIABLES INPUT DEL COMPONENTE PADRE
  @Input() _personaAnalisis: MacPersona;
  @Input() _globalCodMonedaPrincipal: number;
  @Input() listTipoFormaPagoAnalisis: MacTipoFormaPagoAnalisis[];
  @Input() listTipoIngresoAnalisis: MacTipoIngresoAnalisis[];
  @Input() listModelosAnalisis: MacModeloAnalisis[];
  @Input() listNivelesCapacidadpago: MacNivelCapacidadPago[];
  @Input() listTiposGeneradores: MacTipoGenerador[];
  @Input() listTiposMonedas: MacTiposMoneda[];

  //VARIABLES OUTPUT PARA ENVIAR AL COMPONENTE PADRE
  @Output() onIngresos = new EventEmitter();
  @Output() onPD = new EventEmitter();

  private userObservable: User;
  private companiaObservable: Compania;
  private moduleObservable: Module;

  habilitaBtnRegistroDeudor: boolean = false;
  habilitaBtnHistoprialIngreso: boolean = true;
  habilitaBtnGeneraNuevoAnalisis: boolean = true;
  habilitaBtnGuardarAnalisis: boolean = false;
  habilitaBtnIngreso: boolean = false;
  habilitaBtnPD_analisisIndependiente = false;

  formAnalisis: UntypedFormGroup;
  submittedAnalisisForm: boolean = false;

  listHistorialAnalisis: MacAnalisisCapacidadPago[] = [];

  formHistorialAnalisis: UntypedFormGroup;
  submittedHistorialAnalisisForm: boolean = false;

  get g() { return this.formAnalisis.controls; }
  get h() { return this.formHistorialAnalisis.controls; }

  public today : Date = new Date();

  analisisSeleccionado : MacAnalisisCapacidadPago = undefined;

  constructor(private formBuilder: UntypedFormBuilder,
              private macredService: MacredService,
              private accountService: AccountService,
              private alertService: AlertService,
              public srvDatosAnalisisService: SrvDatosAnalisisService) {

    this.srvDatosAnalisisService._analisisCapacidadpago = undefined;

    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.companiaObservable = this.accountService.businessValue;

    this.inicializaFormDatosAnalisis();
    this.inicializaFormHistorial();
  }

  ngOnInit(): void {}


  inicializaFormDatosAnalisis1(): void {

    if (this.srvDatosAnalisisService._analisisCapacidadpago) {

      this.habilitaBtnGeneraNuevoAnalisis = false;
      this.habilitaBtnGuardarAnalisis = true;
      this.inicializarBotonesParaContinuar();

      // this._ingresoAnalisisSeleccionado = null;
      // this._extrasAplicables = null;
      // this._deduccion = null;

      // this.listDeduccionesAnalisis = null;
      // this.listExtrasAplicables = null;

      this.formAnalisis = this.formBuilder.group({
        fechaAnalisis: [
          this.srvDatosAnalisisService._analisisCapacidadpago.fechaAnalisis,
          Validators.required,
        ],
        tipoIngresoAnalisis: [
          this.listTipoIngresoAnalisis.find(
            (x) =>
              x.id ===
              this.srvDatosAnalisisService._analisisCapacidadpago
                .codigoTipoIngresoAnalisis
          ),
          Validators.required,
        ],
        tipoFormaPagoAnalisis: [
          this.listTipoFormaPagoAnalisis.find(
            (x) =>
              x.id ===
              this.srvDatosAnalisisService._analisisCapacidadpago
                .codigoTipoFormaPagoAnalisis
          ),
          Validators.required,
        ],

        tipoMoneda: [
          this.listTiposMonedas.find(
            (x) =>
              x.id ===
              this.srvDatosAnalisisService._analisisCapacidadpago.codigoMoneda
          ),
          Validators.required,
        ],
        analisisDefinitivo:
          this.srvDatosAnalisisService._analisisCapacidadpago
            .analisisDefinitivo,
        estado: this.srvDatosAnalisisService._analisisCapacidadpago.estado,

        modeloAnalisis: [
          this.listModelosAnalisis.find(
            (x) =>
              x.id ===
              this.srvDatosAnalisisService._analisisCapacidadpago
                .codigoModeloAnalisis
          ),
          Validators.required,
        ],
        indicadorCsd:
          this.srvDatosAnalisisService._analisisCapacidadpago.indicadorCsd,
        ponderacionLvt:
          this.srvDatosAnalisisService._analisisCapacidadpago.descPondLvt,

        capacidadPago: this.listNivelesCapacidadpago.find(
          (x) =>
            x.id ===
            this.srvDatosAnalisisService._analisisCapacidadpago
              .codigoNivelCapPago
        ),
        tipoGenerador: this.listTiposGeneradores.find(
          (x) =>
            x.id ===
            this.srvDatosAnalisisService._analisisCapacidadpago
              .codigoTipoGenerador
        ),
        numeroDependientes:
          this.srvDatosAnalisisService._analisisCapacidadpago
            .numeroDependientes,
        puntajeAnalisis:
          this.srvDatosAnalisisService._analisisCapacidadpago.puntajeAnalisis,
        calificacionCic:
          this.srvDatosAnalisisService._analisisCapacidadpago.calificacionCic,
        calificacionFinalCic:
          this.srvDatosAnalisisService._analisisCapacidadpago.puntajeFinalCic,
        observaciones:
          this.srvDatosAnalisisService._analisisCapacidadpago.observaciones,
      });

      // this.formIngresos.patchValue({
      //   totalMontoAnalisis: this._analisisCapacidadpago.totalMontoAnalisis,
      //   totalIngresoBruto: this._analisisCapacidadpago.totalIngresoBruto,
      //   totalIngresoNeto: this._analisisCapacidadpago.totalIngresoNeto,
      //   totalCargaImpuestos: this._analisisCapacidadpago.totalCargaImpuestos,
      //   totalExtrasAplicables:
      //     this._analisisCapacidadpago.totalExtrasAplicables,
      //   totalDeducciones: this._analisisCapacidadpago.totalDeducciones,
      // });
    } else {

      let observacion: string = `Análisis generado el ` + this.today + ` por ` +
                                this.userObservable.identificacion + `.`;

      this.habilitaBtnGeneraNuevoAnalisis = true;
      this.habilitaBtnGuardarAnalisis = false;
      this.habilitaBtnIngreso = false;
      this.habilitaBtnPD_analisisIndependiente = false;

      // this.listDeduccionesAnalisis = null;
      // this.listIngresosAnalisis = null;
      // this.listExtrasAplicables = null;

      this.formAnalisis = this.formBuilder.group({
        fechaAnalisis: [this.today, Validators.required],
        tipoIngresoAnalisis: [null, Validators.required],
        tipoFormaPagoAnalisis: [null, Validators.required],

        // tipoMoneda: [ this.listTiposMonedas.find(
        //               (x) => x.id === this._globalCodMonedaPrincipal ), Validators.required ],
        tipoMoneda: [null, Validators.required ],
        analisisDefinitivo: false,
        estado: true,

        // modeloAnalisis: [ this.listModelosAnalisis.find((x) => x.id === 5), Validators.required ],
        modeloAnalisis: [null, Validators.required ],
        indicadorCsd: null,
        ponderacionLvt: null,

        // capacidadPago: this.listNivelesCapacidadpago.find((x) => x.id === 99),
        // tipoGenerador: this.listTiposGeneradores.find((x) => x.id === 99),
        capacidadPago: null,
        tipoGenerador: null,
        // numeroDependientes: 0,
        // puntajeAnalisis: 0,
        // calificacionCic: '0',
        // calificacionFinalCic: 0,
        numeroDependientes: null,
        puntajeAnalisis: null,
        calificacionCic: null,
        calificacionFinalCic: null,
        observaciones: observacion,
      });
    }
  }

  inicializarBotonesParaContinuar() {

    this.habilitaBtnIngreso = false;
    this.habilitaBtnPD_analisisIndependiente = false;

    if (
      this.listTipoIngresoAnalisis
        .find(
          (x) => x.id == this.srvDatosAnalisisService._analisisCapacidadpago.codigoTipoIngresoAnalisis
        )
        .descripcion.toLocaleLowerCase() == 'independiente'
    ) {
      this.habilitaBtnPD_analisisIndependiente = true;
    } else {
      this.habilitaBtnIngreso = true;
    }
  }

  openHistorialModal(): void {

    this.alertService.clear();

    this.macredService.getHistorialAnlisisPersona(this._personaAnalisis.id)
      .pipe(first())
      .subscribe((response) => { 
        
        if (response && response.length > 0) {

          this.listHistorialAnalisis = response;
          $('#analisisHistorialModal').modal( { backdrop: 'static', keyboard: false }, 'show' );

        } else { this.alertService.warn( `El usuario seleccionado no posee historial de análisis.` ); }
      });

    
  }

  SubmitNuevoAnalisis(): void {
    this.alertService.clear();
    this.submittedAnalisisForm = true;

    if (this.formAnalisis.invalid) return;

    var analisis: MacAnalisisCapacidadPago = this.createAnalisisObjectForm();
    analisis.adicionadoPor = this.userObservable.identificacion;
    analisis.fechaAdicion = this.today;

    this.macredService
      .postAnalisisCapPago(analisis)
      .pipe(first())
      .subscribe(
        (response) => {
          if (response) {
            this.srvDatosAnalisisService._analisisCapacidadpago = response;
            this.inicializaFormDatosAnalisis();

            this.alertService.success(
              `Análisis ${this.srvDatosAnalisisService._analisisCapacidadpago.codigoAnalisis} generado correctamente !`
            );
          } else {
            this.alertService.error(
              `Problemas al registrar el Análisis de Capacidad de Pago.`
            );
          }
        },
        (error) => {
          let message: string = 'Problemas de conexión. Detalle: ' + error;
          this.alertService.error(message);
        }
      );
  }

  createAnalisisObjectForm(): MacAnalisisCapacidadPago {
    var fechaAnalisis = this.formAnalisis.controls['fechaAnalisis'].value;
    var idTipoIngresoAnalisis =
      this.formAnalisis.controls['tipoIngresoAnalisis'].value.id;
    var idTipoFormaPagoAnalisis =
      this.formAnalisis.controls['tipoFormaPagoAnalisis'].value.id;
    var idNivelCapacidadPago =
      this.formAnalisis.controls['capacidadPago'].value.id;
    var idModeloAnalisis =
      this.formAnalisis.controls['modeloAnalisis'].value.id;
    var idTipoMoneda = this.formAnalisis.controls['tipoMoneda'].value.id;
    var idTipoGenerador = this.formAnalisis.controls['tipoGenerador'].value.id;
    var estado = this.formAnalisis.controls['estado'].value;
    var analisisDefinitivo =
      this.formAnalisis.controls['analisisDefinitivo'].value;
    var puntajeAnalisis = this.formAnalisis.controls['puntajeAnalisis'].value;
    var calificacionCic = this.formAnalisis.controls['calificacionCic'].value;
    var calificacionFinalCic =
      this.formAnalisis.controls['calificacionFinalCic'].value;
    var indicadorCsd = this.formAnalisis.controls['indicadorCsd'].value;
    var ponderacionLvt = this.formAnalisis.controls['ponderacionLvt'].value;
    var numeroDependientes =
      this.formAnalisis.controls['numeroDependientes'].value;
    var observaciones = this.formAnalisis.controls['observaciones'].value;

    var ancapCapPago = 0.0;
    var ancapCalificacionFinal = 0.0;
    var ancapPuntajeFinal = 0.0;

    var analisis = new MacAnalisisCapacidadPago();

    analisis.codigoCompania = this.companiaObservable.id;
    analisis.codigoPersona = this._personaAnalisis.id;

    analisis.fechaAnalisis = fechaAnalisis;
    analisis.estado = estado;
    analisis.analisisDefinitivo = analisisDefinitivo;
    analisis.codigoNivelCapPago = idNivelCapacidadPago;
    analisis.puntajeAnalisis = puntajeAnalisis;
    analisis.calificacionCic = calificacionCic;
    analisis.puntajeFinalCic = calificacionFinalCic;
    analisis.codigoTipoIngresoAnalisis = idTipoIngresoAnalisis;
    analisis.codigoTipoFormaPagoAnalisis = idTipoFormaPagoAnalisis;
    analisis.codigoModeloAnalisis = idModeloAnalisis;
    analisis.codigoMoneda = idTipoMoneda;
    analisis.codigoTipoGenerador = idTipoGenerador;
    analisis.indicadorCsd = indicadorCsd;
    analisis.descPondLvt = ponderacionLvt;
    analisis.numeroDependientes = numeroDependientes;
    analisis.observaciones = observaciones;
    analisis.ancapCapacidadPago = ancapCapPago;
    analisis.ancapCalificacionFinal = ancapCalificacionFinal;
    analisis.ancapPuntajeFinal = ancapPuntajeFinal;

    return analisis;
  }

  GuardarAnalisis(): void {
    this.alertService.clear();
    this.submittedAnalisisForm = true;

    if (this.formAnalisis.invalid) return;

    var analisis: MacAnalisisCapacidadPago = this.createAnalisisObjectForm();
    analisis.codigoAnalisis =
      this.srvDatosAnalisisService._analisisCapacidadpago.codigoAnalisis;
    analisis.modificadoPor = this.userObservable.identificacion;
    analisis.fechaModificacion = this.today;

    analisis.totalMontoAnalisis =
      this.srvDatosAnalisisService._analisisCapacidadpago.totalMontoAnalisis;
    analisis.totalIngresoBruto =
      this.srvDatosAnalisisService._analisisCapacidadpago.totalIngresoBruto;
    analisis.totalIngresoNeto =
      this.srvDatosAnalisisService._analisisCapacidadpago.totalIngresoNeto;
    analisis.totalCargaImpuestos =
      this.srvDatosAnalisisService._analisisCapacidadpago.totalCargaImpuestos;
    analisis.totalExtrasAplicables =
      this.srvDatosAnalisisService._analisisCapacidadpago.totalExtrasAplicables;
    analisis.totalDeducciones =
      this.srvDatosAnalisisService._analisisCapacidadpago.totalDeducciones;

    this.srvDatosAnalisisService
      .procesoActualizarAnalisisCapacidadPago(analisis)
      .then((response: any) => {
        if (response) {
          this.srvDatosAnalisisService._analisisCapacidadpago = response;
          this.inicializaFormDatosAnalisis();

          this.alertService.success(
            `Análisis ${this.srvDatosAnalisisService._analisisCapacidadpago.codigoAnalisis} actualizado con éxito.`
          );
        } else {
          this.alertService.error(`No fue posible actualizar el análisis.`);
        }
      })
      .catch((error) => {
        this.alertService.error(
          `Problemas al establecer la conexión con el servidor. Detalle: ${error}`
        );
      });

  }

  selectAnalisisHistorial(analisis: MacAnalisisCapacidadPago): void {
    
    this.srvDatosAnalisisService._analisisCapacidadpago = analisis;
    this.analisisSeleccionado = analisis;

    this.inicializaFormDatosAnalisis(this.analisisSeleccionado);

    $('#analisisHistorialModal').modal('hide');
  }

  handleOnIngresos() {
    this.onIngresos.emit();
  }

  handleOnPD() {
    this.onPD.emit();
  }



  // actualizaciones 2025
  private inicializaFormHistorial(): void {
    this.formHistorialAnalisis = this.formBuilder.group({
      codigoAnalisisHistorial: [null]
    });
  }
  private inicializaFormDatosAnalisis(srvAnalisis : MacAnalisisCapacidadPago = null): void {

    if (srvAnalisis) { 

      this.habilitaBtnGeneraNuevoAnalisis = false;
      this.habilitaBtnGuardarAnalisis = true;

      this.inicializarBotonesParaContinuar();

      this.formAnalisis = this.formBuilder.group({
        fechaAnalisis: [srvAnalisis.fechaAnalisis, Validators.required],

        tipoIngresoAnalisis: [this.listTipoIngresoAnalisis.find((x) => 
          x.id === srvAnalisis.codigoTipoIngresoAnalisis), Validators.required],
        tipoFormaPagoAnalisis: [this.listTipoFormaPagoAnalisis.find((x) => 
          x.id === srvAnalisis.codigoTipoFormaPagoAnalisis), Validators.required],

        tipoMoneda: [this.listTiposMonedas.find((x) => 
          x.id === srvAnalisis.codigoMoneda), Validators.required],
        analisisDefinitivo: srvAnalisis.analisisDefinitivo,
        estado: srvAnalisis.estado,

        modeloAnalisis: [this.listModelosAnalisis.find((x) => 
          x.id === srvAnalisis.codigoModeloAnalisis), Validators.required],
        indicadorCsd: srvAnalisis.indicadorCsd,
        ponderacionLvt: srvAnalisis.descPondLvt,

        capacidadPago: this.listNivelesCapacidadpago.find((x) => 
          x.id === srvAnalisis.codigoNivelCapPago),
        tipoGenerador: this.listTiposGeneradores.find((x) => 
          x.id === srvAnalisis.codigoTipoGenerador ),

        numeroDependientes: srvAnalisis.numeroDependientes,
        puntajeAnalisis: srvAnalisis.puntajeAnalisis,
        calificacionCic: srvAnalisis.calificacionCic,
        calificacionFinalCic: srvAnalisis.puntajeFinalCic,
        observaciones: srvAnalisis.observaciones
      });

    } else {

      let observacion: string = `Análisis generado el ` + this.today + ` por ` +
                                this.userObservable.identificacion + `.`;

      this.habilitaBtnGeneraNuevoAnalisis = true;
      this.habilitaBtnGuardarAnalisis = false;
      this.habilitaBtnIngreso = false;
      this.habilitaBtnPD_analisisIndependiente = false;

      this.formAnalisis = this.formBuilder.group({
        fechaAnalisis: [this.today, Validators.required],
        tipoIngresoAnalisis: [null, Validators.required],
        tipoFormaPagoAnalisis: [null, Validators.required],
        tipoMoneda: [null, Validators.required ],
        analisisDefinitivo: false,
        estado: false,
        modeloAnalisis: [null, Validators.required ],
        indicadorCsd: null,
        ponderacionLvt: null,
        capacidadPago: null,
        tipoGenerador: null,
        numeroDependientes: null,
        puntajeAnalisis: null,
        calificacionCic: null,
        calificacionFinalCic: null,
        observaciones: observacion,
      });
    }
  }
}
