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
import { InvTitulo } from '@app/_models/Inversiones/Titulo';

declare var $: any;

@Component({
    templateUrl: 'HTML_Titulos.html',
    styleUrls: ['../../../../assets/scss/app.scss', '../../../../assets/scss/inversiones/app.scss'],
})
export class InvTitulosComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'HTML_Titulos.html';
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
    public listObjetos  : InvTitulo[]  = [];

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

    get m () {   return this.formulario.controls;  }

    ngOnInit() {

        this.formulario    = this.formBuilder.group({
            idTitulo                : [null],
            codigoTitulo            : [null],
            descripcionTitulo       : [null],
            porcentajeInteresTitulo : [null],
            estadoTitulo            : [null]
        });
        this.nombreModulo = this.moduleObservable.nombre ;

        this.buscarObjeto(true);
    }

    buscarObjeto(getAll : boolean = false) : void {

        this.alertService.clear();
        this.submittedForm = true;

        let descripcion = this.formulario.controls['descripcionTitulo'].value ;

        if (getAll) descripcion = "%%" ;

        this.inversionesService.getTitulo(descripcion, this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {
                    
                    this.inicializaFormulario(response[0]);

                    this.listObjetos = response ;

                } else { 
                
                    this.inicializaFormulario();
                    this.alertService.info('No se encontraron registros .');
                }
            },
            error => {
                let message : string = 'Problemas de conexión: ' + error;
                this.alertService.error(message);
            });
    }
    inicializaFormulario(objeto : InvTitulo = null)       : void {

        if (objeto) {

            this.habilitaBtnRegistro = false ;
            this.habilitaBtnActualiza= true ;
            this.habilitaBtnNuevo = true ;
            this.habilitaBtnElimibar = true;

            this.formulario    = this.formBuilder.group({
                idTitulo                : [objeto.id],
                codigoTitulo            : [objeto.codigoTitulo, Validators.required],
                descripcionTitulo       : [objeto.descripcion, Validators.required],
                porcentajeInteresTitulo : [objeto.porcentajeInteres, Validators.required],
                estadoTitulo            : [objeto.estado, Validators.required]
            });
        } else {

            this.habilitaBtnRegistro = true ;
            this.habilitaBtnActualiza= false;
            this.habilitaBtnNuevo = false ;
            this.habilitaBtnElimibar = false;

            this.formulario    = this.formBuilder.group({
                idTitulo                : [null],
                codigoTitulo            : [null, Validators.required],
                descripcionTitulo       : [null, Validators.required],
                porcentajeInteresTitulo : [null, Validators.required],
                estadoTitulo            : [true, Validators.required]
            });
        }
    }

    selectObjeto(objeto : InvTitulo) : void {

        this.inicializaFormulario(objeto);
    }

    crearObjectForm() : InvTitulo {

        var codigoTitulo            = this.formulario.controls['codigoTitulo'].value;
        var descripcionTitulo       = this.formulario.controls['descripcionTitulo'].value;
        var porcentajeInteresTitulo = this.formulario.controls['porcentajeInteresTitulo'].value;
        var estadoTitulo            = this.formulario.controls['estadoTitulo'].value;

        var objForm = new InvTitulo (this.companiaObservable.id, codigoTitulo, descripcionTitulo, porcentajeInteresTitulo, estadoTitulo) ;

        return objForm ;
    }

    submit() : void {

        this.alertService.clear();
        this.submittedForm = true;

        if ( this.formulario.invalid ) return;

        var objectForm : InvTitulo = this.crearObjectForm();
        
        objectForm.adicionadoPor    = this.userObservable.identificacion;
        objectForm.fechaAdicion     = this.today;

        this.inversionesService.postTitulo(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    this.listObjetos.push(response);

                    this.inicializaFormulario();

                    this.alertService.success( `Registro exitoso .` );

                } else { this.alertService.error(`No fue posible registrar la moneda .`); }

            }, error => {
                this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` );
            });
    }

    eliminarObjeto() : void {

        this.alertService.clear();
        this.submittedForm = true;

        if ( this.formulario.invalid ) return;

        var id : number = this.formulario.controls['idTitulo'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: `Segur@ que desea eliminar el registro para siempre ?`
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deleteTitulo( id )
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

        var objectForm : InvTitulo = this.crearObjectForm();

        objectForm.id = this.formulario.controls['idTitulo'].value;
        
        objectForm.modificadoPor        = this.userObservable.identificacion;
        objectForm.fechaModificacion    = this.today;

        this.inversionesService.putTitulo(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if( this.listObjetos.find( m => m.id == response.id ) ) {
                        this.listObjetos.splice(this.listObjetos.findIndex( m => m.id == response.id ), 1);
                    }
                    this.listObjetos.push(response);

                    this.inicializaFormulario();

                    this.alertService.success( `Registro actualizado con éxito con éxito.` );

                } else { this.alertService.error(`No fue posible actualizar el registro .`); }

            }, error => {
                this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` );
            });
    }
}