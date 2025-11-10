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
import { MacTipoIngresoAnalisis } from '@app/_models/Macred';

declare var $: any;

@Component({
    templateUrl: 'HTML_TipoIngresoAnalisis.html',
    styleUrls: ['../../../../../assets/scss/app.scss',
        '../../../../../assets/scss/macred/app.scss'],
    standalone: false
})
export class TipoIngresoAnalisisComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    nombrePantalla : string = 'tipos-ingresos-analisis.html';

    _tipoIngresoAnalisisMacred : MacTipoIngresoAnalisis;

    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    submittedTipoIngresoAnalisisForm : boolean = false;
    
    // Tipo Ingreso Analisis
    formTipoIngresoAnalisis: UntypedFormGroup;
    formTipoIngresoAnalisisList: UntypedFormGroup;
    listTiposIngresoAnalisis: MacTipoIngresoAnalisis[];
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

        this.formTipoIngresoAnalisis = this.formBuilder.group({
            id                          : [null],
            codigoTipoIngresoAnalisis   : [null],
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

            this.consultaTiposIngresoAnalisisCompania();
    }

    get f() { return this.formTipoIngresoAnalisis.controls; }

    
    consultaTiposIngresoAnalisisCompania() : void {
        this.formTipoIngresoAnalisisList = this.formBuilder.group({
            id                          : [''],
            codigoTipoIngresoAnalisis   : [''],
            codigoCompania              : [''],
            descripcion                 : [''],
            estado                      : ['']
        });

        this.macredService.getTiposAnalisis()
        .pipe(first())
        .subscribe(tipoIngresoAnalisisResponse => {

            if (tipoIngresoAnalisisResponse.length > 0) {
                this.showList = true;
                this.listTiposIngresoAnalisis = tipoIngresoAnalisisResponse;
            }
        },
        error => {
            let message : string = 'Problemas al consultar los tipos de ingresos de análisis. ' + error;
            this.alertService.error(message); 
        });
    }

    addTipoIngresoAnalisis() : void {
        this.alertService.clear();
        this.ngOnInit();
        this.add = true;
        this.tipoMovimiento = 'N'
        this._tipoIngresoAnalisisMacred =  new MacTipoIngresoAnalisis;

        $('#tipoIngresoAnalisisModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    editTipoIngresoAnalisis(TipoIngresoAnalisis:MacTipoIngresoAnalisis) : void {

        this.update = true;
        this.buttomText = 'Actualizar';
        this.tipoMovimiento = 'E';
        
        this._tipoIngresoAnalisisMacred = TipoIngresoAnalisis;
        
        this.formTipoIngresoAnalisis = this.formBuilder.group({
            id                          : [TipoIngresoAnalisis.id,Validators.required],
            codigoTipoIngresoAnalisis   : [TipoIngresoAnalisis.codigoTipoIngresoAnalisis,Validators.required],
            descripcion                 : [TipoIngresoAnalisis.descripcion,Validators.required],
            estado                      : [TipoIngresoAnalisis.estado,Validators.required]
        });

        $('#tipoIngresoAnalisisModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    guardarTipoIngresoAnalisis() : void {

        this.alertService.clear();
        this.submittedTipoIngresoAnalisisForm = true;

        if ( this.formTipoIngresoAnalisis.invalid ){
            return;
        }
        
        var TipoIngresoAnalisis : MacTipoIngresoAnalisis;
        TipoIngresoAnalisis = this.createTipoIngresoAnalisisModal();
        
        if (this.tipoMovimiento == 'N'){    
            TipoIngresoAnalisis.codigoCompania = this.userObservable.empresa;
            TipoIngresoAnalisis.adicionadoPor  = this.userObservable.identificacion;
            TipoIngresoAnalisis.fechaAdicion   = this.today;

            this.macredService.postTipoIngresoAnalisis(TipoIngresoAnalisis)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._tipoIngresoAnalisisMacred = response;

                    this.alertService.success(
                        `Tipo de ingreso de análisis ${ this._tipoIngresoAnalisisMacred.codigoTipoIngresoAnalisis } guardado correctamente!`
                    );
                    $('#tipoIngresoAnalisisModal').modal('hide');
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al registrar el tipo de ingreso.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });

        }
        else if (this.tipoMovimiento == 'E') {
            TipoIngresoAnalisis.modificadoPor      = this.userObservable.identificacion;
            TipoIngresoAnalisis.fechaModificacion  = this.today;

            this.macredService.putTipoIngresoAnalisis(TipoIngresoAnalisis)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._tipoIngresoAnalisisMacred = response;

                    this.alertService.success(
                        `Tipo ingreso de análisis ${ this._tipoIngresoAnalisisMacred.codigoTipoIngresoAnalisis } actualizado correctamente!`
                    );
                    $('#tipoIngresoAnalisisModal').modal('hide');
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al actualizar el tipo de ingreso.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
        }
    }

    createTipoIngresoAnalisisModal() : MacTipoIngresoAnalisis {

        var codigoTipoIngresoAnalisis   = this.formTipoIngresoAnalisis.controls['codigoTipoIngresoAnalisis'].value;
        var descripcion                 = this.formTipoIngresoAnalisis.controls['descripcion'].value;
        var estado                      = this.formTipoIngresoAnalisis.controls['estado'].value

        var TipoIngresoAnalisis = this._tipoIngresoAnalisisMacred;

        TipoIngresoAnalisis.codigoTipoIngresoAnalisis   = codigoTipoIngresoAnalisis;
        TipoIngresoAnalisis.descripcion                 = descripcion;
        TipoIngresoAnalisis.estado                      = estado;

        return TipoIngresoAnalisis;
    }

    deleteTipoIngresoAnalisis(idTipoIngresoAnalisis : number){

        this.macredService.deleteTipoIngresoAnalisis(idTipoIngresoAnalisis)
            .pipe(first())
            .subscribe(response => {

                if (response) {
                    this.alertService.success(
                        `Tipo de ingreso de análisis eliminado correctamente!`
                    );
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al eliminar el tipo de ingreso de análisis.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
    }
   
}