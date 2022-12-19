import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { User, Module } from '@app/_models';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../../../_models/modules/compania';
import { MacredService } from '@app/_services/macred.service';
import { ScreenAccessUser } from '@app/_models/admin/screenAccessUser';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MacPersona } from '@app/_models/Macred/Persona';
import { MacTipoIngresoAnalisis } from '@app/_models/Macred/TipoIngresoAnalisis';
import { MacTipoFormaPagoAnalisis } from '@app/_models/Macred/TipoFormaPagoAnalisis';
import { MacTiposMoneda } from '@app/_models/Macred/TiposMoneda';
import { MacModeloAnalisis } from '@app/_models/Macred/ModeloAnalisis';
import { MacNivelCapacidadPago } from '@app/_models/Macred/NivelCapacidadPago';
import { MacTipoGenerador } from '@app/_models/Macred/TipoGenerador';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';
import { MacEstadoCivil } from '@app/_models/Macred/MacEstadoCivil';
import { MacTipoPersona } from '@app/_models/Macred/TipoPersona';
import { MacTipoGenero } from '@app/_models/Macred/TipoGenero';
import { MacCondicionLaboral } from '@app/_models/Macred/CondicionLaboral';
import { MacCategoriaCredito } from '@app/_models/Macred/CategoriaCredito';
import { MacTipoAsociado } from '@app/_models/Macred/TipoAsociado';
import { MacTipoHabitacion } from '@app/_models/Macred/TipoHabitacion';

declare var $: any;

@Component({
    templateUrl: 'HTML_Personas.html',
    styleUrls: ['../../../../../assets/scss/app.scss',
                '../../../../../assets/scss/macred/app.scss'],
})
export class PersonasComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    nombrePantalla : string = 'datos-personas.html';

    _globalCodMonedaPrincipal : number ;
    _personaMacred : MacPersona;


    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    submittedPersonForm : boolean = false;
    
    // Personas
    formPersona: FormGroup;
    formPersonaList: FormGroup;
    listPersonas: MacPersona[];
    showList : boolean = false;

    // Estados Civiles
    listEstadosCiviles: MacEstadoCivil[];

    // Tipo Persona
    listTiposPersonas: MacTipoPersona[];

    // Tipo Genero
    listTiposGeneros: MacTipoGenero[];

    // Condicion Laboral
    listCondicionesLaborales: MacCondicionLaboral[];

    // Categoria Credito
    listCategoriasCreditos: MacCategoriaCredito[];

    // Tipo Asociado
    listTiposAsociados: MacTipoAsociado[];

    // Tipo Habitacion
    listTiposHabitaciones: MacTipoHabitacion[];

    submitted : boolean = false;
    update : boolean = false;
    add : boolean = false;
    delete : boolean = false;

    buttomText : string = '';

    public today = new Date();

    tipoActualizacion : string; // P - Persona, C - Info Credito, N - Nuevo registro

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

    ngOnInit() {

        this.formPersona = this.formBuilder.group({
            id              : [null],
            nombre          : [null],
            primerApellido  : [null],
            segundoApellido : [null],
            identificacion  : [null, Validators.required],
            codigoCliente   : [null],
            fechaNacimiento : [null],
            estadoCivil     : [null],
            codigoTipoPersona : [null],
            codigoGenero : [null],
            codigoCondicionLaboral : [null],
            cantidadHijos: [null],
            estado : [null],
            indAsociado : [null],

            // Información Crediticia
            cantidadFianzas : [null],
            tiempoAfiliacion : [null],
            cantidadCreditosHistorico : [null],
            totalSaldoFianzas : [null],
            totalCuotasFianzas : [null],
            cPH : [null],
            cPHUltimos12Meses : [null],
            cPHUltimos24Meses : [null],
            atrasoMaximo : [null],
            atrasosUltimos12Meses : [null],
            atrasosUltimos24Meses : [null],
            diasAtrasoCorte : [null],

            codigoCategoriaCredito : [null],
            codigoTipoAsociado : [null],
            codigoTipoHabitacion : [null]

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

            });

            this.consultaPersonasCompania();
    }

    get f() { return this.formPersona.controls; }

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

                    this._personaMacred = response;

                    this.formPersona = this.formBuilder.group({
                        id                      : [this._personaMacred.id,              Validators.required],
                        nombre                  : [this._personaMacred.nombre,          Validators.required],
                        primerApellido          : [this._personaMacred.primerApellido,  Validators.required],
                        segundoApellido         : [this._personaMacred.segundoApellido, Validators.required],
                        identificacion          : [this._personaMacred.identificacion,  Validators.required],
                        fechaNacimiento         : [this._personaMacred.fechaNacimiento, Validators.required],
                        estadoCivil             : [this._personaMacred.codigoEstadoCivil, Validators.required],
                        codigoTipoPersona       : [this._personaMacred.codigoTipoPersona, Validators.required],
                        codigoGenero            : [this._personaMacred.codigoGenero, Validators.required],
                        cantidadHijos           : [this._personaMacred.cantidadHijos, Validators.required],
                        codigoCondicionLaboral  : [this._personaMacred.codigoCondicionLaboral, Validators.required],
                        estado                  : [this._personaMacred.estado],
                        indAsociado             : [this._personaMacred.indAsociado],

                        // Información Crediticia
                        cantidadFianzas             : [this._personaMacred.cantidadFianzas],
                        tiempoAfiliacion            : [this._personaMacred.tiempoAfiliacion],
                        cantidadCreditosHistorico   : [this._personaMacred.cantidadCreditosHistorico],
                        totalSaldoFianzas           : [this._personaMacred.totalSaldoFianzas],
                        totalCuotasFianzas          : [this._personaMacred.totalCuotasFianzas],
                        cPH                         : [this._personaMacred.cPH],
                        cPHUltimos12Meses           : [this._personaMacred.cPHUltimos12Meses],
                        cPHUltimos24Meses           : [this._personaMacred.cPHUltimos24Meses],
                        atrasoMaximo                : [this._personaMacred.atrasoMaximo],
                        atrasosUltimos12Meses       : [this._personaMacred.atrasosUltimos12Meses],
                        atrasosUltimos24Meses       : [this._personaMacred.atrasosUltimos24Meses],
                        diasAtrasoCorte             : [this._personaMacred.diasAtrasoCorte],

                        codigoCategoriaCredito      : [this._personaMacred.codigoCategoriaCredito],
                        codigoTipoAsociado          : [this._personaMacred.codigoTipoAsociado],
                        codigoTipoHabitacion        : [this._personaMacred.codigoTipoHabitacion, Validators.required]
                    });

                    this.showList = true;
                    this.listPersonas.length = 0;
                    this.listPersonas.push(this._personaMacred);
                }
            },
            error => {
                let message : string = 'Problemas al consultar la persona. Detalle: ' + error;
                this.alertService.error(message);
            });
    }

    consultaPersonasCompania() : void {
        this.formPersonaList = this.formBuilder.group({
            id              : [''],
            nombre          : [''],
            primerApellido  : [''],
            segundoApellido : [''],
            identificacion  : [''],
            codigoCliente   : [''],
            fechaNacimiento : [''],
            estadoCivil     : [''],
            codigoTipoPersona : [''],
            codigoGenero : [''],
            cantidadHijos : [''],
            codigoCondicionLaboral : [''],
            estado : [''],
            indAsociado : [''],

            // Información Crediticia
            cantidadFianzas : [''],
            tiempoAfiliacion : [''],
            cantidadCreditosHistorico : [''],
            totalSaldoFianzas : [''],
            totalCuotasFianzas : [''],
            cPH : [''],
            cPHUltimos12Meses : [''],
            cPHUltimos24Meses : [''],
            atrasoMaximo : [''],
            atrasosUltimos12Meses : [''],
            atrasosUltimos24Meses : [''],
            diasAtrasoCorte : [''],

            codigoCategoriaCredito : [''],
            codigoTipoAsociado : [''],
            codigoTipoHabitacion : ['']
        });

        this.macredService.getPersonasCompania(this.userObservable.empresa)
        .pipe(first())
        .subscribe(personaResponse => {

            if (personaResponse.length > 0) {
                this.showList = true;
                this.listPersonas = personaResponse;
            }
        },
        error => {
            let message : string = 'Problemas al consultar las personas. ' + error;
            this.alertService.error(message); 
        });
    }

    consultaEstadosCivilesCompania() : void {

        this.macredService.getEstadosCivilesCompania(this.userObservable.empresa)
        .pipe(first())
        .subscribe(estadoCivilResponse => {

            if (estadoCivilResponse.length > 0) {
                this.showList = true;
                this.listEstadosCiviles = estadoCivilResponse;
            }
        },
        error => {
            let message : string = 'Problemas al consultar los estados civiles. ' + error;
            this.alertService.error(message); 
        });
    }

    consultaTiposPersonasCompania() : void {

        this.macredService.getTiposPersonasCompania(this.userObservable.empresa)
        .pipe(first())
        .subscribe(tipoPersonaResponse => {

            if (tipoPersonaResponse.length > 0) {
                this.showList = true;
                this.listTiposPersonas = tipoPersonaResponse;
            }
        },
        error => {
            let message : string = 'Problemas al consultar los tipos de personas. ' + error;
            this.alertService.error(message); 
        });
    }

    consultaTiposGenerosCompania() : void {

        this.macredService.getTiposGenerosCompania(this.userObservable.empresa)
        .pipe(first())
        .subscribe(tipoGeneroResponse => {

            if (tipoGeneroResponse.length > 0) {
                this.showList = true;
                this.listTiposGeneros = tipoGeneroResponse;
            }
        },
        error => {
            let message : string = 'Problemas al consultar los tipos de generos. ' + error;
            this.alertService.error(message); 
        });
    }

    consultaCondicionesLaboralesCompania() : void {

        this.macredService.getCondicionesLaboralesCompania(this.userObservable.empresa)
        .pipe(first())
        .subscribe(condicionLaboralResponse => {

            if (condicionLaboralResponse.length > 0) {
                this.showList = true;
                this.listCondicionesLaborales = condicionLaboralResponse;
            }
        },
        error => {
            let message : string = 'Problemas al consultar las condiciones laborales. ' + error;
            this.alertService.error(message); 
        });
    }

    consultaCategoriasCreditosCompania() : void {

        this.macredService.getCategoriasCreditosCompania(this.userObservable.empresa)
        .pipe(first())
        .subscribe(categoriaCreditoResponse => {

            if (categoriaCreditoResponse.length > 0) {
                this.showList = true;
                this.listCategoriasCreditos = categoriaCreditoResponse;
            }
        },
        error => {
            let message : string = 'Problemas al consultar las categorias de créditos. ' + error;
            this.alertService.error(message); 
        });
    }

    consultaTiposAsociadoCompania() : void {

        this.macredService.getTiposAsociadosCompania(this.userObservable.empresa)
        .pipe(first())
        .subscribe(tipoAsociadoResponse => {

            if (tipoAsociadoResponse.length > 0) {
                this.showList = true;
                this.listTiposAsociados = tipoAsociadoResponse;
            }
        },
        error => {
            let message : string = 'Problemas al consultar los tipos de asociados. ' + error;
            this.alertService.error(message); 
        });
    }

    consultaTiposHabitacionesCompania() : void {

        this.macredService.getTiposHabitacionesCompania(this.userObservable.empresa)
        .pipe(first())
        .subscribe(tipoHabitacionResponse => {

            if (tipoHabitacionResponse.length > 0) {
                this.showList = true;
                this.listTiposHabitaciones = tipoHabitacionResponse;
            }
        },
        error => {
            let message : string = 'Problemas al consultar los tipos de habitaciones. ' + error;
            this.alertService.error(message); 
        });
    }

    editPersonaModal(persona:MacPersona) : void {

        this.update = true;
        this.buttomText = 'Actualizar';
        this.tipoActualizacion = 'P';

        this.consultaEstadosCivilesCompania();
        this.consultaTiposPersonasCompania();
        this.consultaTiposGenerosCompania();
        this.consultaCondicionesLaboralesCompania();
        this.consultaTiposHabitacionesCompania();

        this._personaMacred = persona;
        
        this.formPersona = this.formBuilder.group({
            identificacion: [persona.identificacion, Validators.required],
            nombre: [persona.nombre, Validators.required],
            primerApellido: [persona.primerApellido, Validators.required],
            segundoApellido: [persona.segundoApellido, Validators.required],
            fechaNacimiento: [persona.fechaNacimiento, Validators.required],
            estadoCivil     : [persona.codigoEstadoCivil, Validators.required],
            codigoTipoPersona : [persona.codigoTipoPersona, Validators.required],
            codigoGenero : [persona.codigoGenero, Validators.required],
            cantidadHijos : [persona.cantidadHijos, Validators.required],
            codigoCondicionLaboral : [persona.codigoCondicionLaboral, Validators.required],
            codigoTipoHabitacion : [persona.codigoTipoHabitacion, Validators.required],
            estado : [persona.estado],
            indAsociado : [persona.indAsociado]
        });

        $('#personaModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    editInformacionCrediticiaModal(persona:MacPersona) : void {

        this.update = true;
        this.buttomText = 'Actualizar';
        this.tipoActualizacion = 'C';

        this.consultaCategoriasCreditosCompania();
        this.consultaTiposAsociadoCompania();

        this._personaMacred = persona;
        
        this.formPersona = this.formBuilder.group({
            identificacion: [persona.identificacion, Validators.required],
            nombre: [persona.nombre, Validators.required],
            primerApellido: [persona.primerApellido, Validators.required],
            segundoApellido: [persona.segundoApellido, Validators.required],
            
            // Información Crediticia
            cantidadFianzas             : [persona.cantidadFianzas],
            tiempoAfiliacion            : [persona.tiempoAfiliacion],
            cantidadCreditosHistorico   : [persona.cantidadCreditosHistorico],
            totalSaldoFianzas           : [persona.totalSaldoFianzas],
            totalCuotasFianzas          : [persona.totalCuotasFianzas],
            cPH                         : [persona.cPH],
            cPHUltimos12Meses           : [persona.cPHUltimos12Meses],
            cPHUltimos24Meses           : [persona.cPHUltimos24Meses],
            atrasoMaximo                : [persona.atrasoMaximo],
            atrasosUltimos12Meses       : [persona.atrasosUltimos12Meses],
            atrasosUltimos24Meses       : [persona.atrasosUltimos24Meses],
            diasAtrasoCorte             : [persona.diasAtrasoCorte],

            codigoCategoriaCredito      : [persona.codigoCategoriaCredito],
            codigoTipoAsociado          : [persona.codigoTipoAsociado]
        });

        $('#infoCreiditiciaModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    openInformacionCrediticiaModal() : void {
        $('#infoCreiditiciaModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    SubmitPerson() : void {

        this.alertService.clear();
        this.cargaInformacionPersona(); 
    }

    addPersona() : void {
        this.alertService.clear();
        this.ngOnInit();
        this.add = true;
        this.tipoActualizacion = 'N'

        this.consultaEstadosCivilesCompania();
        this.consultaTiposPersonasCompania();
        this.consultaTiposGenerosCompania();
        this.consultaCondicionesLaboralesCompania();
        this.consultaTiposHabitacionesCompania();

        $('#personaModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    deletePersona(idPersona:number){

        this.macredService.deletePersona(idPersona)
            .pipe(first())
            .subscribe(response => {

                if (response) {
                    this.alertService.success(
                        `Persona eliminada correctamente!`
                    );
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al eliminar la persona.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
    }

    guardarPersona() : void {

        this.alertService.clear();
        this.submittedPersonForm = true;

        if ( this.formPersona.invalid ){
            return;
        }
        
        var persona : MacPersona;
        if (this.tipoActualizacion == 'N'){
            persona = this.createPersonaForm();
            persona.codigoCompania = this.userObservable.empresa;
            persona.adicionadoPor      = this.userObservable.identificacion;
            persona.fechaAdicion  = this.today;

            this.macredService.postPersona(persona)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._personaMacred = response;

                    this.alertService.success(
                        `Persona ${ this._personaMacred.identificacion } guardado correctamente!`
                    );
                    $('#personaModal').modal('hide');
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al registrar la persona.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });

        } else {
            if (this.tipoActualizacion == 'P') {
                persona = this.updatePersonaModal();  
            } else if (this.tipoActualizacion = 'C') {
                persona = this.updateCreditoModal();
            }
            persona.modificadoPor      = this.userObservable.identificacion;
            persona.fechaModificacion  = this.today;

            this.macredService.putPersona(persona)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._personaMacred = response;

                    this.alertService.success(
                        `Persona ${ this._personaMacred.identificacion } actualizada correctamente!`
                    );
                    if (this.tipoActualizacion == 'P') {
                        $('#personaModal').modal('hide'); 
                    } else if (this.tipoActualizacion = 'C') {
                        $('#infoCreiditiciaModal').modal('hide');
                    }
                    
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al actualizar la persona.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
        }
    }

    createPersonaForm() : MacPersona {
        

        //var codigoCompania = this.userObservable.empresa;
        var identificacion = this.formPersona.controls['identificacion'].value;
        var nombre = this.formPersona.controls['nombre'].value;
        var primerApellido = this.formPersona.controls['primerApellido'].value;
        var segundoApellido = this.formPersona.controls['segundoApellido'].value;
        var estadoCivil = this.formPersona.controls['estadoCivil'].value;
        var codigoTipoPersona = this.formPersona.controls['codigoTipoPersona'].value;
        var codigoGenero = this.formPersona.controls['codigoGenero'].value;
        var condicionLaboral = this.formPersona.controls['codigoCondicionLaboral'].value;
        var cantidadHijos = this.formPersona.controls['cantidadHijos'].value;
        var fechaNacimiento = this.formPersona.controls['fechaNacimiento'].value;
        var codigoTipoHabitacion = this.formPersona.controls['codigoTipoHabitacion'].value;
        var estado = this.formPersona.controls['estado'].value;

        var indicaAsociado = this.formPersona.controls['indAsociado'].value;
        var edad = 0;
        var datoProvincia = 0;
        var perMediosPago = 0;
        var perSegmentoAsociado = 0;
        var perMontoAprobado = 0;
        var perEndeudamientoTotal = 0;
        var perAnioAfiliacion = 0;
        var codigoCategoriaCredito = 1;

        var persona = new MacPersona();

        //persona.codigoCompania = codigoCompania;
        persona.identificacion = identificacion;
        persona.nombre = nombre;
        persona.primerApellido = primerApellido;
        persona.segundoApellido = segundoApellido;
        persona.codigoEstadoCivil = estadoCivil;
        persona.codigoTipoPersona = codigoTipoPersona;
        persona.codigoGenero = codigoGenero;
        persona.codigoCondicionLaboral = condicionLaboral;
        persona.cantidadHijos = cantidadHijos;
        persona.fechaNacimiento = fechaNacimiento;
        persona.codigoTipoHabitacion = codigoTipoHabitacion;
        persona.estado = estado;

        persona.indAsociado = indicaAsociado;
        persona.edad = edad;
        persona.codigoTipoHabitacion = codigoTipoHabitacion;
        persona.datoProvincia = datoProvincia;
        persona.perMediosPago = perMediosPago;
        persona.perSegmentoAsociado = perSegmentoAsociado;
        persona.perMontoAprobado = perMontoAprobado;
        persona.perEndeudamientoTotal = perEndeudamientoTotal;
        persona.perAnioAfiliacion = perAnioAfiliacion;
        persona.codigoCategoriaCredito = codigoCategoriaCredito;

        return persona;
    }

    updatePersonaModal() : MacPersona {

        var identificacion = this.formPersona.controls['identificacion'].value;
        var nombre = this.formPersona.controls['nombre'].value;
        var primerApellido = this.formPersona.controls['primerApellido'].value;
        var segundoApellido = this.formPersona.controls['segundoApellido'].value;
        var estadoCivil = this.formPersona.controls['estadoCivil'].value;
        var codigoTipoPersona = this.formPersona.controls['codigoTipoPersona'].value;
        var codigoGenero = this.formPersona.controls['codigoGenero'].value;
        var condicionLaboral = this.formPersona.controls['codigoCondicionLaboral'].value;
        var cantidadHijos = this.formPersona.controls['cantidadHijos'].value;
        var fechaNacimiento = this.formPersona.controls['fechaNacimiento'].value;
        var codigoTipoHabitacion = this.formPersona.controls['codigoTipoHabitacion'].value;
        var estado = this.formPersona.controls['estado'].value;
        var indicaAsociado = this.formPersona.controls['indAsociado'].value;


        var persona = this._personaMacred;

        persona.identificacion = identificacion;
        persona.nombre = nombre;
        persona.primerApellido = primerApellido;
        persona.segundoApellido = segundoApellido;
        persona.codigoEstadoCivil = estadoCivil;
        persona.codigoTipoPersona = codigoTipoPersona;
        persona.codigoGenero = codigoGenero;
        persona.codigoCondicionLaboral = condicionLaboral;
        persona.cantidadHijos = cantidadHijos;
        persona.fechaNacimiento = fechaNacimiento;
        persona.codigoTipoHabitacion = codigoTipoHabitacion;
        persona.estado = estado;
        persona.indAsociado = indicaAsociado;

        return persona;
    }


    updateCreditoModal() : MacPersona {

        var cantidadFianzas = this.formPersona.controls['cantidadFianzas'].value;
        var tiempoAfiliacion = this.formPersona.controls['tiempoAfiliacion'].value;
        var cantidadCreditosHistorico = this.formPersona.controls['cantidadCreditosHistorico'].value;
        var totalSaldoFianzas = this.formPersona.controls['totalSaldoFianzas'].value;
        var totalCuotasFianzas = this.formPersona.controls['totalCuotasFianzas'].value;
        var cPH = this.formPersona.controls['cPH'].value;
        var cPHUltimos12Meses = this.formPersona.controls['cPHUltimos12Meses'].value;
        var cPHUltimos24Meses = this.formPersona.controls['cPHUltimos24Meses'].value;
        var atrasoMaximo = this.formPersona.controls['atrasoMaximo'].value;
        var atrasosUltimos12Meses = this.formPersona.controls['atrasosUltimos12Meses'].value;
        var atrasosUltimos24Meses = this.formPersona.controls['atrasosUltimos24Meses'].value;
        var diasAtrasoCorte = this.formPersona.controls['diasAtrasoCorte'].value;
        var codigoCategoriaCredito = this.formPersona.controls['codigoCategoriaCredito'].value;
        var codigoTipoAsociado = this.formPersona.controls['codigoTipoAsociado'].value;

        var persona = this._personaMacred;

        persona.cantidadFianzas = cantidadFianzas;
        persona.tiempoAfiliacion = tiempoAfiliacion;
        persona.cantidadCreditosHistorico = cantidadCreditosHistorico;
        persona.totalSaldoFianzas = totalSaldoFianzas;
        persona.totalCuotasFianzas = totalCuotasFianzas;
        persona.cPH = cPH;
        persona.cPHUltimos12Meses = cPHUltimos12Meses;
        persona.cPHUltimos24Meses = cPHUltimos24Meses;
        persona.atrasoMaximo = atrasoMaximo;
        persona.atrasosUltimos12Meses = atrasosUltimos12Meses;
        persona.atrasosUltimos24Meses = atrasosUltimos24Meses;
        persona.diasAtrasoCorte = diasAtrasoCorte;
        persona.codigoCategoriaCredito = codigoCategoriaCredito;
        persona.codigoTipoAsociado = codigoTipoAsociado;
        

        return persona;
    }

    
}