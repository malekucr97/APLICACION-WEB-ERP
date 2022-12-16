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


    habilitaBtnIngreso : boolean = false;
    habilitaBtnHistoprialIngreso: boolean = true;
    habilitaBtnRegistroDeudor: boolean = false;

    public listSubMenu: Module[] = [];
    public menuItem : Module = null;

    habilitaBtnGeneraNuevoAnalisis : boolean = true;

    listScreenAccessUser: ScreenAccessUser[];

    
    // Personas
    formPersona: FormGroup;
    formPersonaList: FormGroup;
    listPersonas: MacPersona[];
    showList : boolean = false;

    // Estados Civiles
    formEstadoCivil: FormGroup;
    formEstadoCivilList: FormGroup;
    listEstadosCiviles: MacEstadoCivil[];



    listIngresosAnalisis : MacEstadoCivil[];

    submitted : boolean = false;
    update : boolean = false;
    add : boolean = false;
    delete : boolean = false;

    buttomText : string = '';

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
            estadoCivil     : [null]
        });
        this.formEstadoCivil = this.formBuilder.group({
            id                  : [null],
            codigoEstadoCivil   : [null],
            descripcion         : [null]
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
    get e() { return this.formEstadoCivil.controls; }

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
                        id              : [this._personaMacred.id,              Validators.required],
                        nombre          : [this._personaMacred.nombre,          Validators.required],
                        primerApellido  : [this._personaMacred.primerApellido,  Validators.required],
                        segundoApellido : [this._personaMacred.segundoApellido, Validators.required],
                        identificacion  : [this._personaMacred.identificacion,  Validators.required],
                        fechaNacimiento : [this._personaMacred.fechaNacimiento, Validators.required],
                        estadoCivil     : [this._personaMacred.codigoEstadoCivil, Validators.required]
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
            estadoCivil     : ['']
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
        this.formEstadoCivilList = this.formBuilder.group({
            id                  : [''],
            codigoEstadoCivil   : [''],
            Descripcion         : ['']
        });

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

    onEdit(persona:MacPersona) : void {

        this.update = true;
        this.buttomText = 'Actualizar';

        this.formPersona = this.formBuilder.group({
            nombre: [persona.nombre, Validators.required],
            primerApellido: [persona.primerApellido, Validators.required],
            segundoApellido: [persona.segundoApellido, Validators.required],
            fechaNacimiento: [persona.fechaNacimiento, Validators.required]
            //segundoApellido: [persona.segundoApellido, Validators.required]
        });

        this.consultaEstadosCivilesCompania();

        $('#personaModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    openPersonaModal() : void {

        // this.add = true;
        // this.buttomText = 'Registrar';

        // this.groupForm = this.formBuilder.group({
        //     descripcionGrupo: ['', Validators.required],
        //     estado: ['A', Validators.required]
        // });

        $('#personaModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    SubmitPerson() : void {

        this.alertService.clear();
        this.cargaInformacionPersona(); 
    }

    habilitaRegistrarIngreso() : void {}
}