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
import { InvTasa } from '@app/_models/Inversiones/Tasa';

declare var $: any;

@Component({
    templateUrl: 'HTML_Tasas.html',
    styleUrls: ['../../../../assets/scss/app.scss', '../../../../assets/scss/inversiones/app.scss'],
})
export class InvTasasComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'HTML_Tasas.html';
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
    public listObjetos  : InvTasa[]  = [];

    public today : Date ;

    constructor (   private alertService:       AlertService,
                    private inversionesService: InversionesService,
                    private formBuilder:        FormBuilder,
                    private accountService:     AccountService,
                    private dialogo:            MatDialog ) {

        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue;

        this.today = new Date();
    }

    get m () {   return this.formulario.controls;  }

    ngOnInit() {

        this.formulario    = this.formBuilder.group({
            idTasa          : [null],
            codigoTasa      : [null],
            descripcionTasa : [null],

            tasa            : [null],
            porcentual      : [null],

            estadoTasa      : [null]
        });
        this.nombreModulo = this.moduleObservable.nombre ;

        this.buscarObjeto(true);
    }

    buscarObjeto(getAll : boolean = false) : void {

        this.alertService.clear();
        this.submittedForm = true;

        let descripcion = this.formulario.controls['descripcionTasa'].value ;

        if (getAll) descripcion = "%%" ;

        this.inversionesService.getTasa(descripcion, this.companiaObservable.id, false)
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
    inicializaFormulario(objeto : InvTasa = null)       : void {

        if (objeto) {

            this.habilitaBtnRegistro = false ;
            this.habilitaBtnActualiza= true ;
            this.habilitaBtnNuevo = true ;
            this.habilitaBtnElimibar = true;

            this.formulario    = this.formBuilder.group({
                idTasa                : [objeto.id],
                codigoTasa            : [objeto.codigoTasa, Validators.required],
                descripcionTasa       : [objeto.descripcion, Validators.required],

                tasa            : [objeto.tasa, Validators.required],
                porcentual      : [objeto.porcentual, Validators.required],

                estadoTasa            : [objeto.estado, Validators.required]
            });
        } else {

            this.habilitaBtnRegistro = true ;
            this.habilitaBtnActualiza= false;
            this.habilitaBtnNuevo = false ;
            this.habilitaBtnElimibar = false;

            this.formulario    = this.formBuilder.group({
                idTasa          : [null],
                codigoTasa      : [null, Validators.required],
                descripcionTasa : [null, Validators.required],

                tasa            : [null, Validators.required],
                porcentual      : [true, Validators.required],

                estadoTasa      : [true, Validators.required]
            });
        }
    }

    selectObjeto(objeto : InvTasa) : void {

        this.inicializaFormulario(objeto);
    }

    crearObjectForm() : InvTasa {

        var codigoTasa            = this.formulario.controls['codigoTasa'].value;
        var descripcionTasa       = this.formulario.controls['descripcionTasa'].value;

        var tasa       = this.formulario.controls['tasa'].value;
        var porcentual       = this.formulario.controls['porcentual'].value;

        var estadoTasa            = this.formulario.controls['estadoTasa'].value;

        var objForm = new InvTasa (this.companiaObservable.id, codigoTasa, descripcionTasa, tasa, porcentual, estadoTasa) ;

        return objForm ;
    }

    submit() : void {

        this.alertService.clear();
        this.submittedForm = true;

        if ( this.formulario.invalid ) return;

        var objectForm : InvTasa = this.crearObjectForm();
        
        objectForm.adicionadoPor    = this.userObservable.identificacion;
        objectForm.fechaAdicion     = this.today;

        this.inversionesService.postTasa(objectForm)
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

        var id : number = this.formulario.controls['idTasa'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: `Segur@ que desea eliminar el registro para siempre ?`
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deleteTasa( id )
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

        var objectForm : InvTasa = this.crearObjectForm();

        objectForm.id = this.formulario.controls['idTasa'].value;
        
        objectForm.modificadoPor        = this.userObservable.identificacion;
        objectForm.fechaModificacion    = this.today;

        this.inversionesService.putTasa(objectForm)
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