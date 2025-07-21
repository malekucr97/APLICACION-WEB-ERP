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
    templateUrl: 'HTML_TiposPersonas.html',
    styleUrls: ['../../../../../assets/scss/app.scss',
        '../../../../../assets/scss/macred/app.scss'],
    standalone: false
})
export class TiposPersonasComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    nombrePantalla : string = 'tipos-personas.html';

    _tipoPersonaMacred : MacTipoPersona;

    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    submittedTipoPersonaForm : boolean = false;

    // Tipo Persona
    formTipoPersona: UntypedFormGroup;
    formTipoPersonaList: UntypedFormGroup;
    listTiposPersonas: MacTipoPersona[];
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

        this.formTipoPersona = this.formBuilder.group({
            id                  : [null],
            codigoTipoPersona   : [null],
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

            this.consultaTiposPersonasCompania();
    }

    get f() { return this.formTipoPersona.controls; }


    consultaTiposPersonasCompania() : void {
        this.formTipoPersonaList = this.formBuilder.group({
            id                  : [''],
            codigoTipoPersona   : [''],
            codigoCompania      : [''],
            descripcion         : [''],
            estado              : ['']
        });

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

    addTipoPersona() : void {
        this.alertService.clear();
        this.ngOnInit();
        this.add = true;
        this.tipoMovimiento = 'N'
        this._tipoPersonaMacred =  new MacTipoPersona;

        $('#tipoPersonaModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    editTipoPersona(tipoPersona:MacTipoPersona) : void {

        this.update = true;
        this.buttomText = 'Actualizar';
        this.tipoMovimiento = 'E';

        this._tipoPersonaMacred = tipoPersona;

        this.formTipoPersona = this.formBuilder.group({
            id: [tipoPersona.id,Validators.required],
            codigoTipoPersona : [tipoPersona.codigoTipoPersona,Validators.required],
            descripcion : [tipoPersona.descripcion,Validators.required],
            estado : [tipoPersona.estado,Validators.required]
        });

        $('#tipoPersonaModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    guardarTipoPersona() : void {

        this.alertService.clear();
        this.submittedTipoPersonaForm = true;

        if ( this.formTipoPersona.invalid ){
            return;
        }

        var tipoPersona : MacTipoPersona;
        tipoPersona = this.createTipoPersonaModal();

        if (this.tipoMovimiento == 'N'){
            tipoPersona.codigoCompania = this.userObservable.empresa;
            tipoPersona.adicionadoPor  = this.userObservable.identificacion;
            tipoPersona.fechaAdicion   = this.today;

            this.macredService.postTipoPersona(tipoPersona)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._tipoPersonaMacred = response;

                    this.alertService.success(
                        `Tipo persona ${ this._tipoPersonaMacred.codigoTipoPersona } guardado correctamente!`
                    );
                    $('#tipoPersonaModal').modal('hide');
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al registrar el tipo de persona.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });

        }
        else if (this.tipoMovimiento == 'E') {
            tipoPersona.modificadoPor      = this.userObservable.identificacion;
            tipoPersona.fechaModificacion  = this.today;

            this.macredService.putTipoPersona(tipoPersona)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._tipoPersonaMacred = response;

                    this.alertService.success(
                        `Tipo persona ${ this._tipoPersonaMacred.codigoTipoPersona } actualizado correctamente!`
                    );
                    $('#tipoPersonaModal').modal('hide');
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al actualizar el tipo de persona.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
        }
    }

    createTipoPersonaModal() : MacTipoPersona {

        var codigoTipoPersona   = this.formTipoPersona.controls['codigoTipoPersona'].value;
        var descripcion         = this.formTipoPersona.controls['descripcion'].value;
        var estado              = this.formTipoPersona.controls['estado'].value


        var tipoPersona = this._tipoPersonaMacred;

        tipoPersona.codigoTipoPersona   = codigoTipoPersona;
        tipoPersona.descripcion         = descripcion;
        tipoPersona.estado              = estado;

        return tipoPersona;
    }

    deleteTipoPersona(idTipoPersona:number){

        this.macredService.deleteTipoPesona(idTipoPersona)
            .pipe(first())
            .subscribe(response => {

                if (response) {
                    this.alertService.success(
                        `Tipo persona eliminado correctamente!`
                    );
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al eliminar el tipo de persona.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
    }

}
