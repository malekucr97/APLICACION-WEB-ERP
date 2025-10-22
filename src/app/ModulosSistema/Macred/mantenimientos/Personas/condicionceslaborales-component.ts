import { UntypedFormBuilder, UntypedFormGroup, Validators  } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { User, Module } from '@app/_models';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../../../_models/modules/compania';
import { MacredService } from '@app/_services/macred.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MacCondicionLaboral } from '@app/_models/Macred/CondicionLaboral';

declare var $: any;

@Component({selector: 'app-condicion-laboral-macred',
            templateUrl: 'HTML_CondicionesLaborales.html',
            styleUrls: ['../../../../../assets/scss/app.scss', '../../../../../assets/scss/macred/app.scss'],
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
            estado                  : [false]

        });

        this.accountService.validateAccessUser( this.userObservable.id,
                                                this.moduleObservable.id,
                                                this.nombrePantalla,
                                                this.companiaObservable.id )
            .pipe(first())
            .subscribe(response => {

                // ## -->> redirecciona NO ACCESO
                if(!response.exito) this.router.navigate([this.moduleObservable.indexHTTP]);

                this.consultaCondicionesLaboralesCompania();
            });
    }

    get f() { return this.formCondicionLaboral.controls; }

    consultaCondicionesLaboralesCompania() : void {

        this.macredService.getCondicionesLaborales()
        .pipe(first())
        .subscribe(condicionLaboralResponse => {

            if (condicionLaboralResponse.length > 0) {
                this.showList = true;
                this.listCondicionesLaborales = condicionLaboralResponse;
            }
        }, error => { this.alertService.error('Problemas al consultar los tipos de personas. ' + error); });
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

        if ( this.formCondicionLaboral.invalid ) return;
        
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

                } else { this.alertService.error('Problemas al registrar la condición laboral.'); }
            }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error); });

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

                } else { this.alertService.error('Problemas al actualizar la condición laboral.'); }
            }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error); });
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

        this.alertService.clear();

        this.macredService.deleteCondicionLaboral(idCondicionLaboral)
            .pipe(first())
            .subscribe(response => {

                if (response) {
                    this.alertService.success( `Condición laboral eliminada correctamente!` );
                    this.ngOnInit();

                } else { this.alertService.error('Problemas al eliminar la condición laboral.'); }
            }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error); });
    }
}