import { FormBuilder, FormGroup, Validators  }      from '@angular/forms';
import { Component, OnInit, ViewChild }             from '@angular/core';
import { AccountService, AlertService }             from '@app/_services';
import { MatSidenav }                               from '@angular/material/sidenav';

import { User, Module, Compania }                   from '@app/_models';

import { MatDialog }                                from '@angular/material/dialog';
import { DialogoConfirmacionComponent }             from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';

// ## -- servicio macred http -- ## //
import { InversionesService }                       from '@app/_services/inversiones.service';
import { first } from 'rxjs/operators';
import { InvTipoSector } from '@app/_models/Inversiones/TipoSector';
import { InvEmisor } from '@app/_models/Inversiones/Emisor';
import { InvTipoPersona } from '@app/_models/Inversiones/TipoPersona';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

declare var $: any;

@Component({
    templateUrl: 'HTML_Emisores.html',
    styleUrls: ['../../../../assets/scss/app.scss', '../../../../assets/scss/inversiones/app.scss'],
})
export class InvEmisoresComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'HTML_Emisores.html';
    public nombreModulo     : string ;

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private moduleObservable    : Module;
    private companiaObservable  : Compania;

    // ## -- formularios -- ## //
    formularioEmisor  : FormGroup;

    // ## -- submitEmisor formularios -- ## //
    submittedFormEmisor    : boolean = false;
    
    // ## -- habilita botones -- ## //
    habilitaBtnRegistroEmisor     : boolean = true;
    habilitaBtnActualizaEmisor    : boolean = false;
    habilitaBtnNuevoEmisor        : boolean = false;
    habilitaBtnElimibarEmisor     : boolean = false;

    // ## -- listas analisis -- ## //
    public listObjetosEmisores  : InvEmisor[];
    
    public listTiposPersonas    : InvTipoPersona[]  = [];
    public listSectores         : InvTipoSector[]   = [];


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

    get m () {   return this.formularioEmisor.controls;  }


    ngOnInit() {

        this.formularioEmisor    = this.formBuilder.group({
            idEmisor            : [null],

            idTipoPersonaEmisor : [null],
            idTipoSectorEmisor  : [null],

            codigoEmisor        : [null],
            descripcionEmisor   : [null],

            identificacionEmisor: [null],
            otrasResenasEmisor  : [null],

            estadoEmisor        : [null]
        });
        this.nombreModulo = this.moduleObservable.nombre ;

        this.inversionesService.getTiposPersonaDescripcion('%%', this.companiaObservable.id, true)
            .pipe(first())
            .subscribe(response => { this.listTiposPersonas = response; });

        this.inversionesService.getTipoSector('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listSectores = response ; });

        this.buscarObjetoEmisor(true);
    }

    buscarObjetoEmisor(getAll : boolean = false) : void {

        this.alertService.clear();
        this.submittedFormEmisor = true;

        let descripcion = this.formularioEmisor.controls['descripcionEmisor'].value ;

        if (getAll) descripcion = "%%" ;

        this.inversionesService.getEmisor(descripcion, this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {
                    
                    this.inicializaFormularioEmisor(response[0]);

                    if (!this.listObjetosEmisores) this.listObjetosEmisores = [] ;

                    this.listObjetosEmisores = response ;

                } else { 
                
                    this.inicializaFormularioEmisor();
                    this.alertService.info(this.translate.translateKey('ALERTS.NO_RECORDS_FOUND'));
                }
            },
            error => {
                let message : string = this.translate.translateKeyP('ALERTS.CONNECTION_PROBLEMS',{$PH:error});
                this.alertService.error(message);
            });
    }
    inicializaFormularioEmisor(objeto : InvEmisor = null) : void {

        if (objeto) {

            this.habilitaBtnRegistroEmisor = false ;
            this.habilitaBtnActualizaEmisor= true ;
            this.habilitaBtnNuevoEmisor = true ;
            this.habilitaBtnElimibarEmisor = true;

            this.formularioEmisor    = this.formBuilder.group({
                idEmisor            : [objeto.id],

                idTipoPersonaEmisor : [this.listTiposPersonas.find( x => x.id === objeto.idTipoPersona ), Validators.required],
                idTipoSectorEmisor  : [this.listSectores.find( x => x.id === objeto.idTipoSector ), Validators.required],

                codigoEmisor        : [objeto.codigoEmisor, Validators.required],
                descripcionEmisor   : [objeto.descripcion, Validators.required],

                identificacionEmisor: [objeto.identificacion],
                otrasResenasEmisor  : [objeto.otrasResenas],

                estadoEmisor        : [objeto.estado]
            });
        } else {

            this.habilitaBtnRegistroEmisor = true ;
            this.habilitaBtnActualizaEmisor= false;
            this.habilitaBtnNuevoEmisor = false ;
            this.habilitaBtnElimibarEmisor = false;

            this.formularioEmisor    = this.formBuilder.group({
                idEmisor            : [null],

                idTipoPersonaEmisor : [null, Validators.required],
                idTipoSectorEmisor  : [null, Validators.required],

                codigoEmisor        : [null, Validators.required],
                descripcionEmisor   : [null, Validators.required],

                identificacionEmisor: [null],
                otrasResenasEmisor  : [null],

                estadoEmisor        : [true]
            });
        }
    }

    selectObjetoEmisor(objeto : InvEmisor) : void {

        this.inicializaFormularioEmisor(objeto);
    }

    crearObjectFormEmisor() : InvEmisor {

        var idTipoPersona   = this.formularioEmisor.controls['idTipoPersonaEmisor'].value.id;
        var idTipoSector     = this.formularioEmisor.controls['idTipoSectorEmisor'].value.id;

        var codigoEmisor     = this.formularioEmisor.controls['codigoEmisor'].value;
        var descripcion     = this.formularioEmisor.controls['descripcionEmisor'].value;

        var identificacion     = this.formularioEmisor.controls['identificacionEmisor'].value;
        var otrasResenas     = this.formularioEmisor.controls['otrasResenasEmisor'].value;

        var estado          = this.formularioEmisor.controls['estadoEmisor'].value;

        var objForm = new InvEmisor (this.companiaObservable.id, idTipoPersona, idTipoSector, codigoEmisor, descripcion, identificacion, otrasResenas, estado) ;

        return objForm ;
    }

    submitEmisor() : void {

        this.alertService.clear();
        this.submittedFormEmisor = true;

        if ( this.formularioEmisor.invalid ) return;

        var objectForm : InvEmisor = this.crearObjectFormEmisor();
        
        objectForm.adicionadoPor    = this.userObservable.identificacion;
        objectForm.fechaAdicion     = this.today;

        this.inversionesService.postEmisor(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if (!this.listObjetosEmisores) this.listObjetosEmisores = [] ;

                    this.listObjetosEmisores.push(response);

                    this.inicializaFormularioEmisor();

                    this.alertService.success(this.translate.translateKey('ALERTS.SUCCESSFUL_REGISTRATION') );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_REGISTRATION_APPLICATION')); }

            }, error => {
                this.alertService.error( this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }

    eliminarObjetoEmisor() : void {

        this.alertService.clear();
        this.submittedFormEmisor = true;

        if ( this.formularioEmisor.invalid ) return;

        var id : number = this.formularioEmisor.controls['idEmisor'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: this.translate.translateKey('ALERTS.dialogConfirmDelete')
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deleteEmisor( id )
                    .pipe(first())
                    .subscribe(response => {
                        if (response.exito) {

                            this.listObjetosEmisores.splice(this.listObjetosEmisores.findIndex( m => m.id == id ), 1);

                            this.inicializaFormularioEmisor();

                            this.alertService.success(response.responseMesagge);
                            
                        } else { this.alertService.error(response.responseMesagge); }
                    });
                
            } else { return; }
        });
    }

    limpiarFormularioEmisor() : void {

        this.inicializaFormularioEmisor();
    }

    actualizaObjetoEmisor() : void {

        this.alertService.clear();
        this.submittedFormEmisor = true;

        if ( this.formularioEmisor.invalid ) return;

        var objectForm : InvEmisor = this.crearObjectFormEmisor();

        objectForm.id = this.formularioEmisor.controls['idEmisor'].value;
        
        objectForm.modificadoPor        = this.userObservable.identificacion;
        objectForm.fechaModificacion    = this.today;

        this.inversionesService.putEmisor(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if( this.listObjetosEmisores.find( m => m.id == response.id ) ) {
                        this.listObjetosEmisores.splice(this.listObjetosEmisores.findIndex( m => m.id == response.id ), 1);
                    }
                    this.listObjetosEmisores.push(response);

                    this.inicializaFormularioEmisor();

                    this.alertService.success( this.translate.translateKey('ALERTS.SUCCESSFUL_UPDATE') );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_UPDATE')); }

            }, error => {
                this.alertService.error( this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }
}