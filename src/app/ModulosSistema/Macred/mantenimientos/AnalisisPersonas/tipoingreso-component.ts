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
import { MatDialog } from '@angular/material/dialog';
import { MacTipoIngreso } from '@app/_models/Macred';

declare var $: any;

@Component({
    templateUrl: 'HTML_TipoIngreso.html',
    styleUrls: ['../../../../../assets/scss/app.scss',
                '../../../../../assets/scss/macred/app.scss'],
})
export class TipoIngresoComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    nombrePantalla : string = 'tipos-ingresos.html';

    _tipoIngresoMacred : MacTipoIngreso;

    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    submittedTipoIngresoForm : boolean = false;
    
    // Tipo Ingreso
    formTipoIngreso: FormGroup;
    formTipoIngresoList: FormGroup;
    listTiposIngreso: MacTipoIngreso[];
    showList : boolean = false;

    submitted : boolean = false;
    update : boolean = false;
    add : boolean = false;
    delete : boolean = false;

    tipoMovimiento : string; // E - Editar, N - Nuevo registro

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

    ngOnInit() {

        this.formTipoIngreso = this.formBuilder.group({
            id                      : [null],
            codigoTipoIngreso       : [null],
            codigoCompania          : [null],
            descripcion             : [null],
            aplicaDeduccionesLey    : [null],
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

            this.consultaTiposIngresoCompania();
    }

    get f() { return this.formTipoIngreso.controls; }

    
    consultaTiposIngresoCompania() : void {
        this.formTipoIngresoList = this.formBuilder.group({
            id                      : [''],
            codigoTipoIngreso       : [''],
            codigoCompania          : [''],
            descripcion             : [''],
            aplicaDeduccionesLey    : [''],
            estado                  : ['']
        });

        this.macredService.getTiposIngresos(this.userObservable.empresa, true)
        .pipe(first())
        .subscribe(tipoIngresoResponse => {

            if (tipoIngresoResponse.length > 0) {
                this.showList = true;
                this.listTiposIngreso = tipoIngresoResponse;
            }
        },
        error => {
            let message : string = 'Problemas al consultar los tipos de ingresos. ' + error;
            this.alertService.error(message); 
        });
    }

    addTipoIngreso() : void {
        this.alertService.clear();
        this.ngOnInit();
        this.add = true;
        this.tipoMovimiento = 'N'
        this._tipoIngresoMacred =  new MacTipoIngreso;

        $('#tipoIngresoModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    editTipoIngreso(TipoIngreso:MacTipoIngreso) : void {

        this.update = true;
        this.buttomText = 'Actualizar';
        this.tipoMovimiento = 'E';
        
        this._tipoIngresoMacred = TipoIngreso;
        
        this.formTipoIngreso = this.formBuilder.group({
            id                      : [TipoIngreso.id,Validators.required],
            codigoTipoIngreso       : [TipoIngreso.codigoTipoIngreso,Validators.required],
            descripcion             : [TipoIngreso.descripcion,Validators.required],
            aplicaDeduccionesLey    : [TipoIngreso.aplicaDeduccionesLey,Validators.required],
            estado                  : [TipoIngreso.estado,Validators.required]
        });

        $('#tipoIngresoModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    guardarTipoIngreso() : void {

        this.alertService.clear();
        this.submittedTipoIngresoForm = true;

        if ( this.formTipoIngreso.invalid ){
            return;
        }
        
        var TipoIngreso : MacTipoIngreso;
        TipoIngreso = this.createTipoIngresoModal();
        
        if (this.tipoMovimiento == 'N'){    
            TipoIngreso.codigoCompania = this.userObservable.empresa;
            TipoIngreso.adicionadoPor  = this.userObservable.identificacion;
            TipoIngreso.fechaAdicion   = this.today;

            this.macredService.postTipoIngreso(TipoIngreso)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._tipoIngresoMacred = response;

                    this.alertService.success(
                        `Tipo de ingreso ${ this._tipoIngresoMacred.codigoTipoIngreso } guardado correctamente!`
                    );
                    $('#tipoIngresoModal').modal('hide');
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
            TipoIngreso.modificadoPor      = this.userObservable.identificacion;
            TipoIngreso.fechaModificacion  = this.today;

            this.macredService.putTipoIngreso(TipoIngreso)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this._tipoIngresoMacred = response;

                    this.alertService.success(
                        `Tipo ingreso ${ this._tipoIngresoMacred.codigoTipoIngreso } actualizado correctamente!`
                    );
                    $('#tipoIngresoModal').modal('hide');
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

    createTipoIngresoModal() : MacTipoIngreso {

        var codigoTipoIngreso       = this.formTipoIngreso.controls['codigoTipoIngreso'].value;
        var descripcion             = this.formTipoIngreso.controls['descripcion'].value;
        var aplicaDeduccionesLey    = this.formTipoIngreso.controls['aplicaDeduccionesLey'].value;
        var estado                  = this.formTipoIngreso.controls['estado'].value

        var TipoIngreso = this._tipoIngresoMacred;

        TipoIngreso.codigoTipoIngreso       = codigoTipoIngreso;
        TipoIngreso.descripcion             = descripcion;
        TipoIngreso.aplicaDeduccionesLey    = aplicaDeduccionesLey;
        TipoIngreso.estado                  = estado;

        return TipoIngreso;
    }

    deleteTipoIngreso(idTipoIngreso : number){

        this.macredService.deleteTipoIngreso(idTipoIngreso)
            .pipe(first())
            .subscribe(response => {

                if (response) {
                    this.alertService.success(
                        `Tipo de ingreso eliminado correctamente!`
                    );
                    this.ngOnInit();

                } else {
                    let message : string = 'Problemas al eliminar el tipo de ingreso.';
                    this.alertService.error(message);
                }
            },
            error => {
                let message : string = 'Problemas de conexión. Detalle: ' + error;
                this.alertService.error(message);
            });
    }
   
}