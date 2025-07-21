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
import { MatDialog } from '@angular/material/dialog';
import { MacTipoAsociado } from '@app/_models/Macred/TipoAsociado';
import { MacTipoFormaPagoAnalisis } from '@app/_models/Macred';

declare var $: any;

@Component({
    templateUrl: 'HTML_TiposFormasPagoAnalisis.html',
    styleUrls: ['../../../../../assets/scss/app.scss',
        '../../../../../assets/scss/macred/app.scss'],
    standalone: false
})
export class TiposFormasPagoAnalisisComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    nombrePantalla : string = 'tipos-forma-pago-analisis.html';

    _tipoFormaPagoAnalisisMacred : MacTipoFormaPagoAnalisis;

    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    submittedTipoFormaPagoAnalisisForm : boolean = false;
    
    // Tipo Forma Pago Analisis
    formTipoFormaPagoAnalisis: UntypedFormGroup;
    formTipoFormaPagoAnalisisList: UntypedFormGroup;
    listTiposFormasPagoAnalisis: MacTipoFormaPagoAnalisis[];
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

        this.formTipoFormaPagoAnalisis = this.formBuilder.group({
            id                          : [null],
            codigoTFormaPagoAnalisis    : [null],
            codigoCompania              : [null],
            descripcion                 : [null],
            estado                      : [null]

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

            this.consultaTiposFormasPagoAnalisisCompania();
    }

    get f() { return this.formTipoFormaPagoAnalisis.controls; }

    
    consultaTiposFormasPagoAnalisisCompania() : void {
        this.formTipoFormaPagoAnalisisList = this.formBuilder.group({
            id                          : [''],
            codigoTFormaPagoAnalisis    : [''],
            codigoCompania              : [''],
            descripcion                 : [''],
            estado                      : ['']
        });

        this.macredService.getTiposFormaPagoAnalisis(this.userObservable.empresa)
        .pipe(first())
        .subscribe(tipoFormaPagoAnalisisResponse => {

            if (tipoFormaPagoAnalisisResponse.length > 0) {
                this.showList = true;
                this.listTiposFormasPagoAnalisis = tipoFormaPagoAnalisisResponse;
            }
        },
        error => {
            let message : string = 'Problemas al consultar los tipos de forma de pago de análisis. ' + error;
            this.alertService.error(message); 
        });
    }

    addTipoFormaPagoAnalisis() : void {
        this.alertService.clear();
        this.ngOnInit();
        this.add = true;
        this.tipoMovimiento = 'N'
        this._tipoFormaPagoAnalisisMacred =  new MacTipoFormaPagoAnalisis;

        $('#tipoFormaPagoAnalisisModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    editTipoFormaPagoAnalisis(TipoFormaPagoAnalisis:MacTipoFormaPagoAnalisis) : void {

        this.update = true;
        this.buttomText = 'Actualizar';
        this.tipoMovimiento = 'E';
        
        this._tipoFormaPagoAnalisisMacred = TipoFormaPagoAnalisis;
        
        this.formTipoFormaPagoAnalisis = this.formBuilder.group({
            id                          : [TipoFormaPagoAnalisis.id,Validators.required],
            codigoTFormaPagoAnalisis    : [TipoFormaPagoAnalisis.codigoTFormaPagoAnalisis,Validators.required],
            descripcion                 : [TipoFormaPagoAnalisis.descripcion,Validators.required],
            estado                      : [TipoFormaPagoAnalisis.estado,Validators.required]
        });

        $('#tipoFormaPagoAnalisisModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    guardarTipoFormaPagoAnalisis() : void {

        this.alertService.clear();
        this.submittedTipoFormaPagoAnalisisForm = true;

        if ( this.formTipoFormaPagoAnalisis.invalid ){
            return;
        }
        
        var TipoFormaPagoAnalisis : MacTipoFormaPagoAnalisis;
        TipoFormaPagoAnalisis = this.createTipoFormaPagoAnalisisModal();
        
        if (this.tipoMovimiento == 'N'){    
            TipoFormaPagoAnalisis.codigoCompania = this.userObservable.empresa;
            TipoFormaPagoAnalisis.adicionadoPor  = this.userObservable.identificacion;
            TipoFormaPagoAnalisis.fechaAdicion   = this.today;

            this.macredService.postTipoFormaPagoAnalisis(TipoFormaPagoAnalisis)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._tipoFormaPagoAnalisisMacred = response;

                    this.alertService.success(
                        `Tipo forma de pago ${ this._tipoFormaPagoAnalisisMacred.codigoTFormaPagoAnalisis } guardado correctamente!`
                    );
                    $('#tipoFormaPagoAnalisisModal').modal('hide');
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al registrar el tipo de forma de pago.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });

        }
        else if (this.tipoMovimiento == 'E') {
            TipoFormaPagoAnalisis.modificadoPor      = this.userObservable.identificacion;
            TipoFormaPagoAnalisis.fechaModificacion  = this.today;

            this.macredService.putTipoFormaPagoAnalisis(TipoFormaPagoAnalisis)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._tipoFormaPagoAnalisisMacred = response;

                    this.alertService.success(
                        `Tipo forma pago de análisis ${ this._tipoFormaPagoAnalisisMacred.codigoTFormaPagoAnalisis } actualizado correctamente!`
                    );
                    $('#tipoFormaPagoAnalisisModal').modal('hide');
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al actualizar el tipo de forma de pago.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
        }
    }

    createTipoFormaPagoAnalisisModal() : MacTipoFormaPagoAnalisis {

        var codigoTFormaPagoAnalisis    = this.formTipoFormaPagoAnalisis.controls['codigoTFormaPagoAnalisis'].value;
        var descripcion                 = this.formTipoFormaPagoAnalisis.controls['descripcion'].value;
        var estado                      = this.formTipoFormaPagoAnalisis.controls['estado'].value

        var TipoFormaPagoAnalisis = this._tipoFormaPagoAnalisisMacred;

        TipoFormaPagoAnalisis.codigoTFormaPagoAnalisis  = codigoTFormaPagoAnalisis;
        TipoFormaPagoAnalisis.descripcion               = descripcion;
        TipoFormaPagoAnalisis.estado                    = estado;

        return TipoFormaPagoAnalisis;
    }

    deleteTipoFormaPagoAnalisis(idTipoFormaPagoAnalisis : number){

        this.macredService.deleteTipoFormaPagoAnalisis(idTipoFormaPagoAnalisis)
            .pipe(first())
            .subscribe(response => {

                if (response) {
                    this.alertService.success(
                        `Tipo de forma de pago eliminado correctamente!`
                    );
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al eliminar el tipo de forma de pago.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
    }
   
}