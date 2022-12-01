import { FormBuilder, FormGroup, Validators  }  from '@angular/forms';
import { Component, OnInit, ViewChild }         from '@angular/core';
import { AccountService, AlertService }         from '@app/_services';
import { User, Module }                         from '@app/_models';
import { MatSidenav }                           from '@angular/material/sidenav';
import { Compania }                             from '../../../_models/modules/compania';
import { MacredService }                        from '@app/_services/macred.service';
import { ScreenAccessUser }                     from '@app/_models/admin/screenAccessUser';
import { Router }                               from '@angular/router';
import { first }                                from 'rxjs/operators';
import { MacPersona }                           from '@app/_models/Macred/Persona';
import { MacTipoIngresoAnalisis }               from '@app/_models/Macred/TipoIngresoAnalisis';
import { MacTipoFormaPagoAnalisis }             from '@app/_models/Macred/TipoFormaPagoAnalisis';
import { MacAnalisisCapacidadPago }             from '@app/_models/Macred/AnalisisCapacidadPago';
import { MacTiposMoneda }                       from '@app/_models/Macred/TiposMoneda';
import { MacModeloAnalisis }                    from '@app/_models/Macred/ModeloAnalisis';
import { MacNivelCapacidadPago }                from '@app/_models/Macred/NivelCapacidadPago';
import { MacTipoGenerador }                     from '@app/_models/Macred/TipoGenerador';
import { MatDialog }                            from '@angular/material/dialog';
import { DialogoConfirmacionComponent }         from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';
import { MacTipoIngreso }                       from '@app/_models/Macred/TipoIngreso';
import { MacIngresosXAnalisis } from '@app/_models/Macred/IngresosXAnalisis';
import { MacExtrasAplicables } from '@app/_models/Macred/ExtrasAplicables';

declare var $: any;

@Component({
    templateUrl: 'HTML_Asociados.html',
    styleUrls: ['../../../../assets/scss/app.scss',
                '../../../../assets/scss/macred/app.scss'],
})
export class AsociadosComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla : string = 'CalificacionAsociados.html';

    _globalCodMonedaPrincipal : number ;
    _globalMesesAplicaExtras : number ;

    _analisisCapacidadpago  : MacAnalisisCapacidadPago;
    _personaMacred          : MacPersona = null;

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private moduleObservable    : Module;
    private companiaObservable  : Compania;
    // ## -- ----------------- -- ## //

    // ## -- submit formularios -- ## //
    submittedPersonForm : boolean = false;
    submittedAnalisisForm : boolean = false;
    submittedIngresosForm : boolean = false;
    submittedExtrasForm : boolean = false;
    submittedHistorialAnalisisForm : boolean = false;
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

    habilitaBtnIngreso : boolean = false;
    habilitaBtnHistoprialIngreso: boolean = true;
    habilitaBtnRegistroDeudor: boolean = false;

    public listSubMenu: Module[] = [];
    public menuItem : Module = null;

    habilitaBtnGeneraNuevoAnalisis : boolean = true;
    habilitaBtnGuardarAnalisis      : boolean = false;

    listScreenAccessUser: ScreenAccessUser[];

    // listas analisis
    listTipoIngresoAnalisis:    MacTipoIngresoAnalisis[];
    listTipoFormaPagoAnalisis:  MacTipoFormaPagoAnalisis[];
    listTiposMonedas:           MacTiposMoneda[];
    listModelosAnalisis:        MacModeloAnalisis[];
    listNivelesCapacidadpago:   MacNivelCapacidadPago[];
    listTiposGeneradores:       MacTipoGenerador[];

    // listas ingresos
    listTiposIngresos: MacTipoIngreso[];
    listIngresosAnalisis : MacIngresosXAnalisis[] ;
    listExtrasAplicables : MacExtrasAplicables[] ;
    listHistorialAnalisis : MacAnalisisCapacidadPago[] ;

    formPersona             : FormGroup;
    formAnalisis            : FormGroup;
    formIngresos            : FormGroup;
    formExtras              : FormGroup;
    formHistorialAnalisis   : FormGroup;

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

    get f () {   return this.formPersona.controls;   }
    get g () {   return this.formAnalisis.controls;  }
    get i () {   return this.formIngresos.controls;  }
    get e () {   return this.formExtras.controls;    }
    get h () {   return this.formHistorialAnalisis.controls;    }
    
    addListMenu(modItem:Module) : void {

        this.listSubMenu.push(modItem);

        // this.listSubMenu.push(new Module(2,
        //                                 'Flujo de Caja',
        //                                 'Flujo de Caja',
        //                                 'Flujo de Caja',
        //                                 'I',
        //                                 '.png',
        //                                 '.ico',
        //                                 'http'));


        // this.listSubMenu.push(new Module(3,
        //                                 'Probability of Default',
        //                                 'Probability of Default',
        //                                 'Probability of Default',
        //                                 'I',
        //                                 '.png',
        //                                 '.ico',
        //                                 'http'));

        // this.listSubMenu.push(new Module(4,
        //                                 'Scoring Crediticio',
        //                                 'Scoring Crediticio',
        //                                 'Scoring Crediticio',
        //                                 'I',
        //                                 '.png',
        //                                 '.ico',
        //                                 'http'));

        // this.listSubMenu.push(new Module(5,
        //                                 'Ingresos',
        //                                 'Ingresos',
        //                                 'Ingresos',
        //                                 'I',
        //                                 '.png',
        //                                 '.ico',
        //                                 'http'));

        // this.listSubMenu.push(new Module(6,
        //                                 'Obligaciones Supervisadas',
        //                                 'Obligaciones Supervisadas',
        //                                 'Obligaciones Supervisadas',
        //                                 'I',
        //                                 '.png',
        //                                 '.ico',
        //                                 'http'));

        // this.listSubMenu.push(new Module(7,
        //                                 'O. No Supervisadas',
        //                                 'O. No Supervisadas',
        //                                 'O. No Supervisadas',
        //                                 'I',
        //                                 '.png',
        //                                 '.ico',
        //                                 'http'));

        // this.listSubMenu.push(new Module(8,
        //                                 'LVT',
        //                                 'LVT',
        //                                 'LVT',
        //                                 'I',
        //                                 '.png',
        //                                 '.ico',
        //                                 'http'));

        // this.listSubMenu.push(new Module(9,
        //                                 'Escenarios',
        //                                 'Escenarios',
        //                                 'Escenarios',
        //                                 'I',
        //                                 '.png',
        //                                 '.ico',
        //                                 'http'));

        // this.listSubMenu.push(new Module(10,
        //                                 'Escenarios FCL',
        //                                 'Escenarios FCL',
        //                                 'Escenarios FCL',
        //                                 'I',
        //                                 '.png',
        //                                 '.ico',
        //                                 'http'));
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

            if (!this.listIngresosAnalisis)
                this.listIngresosAnalisis = [] ;
            
                if (this.listIngresosAnalisis.length == 0) {
                    this.macredService.getIngresosAnalisis( this.companiaObservable.id, 
                                                            this._analisisCapacidadpago.codigoAnalisis )
                        .pipe(first())
                        .subscribe(response => { this.listIngresosAnalisis = response; });
                }

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

    ngOnInit() {

        this.formPersona = this.formBuilder.group({
            id              : [null],
            nombre          : [null],
            primerApellido  : [null],
            segundoApellido : [null],
            identificacion  : [null, Validators.required]
        });
        this.formAnalisis = this.formBuilder.group({
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
        this.formIngresos = this.formBuilder.group({
            codigoTipoIngreso   : [null],
            montoBruto          : [null],
            montoExtras         : [null],
            porcentajeExtras    : [null],
            cargasSociales      : [null],
            impuestoRenta       : [null],
            montoNeto           : [null],
            montoDeducciones    : [null]
        });
        this.formExtras = this.formBuilder.group({
            montoExtra                  : [null],
            desviacionEstandar          : [null],
            coeficienteVarianza         : [null],
            porcentajeExtrasAplicable   : [null],
            mesesExtrasAplicables       : [null]
        });
        this.formHistorialAnalisis = this.formBuilder.group({
            codigoAnalisis  : [null]
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
                this.macredService.GetParametroGeneralVal1(this.companiaObservable.id, 'COD_MONEDA_PRINCIPAL', true)
                    .pipe(first())
                    .subscribe(response => { this._globalCodMonedaPrincipal = +response; });
                this.macredService.GetParametroGeneralVal1(this.companiaObservable.id, 'MESES_APLICABLES_EXTRAS', true)
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
                this.macredService.getModelosAnalisis(this.companiaObservable.id, false)
                    .pipe(first())
                    .subscribe(response => { this.listModelosAnalisis = response; });
                this.macredService.getNivelesCapacidadPago(this.companiaObservable.id, false)
                    .pipe(first())
                    .subscribe(response => { this.listNivelesCapacidadpago = response; });
                this.macredService.getTiposGenerador(this.companiaObservable.id, false)
                    .pipe(first())
                    .subscribe(response => { this.listTiposGeneradores = response; });
                // carga datos ingresos
                this.macredService.getTiposIngresos(this.companiaObservable.id, false)
                    .pipe(first())
                    .subscribe(response => { this.listTiposIngresos = response; });
                });
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

    cargaInformacionPersona(identificacionPersona : string) : void {

        this.macredService.getPersonaMacred(identificacionPersona, this.companiaObservable.id)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    this._personaMacred = response;

                    this.formPersona = this.formBuilder.group({
                        id              : [this._personaMacred.id,               Validators.required],
                        nombre          : [this._personaMacred.nombre,           Validators.required],
                        primerApellido  : [this._personaMacred.primerApellido,   Validators.required],
                        segundoApellido : [this._personaMacred.segundoApellido,  Validators.required],
                        identificacion  : [this._personaMacred.identificacion,   Validators.required]
                    });
                    this.formAnalisis = this.formBuilder.group({
                        fechaAnalisis           : [this.today,  Validators.required],
                        tipoIngresoAnalisis     : [null,        Validators.required],
                        tipoFormaPagoAnalisis   : [null,        Validators.required],

                        tipoMoneda              : [this.listTiposMonedas.find(x => x.id === this._globalCodMonedaPrincipal),
                                                                Validators.required],
                        analisisDefinitivo      : [false],
                        estado                  : [true],

                        modeloAnalisis          : [this.listModelosAnalisis.find(x => x.id === 5),
                                                                Validators.required],
                        indicadorCsd            : [null],
                        ponderacionLvt          : [null],

                        capacidadPago           : [this.listNivelesCapacidadpago.find(x => x.id === 99)],
                        tipoGenerador           : [this.listTiposGeneradores.find(x => x.id === 99)],
                        numeroDependientes      : [0],
                        puntajeAnalisis         : [0],
                        calificacionCic         : ['0'],
                        calificacionFinalCic    : [0],
                        observaciones           : [null]
                    });

                    this.habilitarItemSubMenu(  new Module( 1, 'Datos de Anláisis', 'Datos de Anláisis', 'Datos de Anláisis', 'A', '.png', '.ico', 'http') );
                    this.selectModule(          new Module(1, 'Datos de Anláisis', 'Datos de Anláisis', 'Datos de Anláisis', 'A', '.png', '.ico', 'http') );

                } else { this.alertService.info('No se encontraron registros.'); }
            },
            error => {
                let message : string = 'Problemas de conexión: ' + error;
                this.alertService.error(message);
            });
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

                    this.habilitaBtnGeneraNuevoAnalisis = true;
                    
                    this.habilitaBtnIngreso             = false;
                    this.habilitaBtnGuardarAnalisis     = false;
                    
                    this.cargaInformacionPersona(identificacionPersona);

                } else { return; }
            });

        } else { this.cargaInformacionPersona(identificacionPersona); }
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

                    this.habilitaBtnGeneraNuevoAnalisis = false;
                    this.habilitaBtnIngreso             = true;
                    this.habilitaBtnGuardarAnalisis     = true;

                    this.alertService.success(
                        `Análisis ${this._analisisCapacidadpago.codigoAnalisis} actualizado con éxito.`
                    );

                } else {
                    this.alertService.error(`No fue posible actualizar el análisis.`);
                }
            }, error => {
                this.alertService.error(
                    `Problemas al establecer la conexión con el servidor. Detalle: ${ error }`
                );
            });
    }

    createAnalisisObjectForm() : MacAnalisisCapacidadPago {

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

        var analisis = new MacAnalisisCapacidadPago (   this.companiaObservable.id,
                                                        this._personaMacred.id,
                                                        this.today,
                                                        estado,
                                                        analisisDefinitivo,
                                                        idNivelCapacidadPago,
                                                        puntajeAnalisis,
                                                        calificacionCic,
                                                        calificacionFinalCic,
                                                        idTipoIngresoAnalisis,
                                                        idTipoFormaPagoAnalisis,
                                                        idModeloAnalisis,
                                                        idTipoMoneda,
                                                        idTipoGenerador,
                                                        indicadorCsd,
                                                        ponderacionLvt,
                                                        numeroDependientes,
                                                        observaciones,
                                                        ancapCapPago,
                                                        ancapCalificacionFinal,
                                                        ancapPuntajeFinal,
                                                        this.userObservable.identificacion,
                                                        this.today ) ;
            
        return analisis;
    }

    SubmitNuevoAnalisis() : void {

        this.alertService.clear();
        this.submittedAnalisisForm = true;

        if ( this.formAnalisis.invalid )
            return;
        
        var analisis : MacAnalisisCapacidadPago = this.createAnalisisObjectForm();

        this.macredService.postAnalisisCapPago(analisis)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._analisisCapacidadpago = response;

                    this.habilitaBtnGeneraNuevoAnalisis = false;
                    this.habilitaBtnIngreso             = true;

                    this.habilitaBtnGuardarAnalisis     = true;

                    // this.formAnalisis = this.formBuilder.group({
                    //     fechaAnalisis           : [this._analisisCapacidadpago.fechaAnalisis,               Validators.required],
                    //     tipoIngresoAnalisis     : [this._analisisCapacidadpago.codigoTipoIngresoAnalisis,   Validators.required],
                    //     tipoFormaPagoAnalisis   : [this._analisisCapacidadpago.codigoTipoFormaPagoAnalisis, Validators.required],

                    //     tipoMoneda              : [this._analisisCapacidadpago.codigoMoneda,                Validators.required],
                    //     analisisDefinitivo      : [this._analisisCapacidadpago.analisisDefinitivo],
                    //     estado                  : [this._analisisCapacidadpago.estado],

                    //     modeloAnalisis          : [this._analisisCapacidadpago.codigoModeloAnalisis,        Validators.required],
                    //     indicadorCsd            : [this._analisisCapacidadpago.indicadorCsd],
                    //     ponderacionLvt          : [this._analisisCapacidadpago.descPondLvt],

                    //     capacidadPago           : [this._analisisCapacidadpago.codigoNivelCapPago],
                    //     tipoGenerador           : [this._analisisCapacidadpago.codigoTipoGenerador],
                    //     numeroDependientes      : [this._analisisCapacidadpago.numeroDependientes],
                    //     puntajeAnalisis         : [this._analisisCapacidadpago.puntajeAnalisis],
                    //     calificacionCic         : [this._analisisCapacidadpago.calificacionCic],
                    //     calificacionFinalCic    : [this._analisisCapacidadpago.puntajeFinalCic],
                    //     observaciones           : [this._analisisCapacidadpago.observaciones]
                    // });

                    this.alertService.success(
                        `Análisis ${ this._analisisCapacidadpago.codigoAnalisis } generado correctamente !`
                    );

                } else {
                    let message : string = 'Problemas al registrar el Análisis de Capacidad de Pago.';
                    this.alertService.error(message);
                }
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

    deleteIngreso(ingreso : MacIngresosXAnalisis) : void {

        this.isDeleting = true;
    }
    deleteExtra(extra : MacExtrasAplicables) : void {

        this.isDeleting = true;
    }

    openExtrasModal() : void {

        if (!this.listExtrasAplicables)
            this.listExtrasAplicables = [] ;

        this.macredService.getExtrasAplicables( this.companiaObservable.id, 
                                                this._analisisCapacidadpago
                                                != null 
                                                ? this._analisisCapacidadpago.codigoAnalisis 
                                                : 1 )
            .pipe(first())
            .subscribe(response => { this.listExtrasAplicables = response; });

        // this.macredService.getExtrasAplicables( this.companiaObservable.id, 
        //                                         this._analisisCapacidadpago.codigoAnalisis )
        //     .pipe(first())
        //     .subscribe(response => { this.listExtrasAplicables = response; });
            
        this.formExtras = this.formBuilder.group({
            montoExtra                  : [null,    Validators.required],
            desviacionEstandar          : [0,       Validators.required],
            coeficienteVarianza         : [0,       Validators.required],
            porcentajeExtrasAplicable   : [0,       Validators.required],
            mesesExtrasAplicables       : [this._globalMesesAplicaExtras, Validators.required]
        });
        
        $('#extrasModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }
    openHistorialAnalisisModal() : void {

        // submittedHistorialAnalisisForm

        if (!this.listHistorialAnalisis)
            this.listHistorialAnalisis = [] ;

        this.macredService.getHistorialAnlisis( this.companiaObservable.id )
            .pipe(first())
            .subscribe(response => { this.listHistorialAnalisis = response; });
            
        this.formHistorialAnalisis = this.formBuilder.group({
            codigoAnalisis  : [null,    Validators.required]
        });
        
        $('#analisisModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    openDeduccionesModal() : void {

        // this.add = true;
        // this.buttomText = 'Registrar';

        // this.groupForm = this.formBuilder.group({
        //     descripcionGrupo: ['', Validators.required],
        //     estado: ['A', Validators.required]
        // });

        $('#deduccionesModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    SubmitFormExtras() : void {

        this.alertService.clear();
        this.submittedExtrasForm = true;

        if ( this.formExtras.invalid )
            return;
        
        var extrasAplicables : MacExtrasAplicables = new MacExtrasAplicables ;

        extrasAplicables.codigoAnalisis = this._analisisCapacidadpago
                                            != null 
                                            ? this._analisisCapacidadpago.codigoAnalisis 
                                            : 1;
        extrasAplicables.codigoCompania = this.companiaObservable.id;

        var montoExtra                  = this.formExtras.controls['montoExtra'].value;
        var porcentajeExtrasAplicable   = this.formExtras.controls['porcentajeExtrasAplicable'].value;
        var desviacionEstandar          = this.formExtras.controls['desviacionEstandar'].value;
        var coeficienteVarianza         = this.formExtras.controls['coeficienteVarianza'].value;

        extrasAplicables.montoExtras                = montoExtra ;

        extrasAplicables.porcentajeExtrasAplicables = porcentajeExtrasAplicable != null ? porcentajeExtrasAplicable : 0;
        extrasAplicables.desviacionEstandar         = desviacionEstandar        != null ? desviacionEstandar        : 0;
        extrasAplicables.coeficienteVarianza        = coeficienteVarianza       != null ? coeficienteVarianza       : 0;

        extrasAplicables.adicionadoPor = this.userObservable.identificacion;
        extrasAplicables.fechaAdicion = this.today;

        this.macredService.postExtrasAplicables(extrasAplicables)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this.alertService.success( `sucess.` );

                } else {
                    let message : string = 'Problemas al registrar el Análisis de Capacidad de Pago.';
                    this.alertService.error(message);
                }
            } ,
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
    }
}


