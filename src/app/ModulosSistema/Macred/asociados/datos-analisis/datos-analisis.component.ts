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
import { MatDialog } from '@angular/material/dialog';
import { CodeudorFiador } from '@app/_models/Macred/CodeudorFiador';
import { MacTipoAsociado } from '@app/_models/Macred/TipoAsociado';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';

declare var $: any;

@Component({selector: 'app-datos-analisis-macred',
            templateUrl: './datos-analisis.component.html',
            styleUrls: ['../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class DatosAnalisisComponent implements OnInit {

  //VARIABLES INPUT DEL COMPONENTE PADRE
  @Input() _personaAnalisis: MacPersona;
  // @Input() _globalCodMonedaPrincipal: number;
  
  // @Input() listTipoFormaPagoAnalisis: MacTipoFormaPagoAnalisis[];
  // @Input() listTipoIngresoAnalisis: MacTipoIngresoAnalisis[];
  // @Input() listModelosAnalisis: MacModeloAnalisis[];
  // @Input() listNivelesCapacidadpago: MacNivelCapacidadPago[];
  // @Input() listTiposGeneradores: MacTipoGenerador[];
  // @Input() listTiposMonedas: MacTiposMoneda[];
  
  listTiposAsociados: MacTipoAsociado[];
  listTipoFormaPagoAnalisis: MacTipoFormaPagoAnalisis[];
  listTipoIngresoAnalisis: MacTipoIngresoAnalisis[];
  listModelosAnalisis: MacModeloAnalisis[];
  listNivelesCapacidadpago: MacNivelCapacidadPago[];
  listTiposGeneradores: MacTipoGenerador[];
  listTiposMonedas: MacTiposMoneda[];
  
  @Input() onConfirmNuevoAnalisis!: () => Promise<boolean>;

  //VARIABLES OUTPUT PARA ENVIAR AL COMPONENTE PADRE
  @Output() onIngresos = new EventEmitter();
  @Output() onPD = new EventEmitter();
  
  private userObservable: User;
  private companiaObservable: Compania;
  private moduleObservable: Module;

  public bordeSuccess = false;
  public bordeError = false;

  habilitaBtnNuevoAnalisis: boolean = false;
  habilitaBtnHistoprialIngreso: boolean = true;
  habilitaBtnRegistroAnalisis: boolean = true;
  habilitaBtnGuardarAnalisis: boolean = false;
  habilitaBtnIngreso: boolean = false;
  habilitaBtnPD: boolean = false;

  habilitaBtnNewCod: boolean = false;
  habilitaBtnPostCod: boolean = false;
  habilitaBtnPutCod: boolean = false;
  habilitaBtnDeleteCod: boolean = false;

  
  listCodeudoresFiadores: CodeudorFiador[] = null;

  listHistorialAnalisis: MacAnalisisCapacidadPago[] = [];
  
  formAnalisis: UntypedFormGroup;
  submittedAnalisisForm: boolean = false;

  formHistorialAnalisis: UntypedFormGroup;
  submittedHistorialAnalisisForm: boolean = false;

  formCodeudorFiadorAnalisis: UntypedFormGroup;
  submittedCodeudorFiadorAnalisisForm: boolean = false;

  objSeleccionadoCodeudorFiador : CodeudorFiador = undefined;

  get g() { return this.formAnalisis.controls; }
  get h() { return this.formHistorialAnalisis.controls; }
  get c() { return this.formCodeudorFiadorAnalisis.controls; }

  oAnalisis : MacAnalisisCapacidadPago;

  public today : Date = new Date();

  constructor(private formBuilder: UntypedFormBuilder,
              private macredService: MacredService,
              private accountService: AccountService,
              private alertService: AlertService,
              private dialogo: MatDialog,
              public srvDatosAnalisisService: SrvDatosAnalisisService) {

    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.companiaObservable = this.accountService.businessValue;
  }

  ngOnInit(): void {

    this.listTiposAsociados = this.srvDatosAnalisisService.listTiposAsociados;
    this.listTipoFormaPagoAnalisis = this.srvDatosAnalisisService.listTipoFormaPagoAnalisis;
    this.listTipoIngresoAnalisis = this.srvDatosAnalisisService.listTipoIngresoAnalisis;
    this.listModelosAnalisis = this.srvDatosAnalisisService.listModelosAnalisis;
    this.listNivelesCapacidadpago = this.srvDatosAnalisisService.listNivelesCapacidadpago;
    this.listTiposGeneradores = this.srvDatosAnalisisService.listTiposGeneradores;
    this.listTiposMonedas = this.srvDatosAnalisisService.listTiposMonedas;

    this.inicializaFormDatosAnalisis();
    this.inicializaFormHistorial();
    this.inicializaFormCodeudorFiador();
  }

  handleOnIngresos() { this.habilitaBtnIngreso = false; this.onIngresos.emit(); }
  handleOnPD() { this.onPD.emit(); }
  

  iniciarBotonesDatosAnalisis(registra : boolean) {

    this.habilitaBtnIngreso = false;
    this.habilitaBtnPD = false;

    if (registra) {

      this.habilitaBtnRegistroAnalisis = false;
      this.habilitaBtnNuevoAnalisis = true;
      this.habilitaBtnGuardarAnalisis = true;

      const tipoAnalisis = this.srvDatosAnalisisService.listTipoIngresoAnalisis.find(
        (x) => x.id === this.oAnalisis.codigoTipoIngresoAnalisis).descripcion.toLocaleLowerCase();

      if (tipoAnalisis === 'independiente' ) {
            
        this.habilitaBtnPD = true;
      
      } else { this.habilitaBtnIngreso = true; }

    }
    else {
      this.habilitaBtnRegistroAnalisis = true;
      this.habilitaBtnNuevoAnalisis = false;
      this.habilitaBtnGuardarAnalisis = false;
    }
  }

  openHistorialModal(): void {
    this.alertService.clear();

    this.macredService.getHistorialAnlisisPersona(this._personaAnalisis.id)
      .pipe(first())
      .subscribe((response) => { 
        
        if (response && response.length > 0) {
          this.listHistorialAnalisis = response;

          $('#analisisHistorialModal').modal({ backdrop: 'static', keyboard: false });

        } else { this.alertService.warn(`El usuario seleccionado no posee historial de análisis.`); }
      });
  }
  openCodeudorFiadorModal(): void {
    this.alertService.clear();

    const idAnalisis = this.oAnalisis.codigoAnalisis;

    this.inicializaFormCodeudorFiador();

    this.macredService.getCodeudoresFiadoresAnalisis(idAnalisis)
      .pipe(first())
      .subscribe((response) => {

        if (response && response.length > 0) {

          if (!this.listCodeudoresFiadores) this.listCodeudoresFiadores = [];
          
          response.forEach(e => {
            e.descTipoAsociado = this.listTiposAsociados.find((x) => x.id === e.idTipoAsociado).descripcion;
          });
          this.listCodeudoresFiadores = response;

        } else { this.listCodeudoresFiadores = null; }

        // muestra el modal y hace focus en el primer boton
        const modal = $('#codeudoresFiadoresModal');
        modal.modal({ backdrop: 'static', keyboard: false });
        modal.on('shown.bs.modal', () => {
          const firstFocusable = 
          document.querySelector<HTMLInputElement>( '#codeudoresFiadoresModal button' );
          firstFocusable?.focus();
        });
      });
  }

  private obtenerDatosFormularioCF(registra : boolean = true): CodeudorFiador {

    this.alertService.clear();
    this.submittedCodeudorFiadorAnalisisForm = true;

    if (this.formCodeudorFiadorAnalisis.invalid) return ;
    
    const { idTipoAsociado, 
            identificacionCF,
            montoCF,
            estadoCF } = this.formCodeudorFiadorAnalisis.controls;

    let obj : CodeudorFiador = new CodeudorFiador();

    obj.idAnalisis = this.oAnalisis.codigoAnalisis;
    obj.idTipoAsociado = idTipoAsociado.value.id;

    obj.idPersona = this._personaAnalisis.id;
    obj.identificacionCF = identificacionCF.value;
    obj.montoCF = montoCF.value;

    obj.estado = estadoCF.value;

    if (registra) {

      obj.idCompania = this.companiaObservable.id;
      obj.idModulo = this.moduleObservable.id;

      obj.adicionadoPor = this.userObservable.identificacion; 
      obj.fechaAdicion = new Date();
    } else {
      obj.id = this.objSeleccionadoCodeudorFiador.id;
      obj.modificadoPor = this.userObservable.identificacion; 
      obj.fechaModificacion = new Date();
    }
    return obj;
  }

  newCodeudorFiador() : void { this.inicializaFormCodeudorFiador(); }

  postCodeudorFiador(): void {

    var obj: CodeudorFiador = this.obtenerDatosFormularioCF();
    if (!obj) return;

    this.macredService.postCodeudorFiador(obj)
      .pipe(first())
      .subscribe({
        next: (response) => {
          if (response.exito) {

          if (!this.listCodeudoresFiadores) this.listCodeudoresFiadores = [];
          
          response.objetoDb.descTipoAsociado = 
            this.listTiposAsociados.find((x) => x.id === response.objetoDb.idTipoAsociado).descripcion;

          this.listCodeudoresFiadores.push(response.objetoDb);

          this.inicializaFormCodeudorFiador();
          this.alertService.success( response.responseMesagge );

        } else { this.alertService.error(response.responseMesagge); }

        }, error: (error) => { this.alertService.error(error); }
      });
  }
  putCodeudorFiador(): void {

    var obj: CodeudorFiador = this.obtenerDatosFormularioCF(false);
    if (!obj) return;

    this.macredService.putCodeudorFiador(obj)
      .pipe(first())
      .subscribe({
        next: (response) => {
          if (response.exito) {
          
            response.objetoDb.descTipoAsociado = 
              this.listTiposAsociados.find((x) => x.id === response.objetoDb.idTipoAsociado).descripcion;

            this.listCodeudoresFiadores.splice(
              this.listCodeudoresFiadores.findIndex((x) => x.id === response.objetoDb.idTipoAsociado), 1
            );

            this.listCodeudoresFiadores.push(response.objetoDb);

            this.inicializaFormCodeudorFiador();
            this.alertService.success(response.responseMesagge);

          } else { this.alertService.error(response.responseMesagge); }
        }, error: (error) => { this.alertService.error(error); }
      });
  }
  deleteCodeudorFiador(): void {

    this.alertService.clear();
    
    if (this.objSeleccionadoCodeudorFiador) {

      this.dialogo.open(DialogoConfirmacionComponent, { 
          data: 'Seguro que desea eliminar a ' + this.objSeleccionadoCodeudorFiador.identificacionCF + '?' 
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {

          if (confirmado) {

              this.macredService.deleteCodeudorFiador(this.objSeleccionadoCodeudorFiador.id)
                  .pipe(first())
                  .subscribe({
                    next: (response) => {

                      if (response.exito) {

                          this.listCodeudoresFiadores.splice(
                            this.listCodeudoresFiadores.findIndex( m => m.id == this.objSeleccionadoCodeudorFiador.id ), 1
                          );
                          this.inicializaFormCodeudorFiador();

                          if (this.listCodeudoresFiadores.length === 0) this.listCodeudoresFiadores = null;

                          this.alertService.success( response.responseMesagge );

                      } else { this.alertService.error(response.responseMesagge); }
                    }, error: (error) => { this.alertService.error(error); }
                  });
          } else { return; }
      });
    }
  }

  async postAnalisis(): Promise<void> {

    var analisis: MacAnalisisCapacidadPago = this.createAnalisisObjectForm();

    if (analisis) {

      try {
        const response = await this.srvDatosAnalisisService.registrarAnalisis(analisis);

        if (response.exito) {

          this.inicializaFormDatosAnalisis(response.objetoDb);
          this.alertService.success(response.responseMesagge);

          this.bordeSuccess = true;
          setTimeout(() => { this.bordeSuccess = false; }, 2000);

        } else { 
          this.alertService.error(response.responseMesagge);
          this.bordeError = true;
          setTimeout(() => { this.bordeError = false; }, 2000);
        }
        this.submittedAnalisisForm = false;

      } catch (error: any) { this.alertService.error(error); }
    }
  }

  async putAnalisis(): Promise<void> {

    var analisis: MacAnalisisCapacidadPago = this.createAnalisisObjectForm(false);

    if (analisis) {

      try {
        const response = await this.srvDatosAnalisisService.actualizarAnalisis(analisis);

        if (response.exito) {

          this.inicializaFormDatosAnalisis(response.objetoDb);
          
          this.alertService.success( response.responseMesagge );
          this.bordeSuccess = true;
          setTimeout(() => { this.bordeSuccess = false; }, 2000);

        } else { 
          this.alertService.error( response.responseMesagge );
          this.bordeError = true;
          setTimeout(() => { this.bordeError = false; }, 2000);
        }
        this.submittedAnalisisForm = false;

      } catch (error: any) { this.alertService.error(error); }
    }
  }

  createAnalisisObjectForm(registra : boolean = true): MacAnalisisCapacidadPago {

    this.alertService.clear();
    this.submittedAnalisisForm = true;

    if (this.formAnalisis.invalid) return null;

    const f = this.formAnalisis.controls;
    const analisis = new MacAnalisisCapacidadPago();

    analisis.codigoCompania = this.companiaObservable.id;
    analisis.codigoPersona = this._personaAnalisis.id;

    analisis.fechaAnalisis = f['fechaAnalisis'].value;
    analisis.estado = f['estado'].value;
    analisis.analisisDefinitivo = f['analisisDefinitivo'].value;

    analisis.codigoNivelCapPago = f['capacidadPago'].value.id;
    analisis.puntajeAnalisis = f['puntajeAnalisis'].value ?? 0;
    analisis.calificacionCic = f['calificacionCic'].value ?? '0';
    analisis.puntajeFinalCic = f['calificacionFinalCic'].value ?? 0;

    analisis.codigoTipoIngresoAnalisis = f['tipoIngresoAnalisis'].value.id;
    analisis.codigoTipoFormaPagoAnalisis = f['tipoFormaPagoAnalisis'].value.id;
    analisis.codigoModeloAnalisis = f['modeloAnalisis'].value.id;
    analisis.codigoMoneda = f['tipoMoneda'].value.id;
    analisis.codigoTipoGenerador = f['tipoGenerador'].value.id;

    analisis.indicadorCsd = f['indicadorCsd'].value;
    analisis.descPondLvt = f['ponderacionLvt'].value;
    analisis.numeroDependientes = f['numeroDependientes'].value;
    analisis.observaciones = f['observaciones'].value;

    analisis.ancapCapacidadPago = 0.0;
    analisis.ancapCalificacionFinal = 0.0;
    analisis.ancapPuntajeFinal = 0.0;

    if (registra) {

      analisis.adicionadoPor = this.userObservable.identificacion;
      analisis.fechaAdicion = this.today;

    } else {
      analisis.codigoAnalisis = this.oAnalisis.codigoAnalisis;

      analisis.totalMontoAnalisis = this.oAnalisis.totalMontoAnalisis;
      analisis.totalIngresoBruto = this.oAnalisis.totalIngresoBruto;
      analisis.totalIngresoNeto = this.oAnalisis.totalIngresoNeto;
      analisis.totalCargaImpuestos = this.oAnalisis.totalCargaImpuestos;
      analisis.totalExtrasAplicables = this.oAnalisis.totalExtrasAplicables;
      analisis.totalDeducciones = this.oAnalisis.totalDeducciones;

      analisis.modificadoPor = this.userObservable.identificacion;
      analisis.fechaModificacion = this.today;
    }
    return analisis;
  }

  async nuevoAnalisis(): Promise<void> { 

    const confirmado = await this.onConfirmNuevoAnalisis();

      if (confirmado) {

        this.habilitaBtnNuevoAnalisis = false;
        this.habilitaBtnIngreso = false;

        this.inicializaFormDatosAnalisis();
      }
  }

  async selectAnalisisHistorial(panalisis: MacAnalisisCapacidadPago): Promise<void> {

    if (this.onConfirmNuevoAnalisis) {

      const confirmado = await this.onConfirmNuevoAnalisis();

      if (confirmado) {

        this.habilitaBtnNuevoAnalisis = true;
        this.habilitaBtnIngreso = true;

        this.inicializaFormDatosAnalisis(panalisis);

        $('#analisisHistorialModal').modal('hide');
      }
    }
  }
  
  // actualizaciones 2025

  selectCodeudorFiador(pobj: CodeudorFiador): void { this.inicializaFormCodeudorFiador(pobj); }

  public inicializaFormHistorial(): void {
    this.formHistorialAnalisis = this.formBuilder.group({
      codigoAnalisisHistorial: [null]
    });
  }
  public inicializaFormDatosAnalisis(panalisis : MacAnalisisCapacidadPago = null): void {

    this.submittedAnalisisForm = false;

    if (panalisis) {

      this.formAnalisis = this.formBuilder.group({
        fechaAnalisis: [panalisis.fechaAnalisis, Validators.required],

        
        tipoIngresoAnalisis: [this.listTipoIngresoAnalisis.find((x) => 
          x.id === panalisis.codigoTipoIngresoAnalisis), Validators.required],
        
        // tipoIngresoAnalisis: [this.srvDatosAnalisisService.listTipoIngresoAnalisis.find((x) => 
        //   x.id === panalisis.codigoTipoIngresoAnalisis), Validators.required],
        // tipoFormaPagoAnalisis: [this.srvDatosAnalisisService.listTipoFormaPagoAnalisis.find((x) => 
        //   x.id === panalisis.codigoTipoFormaPagoAnalisis), Validators.required],
        // tipoMoneda: [this.srvDatosAnalisisService.listTiposMonedas.find((x) => 
        //   x.id === panalisis.codigoMoneda), Validators.required],
        // modeloAnalisis: [this.srvDatosAnalisisService.listModelosAnalisis.find((x) => 
        //   x.id === panalisis.codigoModeloAnalisis), Validators.required],
        // capacidadPago: this.srvDatosAnalisisService.listNivelesCapacidadpago.find((x) => 
        //   x.id === panalisis.codigoNivelCapPago),
        // tipoGenerador: this.srvDatosAnalisisService.listTiposGeneradores.find((x) => 
        //   x.id === panalisis.codigoTipoGenerador ),

        tipoFormaPagoAnalisis: [this.listTipoFormaPagoAnalisis.find((x) => x.id === panalisis.codigoTipoFormaPagoAnalisis), Validators.required],
        tipoMoneda: [this.listTiposMonedas.find((x) => x.id === panalisis.codigoMoneda), Validators.required],
        
        analisisDefinitivo: panalisis.analisisDefinitivo,
        estado: panalisis.estado,

        modeloAnalisis: [this.listModelosAnalisis.find((x) => x.id === panalisis.codigoModeloAnalisis), Validators.required],
        indicadorCsd: panalisis.indicadorCsd,
        ponderacionLvt: panalisis.descPondLvt,

        capacidadPago: this.listNivelesCapacidadpago.find((x) => x.id === panalisis.codigoNivelCapPago),
        tipoGenerador: this.listTiposGeneradores.find((x) => x.id === panalisis.codigoTipoGenerador ),

        numeroDependientes: panalisis.numeroDependientes,
        puntajeAnalisis: panalisis.puntajeAnalisis,
        calificacionCic: panalisis.calificacionCic,
        calificacionFinalCic: panalisis.puntajeFinalCic,
        observaciones: panalisis.observaciones
      });
      this.srvDatosAnalisisService.setAnalisisCapacidadPago(panalisis);
      this.oAnalisis = panalisis;

      this.iniciarBotonesDatosAnalisis(true);

    } else {

      const observacion: string = 
        `Análisis generado el ` + this.today + ` por ` + this.userObservable.identificacion + `.`;

      this.formAnalisis = this.formBuilder.group({
        fechaAnalisis: [this.today, Validators.required],
        tipoIngresoAnalisis: [null, Validators.required],
        tipoFormaPagoAnalisis: [null, Validators.required],

        tipoMoneda: [this.listTiposMonedas.find((x) => x.id === this.srvDatosAnalisisService._globalCodMonedaPrincipal), Validators.required],
        // tipoMoneda: [this.srvDatosAnalisisService.listTiposMonedas.find((x) => 
        //   x.id === this.srvDatosAnalisisService._globalCodMonedaPrincipal), Validators.required],
        
        analisisDefinitivo: false,
        estado: true,
        modeloAnalisis: [null, Validators.required ],
        indicadorCsd: null,
        ponderacionLvt: null,
        capacidadPago: this.listNivelesCapacidadpago.find((x) => x.id === 99),
        tipoGenerador: this.listTiposGeneradores.find((x) => x.id === 99),
        // capacidadPago: this.srvDatosAnalisisService.listNivelesCapacidadpago.find((x) => x.id === 99),
        // tipoGenerador: this.srvDatosAnalisisService.listTiposGeneradores.find((x) => x.id === 99),
        numeroDependientes: null,
        puntajeAnalisis: null,
        calificacionCic: null,
        calificacionFinalCic: null,
        observaciones: observacion,
      });
      this.srvDatosAnalisisService.setAnalisisCapacidadPago();
      this.oAnalisis = undefined;

      this.iniciarBotonesDatosAnalisis(false);
    }
    this.srvDatosAnalisisService.actualizaListaIngresosAnalisis();
  }
  public inicializaFormCodeudorFiador(pcodeudorFiador : CodeudorFiador = null): void {
    
    this.submittedCodeudorFiadorAnalisisForm = false;

    if (pcodeudorFiador) {

      this.formCodeudorFiadorAnalisis = this.formBuilder.group({
        
        identificacionRelacionado: [this._personaAnalisis.identificacion],
        nombreCompletoRelacionado: [this._personaAnalisis.nombre + ' ' + 
                                    this._personaAnalisis.primerApellido + ' ' + 
                                    this._personaAnalisis.segundoApellido],
        
        idTipoAsociado: [this.listTiposAsociados.find((x) => x.id === pcodeudorFiador.idTipoAsociado), Validators.required],
        identificacionCF: [pcodeudorFiador.identificacionCF, Validators.required],
        montoCF: [pcodeudorFiador.montoCF],
        estadoCF: [pcodeudorFiador.estado]
      });

      this.objSeleccionadoCodeudorFiador = pcodeudorFiador;

      this.habilitaBtnPutCod = true;
      this.habilitaBtnDeleteCod = true;
      this.habilitaBtnNewCod = true;
      this.habilitaBtnPostCod = false;

    } else {
    
      this.formCodeudorFiadorAnalisis = this.formBuilder.group({

        identificacionRelacionado: [this._personaAnalisis.identificacion],
        nombreCompletoRelacionado: [this._personaAnalisis.nombre + ' ' + 
                                    this._personaAnalisis.primerApellido + ' ' + 
                                    this._personaAnalisis.segundoApellido],

        idTipoAsociado: [
          this.listTiposAsociados && this.listTiposAsociados.length > 0
            ? this.listTiposAsociados.find(x => x.id === 1)
            : null, Validators.required],
        identificacionCF: [null, Validators.required],
        montoCF: [null],
        estadoCF: [true]
      });

      this.objSeleccionadoCodeudorFiador = undefined;

      this.habilitaBtnPutCod = false;
      this.habilitaBtnDeleteCod = false;
      this.habilitaBtnNewCod = false;
      this.habilitaBtnPostCod = true;
    }
  }
}


// inicializaFormDatosAnalisis1(): void {

//     if (this.srvDatosAnalisisService._analisisCapacidadpago) {

//       this.habilitaBtnRegistroAnalisis = false;
//       this.habilitaBtnGuardarAnalisis = true;
//       this.iniciarBotonesDatosAnalisis();

//       // this._ingresoAnalisisSeleccionado = null;
//       // this._extrasAplicables = null;
//       // this._deduccion = null;

//       // this.listDeduccionesAnalisis = null;
//       // this.listExtrasAplicables = null;

//       this.formAnalisis = this.formBuilder.group({
//         fechaAnalisis: [
//           this.srvDatosAnalisisService._analisisCapacidadpago.fechaAnalisis,
//           Validators.required,
//         ],
//         tipoIngresoAnalisis: [
//           this.listTipoIngresoAnalisis.find(
//             (x) =>
//               x.id ===
//               this.srvDatosAnalisisService._analisisCapacidadpago
//                 .codigoTipoIngresoAnalisis
//           ),
//           Validators.required,
//         ],
//         tipoFormaPagoAnalisis: [
//           this.listTipoFormaPagoAnalisis.find(
//             (x) =>
//               x.id ===
//               this.srvDatosAnalisisService._analisisCapacidadpago
//                 .codigoTipoFormaPagoAnalisis
//           ),
//           Validators.required,
//         ],

//         tipoMoneda: [
//           this.listTiposMonedas.find(
//             (x) =>
//               x.id ===
//               this.srvDatosAnalisisService._analisisCapacidadpago.codigoMoneda
//           ),
//           Validators.required,
//         ],
//         analisisDefinitivo:
//           this.srvDatosAnalisisService._analisisCapacidadpago
//             .analisisDefinitivo,
//         estado: this.srvDatosAnalisisService._analisisCapacidadpago.estado,

//         modeloAnalisis: [
//           this.listModelosAnalisis.find(
//             (x) =>
//               x.id ===
//               this.srvDatosAnalisisService._analisisCapacidadpago
//                 .codigoModeloAnalisis
//           ),
//           Validators.required,
//         ],
//         indicadorCsd:
//           this.srvDatosAnalisisService._analisisCapacidadpago.indicadorCsd,
//         ponderacionLvt:
//           this.srvDatosAnalisisService._analisisCapacidadpago.descPondLvt,

//         capacidadPago: this.listNivelesCapacidadpago.find(
//           (x) =>
//             x.id ===
//             this.srvDatosAnalisisService._analisisCapacidadpago
//               .codigoNivelCapPago
//         ),
//         tipoGenerador: this.listTiposGeneradores.find(
//           (x) =>
//             x.id ===
//             this.srvDatosAnalisisService._analisisCapacidadpago
//               .codigoTipoGenerador
//         ),
//         numeroDependientes:
//           this.srvDatosAnalisisService._analisisCapacidadpago
//             .numeroDependientes,
//         puntajeAnalisis:
//           this.srvDatosAnalisisService._analisisCapacidadpago.puntajeAnalisis,
//         calificacionCic:
//           this.srvDatosAnalisisService._analisisCapacidadpago.calificacionCic,
//         calificacionFinalCic:
//           this.srvDatosAnalisisService._analisisCapacidadpago.puntajeFinalCic,
//         observaciones:
//           this.srvDatosAnalisisService._analisisCapacidadpago.observaciones,
//       });

//       // this.formIngresos.patchValue({
//       //   totalMontoAnalisis: this._analisisCapacidadpago.totalMontoAnalisis,
//       //   totalIngresoBruto: this._analisisCapacidadpago.totalIngresoBruto,
//       //   totalIngresoNeto: this._analisisCapacidadpago.totalIngresoNeto,
//       //   totalCargaImpuestos: this._analisisCapacidadpago.totalCargaImpuestos,
//       //   totalExtrasAplicables:
//       //     this._analisisCapacidadpago.totalExtrasAplicables,
//       //   totalDeducciones: this._analisisCapacidadpago.totalDeducciones,
//       // });
//     } else {

//       let observacion: string = `Análisis generado el ` + this.today + ` por ` +
//                                 this.userObservable.identificacion + `.`;

//       this.habilitaBtnRegistroAnalisis = true;
//       this.habilitaBtnGuardarAnalisis = false;
//       this.habilitaBtnIngreso = false;
//       this.habilitaBtnPD = false;

//       // this.listDeduccionesAnalisis = null;
//       // this.listIngresosAnalisis = null;
//       // this.listExtrasAplicables = null;

//       this.formAnalisis = this.formBuilder.group({
//         fechaAnalisis: [this.today, Validators.required],
//         tipoIngresoAnalisis: [null, Validators.required],
//         tipoFormaPagoAnalisis: [null, Validators.required],

//         // tipoMoneda: [ this.listTiposMonedas.find(
//         //               (x) => x.id === this._globalCodMonedaPrincipal ), Validators.required ],
//         tipoMoneda: [null, Validators.required ],
//         analisisDefinitivo: false,
//         estado: true,

//         // modeloAnalisis: [ this.listModelosAnalisis.find((x) => x.id === 5), Validators.required ],
//         modeloAnalisis: [null, Validators.required ],
//         indicadorCsd: null,
//         ponderacionLvt: null,

//         // capacidadPago: this.listNivelesCapacidadpago.find((x) => x.id === 99),
//         // tipoGenerador: this.listTiposGeneradores.find((x) => x.id === 99),
//         capacidadPago: null,
//         tipoGenerador: null,
//         // numeroDependientes: 0,
//         // puntajeAnalisis: 0,
//         // calificacionCic: '0',
//         // calificacionFinalCic: 0,
//         numeroDependientes: null,
//         puntajeAnalisis: null,
//         calificacionCic: null,
//         calificacionFinalCic: null,
//         observaciones: observacion,
//       });
//     }
//   }