import { FormBuilder, FormGroup, Validators  }      from '@angular/forms';
import { Component, OnInit, ViewChild }             from '@angular/core';
import { AccountService, AlertService }             from '@app/_services';
import { MatSidenav }                               from '@angular/material/sidenav';
import { Router }                                   from '@angular/router';
import { first }                                    from 'rxjs/operators';

import { ScreenAccessUser, User, Module, Compania } from '@app/_models';

import { MatDialog }                                from '@angular/material/dialog';
import { DialogoConfirmacionComponent }             from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';

// ## -- servicio macred http -- ## //
import { MacredService }                            from '@app/_services/macred.service';
// ## -- objetos macred analisis de capacidad de pago -- ## //
import {    MacAnalisisCapacidadPago, MacDeduccionesAnalisis, MacExtrasAplicables, 
            MacIngresosXAnalisis, MacMatrizAceptacionIngreso, MacModeloAnalisis, 
            MacNivelCapacidadPago, MacPersona, MacTipoDeducciones,  MacTipoFormaPagoAnalisis, 
            MacTipoGenerador, MacTipoIngreso, MacTipoIngresoAnalisis, MacTiposMoneda } from '@app/_models/Macred';
// ## -- ******************************************** -- ## //

declare var $: any;

@Component({
    templateUrl: 'HTML_Asociados.html',
    styleUrls: ['../../../../assets/scss/app.scss',
                '../../../../assets/scss/macred/app.scss'],
})
export class AsociadosComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla : string = 'calificacion-asociados.html';

    _globalCodMonedaPrincipal : number ;
    _globalMesesAplicaExtras : number ;

    _analisisCapacidadpago  : MacAnalisisCapacidadPago;
    _personaMacred          : MacPersona = null;

    _extrasAplicables       : MacExtrasAplicables ;

    _ingresoAnalisisSeleccionado : MacIngresosXAnalisis ;

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private moduleObservable    : Module;
    private companiaObservable  : Compania;
    // ## -- ----------------- -- ## //

    // ## -- submit formularios -- ## //
    submittedPersonForm     : boolean = false;
    submittedAnalisisForm   : boolean = false;
    submittedIngresosForm   : boolean = false;
    submittedExtrasForm     : boolean = false;
    submittedHistorialAnalisisForm : boolean = false;
    submittedDeduccionesForm : boolean = false;
    // ## -- ------------------ -- ## //

    datosAnalisis               : boolean = false;
    flujoCaja                   : boolean = false;
    pd                          : boolean = false;
    scoring                     : boolean = false;
    ingresos                    : boolean = false;
    obligacionesSupervisadas    : boolean = false;
    oNoSupervisadas             : boolean = false;
    lvt                         : boolean = false;
    escenarios                  : boolean = false;
    escenariosFcl               : boolean = false;

    isDeleting                  : boolean = false;

    // ## -- habilita botones -- ## //
    habilitaBtnIngreso          : boolean = false;
    habilitaBtnHistoprialIngreso: boolean = true;
    habilitaBtnRegistroDeudor   : boolean = false;
    habilitarBtnSubmitExtras    : boolean = false;
    habilitarBtnFinalizarExtras : boolean = false;
    habilitarBtnEliminarExtras  : boolean = false;
    habilitarBtnContinuarExtras : boolean = false;
    habilitarBtnFinalizarDeducciones: boolean = false;

    habilitaBtnGeneraNuevoAnalisis  : boolean = true;
    habilitaBtnGuardarAnalisis      : boolean = false;
    habilitaBtnActualizaIngreso     : boolean = false;
    habilitaBtnRegistrarIngreso     : boolean = false;

    habilitaIcoOpenModalExtras      : boolean = false;
    habilitaIcoOpenModalDeducciones : boolean = false;
    // ## -- ---------------- -- ## //

    public listSubMenu  : Module[]  = [];
    public menuItem     : Module    = null;

    listScreenAccessUser: ScreenAccessUser[];

    // listas analisis
    listTipoIngresoAnalisis:    MacTipoIngresoAnalisis[];
    listTipoFormaPagoAnalisis:  MacTipoFormaPagoAnalisis[];
    listTiposMonedas:           MacTiposMoneda[];
    listModelosAnalisis:        MacModeloAnalisis[];
    listNivelesCapacidadpago:   MacNivelCapacidadPago[];
    listTiposGeneradores:       MacTipoGenerador[];

    // listas ingresos
    listTiposIngresos           : MacTipoIngreso[];
    listIngresosAnalisis        : MacIngresosXAnalisis[];
    listHistorialAnalisis       : MacAnalisisCapacidadPago[];
    listMatrizAceptacionIngreso : MacMatrizAceptacionIngreso[];
    listTiposDeducciones        : MacTipoDeducciones[];

    listExtrasAplicables        : MacExtrasAplicables[];
    listTempExtrasAplicables    : MacExtrasAplicables[];
    listDeduccionesAnalisis     : MacDeduccionesAnalisis[];

    formPersona             : FormGroup;
    formAnalisis            : FormGroup;
    formIngresos            : FormGroup;
    formExtras              : FormGroup;
    formHistorialAnalisis   : FormGroup;
    formDeducciones         : FormGroup;

    public today : Date ;

    constructor (   private formBuilder:       FormBuilder,
                    private macredService:     MacredService,
                    private accountService:    AccountService,
                    private alertService:      AlertService,
                    private router:            Router,
                    private dialogo:           MatDialog )
    {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue;

        this.today = new Date();
    }

    get f () {   return this.formPersona.controls;  }
    get g () {   return this.formAnalisis.controls; }
    get i () {   return this.formIngresos.controls; }
    get e () {   return this.formExtras.controls;   }
    get h () {   return this.formHistorialAnalisis.controls; }
    get d () {   return this.formDeducciones.controls; }
    
    ngOnInit() {

        this.formPersona    = this.formBuilder.group({
            id              : [null],
            nombre          : [null],
            primerApellido  : [null],
            segundoApellido : [null],
            identificacion  : [null, Validators.required]
        });
        this.formAnalisis   = this.formBuilder.group({
            fechaAnalisis           : [null],
            tipoIngresoAnalisis     : [null],
            tipoFormaPagoAnalisis   : [null],
            tipoMoneda              : [null],
            analisisDefinitivo      : [null],
            estado                  : [null],
            modeloAnalisis          : [null],
            indicadorCsd            : [null],
            ponderacionLvt          : [null],
            capacidadPago           : [null],
            tipoGenerador           : [null],
            numeroDependientes      : [null],
            puntajeAnalisis         : [null],
            calificacionCic         : [null],
            calificacionFinalCic    : [null],
            observaciones           : [null]
        });
        this.formIngresos   = this.formBuilder.group({
            codigoTipoIngreso   : [null],
            montoBruto          : [null],
            montoExtras         : [null],
            porcentajeExtras    : [null],
            cargasSociales      : [null],
            impuestoRenta       : [null],
            montoNeto           : [null],
            montoDeducciones    : [null]
        });
        this.formExtras     = this.formBuilder.group({
            montoExtra                  : [null],
            desviacionEstandar          : [null],
            coeficienteVarianza         : [null],
            porcentajeExtrasAplicable   : [null],
            promedioExtrasAplicables    : [null],
            mesesExtrasAplicables       : [null]
        });
        this.formHistorialAnalisis = this.formBuilder.group({
            codigoAnalisisHistorial  : [null]
        });
        this.formDeducciones = this.formBuilder.group({
            codigoTipoDeduccion     : [null],
            codigoTipoMoneda        : [null],
            tipoCambio              : [null],
            montoDeduccion          : [null]
        });

        this.accountService.validateAccessUser( this.userObservable.id  ,
                                                this.moduleObservable.id,
                                                this.nombrePantalla     ,
                                                this.companiaObservable.id )
            .pipe(first())
            .subscribe(response => {

                // ## -->> redirecciona NO ACCESO
                if(!response.exito)
                    this.router.navigate([this.moduleObservable.indexHTTP]);

                // carga datos parámetros generales
                this.macredService.GetParametroGeneralVal1(this.companiaObservable.id, 'COD_MONEDA_PRINCIPAL',      true )
                    .pipe(first())
                    .subscribe(response => { this._globalCodMonedaPrincipal = +response; });
                this.macredService.GetParametroGeneralVal1(this.companiaObservable.id, 'MESES_APLICABLES_EXTRAS',   true )
                    .pipe(first())
                    .subscribe(response => { this._globalMesesAplicaExtras = +response; });
                // carga datos analisis
                this.macredService.getTiposMonedas(this.companiaObservable.id)
                     .pipe(first())
                     .subscribe(response => { this.listTiposMonedas = response; });
                 this.macredService.getTiposFormaPagoAnalisis(this.companiaObservable.id)
                     .pipe(first())
                     .subscribe(response => { this.listTipoFormaPagoAnalisis = response; });
                 this.macredService.getTiposIngresoAnalisis(this.companiaObservable.id)
                     .pipe(first())
                     .subscribe(response => { this.listTipoIngresoAnalisis = response; });
                this.macredService.getModelosAnalisis(this.companiaObservable.id,           false )
                    .pipe(first())
                    .subscribe(response => { this.listModelosAnalisis = response; });
                this.macredService.getNivelesCapacidadPago(this.companiaObservable.id,      false )
                    .pipe(first())
                    .subscribe(response => { this.listNivelesCapacidadpago = response; });
                this.macredService.getTiposGenerador(this.companiaObservable.id,            false )
                    .pipe(first())
                    .subscribe(response => { this.listTiposGeneradores = response; });
                // carga datos ingresos
                this.macredService.getTiposIngresos(this.companiaObservable.id,             false )
                    .pipe(first())
                    .subscribe(response => { this.listTiposIngresos = response; });
                this.macredService.getTiposDeducciones(this.companiaObservable.id,          false )
                    .pipe(first())
                    .subscribe(response => { this.listTiposDeducciones = response; });    
                });
                this.macredService.getMatrizAceptacionIngreso( this.companiaObservable.id,  false )
                    .pipe(first())
                    .subscribe(response => { this.listMatrizAceptacionIngreso = response; });
    }

    addListMenu(modItem:Module) : void {
        this.listSubMenu.push(modItem);
        // this.listSubMenu.push(new Module(2,'Flujo de Caja','Flujo de Caja','Flujo de Caja','I','.png','.ico','http'));
        // this.listSubMenu.push(new Module(3,'Probability of Default','Probability of Default','Probability of Default','I','.png','.ico','http'));
        // this.listSubMenu.push(new Module(4,'Scoring Crediticio','Scoring Crediticio','Scoring Crediticio','I','.png','.ico','http'));
        // this.listSubMenu.push(new Module(5,'Ingresos','Ingresos','Ingresos','I','.png','.ico','http'));
        // this.listSubMenu.push(new Module(6,'Obligaciones Supervisadas','Obligaciones Supervisadas','Obligaciones Supervisadas','I','.png','.ico','http'));
        // this.listSubMenu.push(new Module(7,'O. No Supervisadas','O. No Supervisadas','O. No Supervisadas','I','.png','.ico','http'));
        // this.listSubMenu.push(new Module(8,'LVT','LVT','LVT','I','.png','.ico','http'));
        // this.listSubMenu.push(new Module(9,'Escenarios','Escenarios','Escenarios','I','.png','.ico','http'));
        // this.listSubMenu.push(new Module(10,'Escenarios FCL','Escenarios FCL','Escenarios FCL','I','.png','.ico','http'));
    }
    habilitaTab(mod: Module) {

        switch (mod.id) {

            case 1:                     this.datosAnalisis = true;

                break;

            case 2:
            this.flujoCaja = true;
                break;
            case 3:
            this.pd = true;
                break;

            case 4:
            this.scoring = true;
                break;

            case 5:                     this.ingresos = true;

                this.inicializaFormularioIngreso();

                this.macredService.getIngresosAnalisis( this.companiaObservable.id, 
                                                        this._analisisCapacidadpago.codigoAnalisis )
                    .pipe(first())
                    .subscribe(response => {
                        if (!this.listIngresosAnalisis) this.listIngresosAnalisis = [] ;

                        this.listIngresosAnalisis = response;
                    });
                
                break;

            case 6:
            this.obligacionesSupervisadas = true;
                break;
            case 7:
            this.oNoSupervisadas = true;
                break;
            case 8:
            this.lvt = true;
                break;
            case 9:
            this.escenarios = true;
                break;
            case 10:
            this.escenariosFcl = true;
                break;

            default: mod.indexHTTP = '/';
        }
    }
    limpiarTabs() : void {
        this.datosAnalisis  = false;
        this.flujoCaja      = false;
        this.pd             = false;
        this.scoring        = false;
        this.ingresos       = false;
        this.obligacionesSupervisadas   = false;
        this.oNoSupervisadas            = false;
        this.lvt            = false;
        this.escenarios     = false;
        this.escenariosFcl  = false;
    }

    selectModule(mod: Module) {

        this.limpiarTabs();

        if(this.menuItem && mod.id == this.menuItem.id) {
            this.menuItem = null;
            return;
        }

        this.menuItem = this.listSubMenu.find(x => x.id === mod.id);
        this.habilitaTab(this.menuItem);
    }

    SubmitPerson() : void {

        this.alertService.clear();
        this.submittedPersonForm = true;

        if (this.formPersona.invalid)
            return;

        let identificacionPersona = this.formPersona.controls['identificacion'].value;

        if (this._analisisCapacidadpago) {

            this.dialogo.open(DialogoConfirmacionComponent, { 
                data: 'Existe un análisis en proceso, seguro que desea continuar ?'
            })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {

                if (confirmado) {

                    this.listSubMenu = [];
                    this.limpiarTabs();

                    this._analisisCapacidadpago = null;
                    this._personaMacred         = null;
                    this.menuItem               = null;

                    // this.habilitaBtnGeneraNuevoAnalisis = true;
                    
                    // this.habilitaBtnIngreso             = false;
                    // this.habilitaBtnGuardarAnalisis     = false;
                    
                    this.cargaInformacionPersona(identificacionPersona);
                    this.inicializaFormDatosAnalisis();

                } else { return; }
            });

        } else {
            this.cargaInformacionPersona(identificacionPersona);
            this.inicializaFormDatosAnalisis();
        }
    }
    cargaInformacionPersona(identificacionPersona : string) : void {

        this.macredService.getPersonaMacred(identificacionPersona, this.companiaObservable.id)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    this._personaMacred = response;

                    this.inicializaFormPersonaAnalisis();

                    this.habilitarItemSubMenu(  new Module( 1, 'Datos de Anláisis', 'Datos de Anláisis', 'Datos de Anláisis', 'A', '.png', '.ico', 'http') );
                    this.selectModule(          new Module( 1, 'Datos de Anláisis', 'Datos de Anláisis', 'Datos de Anláisis', 'A', '.png', '.ico', 'http') );

                } else { this.alertService.info('No se encontraron registros.'); }
            },
            error => {
                let message : string = 'Problemas de conexión: ' + error;
                this.alertService.error(message);
            });
    }

    GuardarAnalisis() : void {

        this.alertService.clear();
        this.submittedAnalisisForm = true;

        if ( this.formAnalisis.invalid )
            return;

        var analisis : MacAnalisisCapacidadPago = this.createAnalisisObjectForm();
        analisis.codigoAnalisis     = this._analisisCapacidadpago.codigoAnalisis;
        analisis.modificadoPor      = this.userObservable.identificacion;
        analisis.fechaModificacion  = this.today;

        this.macredService.putAnalisisCapPago(analisis)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    this._analisisCapacidadpago = response;
                    this.inicializaFormDatosAnalisis();

                    // this.habilitaBtnGeneraNuevoAnalisis = false;
                    // this.habilitaBtnIngreso             = true;
                    // this.habilitaBtnGuardarAnalisis     = true;

                    this.alertService.success(
                        `Análisis ${this._analisisCapacidadpago.codigoAnalisis} actualizado con éxito.`
                    );

                } else { this.alertService.error(`No fue posible actualizar el análisis.`); }

            }, error => {
                this.alertService.error(
                    `Problemas al establecer la conexión con el servidor. Detalle: ${ error }`
                );
            });
    }

    createAnalisisObjectForm() : MacAnalisisCapacidadPago {

        var fechaAnalisis           = this.formAnalisis.controls['fechaAnalisis'].value;
        var idTipoIngresoAnalisis   = this.formAnalisis.controls['tipoIngresoAnalisis'].value.id;
        var idTipoFormaPagoAnalisis = this.formAnalisis.controls['tipoFormaPagoAnalisis'].value.id;
        var idNivelCapacidadPago    = this.formAnalisis.controls['capacidadPago'].value.id;
        var idModeloAnalisis        = this.formAnalisis.controls['modeloAnalisis'].value.id;
        var idTipoMoneda            = this.formAnalisis.controls['tipoMoneda'].value.id;
        var idTipoGenerador         = this.formAnalisis.controls['tipoGenerador'].value.id;
        var estado                  = this.formAnalisis.controls['estado'].value;
        var analisisDefinitivo      = this.formAnalisis.controls['analisisDefinitivo'].value;
        var puntajeAnalisis         = this.formAnalisis.controls['puntajeAnalisis'].value;
        var calificacionCic         = this.formAnalisis.controls['calificacionCic'].value;
        var calificacionFinalCic    = this.formAnalisis.controls['calificacionFinalCic'].value;
        var indicadorCsd            = this.formAnalisis.controls['indicadorCsd'].value;
        var ponderacionLvt          = this.formAnalisis.controls['ponderacionLvt'].value;
        var numeroDependientes      = this.formAnalisis.controls['numeroDependientes'].value;
        var observaciones           = this.formAnalisis.controls['observaciones'].value;

        var ancapCapPago            = 0.00 ;
        var ancapCalificacionFinal  = 0.00 ;
        var ancapPuntajeFinal       = 0.00 ;

        var analisis = new MacAnalisisCapacidadPago () ;

        analisis.codigoCompania     = this.companiaObservable.id;
        analisis.codigoPersona      = this._personaMacred.id;
        
        analisis.fechaAnalisis      = fechaAnalisis;
        analisis.estado             = estado;
        analisis.analisisDefinitivo = analisisDefinitivo;
        analisis.codigoNivelCapPago = idNivelCapacidadPago;
        analisis.puntajeAnalisis    = puntajeAnalisis;
        analisis.calificacionCic    = calificacionCic;
        analisis.puntajeFinalCic    = calificacionFinalCic;
        analisis.codigoTipoIngresoAnalisis      = idTipoIngresoAnalisis;
        analisis.codigoTipoFormaPagoAnalisis    = idTipoFormaPagoAnalisis;
        analisis.codigoModeloAnalisis           = idModeloAnalisis;
        analisis.codigoMoneda           = idTipoMoneda;
        analisis.codigoTipoGenerador    = idTipoGenerador;
        analisis.indicadorCsd       = indicadorCsd;
        analisis.descPondLvt        = ponderacionLvt;
        analisis.numeroDependientes = numeroDependientes;
        analisis.observaciones      = observaciones;
        analisis.ancapCapacidadPago = ancapCapPago;
        analisis.ancapCalificacionFinal = ancapCalificacionFinal;
        analisis.ancapPuntajeFinal      = ancapPuntajeFinal;

        return analisis;
    }

    SubmitNuevoAnalisis() : void {

        this.alertService.clear();
        this.submittedAnalisisForm = true;

        if ( this.formAnalisis.invalid ) return;
        
        var analisis : MacAnalisisCapacidadPago = this.createAnalisisObjectForm();
        analisis.adicionadoPor  = this.userObservable.identificacion;
        analisis.fechaAdicion   = this.today ;

        this.macredService.postAnalisisCapPago(analisis)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._analisisCapacidadpago = response;
                    this.inicializaFormDatosAnalisis();

                    // this.habilitaBtnGeneraNuevoAnalisis = false;
                    // this.habilitaBtnIngreso             = true;
                    // this.habilitaBtnGuardarAnalisis     = true;

                    this.alertService.success( `Análisis ${ this._analisisCapacidadpago.codigoAnalisis } generado correctamente !` );

                } else { this.alertService.error(`Problemas al registrar el Análisis de Capacidad de Pago.`); }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
    }

    habilitarItemSubMenu(mod : Module) : void {

        var modTemp : Module = mod;

        if( this.listSubMenu.find( b => b.id == mod.id ) ) {
            this.listSubMenu.splice(this.listSubMenu.findIndex( b => b.id == mod.id ), 1);
        }
        this.listSubMenu.push(modTemp);
    }
    habilitaFormularioIngreso() : void {
        this.habilitarItemSubMenu(  new Module(5, 'Ingresos', 'Ingresos', 'Ingresos', 'A', '.png', '.ico', 'http'));
        this.selectModule(          new Module(5, 'Ingresos', 'Ingresos', 'Ingresos', 'I', '.png', '.ico', 'http'));
        // this.habilitaBtnIngreso = false;
    }
    deleteIngreso(ingreso : MacIngresosXAnalisis) : void {

        this.isDeleting = true;
    }

    openExtrasModal() : void {

        this.inicializaFormExtrasAplicables();

        // this.habilitarBtnSubmitExtras = true;
        
        $('#extrasModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }
    openHistorialModal() : void {

        if (!this.listHistorialAnalisis) this.listHistorialAnalisis = [] ;

        this.macredService.getHistorialAnlisis( this.companiaObservable.id )
            .pipe(first())
            .subscribe(response => { 
                this.listHistorialAnalisis = response; 
            });
            
        this.formHistorialAnalisis = this.formBuilder.group({
            codigoAnalisisHistorial  : [null, Validators.required]
        });
        
        $('#analisisHistorialModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }
    openDeduccionesModal() : void {

        this.inicializaFormDeduccionesAnalisis();

        $('#deduccionesModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }
    selectIngresoAnalisis(ingreso : MacIngresosXAnalisis) : void {

        // limpia formulario
        if (this._ingresoAnalisisSeleccionado && this._ingresoAnalisisSeleccionado.id === ingreso.id) {
            
            this._ingresoAnalisisSeleccionado = null;
            this._extrasAplicables            = null;
            this.listDeduccionesAnalisis      = null;

            this.inicializaFormularioIngreso();

            return;
        }

        this._ingresoAnalisisSeleccionado = ingreso ;

        this.inicializaFormularioIngreso();
        this.obtenerExtrasAplicablesAnalisis();
        this.obtenerDeduccionesAnalisis();
    }
    
    obtenerDeduccionesAnalisis() : void {

        this.macredService.getDeduccionesAnalisis(  this.companiaObservable.id,
                                                    this._analisisCapacidadpago.codigoAnalisis,
                                                    this._ingresoAnalisisSeleccionado.id )
            .pipe(first())
            .subscribe(response => {

                if (!this.listDeduccionesAnalisis) this.listDeduccionesAnalisis = [] ;

                this.listDeduccionesAnalisis = response ;

                this.totalizarDeducciones(false) ;
            });
    }
    obtenerExtrasAplicablesAnalisis() : void {

        this.macredService.getExtrasAnalisisIngreso(    this.companiaObservable.id,
                                                        this._analisisCapacidadpago.codigoAnalisis,
                                                        this._ingresoAnalisisSeleccionado.id )
            .pipe(first())
            .subscribe(response => {
                this._extrasAplicables = response;
                this.inicializaFormExtrasAplicables();
            });
    }

    selectAnalisisHistorial(analisis : MacAnalisisCapacidadPago) : void {

        this._analisisCapacidadpago = analisis ;

        this.inicializaFormDatosAnalisis();

        // this.formAnalisis.setValue({
        //     // tipoIngresoAnalisis     : this.listTipoIngresoAnalisis.find (   x => x.id === this._analisisCapacidadpago.codigoTipoIngresoAnalisis ),
        //     // tipoFormaPagoAnalisis   : this.listTipoFormaPagoAnalisis.find ( x => x.id === this._analisisCapacidadpago.codigoTipoFormaPagoAnalisis ),
        //     // capacidadPago           : this.listNivelesCapacidadpago.find (  x => x.id === this._analisisCapacidadpago.codigoNivelCapPago ),
        //     // modeloAnalisis          : this.listModelosAnalisis.find (       x => x.id === this._analisisCapacidadpago.codigoModeloAnalisis ),
        //     // tipoMoneda              : this.listTiposMonedas.find (          x => x.id === this._analisisCapacidadpago.codigoMoneda ),
        //     // tipoGenerador           : this.listTiposGeneradores.find (      x => x.id === this._analisisCapacidadpago.codigoTipoGenerador ),

        //     // fechaAnalisis       : this._analisisCapacidadpago.fechaAnalisis,
        //     // estado              : this._analisisCapacidadpago.estado,
        //     // analisisDefinitivo  : this._analisisCapacidadpago.analisisDefinitivo,
        //     // puntajeAnalisis     : this._analisisCapacidadpago.puntajeAnalisis,
        //     // calificacionCic     : this._analisisCapacidadpago.calificacionCic,
        //     // calificacionFinalCic: this._analisisCapacidadpago.puntajeFinalCic,
        //     // indicadorCsd        : this._analisisCapacidadpago.indicadorCsd,
        //     // ponderacionLvt      : this._analisisCapacidadpago.descPondLvt,
        //     // numeroDependientes  : this._analisisCapacidadpago.numeroDependientes,
        //     // observaciones       : this._analisisCapacidadpago.observaciones
        // });

        $('#analisisHistorialModal').modal('hide');
    }
    inicializaFormDatosAnalisis()       : void {

        if (this._analisisCapacidadpago) {

            this.habilitaBtnGeneraNuevoAnalisis = false;
            this.habilitaBtnGuardarAnalisis     = true;
            this.habilitaBtnIngreso             = true;

            this._ingresoAnalisisSeleccionado   = null;
            this._extrasAplicables              = null;

            this.listDeduccionesAnalisis        = null;
            this.listIngresosAnalisis           = null;
            this.listExtrasAplicables           = null;

            this.formAnalisis = this.formBuilder.group({
                fechaAnalisis           : [this._analisisCapacidadpago.fechaAnalisis,  Validators.required],
                tipoIngresoAnalisis     : [this.listTipoIngresoAnalisis.find(   x => x.id === this._analisisCapacidadpago.codigoTipoIngresoAnalisis ),      Validators.required],
                tipoFormaPagoAnalisis   : [this.listTipoFormaPagoAnalisis.find( x => x.id === this._analisisCapacidadpago.codigoTipoFormaPagoAnalisis ),    Validators.required],
        
                tipoMoneda              : [this.listTiposMonedas.find( x => x.id === this._analisisCapacidadpago.codigoMoneda ), Validators.required],
                analisisDefinitivo      : this._analisisCapacidadpago.analisisDefinitivo,
                estado                  : this._analisisCapacidadpago.estado,
        
                modeloAnalisis          : [this.listModelosAnalisis.find ( x => x.id === this._analisisCapacidadpago.codigoModeloAnalisis ), Validators.required],
                indicadorCsd            : this._analisisCapacidadpago.indicadorCsd,
                ponderacionLvt          : this._analisisCapacidadpago.descPondLvt,
        
                capacidadPago           : this.listNivelesCapacidadpago.find (  x => x.id === this._analisisCapacidadpago.codigoNivelCapPago ),
                tipoGenerador           : this.listTiposGeneradores.find (      x => x.id === this._analisisCapacidadpago.codigoTipoGenerador ),
                numeroDependientes      : this._analisisCapacidadpago.numeroDependientes,
                puntajeAnalisis         : this._analisisCapacidadpago.puntajeAnalisis,
                calificacionCic         : this._analisisCapacidadpago.calificacionCic,
                calificacionFinalCic    : this._analisisCapacidadpago.puntajeFinalCic,
                observaciones           : this._analisisCapacidadpago.observaciones
            });

        } else {

            let observacion : string = `Análisis generado el ` + this.today + ` por ` + this.userObservable.nombreCompleto + `.`;

            this.habilitaBtnGeneraNuevoAnalisis = true;
            this.habilitaBtnGuardarAnalisis     = false;
            this.habilitaBtnIngreso             = false;

            this.formAnalisis = this.formBuilder.group({
                fechaAnalisis           : [this.today,  Validators.required],
                tipoIngresoAnalisis     : [null,        Validators.required],
                tipoFormaPagoAnalisis   : [null,        Validators.required],
        
                tipoMoneda              : [this.listTiposMonedas.find(x => x.id === this._globalCodMonedaPrincipal), Validators.required],
                analisisDefinitivo      : false,
                estado                  : true,
        
                modeloAnalisis          : [this.listModelosAnalisis.find(x => x.id === 5), Validators.required],
                indicadorCsd            : null,
                ponderacionLvt          : null,
        
                capacidadPago           : this.listNivelesCapacidadpago.find(x => x.id === 99),
                tipoGenerador           : this.listTiposGeneradores.find(x => x.id === 99),
                numeroDependientes      : 0,
                puntajeAnalisis         : 0,
                calificacionCic         : '0',
                calificacionFinalCic    : 0,
                observaciones           : observacion
            });
        }
    }
    inicializaFormularioIngreso() : void {

        if (this._ingresoAnalisisSeleccionado) {

            this.habilitaBtnActualizaIngreso = true;
            this.habilitaBtnRegistrarIngreso = false;

            this.habilitaIcoOpenModalExtras         = true;
            this.habilitaIcoOpenModalDeducciones    = true;

            this.formIngresos = this.formBuilder.group({
                codigoTipoIngreso   : [this.listTiposIngresos.find ( x => x.id === this._ingresoAnalisisSeleccionado.codigoTipoIngreso ), Validators.required],
                montoBruto          : [this._ingresoAnalisisSeleccionado.montoBruto, Validators.required],
                montoExtras         : this._ingresoAnalisisSeleccionado.montoExtras,
                porcentajeExtras    : this._ingresoAnalisisSeleccionado.porcentajeExtras,
                cargasSociales      : this._ingresoAnalisisSeleccionado.cargasSociales,
                impuestoRenta       : this._ingresoAnalisisSeleccionado.impuestoRenta,
                montoNeto           : [this._ingresoAnalisisSeleccionado.montoNeto, Validators.required],
                montoDeducciones    : this._ingresoAnalisisSeleccionado.montoDeducciones
            });
        } else {
            this.habilitaBtnActualizaIngreso = false;
            this.habilitaBtnRegistrarIngreso = true;

            this.habilitaIcoOpenModalExtras         = false;
            this.habilitaIcoOpenModalDeducciones    = false;

            this.formIngresos = this.formBuilder.group({
                codigoTipoIngreso   : [null, Validators.required],
                montoBruto          : [null, Validators.required],
                montoExtras         : 0,
                porcentajeExtras    : 0,
                cargasSociales      : 0,
                impuestoRenta       : 0,
                montoNeto           : [null, Validators.required],
                montoDeducciones    : 0
            });
        }
    }
    inicializaFormDeduccionesAnalisis() : void {
        this.formDeducciones = this.formBuilder.group({
            codigoTipoDeduccion : [null,    Validators.required],
            codigoTipoMoneda    : [null,    Validators.required],
            tipoCambio          : [null,    Validators.required],
            montoDeduccion      : [null,    Validators.required]
        });
    }
    inicializaFormPersonaAnalisis()     : void {
        this.formPersona = this.formBuilder.group({
            id              : [this._personaMacred.id,               Validators.required],
            nombre          : [this._personaMacred.nombre,           Validators.required],
            primerApellido  : [this._personaMacred.primerApellido,   Validators.required],
            segundoApellido : [this._personaMacred.segundoApellido,  Validators.required],
            identificacion  : [this._personaMacred.identificacion,   Validators.required]
        });
    }
    inicializaFormExtrasAplicables()    : void {

        this.habilitarBtnSubmitExtras = true;

        if (this._extrasAplicables) {

            this.habilitarBtnEliminarExtras = true;

            this.formExtras = this.formBuilder.group({
                montoExtra                  : [this._extrasAplicables.montoExtras, Validators.required],
                desviacionEstandar          : this._extrasAplicables.desviacionEstandar,
                coeficienteVarianza         : this._extrasAplicables.coeficienteVarianza,
                porcentajeExtrasAplicable   : this._extrasAplicables.porcentajeExtrasAplicables,
                promedioExtrasAplicables    : this._extrasAplicables.promedioExtrasAplicables,
                mesesExtrasAplicables       : this._globalMesesAplicaExtras
            });
        } else {

            this.habilitarBtnEliminarExtras = false;
            
            this.formExtras = this.formBuilder.group({
                montoExtra                  : [0, Validators.required],
                desviacionEstandar          : 0,
                coeficienteVarianza         : 0,
                porcentajeExtrasAplicable   : 0,
                promedioExtrasAplicables    : 0,
                mesesExtrasAplicables       : this._globalMesesAplicaExtras
            });
        } 
    }

    setFormExtrasIngresosAnalisis(clearExtras : boolean = false) : void {
        if (clearExtras) {
            this.formIngresos.patchValue({
                montoExtras         : 0,
                porcentajeExtras    : 0
            });
        } else {
            this.formIngresos.patchValue({
                montoExtras         : this._extrasAplicables.montoExtras,
                porcentajeExtras    : this._extrasAplicables.porcentajeExtrasAplicables
            });
        } 
    }
    CerrarExtrasModal() : void {

        if (this._extrasAplicables) {
            this.setFormExtrasIngresosAnalisis();
        } else {
            this.setFormExtrasIngresosAnalisis(true);
        }
        this.listExtrasAplicables        = null;
        this.listTempExtrasAplicables    = null;
        this.habilitarBtnContinuarExtras = false;
        this.habilitarBtnFinalizarExtras = false;

        $('#extrasModal').modal('hide');
    }

    EliminarRegistroExtras() : void {

        this.macredService.deleteExtrasAplicables(  this._extrasAplicables.id, 
                                                    this._extrasAplicables.codigoIngreso, 
                                                    this._extrasAplicables.codigoCompania )
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {
                    this._extrasAplicables = null;
                    this.CerrarExtrasModal();
                    this.alertService.success( response.responseMesagge );

                } else {
                    this.alertService.error(response.responseMesagge);
                }
            });
    }

    FinalizarRegistroExtras() : void {

        var extrasAplicables : MacExtrasAplicables = new MacExtrasAplicables ;

        // registro automático meses aplicables
        if (this.listExtrasAplicables.length > 1) {
            if (this.listExtrasAplicables.length < this._globalMesesAplicaExtras ) {
                var iteraciones = this._globalMesesAplicaExtras - this.listExtrasAplicables.length;
                for ( let index = 0; index < iteraciones ; index++ ) { this.SubmitFormExtras(true); }
            }
        }

        extrasAplicables = this.listExtrasAplicables[this.listExtrasAplicables.length - 1];
        
        this.macredService.postExtrasAplicables(extrasAplicables)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this.listExtrasAplicables     = null;
                    this.listTempExtrasAplicables = null;

                    this.habilitarBtnFinalizarExtras = false ;
                    this.habilitarBtnSubmitExtras    = false ;
                    this.habilitarBtnContinuarExtras = true  ;

                    this._extrasAplicables = response;
                    this.inicializaFormExtrasAplicables();

                    // this.formExtras.setValue({
                    //     montoExtra                  : [this._extrasAplicables.montoExtras],
                    //     desviacionEstandar          : [this._extrasAplicables.desviacionEstandar],
                    //     coeficienteVarianza         : [this._extrasAplicables.coeficienteVarianza],
                    //     porcentajeExtrasAplicable   : [this._extrasAplicables.porcentajeExtrasAplicables],
                    //     promedioExtrasAplicables    : [this._extrasAplicables.promedioExtrasAplicables],
                    //     mesesExtrasAplicables       : [this._globalMesesAplicaExtras]
                    // });

                    this.alertService.success( `Registro de Extras realizado con éxito..` );

                } else {
                    let message : string = 'Problemas al registrar el Análisis de Capacidad de Pago.';
                    this.alertService.error(message);
                }
        });
    }

    eliminarRegistroExtra(idExtras : number, idIngreso : number, idCompania : number) : void {
        this.macredService.deleteExtrasAplicables( idExtras, idIngreso, idCompania )
            .pipe(first())
            .subscribe(response => { 
                if (!response.exito) {
                    this.alertService.error(response.responseMesagge);
                    $('#extrasModal').modal('hide');
                    return;
                }
            });
    }

    totalizarDeducciones(close : boolean = true) : void {
        var totalDeducciones : number = 0;
        if (this.listDeduccionesAnalisis) {
            this.listDeduccionesAnalisis.forEach(element => {
                totalDeducciones += element.monto;
            });
        }
        this.formIngresos.patchValue({
            montoDeducciones : totalDeducciones
        });

        this.habilitarBtnFinalizarDeducciones = false;

        if (close) $('#deduccionesModal').modal('hide');
    }

    SubmitFormDeducciones() : void {

        this.alertService.clear();
        this.submittedDeduccionesForm = true;

        if ( this.formDeducciones.invalid ) return;

        var deduccion : MacDeduccionesAnalisis = new MacDeduccionesAnalisis ;
        deduccion.codigoAnalisis        = this._analisisCapacidadpago.codigoAnalisis;
        deduccion.codigoCompania        = this.companiaObservable.id;
        deduccion.codigoIngreso         = this._ingresoAnalisisSeleccionado.id;

        deduccion.codigoTipoDeduccion   = this.formDeducciones.controls['codigoTipoDeduccion'].value.id;
        deduccion.codigoMoneda          = this.formDeducciones.controls['codigoTipoMoneda'].value.id;
        deduccion.tipoCambio            = this.formDeducciones.controls['tipoCambio'].value;
        deduccion.monto                 = this.formDeducciones.controls['montoDeduccion'].value;

        deduccion.adicionadoPor = this.userObservable.identificacion;
        deduccion.fechaAdicion  = this.today;

        this.macredService.postDeduccionesAnalisis(deduccion)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this.formDeducciones.setValue({
                        codigoTipoDeduccion     : null,
                        codigoTipoMoneda        : null,
                        tipoCambio              : null,
                        montoDeduccion          : null
                    });

                    if (!this.listDeduccionesAnalisis) this.listDeduccionesAnalisis = [];

                    this.listDeduccionesAnalisis.push(response);

                    this.habilitarBtnFinalizarDeducciones = true;

                    this.alertService.success( `Registro de Deducciones realizado con éxito.` );

                } else { this.alertService.error(`Problemas al registrar las Deducciones del Análisis de Capacidad de Pago.`); }
            });
    }

    SubmitFormExtras( registroAutomatico : boolean = false ) : void {

        this.alertService.clear();
        this.submittedExtrasForm = true;

        var sumatoriaMontoExtras    : number = 0.00 ;
        var potenciaSaldo           : number = 0.0  ;
        var promedioExtras          : number = 0.0  ;
        var factorAceptacion        : number = 0    ;

        if ( this.formExtras.invalid ) return;

        if (this.formExtras.controls['montoExtra'].value === 0 && !registroAutomatico) {
            this.formExtras.controls['montoExtra'].setErrors({'error': true});
            return;
        }
        
        if (this._extrasAplicables) {
            this.eliminarRegistroExtra( this._extrasAplicables.id,
                                        this._ingresoAnalisisSeleccionado.id,
                                        this.companiaObservable.id );
            this.listTempExtrasAplicables   = [] ;
            this.listExtrasAplicables       = [] ;
            this._extrasAplicables          = null;
            this.habilitarBtnEliminarExtras = false;
        }

        if (!this.listExtrasAplicables)     this.listExtrasAplicables       = [] ;

        if (!this.listTempExtrasAplicables) this.listTempExtrasAplicables   = [] ;
    
        var extrasTempAplicables : MacExtrasAplicables = new MacExtrasAplicables ;
        extrasTempAplicables.montoExtras = this.formExtras.controls['montoExtra'].value ;

        this.listTempExtrasAplicables.push(extrasTempAplicables) ;
            
        this.listTempExtrasAplicables.forEach(extra => { sumatoriaMontoExtras += extra.montoExtras ; });

        var temPromedioTotalExtrasPermitidas = sumatoriaMontoExtras / this._globalMesesAplicaExtras ;
        promedioExtras  = this.listTempExtrasAplicables.length  === 1 
                                                                ? sumatoriaMontoExtras 
                                                                : temPromedioTotalExtrasPermitidas ;
        extrasTempAplicables.promedioExtrasAplicables = promedioExtras;

        this.listTempExtrasAplicables.forEach(extra => {
            potenciaSaldo += Math.pow(extra.montoExtras - promedioExtras, 2) ;
        });

        var tempDesviacionEstandar = Math.sqrt( potenciaSaldo / (this._globalMesesAplicaExtras - 1) ) ;
        extrasTempAplicables.desviacionEstandar = tempDesviacionEstandar != null ? tempDesviacionEstandar : 0 ;

        var tempCoeficienteVarianza = extrasTempAplicables.desviacionEstandar / promedioExtras ;
        tempCoeficienteVarianza     = tempCoeficienteVarianza >= 1 ? 1 : tempCoeficienteVarianza ;
        extrasTempAplicables.coeficienteVarianza = tempCoeficienteVarianza ;
        extrasTempAplicables.porcentajeExtrasAplicables = (100 - extrasTempAplicables.coeficienteVarianza);

        var coeficienteVarianzaPorcentual = extrasTempAplicables.coeficienteVarianza * 100 ;

        this.listMatrizAceptacionIngreso.forEach(element => {
            if ( element.rangoDesviacion1   <= coeficienteVarianzaPorcentual && 
                element.rangoDesviacion2    >= coeficienteVarianzaPorcentual   ) factorAceptacion = element.factor ;
        });

        this.inicializaFormExtrasAplicables();

        // this.formExtras.patchValue({
        //     montoExtra                  : 0,
        //     desviacionEstandar          : 0,
        //     coeficienteVarianza         : 0,
        //     porcentajeExtrasAplicable   : 0,
        //     promedioExtrasAplicables    : 0,
        //     mesesExtrasAplicables       : this._globalMesesAplicaExtras
        // });

        var extrasAplicables : MacExtrasAplicables = new MacExtrasAplicables ;
        extrasAplicables.codigoAnalisis = this._analisisCapacidadpago.codigoAnalisis ;
        extrasAplicables.codigoCompania = this.companiaObservable.id ;
        extrasAplicables.codigoIngreso  = this._ingresoAnalisisSeleccionado.id;
        extrasAplicables.adicionadoPor  = this.userObservable.identificacion ;
        extrasAplicables.fechaAdicion   = this.today ;

        extrasAplicables.montoExtras                = extrasTempAplicables.promedioExtrasAplicables * factorAceptacion ;
        extrasAplicables.desviacionEstandar         = extrasTempAplicables.desviacionEstandar;
        extrasAplicables.coeficienteVarianza        = extrasTempAplicables.coeficienteVarianza;
        extrasAplicables.porcentajeExtrasAplicables = extrasTempAplicables.porcentajeExtrasAplicables;
        extrasAplicables.promedioExtrasAplicables   = extrasTempAplicables.promedioExtrasAplicables;

        this.listExtrasAplicables.push(extrasAplicables);

        this.habilitarBtnFinalizarExtras = true ;
    }

    createIngresoObjectForm() : MacIngresosXAnalisis {

        var ingresoAnalisis : MacIngresosXAnalisis = new MacIngresosXAnalisis ;

        ingresoAnalisis.codigoAnalisis = this._analisisCapacidadpago.codigoAnalisis;
        ingresoAnalisis.codigoCompania = this.companiaObservable.id;

        ingresoAnalisis.codigoTipoIngreso   = this.formIngresos.controls['codigoTipoIngreso'].value.id;
        ingresoAnalisis.codigoTipoMoneda    = this._analisisCapacidadpago.codigoMoneda;
        ingresoAnalisis.montoBruto          = this.formIngresos.controls['montoBruto'].value;
        ingresoAnalisis.montoExtras         = this.formIngresos.controls['montoExtras'].value;
        ingresoAnalisis.porcentajeExtras    = this.formIngresos.controls['porcentajeExtras'].value;
        ingresoAnalisis.cargasSociales      = this.formIngresos.controls['cargasSociales'].value;
        ingresoAnalisis.impuestoRenta       = this.formIngresos.controls['impuestoRenta'].value;
        ingresoAnalisis.montoNeto           = this.formIngresos.controls['montoNeto'].value;
        ingresoAnalisis.montoDeducciones    = this.formIngresos.controls['montoDeducciones'].value;

        return ingresoAnalisis;
    }
    RegistrarIngresoAnalisis() : void {

        this.alertService.clear();
        this.submittedIngresosForm = true;

        if ( this.formIngresos.invalid ) return;

        var ingreso : MacIngresosXAnalisis = this.createIngresoObjectForm();
        ingreso.adicionadoPor   = this.userObservable.identificacion;
        ingreso.fechaAdicion    = this.today;

        this.macredService.postIngresosAnalisis(ingreso)
        .pipe(first())
        .subscribe(response => {

            if (response) {

                if (!this.listIngresosAnalisis) this.listIngresosAnalisis = [];

                this.listIngresosAnalisis.push(response);

                this.inicializaFormularioIngreso();

                this.alertService.success( `Registro de Ingreso realizado con éxito..` );

            } else { this.alertService.error( `Ocurrió un error al registrar el ingreso para el análisis seleccionado.` ); }
        });
    }
    ActualizaFormIngresos() : void {

        this.alertService.clear();
        this.submittedIngresosForm = true;

        if ( this.formIngresos.invalid ) return;

        var ingreso : MacIngresosXAnalisis = this.createIngresoObjectForm();
        ingreso.id                  = this._ingresoAnalisisSeleccionado.id;
        ingreso.modificadoPor       = this.userObservable.identificacion;
        ingreso.fechaModificacion   = this.today;

        // this._ingresoAnalisisSeleccionado.codigoTipoIngreso   = this.formIngresos.controls['codigoTipoIngreso'].value.id;
        // this._ingresoAnalisisSeleccionado.codigoTipoMoneda    = this._analisisCapacidadpago.codigoMoneda;
        // this._ingresoAnalisisSeleccionado.montoBruto          = this.formIngresos.controls['montoBruto'].value;
        // this._ingresoAnalisisSeleccionado.montoExtras         = this.formIngresos.controls['montoExtras'].value;
        // this._ingresoAnalisisSeleccionado.porcentajeExtras    = this.formIngresos.controls['porcentajeExtras'].value;
        // this._ingresoAnalisisSeleccionado.cargasSociales      = this.formIngresos.controls['cargasSociales'].value;
        // this._ingresoAnalisisSeleccionado.impuestoRenta       = this.formIngresos.controls['impuestoRenta'].value;
        // this._ingresoAnalisisSeleccionado.montoNeto           = this.formIngresos.controls['montoNeto'].value;
        // this._ingresoAnalisisSeleccionado.montoDeducciones    = this.formIngresos.controls['montoDeducciones'].value;
        // this._ingresoAnalisisSeleccionado.modificadoPor     = this.userObservable.identificacion;
        // this._ingresoAnalisisSeleccionado.fechaModificacion = this.today;

        this.macredService.putIngresosAnalisis(ingreso)
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {

                    this.listIngresosAnalisis.splice(this.listIngresosAnalisis.findIndex( m => m.id == ingreso.id ), 1);
                    this.listIngresosAnalisis.push(ingreso);

                    this._ingresoAnalisisSeleccionado = null;
                    this.inicializaFormularioIngreso();

                    this.alertService.success( response.responseMesagge );

                } else { this.alertService.error(response.responseMesagge); }
            });
    }
}