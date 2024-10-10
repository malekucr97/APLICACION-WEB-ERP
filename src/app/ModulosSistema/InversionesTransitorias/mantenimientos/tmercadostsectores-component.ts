import { FormBuilder, FormGroup, Validators  }      from '@angular/forms';
import { Component, OnInit, ViewChild }             from '@angular/core';
import { AccountService, AlertService }             from '@app/_services';
import { MatSidenav }                               from '@angular/material/sidenav';

import { User, Module, Compania }                   from '@app/_models';

import { MatDialog }                                from '@angular/material/dialog';
import { DialogoConfirmacionComponent }             from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';

// ## -- servicio macred http -- ## //
import { InversionesService }                       from '@app/_services/inversiones.service';
import { InvTipoMoneda } from '@app/_models/Inversiones/TipoMoneda';
import { first } from 'rxjs/operators';
import { InvTipoCambio } from '@app/_models/Inversiones/TipoCambio';
import { InvPeriocidad } from '@app/_models/Inversiones/Periocidad';
import { InvTipoMercado } from '@app/_models/Inversiones/TipoMercado';
import { InvTipoSector } from '@app/_models/Inversiones/TipoSector';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

declare var $: any;

@Component({
    templateUrl: 'HTML_TMercadosTSectores.html',
    styleUrls: ['../../../../assets/scss/app.scss', '../../../../assets/scss/inversiones/app.scss'],
})
export class InvTMercadosTSectoresComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'HTML_TMercadosTSectores.html';
    public nombreModulo     : string ;

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private moduleObservable    : Module;
    private companiaObservable  : Compania;

    // ## -- formularios -- ## //
    formularioMercado  : FormGroup;
    formularioSector  : FormGroup;

    // ## -- submitMercado formularios -- ## //
    submittedFormMercado    : boolean = false;
    submittedFormSector     : boolean = false;
    
    // ## -- habilita botones -- ## //
    habilitaBtnRegistroMercado     : boolean = true;
    habilitaBtnActualizaMercado    : boolean = false;
    habilitaBtnNuevoMercado        : boolean = false;
    habilitaBtnElimibarMercado     : boolean = false;
    habilitaBtnRegistroSector     : boolean = true;
    habilitaBtnActualizaSector    : boolean = false;
    habilitaBtnNuevoSector        : boolean = false;
    habilitaBtnElimibarSector     : boolean = false;

    // ## -- listas analisis -- ## //
    public listObjetosMercados  : InvTipoMercado []  = [];
    public listObjetosSectores  : InvTipoSector []  = [];

    public today : Date ;

    constructor (   private alertService:      AlertService,
                    private inversionesService:     InversionesService,
                    private formBuilder:       FormBuilder,
                    private accountService:     AccountService,
                    private dialogo:           MatDialog,
                    private translate: TranslateMessagesService ) {

        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue;

        this.today = new Date();
    }

    get m () {   return this.formularioMercado.controls;  }
    get s () {   return this.formularioSector.controls;  }


    ngOnInit() {

        this.formularioMercado    = this.formBuilder.group({
            idMercado              : [null],
            codigoMercado   : [null],
            descripcionMercado     : [null],
            estadoMercado          : [null]
        });
        this.formularioSector    = this.formBuilder.group({
            idSector              : [null],
            codigoSector   : [null],
            descripcionSector     : [null],
            estadoSector          : [null]
        });
        this.nombreModulo = this.moduleObservable.nombre ;

        this.buscarObjetoMercado(true);
        this.buscarObjetoSector(true);
    }

    buscarObjetoMercado(getAll : boolean = false) : void {

        this.alertService.clear();
        this.submittedFormMercado = true;

        let codigoMercado = this.formularioMercado.controls['codigoMercado'].value ;

        if (getAll) codigoMercado = "%%" ;

        this.inversionesService.getTipoMercado(codigoMercado, this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {
                    
                    this.inicializaFormularioMercado(response[0]);

                    this.listObjetosMercados = response ;

                } else { 
                
                    this.inicializaFormularioMercado();
                    this.alertService.info(this.translate.translateKey('ALERTS.NO_RECORDS_FOUND'));
                }
            },
            error => {
                let message : string = this.translate.translateKeyP('ALERTS.CONNECTION_PROBLEMS',{$PH:error});
                this.alertService.error(message);
            });
    }
    buscarObjetoSector(getAll : boolean = false) : void {

        this.alertService.clear();
        this.submittedFormSector = true;

        let codigoSector = this.formularioSector.controls['codigoSector'].value ;

        if (getAll) codigoSector = "%%" ;

        this.inversionesService.getTipoSector(codigoSector, this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {
                    
                    this.inicializaFormularioSector(response[0]);

                    this.listObjetosSectores = response ;

                } else { 
                
                    this.inicializaFormularioSector();
                    this.alertService.info(this.translate.translateKey('ALERTS.NO_RECORDS_FOUND'));
                }
            },
            error => {
                let message : string = this.translate.translateKeyP('ALERTS.CONNECTION_PROBLEMS',{$PH:error});
                this.alertService.error(message);
            });
    }
    inicializaFormularioMercado(objeto : InvTipoMercado = null) : void {

        if (objeto) {

            this.habilitaBtnRegistroMercado = false ;
            this.habilitaBtnActualizaMercado= true ;
            this.habilitaBtnNuevoMercado = true ;
            this.habilitaBtnElimibarMercado = true;

            this.formularioMercado    = this.formBuilder.group({
                idMercado              : [objeto.id],
                codigoMercado   : [objeto.codigoMercado, Validators.required],
                descripcionMercado     : [objeto.descripcion, Validators.required],
                estadoMercado          : [objeto.estado, Validators.required]
            });
        } else {

            this.habilitaBtnRegistroMercado = true ;
            this.habilitaBtnActualizaMercado= false;
            this.habilitaBtnNuevoMercado = false ;
            this.habilitaBtnElimibarMercado = false;

            this.formularioMercado    = this.formBuilder.group({
                idMercado              : [null],
                codigoMercado   : [null, Validators.required],
                descripcionMercado     : [null, Validators.required],
                estadoMercado          : [true, Validators.required]
            });
        }
    }
    inicializaFormularioSector(objeto : InvTipoSector = null)   : void {

        if (objeto) {

            this.habilitaBtnRegistroSector = false ;
            this.habilitaBtnActualizaSector= true ;
            this.habilitaBtnNuevoSector = true ;
            this.habilitaBtnElimibarSector = true;

            this.formularioSector    = this.formBuilder.group({
                idSector              : [objeto.id],
                codigoSector   : [objeto.codigoSector, Validators.required],
                descripcionSector     : [objeto.descripcion, Validators.required],
                estadoSector          : [objeto.estado, Validators.required]
            });
        } else {

            this.habilitaBtnRegistroSector = true ;
            this.habilitaBtnActualizaSector= false;
            this.habilitaBtnNuevoSector = false ;
            this.habilitaBtnElimibarSector = false;

            this.formularioSector    = this.formBuilder.group({
                idSector              : [null],
                codigoSector   : [null, Validators.required],
                descripcionSector     : [null, Validators.required],
                estadoSector          : [true, Validators.required]
            });
        }
    }

    selectObjetoMercado(objeto : InvTipoMercado) : void {

        this.inicializaFormularioMercado(objeto);
    }
    selectObjetoSector(objeto : InvTipoSector) : void {

        this.inicializaFormularioSector(objeto);
    }

    crearObjectFormMercado() : InvTipoMercado {

        var codigoMercado   = this.formularioMercado.controls['codigoMercado'].value;
        var descripcion     = this.formularioMercado.controls['descripcionMercado'].value;
        var estado          = this.formularioMercado.controls['estadoMercado'].value;

        var objForm = new InvTipoMercado (this.companiaObservable.id, codigoMercado, descripcion, estado) ;

        return objForm ;
    }
    crearObjectFormSector() : InvTipoSector {

        var codigoSector   = this.formularioSector.controls['codigoSector'].value;
        var descripcion     = this.formularioSector.controls['descripcionSector'].value;
        var estado          = this.formularioSector.controls['estadoSector'].value;

        var objForm = new InvTipoSector (this.companiaObservable.id, codigoSector, descripcion, estado) ;

        return objForm ;
    }

    submitMercado() : void {

        this.alertService.clear();
        this.submittedFormMercado = true;

        if ( this.formularioMercado.invalid ) return;

        var objectForm : InvTipoMercado = this.crearObjectFormMercado();
        
        objectForm.adicionadoPor    = this.userObservable.identificacion;
        objectForm.fechaAdicion     = this.today;

        this.inversionesService.postTipoMercado(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    this.listObjetosMercados.push(response);

                    this.inicializaFormularioMercado();

                    this.alertService.success( this.translate.translateKey('ALERTS.SUCCESSFUL_REGISTRATION') );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_CURRENCY_REGISTRATION')); }

            }, error => {
                this.alertService.error( this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }
    submitSector() : void {

        this.alertService.clear();
        this.submittedFormSector = true;

        if ( this.formularioSector.invalid ) return;

        var objectForm : InvTipoSector = this.crearObjectFormSector();
        
        objectForm.adicionadoPor    = this.userObservable.identificacion;
        objectForm.fechaAdicion     = this.today;

        this.inversionesService.postTipoSector(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    this.listObjetosSectores.push(response);

                    this.inicializaFormularioSector();

                    this.alertService.success( this.translate.translateKey('ALERTS.SUCCESSFUL_REGISTRATION') );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_CURRENCY_REGISTRATION')); }

            }, error => {
                this.alertService.error( this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }

    eliminarObjetoMercado() : void {

        this.alertService.clear();
        this.submittedFormMercado = true;

        if ( this.formularioMercado.invalid ) return;

        var id : number = this.formularioMercado.controls['idMercado'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: this.translate.translateKey('ALERTS.dialogConfirmDelete')
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deleteTipoMercado( id )
                    .pipe(first())
                    .subscribe(response => {
                        if (response.exito) {

                            this.listObjetosMercados.splice(this.listObjetosMercados.findIndex( m => m.id == id ), 1);

                            this.inicializaFormularioMercado();

                            this.alertService.success(response.responseMesagge);
                            
                        } else { this.alertService.error(response.responseMesagge); }
                    });
                
            } else { return; }
        });
    }
    eliminarObjetoSector() : void {

        this.alertService.clear();
        this.submittedFormMercado = true;

        if ( this.formularioSector.invalid ) return;

        var id : number = this.formularioSector.controls['idSector'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: this.translate.translateKey('ALERTS.dialogConfirmDelete')
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deleteTipoSector( id )
                    .pipe(first())
                    .subscribe(response => {
                        if (response.exito) {

                            this.listObjetosSectores.splice(this.listObjetosSectores.findIndex( m => m.id == id ), 1);

                            this.inicializaFormularioSector();

                            this.alertService.success(response.responseMesagge);
                            
                        } else { this.alertService.error(response.responseMesagge); }
                    });
                
            } else { return; }
        });
    }

    limpiarFormularioMercado() : void {

        this.inicializaFormularioMercado();
    }
    limpiarFormularioSector() : void {

        this.inicializaFormularioSector();
    }

    actualizaObjetoMercado() : void {

        this.alertService.clear();
        this.submittedFormMercado = true;

        if ( this.formularioMercado.invalid ) return;

        var objectForm : InvTipoMercado = this.crearObjectFormMercado();

        objectForm.id = this.formularioMercado.controls['idMercado'].value;
        
        objectForm.modificadoPor        = this.userObservable.identificacion;
        objectForm.fechaModificacion    = this.today;

        this.inversionesService.putTipoMercado(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if( this.listObjetosMercados.find( m => m.id == response.id ) ) {
                        this.listObjetosMercados.splice(this.listObjetosMercados.findIndex( m => m.id == response.id ), 1);
                    }
                    this.listObjetosMercados.push(response);

                    this.inicializaFormularioMercado();

                    this.alertService.success( this.translate.translateKey('ALERTS.SUCCESSFUL_UPDATE') );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_UPDATE')); }

            }, error => {
                this.alertService.error( this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }

    actualizaObjetoSector() : void {

        this.alertService.clear();
        this.submittedFormSector = true;

        if ( this.formularioSector.invalid ) return;

        var objectForm : InvTipoSector = this.crearObjectFormSector();

        objectForm.id = this.formularioSector.controls['idSector'].value;
        
        objectForm.modificadoPor        = this.userObservable.identificacion;
        objectForm.fechaModificacion    = this.today;

        this.inversionesService.putTipoSector(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if( this.listObjetosSectores.find( m => m.id == response.id ) ) {
                        this.listObjetosSectores.splice(this.listObjetosSectores.findIndex( m => m.id == response.id ), 1);
                    }
                    this.listObjetosSectores.push(response);

                    this.inicializaFormularioSector();

                    this.alertService.success( this.translate.translateKey('ALERTS.SUCCESSFUL_UPDATE') );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_UPDATE')); }

            }, error => {
                this.alertService.error( this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }
}