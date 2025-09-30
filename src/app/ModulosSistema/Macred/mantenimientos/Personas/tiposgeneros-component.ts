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
import { MacTipoGenero } from '@app/_models/Macred/TipoGenero';

declare var $: any;

@Component({selector: 'app-tipos-genero-macred',
            templateUrl: 'HTML_TiposGeneros.html',
            styleUrls: ['../../../../../assets/scss/app.scss', '../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class TiposGenerosComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    nombrePantalla : string = 'tipos-generos.html';

    _tipoGeneroMacred : MacTipoGenero;

    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    submittedTipoGeneroForm : boolean = false;

    // Tipo Genero
    formTipoGenero: UntypedFormGroup;
    listTiposGeneros: MacTipoGenero[];
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

        this.formTipoGenero = this.formBuilder.group({
            id : [null],
            codigoGenero : [null],
            codigoCompania : [null],
            descripcion : [null],
            estado : [false]

        });

        this.accountService.validateAccessUser( this.userObservable.id,
                                                this.moduleObservable.id,
                                                this.nombrePantalla,
                                                this.companiaObservable.id )
            .pipe(first())
            .subscribe(response => {

                // ## -->> redirecciona NO ACCESO
                if(!response.exito) this.router.navigate([this.moduleObservable.indexHTTP]);

                this.consultaTiposGenerosCompania();
            });
    }

    get f() { return this.formTipoGenero.controls; }


    consultaTiposGenerosCompania() : void {

        this.macredService.getTiposGenerosCompania(this.userObservable.empresa)
        .pipe(first())
        .subscribe(tipoGeneroResponse => {

            if (tipoGeneroResponse.length > 0) {
                this.showList = true;
                this.listTiposGeneros = tipoGeneroResponse;
            }
        }, error => { this.alertService.error('Problemas al consultar los tipos de generos. ' + error); });
    }

    addTipoGenero() : void {
        this.alertService.clear();
        this.ngOnInit();
        this.add = true;
        this.tipoMovimiento = 'N'
        this._tipoGeneroMacred =  new MacTipoGenero;

        $('#tipoGeneroModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    editTipoGenero(tipoGenero:MacTipoGenero) : void {

        this.update = true;
        this.buttomText = 'Actualizar';
        this.tipoMovimiento = 'E';

        this._tipoGeneroMacred = tipoGenero;

        this.formTipoGenero = this.formBuilder.group({
            id: [tipoGenero.id,Validators.required],
            codigoGenero : [tipoGenero.codigoGenero,Validators.required],
            descripcion : [tipoGenero.descripcion,Validators.required],
            estado : [tipoGenero.estado,Validators.required]
        });

        $('#tipoGeneroModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    guardarTipoGenero() : void {

        this.alertService.clear();
        this.submittedTipoGeneroForm = true;

        if ( this.formTipoGenero.invalid ) return;

        var tipoGenero : MacTipoGenero;
        tipoGenero = this.createTipoGeneroModal();

        if (this.tipoMovimiento == 'N'){
            tipoGenero.codigoCompania = this.userObservable.empresa;
            tipoGenero.adicionadoPor  = this.userObservable.identificacion;
            tipoGenero.fechaAdicion   = this.today;

            this.macredService.postTipoGenero(tipoGenero)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._tipoGeneroMacred = response;

                    this.alertService.success(
                        `Tipo genero ${ this._tipoGeneroMacred.codigoGenero } guardado correctamente!`
                    );
                    $('#tipoGeneroModal').modal('hide');
                    this.ngOnInit();

                } else { this.alertService.error('Problemas al registrar el tipo de genero.'); }
            }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error); });

        }
        else if (this.tipoMovimiento == 'E') {
            tipoGenero.modificadoPor      = this.userObservable.identificacion;
            tipoGenero.fechaModificacion  = this.today;

            this.macredService.putTipoGenero(tipoGenero)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._tipoGeneroMacred = response;

                    this.alertService.success(
                        `Tipo genero ${ this._tipoGeneroMacred.codigoGenero } actualizado correctamente!`
                    );
                    $('#tipoGeneroModal').modal('hide');
                    this.ngOnInit();

                } else { this.alertService.error('Problemas al actualizar el tipo de genero.'); }
            }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error); });
        }
    }

    createTipoGeneroModal() : MacTipoGenero {

        var codigoGenero = this.formTipoGenero.controls['codigoGenero'].value;
        var descripcion = this.formTipoGenero.controls['descripcion'].value;
        var estado = this.formTipoGenero.controls['estado'].value

        var tipoGenero = this._tipoGeneroMacred;

        tipoGenero.codigoGenero     = codigoGenero;
        tipoGenero.descripcion      = descripcion;
        tipoGenero.estado           = estado;

        return tipoGenero;
    }

    deleteTipoGenero(idTipoGenero:number){

        this.alertService.clear();

        this.macredService.deleteTipoGenero(idTipoGenero)
            .pipe(first())
            .subscribe(response => {

                if (response) {
                    this.alertService.success( `Tipo genero eliminado correctamente!` );
                    this.ngOnInit();

                } else { this.alertService.error('Problemas al eliminar el tipo de genero.'); }
            }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error); });
    }
}
