import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { User, Module } from '@app/_models';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../../_models/modules/compania';
import { MacredService } from '@app/_services/macred.service';
import { ScreenAccessUser } from '@app/_models/admin/screenAccessUser';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MacPersona } from '@app/_models/Macred/Persona';
import { MacTipoIngresoAnalisis } from '@app/_models/Macred/TipoIngresoAnalisis';
import { MacTipoFormaPagoAnalisis } from '@app/_models/Macred/TipoFormaPagoAnalisis';
import { MacAnalisisCapacidadPago } from '@app/_models/Macred/AnalisisCapacidadPago';
import { MacTiposMoneda } from '@app/_models/Macred/TiposMoneda';
import { MacModeloAnalisis } from '@app/_models/Macred/ModeloAnalisis';
import { MacNivelCapacidadPago } from '@app/_models/Macred/NivelCapacidadPago';
import { MacTipoGenerador } from '@app/_models/Macred/TipoGenerador';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';

declare var $: any;

@Component({
    templateUrl: 'HTML_Asociados.html',
    styleUrls: ['../../../../assets/scss/macred/app.scss'],
})
export class AsociadosComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    nombrePantalla : string = 'CalificacionAsociados.html';

    _globalCodMonedaPrincipal : number ;

    _analisisCapacidadpago : MacAnalisisCapacidadPago;
    _personaMacred : MacPersona = null;


    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    submittedPersonForm : boolean = false;
    submittedDatosAnalisisHeaderForm : boolean = false;

    datosAnalisis : boolean = false;
    flujoCaja : boolean = false;
    pd : boolean = false;
    scoring : boolean = false;
    ingresos : boolean = false;
    obligacionesSupervisadas : boolean = false;
    oNoSupervisadas : boolean = false;
    lvt : boolean = false;
    escenarios : boolean = false;
    escenariosFcl : boolean = false;

    habilitaBtnIngreso : boolean = false;
    habilitaBtnHistoprialIngreso: boolean = true;
    habilitaBtnRegistroDeudor: boolean = false;

    public listSubMenu: Module[] = [];
    public menuItem : Module = null;

    habilitaBtnGeneraNuevoAnalisis : boolean = true;

    listScreenAccessUser: ScreenAccessUser[];

    listTipoIngresoAnalisis: MacTipoIngresoAnalisis[];
    listTipoFormaPagoAnalisis: MacTipoFormaPagoAnalisis[];
    listTiposMonedas: MacTiposMoneda[];
    listModelosAnalisis: MacModeloAnalisis[];
    listNivelesCapacidadpago: MacNivelCapacidadPago[];
    listTiposGeneradores: MacTipoGenerador[];

    formPersona: FormGroup;
    formDatosAnalisisHeader: FormGroup;

    public today = new Date();

    constructor (private formBuilder: FormBuilder,
                 private macredService: MacredService,
                 private accountService: AccountService,
                 private alertService: AlertService,
                 private router: Router,
                 public dialogo: MatDialog)
    {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue;
    }

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

            // datos análisis
            case 1:     this.datosAnalisis = true;

                break;
            // flujo de caja libre
            case 2:
            this.flujoCaja = true;
                break;
            // probability of default
            case 3:
            this.pd = true;
                break;
            // scoring crediticio
            case 4:
            this.scoring = true;
                break;

            // ingresos
            case 5: this.ingresos = true;
                break;


            // obligaciones supervisadas
            case 6:
            this.obligacionesSupervisadas = true;
                break;
            // obligaciones no supervisadas
            case 7:
            this.oNoSupervisadas = true;
                break;
            // lvt
            case 8:
            this.lvt = true;
                break;
            // escenarios
            case 9:
            this.escenarios = true;
                break;
            // escenarios fcl
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
            identificacion  : [null, Validators.required],
            codigoCliente   : [null]
        });
        this.formDatosAnalisisHeader = this.formBuilder.group({
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

        this.accountService.validateAccessUser( this.userObservable.id,
                                                this.moduleObservable.id,
                                                this.nombrePantalla,
                                                this.companiaObservable.id )
            .pipe(first())
            .subscribe(response => {

                // ## -->> redirecciona NO ACCESO
                if(!response.exito)
                    this.router.navigate([this.moduleObservable.indexHTTP]);

                this.macredService.GetParametroGeneralVal1(this.companiaObservable.id, 'COD_MONEDA_PRINCIPAL', true)
                    .pipe(first())
                    .subscribe(response => { this._globalCodMonedaPrincipal = +response; });

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

    get f() { return this.formPersona.controls; }
    get g() { return this.formDatosAnalisisHeader.controls; }


    cargaInformacionPersona() : void {

        this.submittedPersonForm = true;

        if (this.formPersona.invalid)
            return;

        let persona = new MacPersona();
        persona.identificacion = this.formPersona.controls['identificacion'].value;

        this.macredService.getPersonaMacred(persona.identificacion, this.companiaObservable.id)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    if (this._personaMacred == null) {
                        this.habilitarItemSubMenu(new Module(   1,
                                                                'Datos de Anláisis',
                                                                'Datos de Anláisis',
                                                                'Datos de Anláisis',
                                                                'A',
                                                                '.png',
                                                                '.ico',
                                                                'http'));
                    }
                    this._personaMacred = response;

                    this.formPersona = this.formBuilder.group({
                        id              : [this._personaMacred.id,               Validators.required],
                        nombre          : [this._personaMacred.nombre,           Validators.required],
                        primerApellido  : [this._personaMacred.primerApellido,   Validators.required],
                        segundoApellido : [this._personaMacred.segundoApellido,  Validators.required],
                        identificacion  : [this._personaMacred.identificacion,   Validators.required],
                        codigoCliente   : [this._personaMacred.codigoPersona,       Validators.required]
                    });

                    this.formDatosAnalisisHeader = this.formBuilder.group({
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
                }
            },
            error => {
                let message : string = 'Problemas al consultar la persona. Detalle: ' + error;
                this.alertService.error(message);
            });
    }

    SubmitPerson() : void {

        this.alertService.clear();

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
                    this.habilitaBtnIngreso    = false;
                    
                    this.cargaInformacionPersona();
     
                } else { return; }
            });

        } else { this.cargaInformacionPersona(); }
    }

    SubmitNuevoAnalisis() : void {

        this.alertService.clear();

        this.submittedDatosAnalisisHeaderForm = true;

        if ( this.formDatosAnalisisHeader.invalid )
            return;

        if ( this._personaMacred == null ) {
            this._personaMacred = new MacPersona();
            this._personaMacred.id = 5;
        }

        var idTipoIngresoAnalisis   = this.formDatosAnalisisHeader.controls['tipoIngresoAnalisis'].value.id;
        var idTipoFormaPagoAnalisis = this.formDatosAnalisisHeader.controls['tipoFormaPagoAnalisis'].value.id;
        var idNivelCapacidadPago    = this.formDatosAnalisisHeader.controls['capacidadPago'].value.id;
        var idModeloAnalisis        = this.formDatosAnalisisHeader.controls['modeloAnalisis'].value.id;
        var idTipoMoneda            = this.formDatosAnalisisHeader.controls['tipoMoneda'].value.id;
        var idTipoGenerador         = this.formDatosAnalisisHeader.controls['tipoGenerador'].value.id;
        var estado                  = this.formDatosAnalisisHeader.controls['estado'].value;
        var analisisDefinitivo      = this.formDatosAnalisisHeader.controls['analisisDefinitivo'].value;
        var puntajeAnalisis         = this.formDatosAnalisisHeader.controls['puntajeAnalisis'].value;
        var calificacionCic         = this.formDatosAnalisisHeader.controls['calificacionCic'].value;
        var calificacionFinalCic    = this.formDatosAnalisisHeader.controls['calificacionFinalCic'].value;
        var indicadorCsd            = this.formDatosAnalisisHeader.controls['indicadorCsd'].value;
        var ponderacionLvt          = this.formDatosAnalisisHeader.controls['ponderacionLvt'].value;
        var numeroDependientes      = this.formDatosAnalisisHeader.controls['numeroDependientes'].value;
        var observaciones           = this.formDatosAnalisisHeader.controls['observaciones'].value;

        var ancapCapPago            = 0.00;
        var ancapCalificacionFinal  = 0.00;
        var ancapPuntajeFinal       = 0.00;

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

        this.macredService.postAnalisisCapPago(analisis)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._analisisCapacidadpago = response;

                    this.habilitaBtnGeneraNuevoAnalisis = false;
                    this.habilitaBtnIngreso    = true;

                    // this.formDatosAnalisisHeader = this.formBuilder.group({
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

                    this.habilitarItemSubMenu(new Module(5, 'Ingresos', 'Ingresos', 'Ingresos', 'A', '.png', '.ico', 'http'));

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

        if( this.listSubMenu.find( b => b.id == mod.id ) &&
            this.listSubMenu.find( b => b.id == mod.id ).estado != 'A' ) {

                this.listSubMenu.splice(this.listSubMenu.findIndex( b => b.id == mod.id ), 1);
        }
        this.listSubMenu.push(modTemp);
    }

    habilitaRegistrarIngreso() : void {}
}