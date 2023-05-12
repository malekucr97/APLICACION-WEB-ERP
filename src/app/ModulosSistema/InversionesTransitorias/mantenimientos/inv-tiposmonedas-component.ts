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

declare var $: any;

@Component({
    templateUrl: 'HTML_TiposMonedas.html',
    styleUrls: ['../../../../assets/scss/app.scss', '../../../../assets/scss/inversiones/app.scss'],
})
export class InvTiposMonedasComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'HTML_TiposMonedas.html';

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private moduleObservable    : Module;
    private companiaObservable  : Compania;

    // ## -- formularios -- ## //
    formTipoMoneda              : FormGroup;

    // ## -- submit formularios -- ## //
    submittedTipoMonedaForm     : boolean = false;

    // ## -- habilita botones -- ## //
    habilitaBtnRegistro     : boolean = false;
    habilitaBtnActualiza    : boolean = false;
    habilitaBtnNuevo        : boolean = false;
    habilitaBtnElimibar     : boolean = false;

    public listTiposMonedas  : InvTipoMoneda[]  = [];

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

    get m () {   return this.formTipoMoneda.controls;  }


    ngOnInit() {

        this.formTipoMoneda    = this.formBuilder.group({
            id              : [null],
            codigo_moneda   : [null],
            simbolo         : [null],
            descripcion     : [null],
            valorRiesgo     : [null],
            estado          : [true]
        });

        this.buscarMoneda(true);
    }

    buscarMoneda(getAllMonedas : boolean = false) : void {

        this.alertService.clear();
        this.submittedTipoMonedaForm = true;

        let codigoMoneda = this.formTipoMoneda.controls['codigo_moneda'].value ;

        if (getAllMonedas) codigoMoneda = "%%" ;

        this.inversionesService.getTiposMonedasInversiones(codigoMoneda, this.companiaObservable.id, true)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {
                    
                    this.inicializaFormTipoMoneda(response[0]);

                    this.listTiposMonedas = response ;

                } else { this.alertService.info('No se encontraron registros .'); }
            },
            error => {
                let message : string = 'Problemas de conexión: ' + error;
                this.alertService.error(message);
            });
    }

    selectAnalisisHistorial(moneda : InvTipoMoneda) : void {

        this.inicializaFormTipoMoneda(moneda);
    }

    inicializaFormTipoMoneda(objetoMoneda : InvTipoMoneda = null)       : void {

        if (objetoMoneda) {

            this.habilitaBtnRegistro = false ;
            this.habilitaBtnActualiza= true ;
            this.habilitaBtnNuevo = true ;
            this.habilitaBtnElimibar = true;

            this.formTipoMoneda    = this.formBuilder.group({
                id              : [objetoMoneda.id],
                codigo_moneda   : [objetoMoneda.codigoMoneda, Validators.required],
                simbolo         : [objetoMoneda.simbolo, Validators.required],
                descripcion     : [objetoMoneda.descripcion, Validators.required],
                valorRiesgo     : [objetoMoneda.valorRiesgo],
                estado          : [objetoMoneda.estado, Validators.required]
            });
        } else {

            this.habilitaBtnRegistro = true ;
            this.habilitaBtnActualiza= false;
            this.habilitaBtnNuevo = false ;
            this.habilitaBtnElimibar = false;

            this.formTipoMoneda    = this.formBuilder.group({
                id              : [null],
                codigo_moneda   : [null, Validators.required],
                simbolo         : [null, Validators.required],
                descripcion     : [null, Validators.required],
                valorRiesgo     : [null],
                estado          : [true, Validators.required]
            });
        }
    }

    crearMonedaObjectForm() : InvTipoMoneda {

        var codigo_moneda   = this.formTipoMoneda.controls['codigo_moneda'].value;
        var simbolo         = this.formTipoMoneda.controls['simbolo'].value;
        var descripcion     = this.formTipoMoneda.controls['descripcion'].value;
        var valorRiesgo     = this.formTipoMoneda.controls['valorRiesgo'].value;
        var estado          = this.formTipoMoneda.controls['estado'].value;

        var monedaForm = new InvTipoMoneda (codigo_moneda, this.companiaObservable.id, descripcion, simbolo, valorRiesgo, estado) ;

        return monedaForm ;
    }

    submitMoneda() : void {

        this.alertService.clear();
        this.submittedTipoMonedaForm = true;

        if ( this.formTipoMoneda.invalid ) return;

        var monedaForm : InvTipoMoneda = this.crearMonedaObjectForm();
        
        monedaForm.adicionadoPor    = this.userObservable.identificacion;
        monedaForm.fechaAdicion     = this.today;

        this.inversionesService.postTipoMoneda(monedaForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    this.listTiposMonedas.push(response);

                    this.inicializaFormTipoMoneda();

                    this.alertService.success( `Moneda ${response.codigoMoneda} registrada con éxito.` );

                } else { this.alertService.error(`No fue posible registrar la moneda .`); }

            }, error => {
                this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` );
            });
    }

    eliminarMoneda() : void {

        this.alertService.clear();
        this.submittedTipoMonedaForm = true;

        if ( this.formTipoMoneda.invalid ) return;

        var monedaForm : InvTipoMoneda = this.crearMonedaObjectForm();

        var idMoneda : number = this.formTipoMoneda.controls['id'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: `Segur@ que desea eliminar la moneda para siempre ?`
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deleteTipoMoneda( idMoneda )
                    .pipe(first())
                    .subscribe(response => {
                        if (response.exito) {

                            this.listTiposMonedas.splice(this.listTiposMonedas.findIndex( m => m.id == idMoneda ), 1);

                            this.inicializaFormTipoMoneda();

                            this.alertService.success(response.responseMesagge);
                            
                        } else { this.alertService.error(response.responseMesagge); }
                    });
                
            } else { return; }
        });
    }

    limpiarFormularioMoneda() : void {

        this.inicializaFormTipoMoneda();
    }

    actualizaMoneda() : void {

        this.alertService.clear();
        this.submittedTipoMonedaForm = true;

        if ( this.formTipoMoneda.invalid ) return;

        var monedaForm : InvTipoMoneda = this.crearMonedaObjectForm();

        monedaForm.id = this.formTipoMoneda.controls['id'].value;
        
        monedaForm.modificadoPor        = this.userObservable.identificacion;
        monedaForm.fechaModificacion    = this.today;

        this.inversionesService.putTipoMoneda(monedaForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if( this.listTiposMonedas.find( m => m.id == response.id ) ) {
                        this.listTiposMonedas.splice(this.listTiposMonedas.findIndex( m => m.id == response.id ), 1);
                    }
                    this.listTiposMonedas.push(response);

                    this.inicializaFormTipoMoneda();

                    this.alertService.success( `Moneda ${response.codigoMoneda} actualizada con éxito.` );

                } else { this.alertService.error(`No fue posible actualizar la moneda .`); }

            }, error => {
                this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` );
            });
    }
}