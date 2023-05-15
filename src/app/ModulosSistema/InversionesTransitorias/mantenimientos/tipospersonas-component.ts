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
import { InvTipoPersona } from '@app/_models/Inversiones/TipoPersona';

declare var $: any;

@Component({
    templateUrl: 'HTML_TiposPersonas.html',
    styleUrls: ['../../../../assets/scss/app.scss', '../../../../assets/scss/inversiones/app.scss'],
})
export class InvTiposPersonasComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'HTML_TiposPersonas.html';

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private moduleObservable    : Module;
    private companiaObservable  : Compania;

    // ## -- formularios -- ## //
    formTipoPersona              : FormGroup;

    // ## -- submit formularios -- ## //
    submittedTipoPersonaForm     : boolean = false;

    // ## -- habilita botones -- ## //
    habilitaBtnRegistro     : boolean = true;
    habilitaBtnActualiza    : boolean = false;
    habilitaBtnNuevo        : boolean = false;
    habilitaBtnElimibar     : boolean = false;

    public listTiposPersonas  : InvTipoPersona[]  = [];

    public today : Date ;

    constructor (   private alertService:      AlertService,
                    private inversionesService:     InversionesService,
                    private formBuilder:       FormBuilder,
                    private accountService:     AccountService,
                    private dialogo:           MatDialog ) {

        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue;

        this.today = new Date();
    }

    get m () {   return this.formTipoPersona.controls;  }


    ngOnInit() {

        this.formTipoPersona    = this.formBuilder.group({
            id                      : [null],
            descripcion             : [null],
            mascaraIdentificacion   : [null],
            estado                  : [true]
        });

        this.buscarTiposPersona(true);
    }

    buscarTiposPersona(getAllPersonas : boolean = false) : void {

        this.alertService.clear();
        this.submittedTipoPersonaForm = true;

        let descripcion = this.formTipoPersona.controls['descripcion'].value ;

        if (getAllPersonas) descripcion = "%%" ;

        this.inversionesService.getTiposPersonaDescripcion(descripcion, this.companiaObservable.id, true)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {
                    
                    this.inicializaformTipoPersona(response[0]);

                    this.listTiposPersonas = response ;

                } else { this.alertService.info('No se encontraron registros .'); }
            },
            error => {
                let message : string = 'Problemas de conexión: ' + error;
                this.alertService.error(message);
            });
    }

    selectTipoPersona(moneda : InvTipoPersona) : void {

        this.inicializaformTipoPersona(moneda);
    }

    inicializaformTipoPersona(objeto : InvTipoPersona = null)       : void {

        if (objeto) {

            this.habilitaBtnRegistro = false ;
            this.habilitaBtnActualiza= true ;
            this.habilitaBtnNuevo = true ;
            this.habilitaBtnElimibar = true;

            this.formTipoPersona    = this.formBuilder.group({
                id                      : [objeto.id],
                descripcion             : [objeto.descripcion, Validators.required],
                mascaraIdentificacion   : [objeto.mascaraIdentificacion],
                estado                  : [objeto.estado, Validators.required]
            });
        } else {

            this.habilitaBtnRegistro = true ;
            this.habilitaBtnActualiza= false;
            this.habilitaBtnNuevo = false ;
            this.habilitaBtnElimibar = false;

            this.formTipoPersona    = this.formBuilder.group({
                id                      : [null],
                descripcion             : [null, Validators.required],
                mascaraIdentificacion   : [null],
                estado                  : [true, Validators.required]
            });
        }
    }

    crearTipoPersonaObjectForm() : InvTipoPersona {

        var descripcion             = this.formTipoPersona.controls['descripcion'].value;
        var mascaraIdentificacion   = this.formTipoPersona.controls['mascaraIdentificacion'].value;
        var estado                  = this.formTipoPersona.controls['estado'].value;

        var objectForm = new InvTipoPersona (this.companiaObservable.id, descripcion, mascaraIdentificacion, estado) ;

        return objectForm ;
    }

    submitTipoPersona() : void {

        this.alertService.clear();
        this.submittedTipoPersonaForm = true;

        if ( this.formTipoPersona.invalid ) return;

        var objectForm : InvTipoPersona = this.crearTipoPersonaObjectForm();
        
        objectForm.adicionadoPor    = this.userObservable.identificacion;
        objectForm.fechaAdicion     = this.today;

        this.inversionesService.postTipoPersona(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    this.listTiposPersonas.push(response);

                    this.inicializaformTipoPersona();

                    this.alertService.success( `Tipo de persona ${response.descripcion} registrado con éxito.` );

                } else { this.alertService.error(`No fue posible registrar el tipo de persona .`); }

            }, error => {
                this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` );
            });
    }

    eliminarTipoPersona() : void {

        this.alertService.clear();
        this.submittedTipoPersonaForm = true;

        if ( this.formTipoPersona.invalid ) return;

        var id : number = this.formTipoPersona.controls['id'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: `Segur@ que desea eliminar el registro para siempre ?`
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deleteTipoPersona( id )
                    .pipe(first())
                    .subscribe(response => {
                        if (response.exito) {

                            this.listTiposPersonas.splice(this.listTiposPersonas.findIndex( m => m.id == id ), 1);

                            this.inicializaformTipoPersona();

                            this.alertService.success(response.responseMesagge);
                            
                        } else { this.alertService.error(response.responseMesagge); }
                    });
                
            } else { return; }
        });
    }

    limpiarFormularioTipoPersona() : void {

        this.inicializaformTipoPersona();
    }

    actualizaTipoPersona() : void {

        this.alertService.clear();
        this.submittedTipoPersonaForm = true;

        if ( this.formTipoPersona.invalid ) return;

        var objectForm : InvTipoPersona = this.crearTipoPersonaObjectForm();

        objectForm.id = this.formTipoPersona.controls['id'].value;
        
        objectForm.modificadoPor        = this.userObservable.identificacion;
        objectForm.fechaModificacion    = this.today;

        this.inversionesService.putTipoPersona(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if( this.listTiposPersonas.find( m => m.id == response.id ) ) {
                        this.listTiposPersonas.splice(this.listTiposPersonas.findIndex( m => m.id == response.id ), 1);
                    }
                    this.listTiposPersonas.push(response);

                    this.inicializaformTipoPersona();

                    this.alertService.success( `Tipo de persona ${response.descripcion} actualizado con éxito.` );

                } else { this.alertService.error(`No fue posible actualizar el registro .`); }

            }, error => {
                this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` );
            });
    }
}