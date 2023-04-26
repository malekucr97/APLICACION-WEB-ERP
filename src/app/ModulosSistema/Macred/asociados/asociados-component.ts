import { FormBuilder, FormGroup, Validators  }      from '@angular/forms';
import { Component, OnInit, ViewChild }             from '@angular/core';
import { AccountService, AlertService }             from '@app/_services';
import { MatSidenav }                               from '@angular/material/sidenav';
import { Router }                                   from '@angular/router';
import { first }                                    from 'rxjs/operators';

import { User, Module, Compania }                   from '@app/_models';

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
    styleUrls: ['../../../../assets/scss/app.scss', '../../../../assets/scss/macred/app.scss'],
})
export class AsociadosComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'calificacion-asociados.html';
    // listScreenAccessUser    : ScreenAccessUser[];

    _globalCodMonedaPrincipal : number ;
    _globalMesesAplicaExtras : number ;

    _analisisCapacidadpago  : MacAnalisisCapacidadPago;
    _personaMacred          : MacPersona = null;

    _extrasAplicables       : MacExtrasAplicables ;
    _deduccion              : MacDeduccionesAnalisis ;

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
    habilitaBtnIngreso              : boolean = false;
    habilitaBtnHistoprialIngreso    : boolean = true;
    habilitaBtnRegistroDeudor       : boolean = false;
    habilitarBtnSubmitExtras        : boolean = false;
    habilitarBtnFinalizarExtras     : boolean = false;
    habilitarBtnEliminarExtras      : boolean = false;
    // habilitarBtnContinuarExtras     : boolean = false;
    habilitarBtnFinalizarDeducciones: boolean = false;

    habilitaBtnGeneraNuevoAnalisis  : boolean = true;
    habilitaBtnGuardarAnalisis      : boolean = false;
    habilitaBtnActualizaIngreso     : boolean = false;
    habilitaBtnRegistrarIngreso     : boolean = false;

    habilitaIcoOpenModalExtras      : boolean = false;
    habilitaIcoOpenModalDeducciones : boolean = false;

    habilitarBtnActualizaDeduccion  : boolean = false;
    habilitarBtnRegistraDeduccion   : boolean = false;
    // ## -- ---------------- -- ## //

    public listSubMenu  : Module[]  = [];
    public menuItem     : Module    = null;

    // ## -- listas analisis -- ## //
    listTipoIngresoAnalisis:    MacTipoIngresoAnalisis[];
    listTipoFormaPagoAnalisis:  MacTipoFormaPagoAnalisis[];
    listTiposMonedas:           MacTiposMoneda[];
    listModelosAnalisis:        MacModeloAnalisis[];
    listNivelesCapacidadpago:   MacNivelCapacidadPago[];
    listTiposGeneradores:       MacTipoGenerador[];
    // ## -- *************** -- ## //

    // ## -- listas ingresos -- ## //
    listTiposIngresos           : MacTipoIngreso[];
    listIngresosAnalisis        : MacIngresosXAnalisis[];
    listHistorialAnalisis       : MacAnalisisCapacidadPago[];
    listMatrizAceptacionIngreso : MacMatrizAceptacionIngreso[];
    listTiposDeducciones        : MacTipoDeducciones[];
    listExtrasAplicables        : MacExtrasAplicables[];
    listTempExtrasAplicables    : MacExtrasAplicables[];
    listDeduccionesAnalisis     : MacDeduccionesAnalisis[];
    listTotalDeduccionesAnalisis: MacDeduccionesAnalisis[];
    // ## -- *************** -- ## //

    // ## -- formularios -- ## //
    formPersona             : FormGroup;
    formAnalisis            : FormGroup;
    formIngresos            : FormGroup;
    formExtras              : FormGroup;
    formHistorialAnalisis   : FormGroup;
    formDeducciones         : FormGroup;
    // ## -- *********** -- ## //

    public today : Date ;

    constructor (   private formBuilder:       FormBuilder,
                    private macredService:     MacredService,
                    private accountService:    AccountService,
                    private alertService:      AlertService,
                    private router:            Router,
                    private dialogo:           MatDialog ) {

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
            cargasSociales      : [null],
            impuestoRenta       : [null],
            montoNeto           : [null],
            montoDeducciones    : [null],

            totalMontoAnalisis      : [null],
            totalIngresoBruto       : [null],
            totalIngresoNeto        : [null],
            totalCargaImpuestos     : [null],
            totalExtrasAplicables   : [null],
            totalDeducciones        : [null]
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
                
                this.macredService.getMatrizAceptacionIngreso( this.companiaObservable.id,  false )
                    .pipe(first())
                    .subscribe(response => { this.listMatrizAceptacionIngreso = response; });
            });
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

                this.inicializaFormIngreso();

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

        if (this.formPersona.invalid) return;

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

        if ( this.formAnalisis.invalid ) return;

        var analisis : MacAnalisisCapacidadPago = this.createAnalisisObjectForm();
        analisis.codigoAnalisis     = this._analisisCapacidadpago.codigoAnalisis;
        analisis.modificadoPor      = this.userObservable.identificacion;
        analisis.fechaModificacion  = this.today;

        analisis.totalMontoAnalisis      = this._analisisCapacidadpago.totalMontoAnalisis;
        analisis.totalIngresoBruto       = this._analisisCapacidadpago.totalIngresoBruto;
        analisis.totalIngresoNeto        = this._analisisCapacidadpago.totalIngresoNeto;
        analisis.totalCargaImpuestos     = this._analisisCapacidadpago.totalCargaImpuestos;
        analisis.totalExtrasAplicables   = this._analisisCapacidadpago.totalExtrasAplicables;
        analisis.totalDeducciones        = this._analisisCapacidadpago.totalDeducciones;

        this.macredService.putAnalisisCapPago(analisis)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    this._analisisCapacidadpago = response;
                    this.inicializaFormDatosAnalisis();

                    this.alertService.success( `Análisis ${this._analisisCapacidadpago.codigoAnalisis} actualizado con éxito.` );

                } else { this.alertService.error(`No fue posible actualizar el análisis.`); }

            }, error => {
                this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` );
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
        analisis.indicadorCsd           = indicadorCsd;
        analisis.descPondLvt            = ponderacionLvt;
        analisis.numeroDependientes     = numeroDependientes;
        analisis.observaciones          = observaciones;
        analisis.ancapCapacidadPago     = ancapCapPago;
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

        this.habilitaBtnIngreso = false;
    }

    openExtrasModal() : void {

        this.inicializaFormExtrasAplicables();
        
        $('#extrasModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }
    openHistorialModal() : void {

        this.formHistorialAnalisis = this.formBuilder.group({
            codigoAnalisisHistorial : [null, Validators.required]
        });

        this.macredService.getHistorialAnlisis( this.companiaObservable.id )
            .pipe(first())
            .subscribe(response => { 
                if (!this.listHistorialAnalisis) this.listHistorialAnalisis = [] ; 

                this.listHistorialAnalisis = response; 
            });
            
        $('#analisisHistorialModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }
    openDeduccionesModal() : void {

        this.inicializaFormDeducciones();

        $('#deduccionesModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    selectDeduccionAnalisis(deduccion : MacDeduccionesAnalisis) : void {

        // limpia formulario
        if (this._deduccion && this._deduccion.id === deduccion.id) {
            this._deduccion = null;
            this.inicializaFormDeducciones();
            return;
        }
        this._deduccion = deduccion ;
        this.inicializaFormDeducciones();
    }
    selectIngresoAnalisis(ingreso : MacIngresosXAnalisis) : void {

        // limpia formulario
        if (this._ingresoAnalisisSeleccionado && this._ingresoAnalisisSeleccionado.id === ingreso.id) {
            
            this._ingresoAnalisisSeleccionado   = null;
            this._extrasAplicables              = null;
            this._deduccion                     = null;
            this.listDeduccionesAnalisis        = null;

            this.inicializaFormIngreso();
            return;
        }

        this._ingresoAnalisisSeleccionado = ingreso ;
        this.inicializaFormIngreso();

        this.obtenerExtrasAplicablesAnalisis();
        this.obtenerDeduccionesAnalisis();
    }

    /*
     * OBTENER DEDUCCIONES
     */
    obtenerDeduccionesAnalisis() : void {

        this.listTotalDeduccionesAnalisis   = [] ;
        this.listDeduccionesAnalisis        = [] ;

        this.macredService.getDeduccionesAnalisis(  this.companiaObservable.id,
                                                    this._analisisCapacidadpago.codigoAnalisis )
            .pipe(first())
            .subscribe(response => {

                this.listTotalDeduccionesAnalisis = response ;

                this.listTotalDeduccionesAnalisis.forEach(element => {

                    if (element.codigoIngreso === this._ingresoAnalisisSeleccionado.id) 
                        this.listDeduccionesAnalisis.push(element);

                });
                
                this.totalizarDeducciones() ;
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

        $('#analisisHistorialModal').modal('hide');
    }

    inicializaFormDatosAnalisis()       : void {

        if (this._analisisCapacidadpago) {

            this.habilitaBtnGeneraNuevoAnalisis = false;
            this.habilitaBtnGuardarAnalisis     = true;
            this.habilitaBtnIngreso             = true;

            this._ingresoAnalisisSeleccionado   = null;
            this._extrasAplicables              = null;
            this._deduccion                     = null;

            this.listDeduccionesAnalisis        = null;
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

            this.formIngresos.patchValue({
                totalMontoAnalisis      : this._analisisCapacidadpago.totalMontoAnalisis,
                totalIngresoBruto       : this._analisisCapacidadpago.totalIngresoBruto,
                totalIngresoNeto        : this._analisisCapacidadpago.totalIngresoNeto,
                totalCargaImpuestos     : this._analisisCapacidadpago.totalCargaImpuestos,
                totalExtrasAplicables   : this._analisisCapacidadpago.totalExtrasAplicables,
                totalDeducciones        : this._analisisCapacidadpago.totalDeducciones
            });

        } else {

            let observacion : string = `Análisis generado el ` + this.today + ` por ` + this.userObservable.nombreCompleto + `.`;

            this.habilitaBtnGeneraNuevoAnalisis = true;
            this.habilitaBtnGuardarAnalisis     = false;
            this.habilitaBtnIngreso             = false;

            this.listDeduccionesAnalisis        = null;
            this.listIngresosAnalisis           = null;
            this.listExtrasAplicables           = null;

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
    inicializaFormIngreso() : void {

        if (this._ingresoAnalisisSeleccionado) {

            this.habilitaBtnActualizaIngreso = true;
            this.habilitaBtnRegistrarIngreso = false;

            this.habilitaIcoOpenModalExtras         = true;
            this.habilitaIcoOpenModalDeducciones    = true;

            this.formIngresos = this.formBuilder.group({
                codigoTipoIngreso   : [this.listTiposIngresos.find ( x => x.id === this._ingresoAnalisisSeleccionado.codigoTipoIngreso ), Validators.required],
                montoBruto          : [this._ingresoAnalisisSeleccionado.montoBruto, Validators.required],
                montoExtras         : this._ingresoAnalisisSeleccionado.montoExtras,
                cargasSociales      : this._ingresoAnalisisSeleccionado.cargasSociales,
                impuestoRenta       : this._ingresoAnalisisSeleccionado.impuestoRenta,
                montoNeto           : [this._ingresoAnalisisSeleccionado.montoNeto, Validators.required],
                montoDeducciones    : this._ingresoAnalisisSeleccionado.montoDeducciones,

                totalMontoAnalisis      : this._analisisCapacidadpago.totalMontoAnalisis,
                totalIngresoBruto       : this._analisisCapacidadpago.totalIngresoBruto,
                totalIngresoNeto        : this._analisisCapacidadpago.totalIngresoNeto,
                totalCargaImpuestos     : this._analisisCapacidadpago.totalCargaImpuestos,
                totalExtrasAplicables   : this._analisisCapacidadpago.totalExtrasAplicables,
                totalDeducciones        : this._analisisCapacidadpago.totalDeducciones
            });

        } else {

            this.habilitaBtnActualizaIngreso = false;
            this.habilitaBtnRegistrarIngreso = true;

            this.habilitaIcoOpenModalExtras         = false;
            this.habilitaIcoOpenModalDeducciones    = false;

            this.formIngresos = this.formBuilder.group({
                codigoTipoIngreso       : [null, Validators.required],
                // codigoTipoIngreso       : [null, Validators.required],
                montoBruto              : [0, Validators.required],
                // montoBruto              : [null, Validators.required],
                montoExtras             : 0,
                cargasSociales          : 0,
                impuestoRenta           : 0,
                montoNeto               : [0, Validators.required],
                // montoNeto               : [null, Validators.required],
                montoDeducciones        : 0,

                totalMontoAnalisis      : 0,
                totalIngresoBruto       : 0,
                totalIngresoNeto        : 0,
                totalCargaImpuestos     : 0,
                totalExtrasAplicables   : 0,
                totalDeducciones        : 0
            });
        }
    }
    inicializaFormDeducciones() : void {

        if (this._deduccion) {

            this.habilitarBtnActualizaDeduccion = true;
            this.habilitarBtnRegistraDeduccion  = false;

            this.formDeducciones = this.formBuilder.group({
                codigoTipoDeduccion : [this.listTiposDeducciones.find( x => x.id === this._deduccion.codigoTipoDeduccion ), Validators.required],
                codigoTipoMoneda    : [this.listTiposMonedas.find( x => x.id === this._deduccion.codigoMoneda ), Validators.required],
                tipoCambio          : [this._deduccion.tipoCambio,  Validators.required],
                montoDeduccion      : [this._deduccion.monto,       Validators.required]
            });
        } else {

            this.habilitarBtnActualizaDeduccion = false;
            this.habilitarBtnRegistraDeduccion  = true;

            this.formDeducciones = this.formBuilder.group({
                codigoTipoDeduccion : [null, Validators.required],
                codigoTipoMoneda    : [this.listTiposMonedas.find( x => x.id === this._globalCodMonedaPrincipal ), Validators.required],
                tipoCambio          : [1, Validators.required],
                montoDeduccion      : [null, Validators.required]
            });
        }
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

    // setFormExtrasIngresosAnalisis(clearExtras : boolean = false) : void {
    //     if (clearExtras) {
    //         this.formIngresos.patchValue({ montoExtras  : 0 });
    //     } else {
    //         this.formIngresos.patchValue({ montoExtras  : this._extrasAplicables.montoExtras });
    //     }
    // }
    
    CerrarExtrasModal()         : void { $('#extrasModal').modal('hide'); }
    CerrarDeduccionesModal()    : void { $('#deduccionesModal').modal('hide'); }

    
    deleteIngreso(ingreso : MacIngresosXAnalisis) : void {

        this.alertService.clear();

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: `Seguro que desea eliminar el ingreso seleccionado ?`
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                // elimina registros de dependencia del ingreso: deducciones y extras aplicables 
                if (this.listDeduccionesAnalisis) {
                    this.listDeduccionesAnalisis.forEach(element => {
                        if ( element.codigoIngreso == ingreso.id ) this.eliminarRegistroDeduccion(element.id);
                    });
                }
                if (this._extrasAplicables && this._extrasAplicables.codigoIngreso == ingreso.id ) {
                    this.eliminarRegistroExtra( this._extrasAplicables.id );
                }
                // *** 

                this.macredService.deleteIngreso( ingreso.id )
                    .pipe(first())
                    .subscribe(response => { 
                        if (response.exito) {

                            this.listIngresosAnalisis.splice(this.listIngresosAnalisis.findIndex( m => m.id == ingreso.id ), 1);

                            if (this.listIngresosAnalisis.length === 0) this.listIngresosAnalisis = null;

                            this._ingresoAnalisisSeleccionado   = null;
                            this._deduccion                     = null;
                            this._extrasAplicables              = null;

                            this.inicializaFormIngreso();

                            this.alertService.success(response.responseMesagge);
                            
                        } else { this.alertService.error(response.responseMesagge); }
                    });
                
            } else { return; }
        });
    }

    eliminarDeduccion(deduccion : MacDeduccionesAnalisis) : void {

        this.alertService.clear();

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: `Seguro que desea eliminar la deducción seleccionada ?`
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.macredService.deleteDeduccion( deduccion.id )
                    .pipe(first())
                    .subscribe(response => { 
                        if (response.exito) {

                            this.obtenerDeduccionesAnalisis();

                            this.habilitarBtnFinalizarDeducciones = true;

                            this._deduccion = null;
                            this.inicializaFormDeducciones();

                            this.alertService.success(response.responseMesagge);
                            
                        } else { this.alertService.error(response.responseMesagge); }
                    });
                
            } else { return; }
        });
    }
    
    

    // elimina registros de forma interna para el ingreso y ejecución de procesos sin confirmación
    eliminarRegistroExtra(idExtras : number) : void {
        this.macredService.deleteExtra( idExtras )
            .pipe(first())
            .subscribe(response => { 
                if (!response.exito) {
                    this.alertService.error(response.responseMesagge);
                    return;
                }
            });
    }
    eliminarRegistroDeduccion(idDeduccion : number) : void {
        this.macredService.deleteDeduccion( idDeduccion )
            .pipe(first())
            .subscribe(response => {
                if (!response.exito) {
                    this.alertService.error(response.responseMesagge);
                    return;
                }
            });
    }
    // *** //

    totalizarDeducciones() : void {

        var totalDeducciones        : number = 0;
        var totalDeduccionesIngreso : number = 0;

        this.formIngresos.patchValue({ montoDeducciones : 0 });
        this.formIngresos.patchValue({ totalDeducciones : 0 });
        
        if (this.listDeduccionesAnalisis)       this.listDeduccionesAnalisis.forEach(element => { totalDeduccionesIngreso += element.monto; });

        if (this.listTotalDeduccionesAnalisis)  this.listTotalDeduccionesAnalisis.forEach(element => { totalDeducciones += element.monto; });
        
        this.formIngresos.patchValue({ montoDeducciones : totalDeduccionesIngreso });
        this.formIngresos.patchValue({ totalDeducciones : totalDeducciones });

        // this.habilitarBtnFinalizarDeducciones = false;
    }

    finalizarFormularioDeducciones() : void {

        var totalDeducciones        : number = 0;
        var totalDeduccionesIngreso : number = 0;

        this.formIngresos.patchValue({ montoDeducciones : 0 });
        this.formIngresos.patchValue({ totalDeducciones : 0 });
        
        if (this.listDeduccionesAnalisis)       this.listDeduccionesAnalisis.forEach(element => { totalDeduccionesIngreso += element.monto; });

        if (this.listTotalDeduccionesAnalisis)  this.listTotalDeduccionesAnalisis.forEach(element => { totalDeducciones += element.monto; });
        
        this.formIngresos.patchValue({ montoDeducciones : totalDeduccionesIngreso });
        this.formIngresos.patchValue({ totalDeducciones : totalDeducciones });

        this.habilitarBtnFinalizarDeducciones = false;

        this.ActualizaFormIngresos();

        $('#deduccionesModal').modal('hide');
    }

    SubmitFormDeducciones() : void {

        this.alertService.clear();
        this.submittedDeduccionesForm = true;

        if ( this.formDeducciones.invalid ) return;

        var deduccion : MacDeduccionesAnalisis = this.createDeduccionObjectForm();
        deduccion.adicionadoPor = this.userObservable.identificacion;
        deduccion.fechaAdicion  = this.today;

        this.macredService.postDeduccionesAnalisis(deduccion)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this.obtenerDeduccionesAnalisis();

                    this.inicializaFormDeducciones();

                    // if (!this.listDeduccionesAnalisis) this.listDeduccionesAnalisis = [];

                    // this.listDeduccionesAnalisis.push(response);

                    this.habilitarBtnFinalizarDeducciones = true;

                    this.alertService.success( `Registro de Deducciones realizado con éxito.` );

                } else { this.alertService.error(`Problemas al registrar las Deducciones del Análisis de Capacidad de Pago.`); }
            });
    }

    FinalizarRegistroExtras() : void {

        this.alertService.clear();
        var extrasAplicables : MacExtrasAplicables = new MacExtrasAplicables ;

        // registro automático meses aplicables
        // if (this.listExtrasAplicables.length > 1) {
        //     if (this.listExtrasAplicables.length < this._globalMesesAplicaExtras ) {
        //         var iteraciones = this._globalMesesAplicaExtras - this.listExtrasAplicables.length;
        //         for ( let index = 0; index < iteraciones ; index++ ) { this.SubmitFormExtras(true); }
        //     }
        // }

        extrasAplicables = this.listExtrasAplicables[this.listExtrasAplicables.length - 1];
        
        this.macredService.postExtrasAplicables(extrasAplicables)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this.listExtrasAplicables     = null;
                    this.listTempExtrasAplicables = null;

                    this.habilitarBtnFinalizarExtras = false ;
                    this.habilitarBtnSubmitExtras    = false ;
                    // this.habilitarBtnContinuarExtras = true  ;

                    this._extrasAplicables = response;
                    this.inicializaFormExtrasAplicables();

                    this.formIngresos.patchValue({ montoExtras  : this._extrasAplicables.montoExtras });

                    this.alertService.success( `Registro de Extras realizado con éxito..` );

                } else {
                    let message : string = 'Problemas al registrar el Análisis de Capacidad de Pago.';
                    this.alertService.error(message);
                }
        });
    }
    SubmitFormExtras() : void {

        this.alertService.clear();
        this.submittedExtrasForm = true;

        var sumatoriaMontoExtras    : number = 0.00 ;
        var potenciaSaldo           : number = 0.0  ;
        var promedioExtras          : number = 0.0  ;
        var factorAceptacion        : number = 0    ;

        var cantidadRegistrosExtras : number = 0 ;

        if ( this.formExtras.invalid ) return;

        if (this.formExtras.controls['montoExtra'].value === 0) {
            this.formExtras.controls['montoExtra'].setErrors({'error': true});
            return;
        }
        
        if (this._extrasAplicables) {
            this.eliminarRegistroExtra( this._extrasAplicables.id );
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
        
        // sumatoria total extras
        this.listTempExtrasAplicables.forEach(extra => { 
            sumatoriaMontoExtras += extra.montoExtras ; 
        });

        extrasTempAplicables.montoExtras = sumatoriaMontoExtras ;

        cantidadRegistrosExtras = this.listExtrasAplicables.length+1;

        // promedio extras
        var temPromedioTotalExtrasPermitidas = sumatoriaMontoExtras / cantidadRegistrosExtras ;
        promedioExtras  = this.listTempExtrasAplicables.length  === 1 
                                                                ? sumatoriaMontoExtras 
                                                                : temPromedioTotalExtrasPermitidas ;
        
        // // promedio extras
        // var temPromedioTotalExtrasPermitidas = sumatoriaMontoExtras / this._globalMesesAplicaExtras ;
        // promedioExtras  = this.listTempExtrasAplicables.length  === 1 
        //                                                         ? sumatoriaMontoExtras 
        //                                                         : temPromedioTotalExtrasPermitidas ;
        // extrasTempAplicables.promedioExtrasAplicables = promedioExtras;

        this.listTempExtrasAplicables.forEach(extra => {
            potenciaSaldo += Math.pow(extra.montoExtras - promedioExtras, 2) ;
        });
        
        var tempDesviacionEstandar = Math.sqrt( potenciaSaldo / (cantidadRegistrosExtras - 1) ) ;
        // var tempDesviacionEstandar = Math.sqrt( potenciaSaldo / (this._globalMesesAplicaExtras - 1) ) ;
        extrasTempAplicables.desviacionEstandar = tempDesviacionEstandar != null ? tempDesviacionEstandar : 0 ;

        var tempCoeficienteVarianza = extrasTempAplicables.desviacionEstandar / promedioExtras ;
        extrasTempAplicables.coeficienteVarianza = tempCoeficienteVarianza * 100 ;

        var tempCoeficienteVarianzaPorcentual = extrasTempAplicables.coeficienteVarianza ;

        tempCoeficienteVarianzaPorcentual     = tempCoeficienteVarianzaPorcentual >= 1 ? 1 : tempCoeficienteVarianzaPorcentual ;
        

        // extrasTempAplicables.coeficienteVarianza = tempCoeficienteVarianza ;
        // extrasTempAplicables.porcentajeExtrasAplicables = (100 - extrasTempAplicables.coeficienteVarianza);

        // var coeficienteVarianzaPorcentual = extrasTempAplicables.coeficienteVarianza * 100 ;

        this.listMatrizAceptacionIngreso.forEach(element => {
            if ( element.rangoDesviacion1   <= tempCoeficienteVarianzaPorcentual && 
                element.rangoDesviacion2    >= tempCoeficienteVarianzaPorcentual   ) factorAceptacion = element.factor ;
        });

        extrasTempAplicables.promedioExtrasAplicables = promedioExtras * ( factorAceptacion / 100 );

        extrasTempAplicables.porcentajeExtrasAplicables = extrasTempAplicables.promedioExtrasAplicables * (1 - (extrasTempAplicables.coeficienteVarianza / 100))

        this.inicializaFormExtrasAplicables();

        var extrasAplicables : MacExtrasAplicables = new MacExtrasAplicables ;
        extrasAplicables.codigoAnalisis = this._analisisCapacidadpago.codigoAnalisis ;
        extrasAplicables.codigoCompania = this.companiaObservable.id ;
        extrasAplicables.codigoIngreso  = this._ingresoAnalisisSeleccionado.id;
        extrasAplicables.adicionadoPor  = this.userObservable.identificacion ;
        extrasAplicables.fechaAdicion   = this.today ;

        extrasAplicables.montoExtras                = extrasTempAplicables.montoExtras;
        extrasAplicables.desviacionEstandar         = extrasTempAplicables.desviacionEstandar;
        extrasAplicables.coeficienteVarianza        = extrasTempAplicables.coeficienteVarianza;
        extrasAplicables.porcentajeExtrasAplicables = extrasTempAplicables.porcentajeExtrasAplicables;
        extrasAplicables.promedioExtrasAplicables   = extrasTempAplicables.promedioExtrasAplicables;

        this.listExtrasAplicables.push(extrasAplicables);
        
        this.habilitarBtnFinalizarExtras = true ;
    }
    deleteExtra() : void {

        this.alertService.clear();

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: `Seguro que desea eliminar el registro de extras ?`
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.macredService.deleteExtra(  this._extrasAplicables.id )
                .pipe(first())
                .subscribe(response => {
    
                    if (response.exito) {
    
                        this._extrasAplicables = null;
    
                        this.listExtrasAplicables        = null;
                        this.listTempExtrasAplicables    = null;
                        this.habilitarBtnFinalizarExtras = false;
    
                        this.formIngresos.patchValue({ montoExtras  : 0 });
    
                        $('#extrasModal').modal('hide');

                        this.alertService.success( response.responseMesagge );
                    } 
                    else { this.alertService.error(response.responseMesagge); }
                });

            } else { return; }
        });
    }

    createIngresoObjectForm() : MacIngresosXAnalisis {

        var ingresoAnalisis : MacIngresosXAnalisis = new MacIngresosXAnalisis ;

        ingresoAnalisis.codigoAnalisis = this._analisisCapacidadpago.codigoAnalisis;
        ingresoAnalisis.codigoCompania = this.companiaObservable.id;

        ingresoAnalisis.codigoTipoIngreso       = this.formIngresos.controls['codigoTipoIngreso'].value.id;
        ingresoAnalisis.codigoTipoMoneda        = this._analisisCapacidadpago.codigoMoneda;
        ingresoAnalisis.montoBruto              = this.formIngresos.controls['montoBruto'].value;
        ingresoAnalisis.montoExtras             = this.formIngresos.controls['montoExtras'].value;
        ingresoAnalisis.cargasSociales          = this.formIngresos.controls['cargasSociales'].value;
        ingresoAnalisis.impuestoRenta           = this.formIngresos.controls['impuestoRenta'].value;
        ingresoAnalisis.montoNeto               = this.formIngresos.controls['montoNeto'].value;
        ingresoAnalisis.montoDeducciones        = this.formIngresos.controls['montoDeducciones'].value;

        return ingresoAnalisis;
    }
    createDeduccionObjectForm() : MacDeduccionesAnalisis {

        var deduccion : MacDeduccionesAnalisis = new MacDeduccionesAnalisis ;

        deduccion.codigoAnalisis        = this._analisisCapacidadpago.codigoAnalisis;
        deduccion.codigoCompania        = this.companiaObservable.id;
        deduccion.codigoIngreso         = this._ingresoAnalisisSeleccionado.id;

        deduccion.codigoTipoDeduccion   = this.formDeducciones.controls['codigoTipoDeduccion'].value.id;
        deduccion.codigoMoneda          = this.formDeducciones.controls['codigoTipoMoneda'].value.id;
        deduccion.tipoCambio            = this.formDeducciones.controls['tipoCambio'].value;
        deduccion.monto                 = this.formDeducciones.controls['montoDeduccion'].value;

        return deduccion;
    }
    
    RegistrarIngresoAnalisis() : void {

        this.alertService.clear();

        this.submittedIngresosForm = true;

        if ( this.formIngresos.invalid ) return;

        if (this.formIngresos.controls['montoBruto'].value === 0) {
            this.formIngresos.controls['montoBruto'].setErrors({'error': true});
            return;
        }

        var ingreso : MacIngresosXAnalisis = this.createIngresoObjectForm();
        ingreso.adicionadoPor   = this.userObservable.identificacion;
        ingreso.fechaAdicion    = this.today;

        this.macredService.postIngresosAnalisis(ingreso)
        .pipe(first())
        .subscribe(response => {

            if (response) {

                if (!this.listIngresosAnalisis) this.listIngresosAnalisis = [];

                this.listIngresosAnalisis.push(response);

                this.totalizarMontosIngreso();

                this._ingresoAnalisisSeleccionado = null;
                this.inicializaFormIngreso();

                this.GuardarAnalisis();

                this.alertService.success( `Registro de Ingreso realizado con éxito.` );

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

        this.macredService.putIngresosAnalisis(ingreso)
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {

                    this.listIngresosAnalisis.splice(this.listIngresosAnalisis.findIndex( m => m.id == ingreso.id ), 1);
                    this.listIngresosAnalisis.push(ingreso);

                    this.totalizarMontosIngreso();

                    this._ingresoAnalisisSeleccionado = null;
                    this.inicializaFormIngreso();

                    this.GuardarAnalisis();

                    this.alertService.success( response.responseMesagge + '. ID Ingreso Actualizado: ' + ingreso.id );

                } else { this.alertService.error(response.responseMesagge); }
            });
    }
    ActualizaFormDeducciones() : void {

        this.alertService.clear();
        this.submittedDeduccionesForm = true;

        if ( this.formDeducciones.invalid ) return;

        var deduccion : MacDeduccionesAnalisis = this.createDeduccionObjectForm();
        deduccion.id                  = this._deduccion.id;
        deduccion.modificadoPor       = this.userObservable.identificacion;
        deduccion.fechaModificacion   = this.today;

        this.macredService.putDeduccionAnalisis(deduccion)
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {
                    
                    this.obtenerDeduccionesAnalisis();

                    this.habilitarBtnFinalizarDeducciones = true;

                    this._deduccion = null;
                    this.inicializaFormDeducciones();

                    this.alertService.success( response.responseMesagge );

                } else { this.alertService.error(response.responseMesagge); }
            });
    }

    totalizarMontosIngreso() : void {

        let totalDeducciones        : number = 0;
        let totalIngresoBruto       : number = 0;
        let totalCargasImpuestos    : number = 0;
        let totalExtrasAplicables   : number = 0;

        let totalIngresoNeto        : number = 0;
        let totalIngresoAnalisis    : number = 0;

        if (this.listTotalDeduccionesAnalisis) {
            this.listTotalDeduccionesAnalisis.forEach(deduccion => {
                totalDeducciones += deduccion.monto;
            });
        }
        
        this.listIngresosAnalisis.forEach(ingreso => {
            totalIngresoBruto += ingreso.montoBruto;
            totalCargasImpuestos += ingreso.cargasSociales + ingreso.impuestoRenta;

            totalExtrasAplicables += ingreso.montoExtras;
        });

        totalIngresoNeto        = totalIngresoBruto - totalCargasImpuestos ;
        totalIngresoAnalisis    = totalIngresoNeto  + totalExtrasAplicables;

        this._analisisCapacidadpago.totalCargaImpuestos    = totalCargasImpuestos;;
        this._analisisCapacidadpago.totalDeducciones       = totalDeducciones;
        this._analisisCapacidadpago.totalExtrasAplicables  = totalExtrasAplicables;
        this._analisisCapacidadpago.totalIngresoBruto      = totalIngresoBruto;
        this._analisisCapacidadpago.totalIngresoNeto       = totalIngresoNeto;
        this._analisisCapacidadpago.totalMontoAnalisis     = totalIngresoAnalisis;
    }
}