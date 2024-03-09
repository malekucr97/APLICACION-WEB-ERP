import { FormBuilder, FormGroup, Validators  }      from '@angular/forms';
import { Component, OnInit, ViewChild }             from '@angular/core';
import { AccountService, AlertService }             from '@app/_services';
import { MatSidenav }                               from '@angular/material/sidenav';

import { User, Module, Compania }                   from '@app/_models';

import { MatDialog }                                from '@angular/material/dialog';
import { DialogoConfirmacionComponent }             from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';

// ## -- servicio macred http -- ## //
import { InversionesService }   from '@app/_services/inversiones.service';
import { first }                from 'rxjs/operators';

import { InvPlazoInversion }    from '@app/_models/Inversiones/PlazoInversion';
import { InvClaseInversion } from '@app/_models/Inversiones/ClaseInversion';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

declare var $: any;

@Component({
    templateUrl: 'HTML_ClasesPlazosInversiones.html',
    styleUrls: ['../../../../assets/scss/app.scss', '../../../../assets/scss/inversiones/app.scss'],
})
export class InvClasesPlazosInversionesComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'HTML_ClasesPlazosInversiones.html';
    public nombreModulo     : string ;

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private moduleObservable    : Module;
    private companiaObservable  : Compania;

    // ## -- formularios -- ## //
    formularioPlazoInversion  : FormGroup;
    formulario  : FormGroup;

    // ## -- submitPlazoInversion formularios -- ## //
    submittedFormPlazoInversion    : boolean = false;
    submittedForm     : boolean = false;
    
    // ## -- habilita botones -- ## //
    habilitaBtnRegistroPlazoInversion     : boolean = true;
    habilitaBtnActualizaPlazoInversion    : boolean = false;
    habilitaBtnNuevoPlazoInversion        : boolean = false;
    habilitaBtnEliminarPlazoInversion     : boolean = false;
    habilitaBtnRegistro     : boolean = true;
    habilitaBtnActualiza    : boolean = false;
    habilitaBtnNuevo        : boolean = false;
    habilitaBtnElimibar     : boolean = false;

    // ## -- listas analisis -- ## //
    public listObjetosPlazosInversiones  : InvPlazoInversion[];
    public listObjetos  : InvClaseInversion[]  = [];
    
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

    get m () {   return this.formularioPlazoInversion.controls;  }
    get f () {   return this.formulario.controls;  }

    ngOnInit() {

        this.formularioPlazoInversion    = this.formBuilder.group({
            idPlazoInversion            : [null],

            descripcionPlazoInversion   : [null],

            minimoPlazoInversion        :[null],
            maximoPlazoInversion        : [null],

            estadoPlazoInversion        : [null]
        });
        this.formulario    = this.formBuilder.group({
            idClase             : [null],
            codigoClase         : [null],
            descripcionClase    : [null],
            estadoClase         : [null]
        });
        this.nombreModulo = this.moduleObservable.nombre ;

        this.buscarObjetoPlazoInversion(true);
        this.buscarObjeto(true);
    }

    buscarObjetoPlazoInversion(getAll : boolean = false) : void {

        this.alertService.clear();
        this.submittedFormPlazoInversion = true;

        let descripcion = this.formularioPlazoInversion.controls['descripcionPlazoInversion'].value ;

        if (getAll) descripcion = "%%" ;

        this.inversionesService.getPlazoInversion(descripcion, this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {
                    
                    this.inicializaFormularioPlazoInversion(response[0]);

                    if (!this.listObjetosPlazosInversiones) this.listObjetosPlazosInversiones = [] ;

                    this.listObjetosPlazosInversiones = response ;

                } else { 
                
                    this.inicializaFormularioPlazoInversion();
                    this.alertService.info(this.translate.translateKey('ALERTS.NO_RECORDS_FOUND'));
                }
            },
            error => {
                let message : string = this.translate.translateKeyP('ALERTS.CONNECTION_PROBLEMS',{$PH:error});
                this.alertService.error(message);
            });
    }
    inicializaFormularioPlazoInversion(objeto : InvPlazoInversion = null) : void {

        if (objeto) {

            this.habilitaBtnRegistroPlazoInversion = false ;
            this.habilitaBtnActualizaPlazoInversion= true ;
            this.habilitaBtnNuevoPlazoInversion = true ;
            this.habilitaBtnEliminarPlazoInversion = true;

            this.formularioPlazoInversion    = this.formBuilder.group({
                idPlazoInversion            : [objeto.id],

                descripcionPlazoInversion   : [objeto.descripcion, Validators.required],

                minimoPlazoInversion        : [objeto.minimo, Validators.required],
                maximoPlazoInversion        : [objeto.maximo, Validators.required],

                estadoPlazoInversion        : [objeto.estado]
            });
        } else {

            this.habilitaBtnRegistroPlazoInversion = true ;
            this.habilitaBtnActualizaPlazoInversion= false;
            this.habilitaBtnNuevoPlazoInversion = false ;
            this.habilitaBtnEliminarPlazoInversion = false;

            this.formularioPlazoInversion    = this.formBuilder.group({
                idPlazoInversion            : [null],
                
                descripcionPlazoInversion   : [null, Validators.required],

                minimoPlazoInversion        : [null, Validators.required],
                maximoPlazoInversion        : [null, Validators.required],

                estadoPlazoInversion        : [true]
            });
        }
    }

    selectObjetoPlazoInversion(objeto : InvPlazoInversion) : void {

        this.inicializaFormularioPlazoInversion(objeto);
    }

    crearObjectFormPlazoInversion() : InvPlazoInversion {

        var descripcion     = this.formularioPlazoInversion.controls['descripcionPlazoInversion'].value;

        var mimino     = this.formularioPlazoInversion.controls['minimoPlazoInversion'].value;
        var maximo     = this.formularioPlazoInversion.controls['maximoPlazoInversion'].value;

        var estado          = this.formularioPlazoInversion.controls['estadoPlazoInversion'].value;

        var objForm = new InvPlazoInversion (this.companiaObservable.id, descripcion, mimino, maximo, estado) ;

        return objForm ;
    }

    submitPlazoInversion() : void {

        this.alertService.clear();
        this.submittedFormPlazoInversion = true;

        if ( this.formularioPlazoInversion.invalid ) return;

        var objectForm : InvPlazoInversion = this.crearObjectFormPlazoInversion();
        
        objectForm.adicionadoPor    = this.userObservable.identificacion;
        objectForm.fechaAdicion     = this.today;

        this.inversionesService.postPlazoInversion(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if (!this.listObjetosPlazosInversiones) this.listObjetosPlazosInversiones = [] ;

                    this.listObjetosPlazosInversiones.push(response);

                    this.inicializaFormularioPlazoInversion();

                    this.alertService.success( this.translate.translateKey('ALERTS.SUCCESSFUL_REGISTRATION') );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_REGISTRATION_APPLICATION')); }

            }, error => {
                this.alertService.error(this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }

    eliminarObjetoEmisor() : void {

        this.alertService.clear();
        this.submittedFormPlazoInversion = true;

        if ( this.formularioPlazoInversion.invalid ) return;

        var id : number = this.formularioPlazoInversion.controls['idPlazoInversion'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: this.translate.translateKey('ALERTS.dialogConfirmDelete')
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deletePlazoInversion( id )
                    .pipe(first())
                    .subscribe(response => {
                        if (response.exito) {

                            this.listObjetosPlazosInversiones.splice(this.listObjetosPlazosInversiones.findIndex( m => m.id == id ), 1);

                            this.inicializaFormularioPlazoInversion();

                            this.alertService.success(response.responseMesagge);
                            
                        } else { this.alertService.error(response.responseMesagge); }
                    });
                
            } else { return; }
        });
    }

    limpiarFormularioPlazoInversion() : void {

        this.inicializaFormularioPlazoInversion();
    }

    actualizaObjetoPlazoInversion() : void {

        this.alertService.clear();
        this.submittedFormPlazoInversion = true;

        if ( this.formularioPlazoInversion.invalid ) return;

        var objectForm : InvPlazoInversion = this.crearObjectFormPlazoInversion();

        objectForm.id = this.formularioPlazoInversion.controls['idPlazoInversion'].value;
        
        objectForm.modificadoPor        = this.userObservable.identificacion;
        objectForm.fechaModificacion    = this.today;

        this.inversionesService.putPlazoInversion(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if( this.listObjetosPlazosInversiones.find( m => m.id == response.id ) ) {
                        this.listObjetosPlazosInversiones.splice(this.listObjetosPlazosInversiones.findIndex( m => m.id == response.id ), 1);
                    }
                    this.listObjetosPlazosInversiones.push(response);

                    this.inicializaFormularioPlazoInversion();

                    this.alertService.success( this.translate.translateKey('ALERTS.SUCCESSFUL_UPDATE') );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_UPDATE')); }

            }, error => {
                this.alertService.error( this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }


    buscarObjeto(getAll : boolean = false) : void {

        this.alertService.clear();
        this.submittedForm = true;

        let descripcion = this.formulario.controls['descripcionClase'].value ;

        if (getAll) descripcion = "%%" ;

        this.inversionesService.getClaseInversion(descripcion, this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {
                    
                    this.inicializaFormulario(response[0]);

                    this.listObjetos = response ;

                } else { 
                
                    this.inicializaFormulario();
                    this.alertService.info(this.translate.translateKey('ALERTS.NO_RECORDS_FOUND'));
                }
            },
            error => {
                let message : string = this.translate.translateKeyP('ALERTS.CONNECTION_PROBLEMS',{$PH:error});
                this.alertService.error(message);
            });
    }
    inicializaFormulario(objeto : InvClaseInversion = null)       : void {

        if (objeto) {

            this.habilitaBtnRegistro = false ;
            this.habilitaBtnActualiza= true ;
            this.habilitaBtnNuevo = true ;
            this.habilitaBtnElimibar = true;

            this.formulario    = this.formBuilder.group({
                idClase                : [objeto.id],
                codigoClase            : [objeto.codigoClase, Validators.required],
                descripcionClase       : [objeto.descripcion, Validators.required],
                estadoClase            : [objeto.estado, Validators.required]
            });
        } else {

            this.habilitaBtnRegistro = true ;
            this.habilitaBtnActualiza= false;
            this.habilitaBtnNuevo = false ;
            this.habilitaBtnElimibar = false;

            this.formulario    = this.formBuilder.group({
                idClase                : [null],
                codigoClase            : [null, Validators.required],
                descripcionClase       : [null, Validators.required],
                estadoClase            : [true, Validators.required]
            });
        }
    }

    selectObjeto(objeto : InvClaseInversion) : void {

        this.inicializaFormulario(objeto);
    }

    crearObjectForm() : InvClaseInversion {

        var codigoClase            = this.formulario.controls['codigoClase'].value;
        var descripcionClase       = this.formulario.controls['descripcionClase'].value;
        var estadoClase            = this.formulario.controls['estadoClase'].value;

        var objForm = new InvClaseInversion (this.companiaObservable.id, codigoClase, descripcionClase, estadoClase) ;

        return objForm ;
    }

    submit() : void {

        this.alertService.clear();
        this.submittedForm = true;

        if ( this.formulario.invalid ) return;

        var objectForm : InvClaseInversion = this.crearObjectForm();
        
        objectForm.adicionadoPor    = this.userObservable.identificacion;
        objectForm.fechaAdicion     = this.today;

        this.inversionesService.postClaseInversion(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    this.listObjetos.push(response);

                    this.inicializaFormulario();

                    this.alertService.success( this.translate.translateKey('ALERTS.SUCCESSFUL_REGISTRATION') );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_CURRENCY_REGISTRATION')); }

            }, error => {
                this.alertService.error(this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }

    eliminarObjeto() : void {

        this.alertService.clear();
        this.submittedForm = true;

        if ( this.formulario.invalid ) return;

        var id : number = this.formulario.controls['idClase'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: this.translate.translateKey('ALERTS.dialogConfirmDelete')
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deleteClaseInversion( id )
                    .pipe(first())
                    .subscribe(response => {
                        if (response.exito) {

                            this.listObjetos.splice(this.listObjetos.findIndex( m => m.id == id ), 1);

                            this.inicializaFormulario();

                            this.alertService.success(response.responseMesagge);
                            
                        } else { this.alertService.error(response.responseMesagge); }
                    });
                
            } else { return; }
        });
    }

    limpiarFormulario() : void {

        this.inicializaFormulario();
    }

    actualizaObjeto() : void {

        this.alertService.clear();
        this.submittedForm = true;

        if ( this.formulario.invalid ) return;

        var objectForm : InvClaseInversion = this.crearObjectForm();

        objectForm.id = this.formulario.controls['idClase'].value;
        
        objectForm.modificadoPor        = this.userObservable.identificacion;
        objectForm.fechaModificacion    = this.today;

        this.inversionesService.putClaseInversion(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if( this.listObjetos.find( m => m.id == response.id ) ) {
                        this.listObjetos.splice(this.listObjetos.findIndex( m => m.id == response.id ), 1);
                    }
                    this.listObjetos.push(response);

                    this.inicializaFormulario();

                    this.alertService.success( this.translate.translateKey('ALERTS.SUCCESSFUL_UPDATE') );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_UPDATE')); }

            }, error => {
                this.alertService.error( this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }
}