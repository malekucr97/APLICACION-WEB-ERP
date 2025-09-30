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
import { MacTipoAsociado } from '@app/_models/Macred/TipoAsociado';

declare var $: any;

@Component({selector: 'app-tipo-asociados-macred',
            templateUrl: 'HTML_TiposAsociados.html',
            styleUrls: ['../../../../../assets/scss/app.scss', '../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class TiposAsociadosComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    nombrePantalla : string = 'tipos-asociados.html';

    _tipoAsociadoMacred : MacTipoAsociado;

    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    submittedTipoAsociadoForm : boolean = false;

    // Tipo Asociado
    formTipoAsociado: UntypedFormGroup;
    listTiposAsociados: MacTipoAsociado[];
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

        this.formTipoAsociado = this.formBuilder.group({
            id                  : [null],
            codigoTipoAsociado  : [null],
            codigoCompania      : [null],
            descripcion         : [null],
            estado              : [false]
        });

        this.accountService.validateAccessUser( this.userObservable.id,
                                                this.moduleObservable.id,
                                                this.nombrePantalla,
                                                this.companiaObservable.id )
            .pipe(first())
            .subscribe(response => {

                // ## -->> redirecciona NO ACCESO
                if(!response.exito) this.router.navigate([this.moduleObservable.indexHTTP]);

                this.consultaTiposAsociadosCompania();
            });   
    }

    get f() { return this.formTipoAsociado.controls; }


    consultaTiposAsociadosCompania() : void {

        this.macredService.getTiposAsociadosCompania(this.userObservable.empresa)
        .pipe(first())
        .subscribe(tipoAsociadoResponse => {

            if (tipoAsociadoResponse.length > 0) {
                this.showList = true;
                this.listTiposAsociados = tipoAsociadoResponse;
            }
        },
        error => { this.alertService.error('Problemas al consultar los tipos de asociados. ' + error); });
    }

    addTipoAsociado() : void {
        this.alertService.clear();
        this.ngOnInit();
        this.add = true;
        this.tipoMovimiento = 'N'
        this._tipoAsociadoMacred =  new MacTipoAsociado;

        $('#tipoAsociadoModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    editTipoAsociado(tipoAsociado:MacTipoAsociado) : void {

        this.update = true;
        this.buttomText = 'Actualizar';
        this.tipoMovimiento = 'E';

        this._tipoAsociadoMacred = tipoAsociado;

        this.formTipoAsociado = this.formBuilder.group({
            id: [tipoAsociado.id,Validators.required],
            codigoTipoAsociado : [tipoAsociado.codigoTipoAsociado,Validators.required],
            descripcion : [tipoAsociado.descripcion,Validators.required],
            estado : [tipoAsociado.estado,Validators.required]
        });

        $('#tipoAsociadoModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    guardarTipoAsociado() : void {

        this.alertService.clear();
        this.submittedTipoAsociadoForm = true;

        if ( this.formTipoAsociado.invalid ) return;
        
        var tipoAsociado : MacTipoAsociado;
        tipoAsociado = this.createTipoAsociadoModal();

        if (this.tipoMovimiento == 'N'){
            tipoAsociado.codigoCompania = this.userObservable.empresa;
            tipoAsociado.adicionadoPor  = this.userObservable.identificacion;
            tipoAsociado.fechaAdicion   = this.today;

            this.macredService.postTipoAsociado(tipoAsociado)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._tipoAsociadoMacred = response;

                    this.alertService.success(
                        `Tipo asociado ${ this._tipoAsociadoMacred.codigoTipoAsociado } guardado correctamente!`
                    );
                    $('#tipoAsociadoModal').modal('hide');
                    this.ngOnInit();

                } else { this.alertService.error('Problemas al registrar el tipo de asociado.'); }
            }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error); });

        } else if (this.tipoMovimiento == 'E') {

            tipoAsociado.modificadoPor      = this.userObservable.identificacion;
            tipoAsociado.fechaModificacion  = this.today;

            this.macredService.putTipoAsociado(tipoAsociado)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._tipoAsociadoMacred = response;

                    this.alertService.success(
                        `Tipo asociado ${ this._tipoAsociadoMacred.codigoTipoAsociado } actualizado correctamente!`
                    );
                    $('#tipoAsociadoModal').modal('hide');
                    this.ngOnInit();

                } else { this.alertService.error('Problemas al actualizar el tipo de asociado.'); }
            }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error); });
        }
    }

    createTipoAsociadoModal() : MacTipoAsociado {

        var codigoTipoAsociado  = this.formTipoAsociado.controls['codigoTipoAsociado'].value;
        var descripcion         = this.formTipoAsociado.controls['descripcion'].value;
        var estado              = this.formTipoAsociado.controls['estado'].value

        var tipoAsociado = this._tipoAsociadoMacred;

        tipoAsociado.codigoTipoAsociado = codigoTipoAsociado;
        tipoAsociado.descripcion        = descripcion;
        tipoAsociado.estado             = estado;

        return tipoAsociado;
    }

    deleteTipoAsociado(idTipoAsociado:number){

        this.alertService.clear();

        this.macredService.deleteTipoAsociado(idTipoAsociado)
            .pipe(first())
            .subscribe(response => {

                if (response) {
                    this.alertService.success( `Tipo de asociado eliminado correctamente!` );
                    this.ngOnInit();

                } else { this.alertService.error('Problemas al eliminar el tipo de genero.'); }
            }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error); });
    }
}