import { UntypedFormBuilder, UntypedFormGroup, Validators  } from '@angular/forms';
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
import { MacParametrosGenerales } from '@app/_models/Macred';

declare var $: any;

@Component({
    templateUrl: 'HTML_ParametrosGenerales.html',
    styleUrls: ['../../../../assets/scss/app.scss',
        '../../../../assets/scss/macred/app.scss'],
    standalone: false
})
export class ParametrosGeneralesComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    nombrePantalla : string = 'parametros-generales.html';

    _parametroGeneralMacred : MacParametrosGenerales;

    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    submittedParametroGeneralForm : boolean = false;

    // Parametros Generales
    formParametroGeneral: UntypedFormGroup;
    formParametroGeneralList: UntypedFormGroup;
    listParametrosGenerales: MacParametrosGenerales[];
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

        this.formParametroGeneral = this.formBuilder.group({
            id                  : [null],
            codigoParametro     : [null],
            codigoCompania      : [null],
            encriptado          : [null],
            valor1              : [null],
            valor2              : [null],
            valor3              : [null],
            valor4              : [null],
            valor5              : [null]

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

            this.consultaParametrosGeneralesCompania();
    }

    get f() { return this.formParametroGeneral.controls; }


    consultaParametrosGeneralesCompania() : void {
        this.formParametroGeneralList = this.formBuilder.group({
            id                  : [''],
            codigoParametro     : [''],
            codigoCompania      : [''],
            encriptado          : [''],
            valor1              : [''],
            valor2              : [''],
            valor3              : [''],
            valor4              : [''],
            valor5              : ['']
        });

        this.macredService.getParametrosGeneralesCompania(this.userObservable.empresa)
        .pipe(first())
        .subscribe(parametroGeneralResponse => {

            if (parametroGeneralResponse.length > 0) {
                this.showList = true;
                this.listParametrosGenerales = parametroGeneralResponse;
            }
        },
        error => {
            let message : string = 'Problemas al consultar los parámetros generales. ' + error;
            this.alertService.error(message);
        });
    }

    addParametroGeneral() : void {
        this.alertService.clear();
        this.ngOnInit();
        this.add = true;
        this.tipoMovimiento = 'N'
        this._parametroGeneralMacred =  new MacParametrosGenerales;

        $('#parametroGeneralModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    editParametroGeneral(parametroGeneral:MacParametrosGenerales) : void {

        this.update = true;
        this.buttomText = 'Actualizar';
        this.tipoMovimiento = 'E';

        this._parametroGeneralMacred = parametroGeneral;

        this.formParametroGeneral = this.formBuilder.group({
            id                  : [parametroGeneral.id,Validators.required],
            codigoParametro     : [parametroGeneral.codigoParametro,Validators.required],
            encriptado          : [parametroGeneral.encriptado,Validators.required],
            valor1              : [parametroGeneral.valor1],
            valor2              : [parametroGeneral.valor2],
            valor3              : [parametroGeneral.valor3],
            valor4              : [parametroGeneral.valor4],
            valor5              : [parametroGeneral.valor5]

        });

        $('#parametroGeneralModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    guardarParametroGeneral() : void {

        this.alertService.clear();
        this.submittedParametroGeneralForm = true;

        if ( this.formParametroGeneral.invalid ){
            return;
        }

        var parametroGeneral : MacParametrosGenerales;
        parametroGeneral = this.createParametroGeneralModal();

        if (this.tipoMovimiento == 'N'){

            parametroGeneral.codigoCompania = this.userObservable.empresa;
            parametroGeneral.adicionadoPor  = this.userObservable.identificacion;
            parametroGeneral.fechaAdicion   = this.today;

            this.macredService.postParametroGeneral(parametroGeneral)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._parametroGeneralMacred = response;

                    this.alertService.success(
                        `Parámetro general ${ this._parametroGeneralMacred.codigoParametro } guardado correctamente!`
                    );
                    $('#parametroGeneralModal').modal('hide');
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al registrar el parámetro general.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });

        }
        else if (this.tipoMovimiento == 'E') {
            parametroGeneral.modificadoPor      = this.userObservable.identificacion;
            parametroGeneral.fechaModificacion  = this.today;

            this.macredService.putParametroGeneral(parametroGeneral)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._parametroGeneralMacred = response;

                    this.alertService.success(
                        `Parámetro general ${ this._parametroGeneralMacred.codigoParametro } actualizado correctamente!`
                    );
                    $('#parametroGeneralModal').modal('hide');
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al actualizar el parámetro general.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
        }
    }

    createParametroGeneralModal() : MacParametrosGenerales {

        var codigoParametro = this.formParametroGeneral.controls['codigoParametro'].value;
        var encriptado      = this.formParametroGeneral.controls['encriptado'].value;
        var valor1          = this.formParametroGeneral.controls['valor1'].value;
        var valor2          = this.formParametroGeneral.controls['valor2'].value;
        var valor3          = this.formParametroGeneral.controls['valor3'].value;
        var valor4          = this.formParametroGeneral.controls['valor4'].value;
        var valor5          = this.formParametroGeneral.controls['valor5'].value;


        var parametroGeneral = this._parametroGeneralMacred;

        parametroGeneral.codigoParametro    = codigoParametro;
        parametroGeneral.encriptado         = encriptado;
        parametroGeneral.valor1             = valor1;
        parametroGeneral.valor2             = valor2;
        parametroGeneral.valor3             = valor3;
        parametroGeneral.valor4             = valor4;
        parametroGeneral.valor5             = valor5;

        return parametroGeneral;
    }

    deleteParametroGeneral(idParametroGeneral:number){

        this.macredService.deleteParametroGeneral(idParametroGeneral)
            .pipe(first())
            .subscribe(response => {

                if (response) {
                    this.alertService.success(
                        `Parámetro eliminado correctamente!`
                    );
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al eliminar el parámetro general.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
    }

}
