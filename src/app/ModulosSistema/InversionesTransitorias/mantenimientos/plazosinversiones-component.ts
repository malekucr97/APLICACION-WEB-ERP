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

declare var $: any;

@Component({
    templateUrl: 'HTML_PlazosInversiones.html',
    styleUrls: ['../../../../assets/scss/app.scss', '../../../../assets/scss/inversiones/app.scss'],
})
export class InvPlazosInversionesComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'HTML_PlazosInversiones.html';
    public nombreModulo     : string ;

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private moduleObservable    : Module;
    private companiaObservable  : Compania;

    // ## -- formularios -- ## //
    formularioPlazoInversion  : FormGroup;

    // ## -- submitPlazoInversion formularios -- ## //
    submittedFormPlazoInversion    : boolean = false;
    
    // ## -- habilita botones -- ## //
    habilitaBtnRegistroPlazoInversion     : boolean = true;
    habilitaBtnActualizaPlazoInversion    : boolean = false;
    habilitaBtnNuevoPlazoInversion        : boolean = false;
    habilitaBtnEliminarPlazoInversion     : boolean = false;

    // ## -- listas analisis -- ## //
    public listObjetosPlazosInversiones  : InvPlazoInversion[];
    
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

    get m () {   return this.formularioPlazoInversion.controls;  }

    ngOnInit() {

        this.formularioPlazoInversion    = this.formBuilder.group({
            idPlazoInversion            : [null],

            descripcionPlazoInversion   : [null],

            minimoPlazoInversion        :[null],
            maximoPlazoInversion        : [null],

            estadoPlazoInversion        : [null]
        });
        this.nombreModulo = this.moduleObservable.nombre ;

        this.buscarObjetoPlazoInversion(true);
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
                    this.alertService.info('No se encontraron registros .');
                }
            },
            error => {
                let message : string = 'Problemas de conexión: ' + error;
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

                    this.alertService.success( `Registro exitoso .` );

                } else { this.alertService.error(`No fue posible aplicar el registro .`); }

            }, error => {
                this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` );
            });
    }

    eliminarObjetoEmisor() : void {

        this.alertService.clear();
        this.submittedFormPlazoInversion = true;

        if ( this.formularioPlazoInversion.invalid ) return;

        var id : number = this.formularioPlazoInversion.controls['idPlazoInversion'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: `Segur@ que desea eliminar el registro para siempre ?`
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

                    this.alertService.success( `Registro actualizado con éxito.` );

                } else { this.alertService.error(`No fue posible actualizar el registro .`); }

            }, error => {
                this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` );
            });
    }
}