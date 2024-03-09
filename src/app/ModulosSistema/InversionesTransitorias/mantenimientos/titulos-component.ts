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
import { InvTipoSector } from '@app/_models/Inversiones/TipoSector';
import { InvTasa } from '@app/_models/Inversiones/Tasa';
import { InvClaseInversion } from '@app/_models/Inversiones/ClaseInversion';
import { InvPlazoInversion } from '@app/_models/Inversiones/PlazoInversion';
import { InvTipoMercado } from '@app/_models/Inversiones/TipoMercado';
import { InvEmisor } from '@app/_models/Inversiones/Emisor';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

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

    public listSectores         : InvTipoSector[]       = [];
    public listTasas            : InvTasa[]             = [];
    public listClasesInversion  : InvClaseInversion[]   = [];
    public listPlazosInversion  : InvPlazoInversion[]   = [];
    public listMercados         : InvTipoMercado[]      = [];
    public listEmisores         : InvEmisor[]           = [];
    public listMonedas          : InvTipoMoneda[]       = [];

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
            idTitulo                : [null],
            codigoTitulo            : [null],
            descripcionTitulo       : [null],

            tasaImpuestoRenta       : [null],
            idTasa       : [null],
            idClase       : [null],
            idPlazo       : [null],
            idMercado       : [null],
            idSector       : [null],
            idEmisor       : [null],
            idMoneda       : [null],
            calculaIntereses       : [null],
            calculaImpuestos       : [null],
            calculaCupones       : [null],

            estadoTitulo            : [null]
        });
        this.nombreModulo = this.moduleObservable.nombre ;

        this.inversionesService.getTipoSector('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listSectores = response ; });

        this.inversionesService.getTasa('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listTasas = response ; });

        this.inversionesService.getClaseInversion('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listClasesInversion = response ; });

        this.inversionesService.getPlazoInversion('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listPlazosInversion = response ; });

        this.inversionesService.getTipoMercado('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listMercados = response ; });

        this.inversionesService.getEmisor('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listEmisores = response ; });

        this.inversionesService.getTiposMonedas('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listMonedas = response ; });

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
                    this.alertService.info(this.translate.translateKey('ALERTS.NO_RECORDS_FOUND'));
                }
            },
            error => {
                let message : string = this.translate.translateKeyP('ALERTS.CONNECTION_PROBLEMS',{$PH:error});
                this.alertService.error(message);
            });
    }
    
    inicializaFormulario(objeto : InvTitulo = null) : void {

        if (objeto) {

            this.habilitaBtnRegistro    = false ;
            this.habilitaBtnActualiza   = true ;
            this.habilitaBtnNuevo       = true ;
            this.habilitaBtnElimibar    = true;

            this.formulario    = this.formBuilder.group({
                idTitulo                : [objeto.id],
                codigoTitulo            : [objeto.codigoTitulo, Validators.required],
                descripcionTitulo       : [objeto.descripcion, Validators.required],
                tasaImpuestoRenta : [objeto.tasaImpuestoRenta, Validators.required],

                idTasa : [this.listTasas.find( x => x.id === objeto.idTasa ), Validators.required],
                idClase : [this.listClasesInversion.find( x => x.id === objeto.idClase ), Validators.required],
                idPlazo : [this.listPlazosInversion.find( x => x.id === objeto.idPlazo ), Validators.required],
                idMercado : [this.listMercados.find( x => x.id === objeto.idMercado ), Validators.required],
                idSector : [this.listSectores.find( x => x.id === objeto.idSector ), Validators.required],
                idEmisor : [this.listEmisores.find( x => x.id === objeto.idEmisor ), Validators.required],
                idMoneda : [this.listMonedas.find( x => x.id === objeto.idMoneda ), Validators.required],

                calculaIntereses : [objeto.calculaIntereses, Validators.required],
                calculaImpuestos : [objeto.calculaImpuestos, Validators.required],
                calculaCupones : [objeto.calculaCupones, Validators.required],

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
                tasaImpuestoRenta : [null, Validators.required],

                idTasa : [null, Validators.required],
                idClase : [null, Validators.required],
                idPlazo : [null, Validators.required],
                idMercado : [null, Validators.required],
                idSector : [null, Validators.required],
                idEmisor : [null, Validators.required],
                idMoneda : [null, Validators.required],

                calculaIntereses : [true, Validators.required],
                calculaImpuestos : [true, Validators.required],
                calculaCupones : [true, Validators.required],

                estadoTitulo            : [true, Validators.required]
            });
        }
    }

    selectObjeto(objeto : InvTitulo) : void {

        this.inicializaFormulario(objeto);
    }

    crearObjectForm() : InvTitulo {

        var codigoTitulo        = this.formulario.controls['codigoTitulo'].value;
        var descripcionTitulo   = this.formulario.controls['descripcionTitulo'].value;
        var tasaImpuestoRenta   = this.formulario.controls['tasaImpuestoRenta'].value;

        var idTasa = this.formulario.controls['idTasa'].value.id;
        var idClase = this.formulario.controls['idClase'].value.id;
        var idPlazo = this.formulario.controls['idPlazo'].value.id;
        var idMercado = this.formulario.controls['idMercado'].value.id;
        var idSector = this.formulario.controls['idSector'].value.id;
        var idEmisor = this.formulario.controls['idEmisor'].value.id;
        var idMoneda = this.formulario.controls['idMoneda'].value.id;
        var calculaIntereses = this.formulario.controls['calculaIntereses'].value;
        var calculaImpuestos = this.formulario.controls['calculaImpuestos'].value;
        var calculaCupones = this.formulario.controls['calculaCupones'].value;

        var estadoTitulo            = this.formulario.controls['estadoTitulo'].value;

        var objForm = new InvTitulo (this.companiaObservable.id, codigoTitulo, descripcionTitulo, tasaImpuestoRenta, idTasa,
            idClase,
            idPlazo,
            idMercado,
            idSector,
            idEmisor,
            idMoneda,
            calculaIntereses,
            calculaImpuestos,
            calculaCupones,
            estadoTitulo) ;

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

        var id : number = this.formulario.controls['idTitulo'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: this.translate.translateKey('ALERTS.dialogConfirmDelete')
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

                    this.alertService.success( this.translate.translateKey('ALERTS.SUCCESSFUL_UPDATE') );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_UPDATE')); }

            }, error => {
                this.alertService.error( this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }
}