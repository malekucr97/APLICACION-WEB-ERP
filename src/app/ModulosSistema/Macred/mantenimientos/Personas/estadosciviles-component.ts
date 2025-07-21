import { UntypedFormBuilder, UntypedFormGroup, Validators  } from '@angular/forms';
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
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';
import { MacEstadoCivil } from '@app/_models/Macred/EstadoCivil';
import { MacTipoPersona } from '@app/_models/Macred/TipoPersona';
import { MacTipoGenero } from '@app/_models/Macred/TipoGenero';
import { MacCondicionLaboral } from '@app/_models/Macred/CondicionLaboral';
import { MacCategoriaCredito } from '@app/_models/Macred/CategoriaCredito';
import { MacTipoAsociado } from '@app/_models/Macred/TipoAsociado';
import { MacTipoHabitacion } from '@app/_models/Macred/TipoHabitacion';
import { valHooks } from 'jquery';

declare var $: any;

@Component({
    templateUrl: 'HTML_EstadosCiviles.html',
    styleUrls: ['../../../../../assets/scss/app.scss',
        '../../../../../assets/scss/macred/app.scss'],
    standalone: false
})
export class EstadosCivilesComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    nombrePantalla : string = 'estados-civiles.html';

    _estadoCivilMacred : MacEstadoCivil;

    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    submittedEstadoCivilForm : boolean = false;

    // Estados Civiles
    formEstadoCivil: UntypedFormGroup;
    formEstadoCivilList: UntypedFormGroup;
    listEstadosCiviles: MacEstadoCivil[];
    showList : boolean = false;

    submitted : boolean = false;
    update : boolean = false;
    add : boolean = false;
    delete : boolean = false;

    tipoMovimiento : string; // E - Editar, N - Nuevo registro

    buttomText : string = '';

    public today = new Date();

    constructor (private formBuilder: UntypedFormBuilder,
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

        this.formEstadoCivil = this.formBuilder.group({
            id                  : [null],
            codigoEstadoCivil   : [null],
            codigoCompania      : [null],
            descripcion         : [null],
            estado              : [null]

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

            });

            this.consultaEstadosCivilesCompania();
    }

    get f() { return this.formEstadoCivil.controls; }


    consultaEstadosCivilesCompania() : void {
        this.formEstadoCivilList = this.formBuilder.group({
            id                  : [''],
            codigoEstadoCivil   : [''],
            codigoCompania      : [''],
            descripcion         : [''],
            estado              : ['']
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

    addEstadoCivil() : void {
        this.alertService.clear();
        this.ngOnInit();
        this.add = true;
        this.tipoMovimiento = 'N'
        this._estadoCivilMacred =  new MacEstadoCivil;

        $('#estadoCivilModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    editEstadoCivil(estadoCivil:MacEstadoCivil) : void {

        this.update = true;
        this.buttomText = 'Actualizar';
        this.tipoMovimiento = 'E';

        this._estadoCivilMacred = estadoCivil;

        this.formEstadoCivil = this.formBuilder.group({
            id: [estadoCivil.id,Validators.required],
            codigoEstadoCivil : [estadoCivil.codigoEstadoCivil,Validators.required],
            descripcion : [estadoCivil.descripcion,Validators.required],
            estado : [estadoCivil.estado,Validators.required]
        });

        $('#estadoCivilModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    guardarEstadoCivil() : void {

        this.alertService.clear();
        this.submittedEstadoCivilForm = true;

        if ( this.formEstadoCivil.invalid ){
            return;
        }

        var estadoCivil : MacEstadoCivil;
        estadoCivil = this.createEstadoCivilModal();

        if (this.tipoMovimiento == 'N'){
            estadoCivil.codigoCompania = this.userObservable.empresa;
            estadoCivil.adicionadoPor  = this.userObservable.identificacion;
            estadoCivil.fechaAdicion   = this.today;

            this.macredService.postEstadoCivil(estadoCivil)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._estadoCivilMacred = response;

                    this.alertService.success(
                        `Estado civil ${ this._estadoCivilMacred.codigoEstadoCivil } guardado correctamente!`
                    );
                    $('#estadoCivilModal').modal('hide');
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al registrar el estado civil.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });

        }
        else if (this.tipoMovimiento == 'E') {
            estadoCivil.modificadoPor      = this.userObservable.identificacion;
            estadoCivil.fechaModificacion  = this.today;

            this.macredService.putEstadoCivil(estadoCivil)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._estadoCivilMacred = response;

                    this.alertService.success(
                        `Estado civil ${ this._estadoCivilMacred.codigoEstadoCivil } actualizado correctamente!`
                    );
                    $('#estadoCivilModal').modal('hide');
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al actualizar el estado civil.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
        }
    }

    createEstadoCivilModal() : MacEstadoCivil {

        var codigoEstadoCivil   = this.formEstadoCivil.controls['codigoEstadoCivil'].value;
        var descripcion         = this.formEstadoCivil.controls['descripcion'].value;
        var estado              = this.formEstadoCivil.controls['estado'].value


        var estadoCivil = this._estadoCivilMacred;

        estadoCivil.codigoEstadoCivil   = codigoEstadoCivil;
        estadoCivil.descripcion         = descripcion;
        estadoCivil.estado              = estado;

        return estadoCivil;
    }

    deleteEstadoCivil(idEstadoCivil:number){

        this.macredService.deleteEstadoCivil(idEstadoCivil)
            .pipe(first())
            .subscribe(response => {

                if (response) {
                    this.alertService.success(
                        `Estado civil eliminado correctamente!`
                    );
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al eliminar el estado civil.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
    }

}
