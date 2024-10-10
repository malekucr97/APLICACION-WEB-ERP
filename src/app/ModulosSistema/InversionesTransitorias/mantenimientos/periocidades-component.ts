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
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

declare var $: any;

@Component({
    templateUrl: 'HTML_Periocidades.html',
    styleUrls: ['../../../../assets/scss/app.scss', '../../../../assets/scss/inversiones/app.scss'],
})
export class InvPeriocidadesComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'HTML_Periocidades.html';
    public nombreModulo     : string ;

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private moduleObservable    : Module;
    private companiaObservable  : Compania;

    // ## -- formularios -- ## //
    formulario  : FormGroup;

    // ## -- submit formularios -- ## //
    submittedForm     : boolean = false;

    // ## -- habilita botones -- ## //
    habilitaBtnRegistro     : boolean = true;
    habilitaBtnActualiza    : boolean = false;
    habilitaBtnNuevo        : boolean = false;
    habilitaBtnElimibar     : boolean = false;

    // ## -- listas analisis -- ## //
    public listObjetos  : InvPeriocidad[]  = [];

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

    get m () {   return this.formulario.controls;  }


    ngOnInit() {

        this.formulario    = this.formBuilder.group({
            id                  : [null],
            codigoPeriocidad    : [null],
            descripcion         : [null],
            vecesxAnio          : [null],
            estado              : [null]
        });
        this.nombreModulo = this.moduleObservable.nombre ;

        this.buscarObjeto(true);
    }

    buscarObjeto(getAll : boolean = false) : void {

        this.alertService.clear();
        this.submittedForm = true;

        let codigoPeriocidad = this.formulario.controls['codigoPeriocidad'].value ;

        if (getAll) codigoPeriocidad = "%%" ;

        this.inversionesService.getPeriocidad(codigoPeriocidad, this.companiaObservable.id, false)
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
    inicializaFormulario(objeto : InvPeriocidad = null)       : void {

        if (objeto) {

            this.habilitaBtnRegistro = false ;
            this.habilitaBtnActualiza= true ;
            this.habilitaBtnNuevo = true ;
            this.habilitaBtnElimibar = true;

            this.formulario    = this.formBuilder.group({
                id                  : [objeto.id],
                codigoPeriocidad    : [objeto.codigoPeriocidad, Validators.required],
                descripcion         : [objeto.descripcion, Validators.required],
                vecesxAnio          : [objeto.vecesxAnio, Validators.required],
                estado              : [objeto.estado, Validators.required]
            });
        } else {

            this.habilitaBtnRegistro = true ;
            this.habilitaBtnActualiza= false;
            this.habilitaBtnNuevo = false ;
            this.habilitaBtnElimibar = false;

            this.formulario    = this.formBuilder.group({
                id                  : [null],
                codigoPeriocidad    : [null, Validators.required],
                descripcion         : [null, Validators.required],
                vecesxAnio          : [null, Validators.required],
                estado              : [true, Validators.required]
            });
        }
    }

    selectObjeto(objeto : InvPeriocidad) : void {

        this.inicializaFormulario(objeto);
    }

    crearObjectForm() : InvPeriocidad {

        var codigoPeriocidad   = this.formulario.controls['codigoPeriocidad'].value;
        var descripcion     = this.formulario.controls['descripcion'].value;
        var vecesxAnio = this.formulario.controls['vecesxAnio'].value;
        var estado          = this.formulario.controls['estado'].value;

        var objForm = new InvPeriocidad (this.companiaObservable.id, codigoPeriocidad, descripcion, vecesxAnio, estado) ;

        return objForm ;
    }

    submit() : void {

        this.alertService.clear();
        this.submittedForm = true;

        if ( this.formulario.invalid ) return;

        var objectForm : InvPeriocidad = this.crearObjectForm();
        
        objectForm.adicionadoPor    = this.userObservable.identificacion;
        objectForm.fechaAdicion     = this.today;

        this.inversionesService.postPeriocidad(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    this.listObjetos.push(response);

                    this.inicializaFormulario();

                    this.alertService.success( this.translate.translateKey('ALERTS.SUCCESSFUL_REGISTRATION') );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_CURRENCY_REGISTRATION')); }

            }, error => {
                this.alertService.error( this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }

    eliminarObjeto() : void {

        this.alertService.clear();
        this.submittedForm = true;

        if ( this.formulario.invalid ) return;

        var id : number = this.formulario.controls['id'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: this.translate.translateKey('ALERTS.dialogConfirmDelete')
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deletePeriocidad( id )
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

        var objectForm : InvPeriocidad = this.crearObjectForm();

        objectForm.id = this.formulario.controls['id'].value;
        
        objectForm.modificadoPor        = this.userObservable.identificacion;
        objectForm.fechaModificacion    = this.today;

        this.inversionesService.putPeriocidad(objectForm)
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