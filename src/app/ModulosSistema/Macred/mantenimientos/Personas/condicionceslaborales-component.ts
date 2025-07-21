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
import { MacTipoPersona } from '@app/_models/Macred/TipoPersona';
import { MacTipoGenero } from '@app/_models/Macred/TipoGenero';
import { MacCondicionLaboral } from '@app/_models/Macred/CondicionLaboral';
import { MacCategoriaCredito } from '@app/_models/Macred/CategoriaCredito';
import { MacTipoAsociado } from '@app/_models/Macred/TipoAsociado';
import { MacTipoHabitacion } from '@app/_models/Macred/TipoHabitacion';
import { valHooks } from 'jquery';

declare var $: any;

@Component({
    templateUrl: 'HTML_CondicionesLaborales.html',
    styleUrls: ['../../../../../assets/scss/app.scss',
        '../../../../../assets/scss/macred/app.scss'],
    standalone: false
})
export class CondicionesLaboralesComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    nombrePantalla : string = 'condiciones-laborales.html';

    _condicionLaboralMacred : MacCondicionLaboral;

    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    submittedCondicionLaboralForm : boolean = false;

    // Condicion laboral
    formCondicionLaboral: UntypedFormGroup;
    formCondicionLaboralList: UntypedFormGroup;
    listCondicionesLaborales: MacCondicionLaboral[];
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

        this.formCondicionLaboral = this.formBuilder.group({
            id                      : [null],
            codigoCondicionLaboral  : [null],
            codigoCompania          : [null],
            descripcion             : [null],
            estado                  : [null]

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

            this.consultaCondicionesLaboralesCompania();
    }

    get f() { return this.formCondicionLaboral.controls; }


    consultaCondicionesLaboralesCompania() : void {
        this.formCondicionLaboralList = this.formBuilder.group({
            id                      : [''],
            codigoCondicionLaboral  : [''],
            codigoCompania          : [''],
            descripcion             : [''],
            estado                  : ['']
        });

        this.macredService.getCondicionesLaboralesCompania(this.userObservable.empresa)
        .pipe(first())
        .subscribe(condicionLaboralResponse => {

            if (condicionLaboralResponse.length > 0) {
                this.showList = true;
                this.listCondicionesLaborales = condicionLaboralResponse;
            }
        },
        error => {
            let message : string = 'Problemas al consultar los tipos de personas. ' + error;
            this.alertService.error(message);
        });
    }

    addCondicionLaboral() : void {
        this.alertService.clear();
        this.ngOnInit();
        this.add = true;
        this.tipoMovimiento = 'N'
        this._condicionLaboralMacred =  new MacCondicionLaboral;

        $('#condicionLaboralModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    editCondicionLaboral(condicionLaboral:MacCondicionLaboral) : void {

        this.update = true;
        this.buttomText = 'Actualizar';
        this.tipoMovimiento = 'E';

        this._condicionLaboralMacred = condicionLaboral;

        this.formCondicionLaboral = this.formBuilder.group({
            id: [condicionLaboral.id,Validators.required],
            codigoCondicionLaboral : [condicionLaboral.codigoCondicionLaboral,Validators.required],
            descripcion : [condicionLaboral.descripcion,Validators.required],
            estado : [condicionLaboral.estado,Validators.required]
        });

        $('#condicionLaboralModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    guardarCondicionLaboral() : void {

        this.alertService.clear();
        this.submittedCondicionLaboralForm = true;

        if ( this.formCondicionLaboral.invalid ){
            return;
        }

        var condicionLaboral : MacCondicionLaboral;
        condicionLaboral = this.createCondicionLaboralModal();

        if (this.tipoMovimiento == 'N'){
            condicionLaboral.codigoCompania = this.userObservable.empresa;
            condicionLaboral.adicionadoPor  = this.userObservable.identificacion;
            condicionLaboral.fechaAdicion   = this.today;

            this.macredService.postCondicionLaboral(condicionLaboral)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._condicionLaboralMacred = response;

                    this.alertService.success(
                        `Condición laboral ${ this._condicionLaboralMacred.codigoCondicionLaboral } guardada correctamente!`
                    );
                    $('#condicionLaboralModal').modal('hide');
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al registrar la condición laboral.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });

        }
        else if (this.tipoMovimiento == 'E') {
            condicionLaboral.modificadoPor      = this.userObservable.identificacion;
            condicionLaboral.fechaModificacion  = this.today;

            this.macredService.putCondicionLaboral(condicionLaboral)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._condicionLaboralMacred = response;

                    this.alertService.success(
                        `Condición laboral ${ this._condicionLaboralMacred.codigoCondicionLaboral } actualizada correctamente!`
                    );
                    $('#condicionLaboralModal').modal('hide');
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al actualizar la condición laboral.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
        }
    }

    createCondicionLaboralModal() : MacCondicionLaboral {

        var codigoCondicionLaboral  = this.formCondicionLaboral.controls['codigoCondicionLaboral'].value;
        var descripcion             = this.formCondicionLaboral.controls['descripcion'].value;
        var estado                  = this.formCondicionLaboral.controls['estado'].value


        var condicionLaboral = this._condicionLaboralMacred;

        condicionLaboral.codigoCondicionLaboral = codigoCondicionLaboral;
        condicionLaboral.descripcion            = descripcion;
        condicionLaboral.estado                 = estado;

        return condicionLaboral;
    }

    deleteCondicionLaboral(idCondicionLaboral:number){

        this.macredService.deleteCondicionLaboral(idCondicionLaboral)
            .pipe(first())
            .subscribe(response => {

                if (response) {
                    this.alertService.success(
                        `Condición laboral eliminada correctamente!`
                    );
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al eliminar la condición laboral.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
    }

}
