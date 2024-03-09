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
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

declare var $: any;

@Component({
    templateUrl: 'HTML_TiposMonedas.html',
    styleUrls: ['../../../../assets/scss/app.scss', '../../../../assets/scss/inversiones/app.scss'],
})
export class InvTiposMonedasComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'HTML_TiposMonedas.html';
    public nombreModulo     : string ;

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private moduleObservable    : Module;
    private companiaObservable  : Compania;

    // ## -- formularios -- ## //
    formTipoMoneda              : FormGroup;
    formTipoCambio              : FormGroup;

    // ## -- submit formularios -- ## //
    submittedTipoMonedaForm     : boolean = false;
    submittedFormTipoCambio     : boolean = false;

    // ## -- habilita botones -- ## //
    habilitaBtnRegistro     : boolean = true;
    habilitaBtnActualiza    : boolean = false;
    habilitaBtnNuevo        : boolean = false;
    habilitaBtnElimibar     : boolean = false;
    habilitaBtnRegistroTC     : boolean = true;
    habilitaBtnActualizaTC    : boolean = false;
    habilitaBtnNuevoTC        : boolean = false;
    habilitaBtnEliminarTC     : boolean = false;

    // ## -- habilita grids -- ## //
    habilitaTipoCambioMoneda    : boolean = false;
    habilitaFormularioTipoCambio : boolean = false;
    habilitaListaTipoCambio : boolean = false;

    // ## -- listas analisis -- ## //
    public listTiposMonedas  : InvTipoMoneda[]  = [];
    public listObjetosTipoCambio  : InvTipoCambio[]  = [];

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

    get m () {   return this.formTipoMoneda.controls;  }
    get t () {   return this.formTipoCambio.controls;  }


    ngOnInit() {

        this.formTipoMoneda    = this.formBuilder.group({
            id                  : [null],
            codigo_moneda       : [null],
            simbolo             : [null],
            descripcion         : [null],
            bccrIndicadorCompra : [null],
            bccrIndicadorVenta  : [null],
            estado              : [true]
        });
        this.formTipoCambio    = this.formBuilder.group({
            id              : [null],
            idMoneda        : [null],
            montoCompra     : [null],
            montoVenta      : [null],
            fechaConsulta   : [null]

        });
        this.nombreModulo = this.moduleObservable.nombre ;

        this.buscarMoneda(true);
    }

    obtieneFechaConsultaWebServiceTipoCambio() : string {

        if (!this.formTipoCambio.controls['fechaConsulta'].value) return "%%" ;

        let fechaConsulta = new Date(this.formTipoCambio.controls['fechaConsulta'].value);
    
        let date    = fechaConsulta.getDate();
        let month   = fechaConsulta.getMonth() + 1;
        let year    = fechaConsulta.getFullYear();
    
        let dia     : string = "" ;
        let mes     : string = "" ;
        let anio    : string = year.toString() ;
    
        dia = date.toString();
        if (date < 10) dia = '0' + date.toString();
          
        mes = month.toString();
        if (month < 10) mes = '0' + month.toString();
        
        let fechaConsultaCompleta : string = dia + '/' + mes + '/' + anio ;

        return fechaConsultaCompleta ;
    }

    consultarWSBCCRTipoCambio() : void {

        this.alertService.clear();
        this.submittedTipoMonedaForm = true;

        let poseeIndicadoresBCCR : Boolean = false ;

        if ( this.formTipoMoneda.invalid ) return;

        let idMoneda = this.formTipoMoneda.controls['id'].value ;
        let bccrIndicadorCompra = this.formTipoMoneda.controls['bccrIndicadorCompra'].value ;
        let bccrIndicadorVenta = this.formTipoMoneda.controls['bccrIndicadorVenta'].value ;

        if (isNaN(+bccrIndicadorCompra) == false && bccrIndicadorCompra > 0) poseeIndicadoresBCCR = true ;

        if (isNaN(+bccrIndicadorVenta) == false && bccrIndicadorVenta > 0 && poseeIndicadoresBCCR) poseeIndicadoresBCCR = true ;

        if(!poseeIndicadoresBCCR){
            this.alertService.error(this.translate.translateKey('ALERTS.BCCR_ExchangeRate_Indicators_Required'));
            return ;
        }

        let fechaConsultaCompleta : string = this.obtieneFechaConsultaWebServiceTipoCambio();
        
        this.inversionesService.requestTipoCambioBCCR(bccrIndicadorCompra, bccrIndicadorVenta, idMoneda, this.companiaObservable.id, fechaConsultaCompleta)
            .pipe(first())
            .subscribe(responseTiposCambioBCCR => {

                if ( responseTiposCambioBCCR ) {

                    this.habilitaListaTipoCambio = true ;

                    this.inicializaFormularioTipoCambio(responseTiposCambioBCCR);

                    if (!this.listObjetosTipoCambio) this.listObjetosTipoCambio = [] ;
                    this.listObjetosTipoCambio.push(responseTiposCambioBCCR) ;

                } else { 

                    this.listObjetosTipoCambio = null ;

                    this.habilitaListaTipoCambio = false ;

                    this.inicializaFormularioTipoCambio();
                }
            });
    }

    buscarMoneda(getAll : boolean = false) : void {

        this.alertService.clear();
        this.submittedTipoMonedaForm = true;

        let codigoMoneda = this.formTipoMoneda.controls['codigo_moneda'].value ;

        if (getAll) codigoMoneda = "%%" ;

        this.inversionesService.getTiposMonedas(codigoMoneda, this.companiaObservable.id, true)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {
                    
                    this.inicializaFormTipoMoneda(response[0]);

                    this.listTiposMonedas = response ;

                    // CONSULTA LOS TIPOS DE CAMBIO DE LA MONEDA
                    this.consultaTiposCambio(response[0]);

                } else { 
                
                    this.inicializaFormTipoMoneda();
                    this.alertService.info(this.translate.translateKey('ALERTS.NO_RECORDS_FOUND')); 
                
                }
            },
            error => {
                let message : string = this.translate.translateKeyP('ALERTS.CONNECTION_PROBLEMS',{$PH:error});
                this.alertService.error(message);
            });
    }
    buscarTipoCambio(getAll : boolean = false) : void {

        this.alertService.clear();
        this.submittedTipoMonedaForm = true;

        let idMoneda = this.formTipoMoneda.controls['id'].value ;

        let fechaConsultaCompleta : string = this.obtieneFechaConsultaWebServiceTipoCambio();

        if (getAll) fechaConsultaCompleta = "%%" ;

        this.inversionesService.getTipoCambio(idMoneda, this.companiaObservable.id, fechaConsultaCompleta)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {
                    
                    this.inicializaFormularioTipoCambio(response[0]);

                    this.listObjetosTipoCambio = response ;
                    this.habilitaListaTipoCambio = true ;

                    this.inicializaFormularioTipoCambio(response[0]);

                } else { 

                    this.listObjetosTipoCambio = null ;
                    this.habilitaListaTipoCambio = false ;
                
                    this.inicializaFormularioTipoCambio();
                    this.alertService.info(this.translate.translateKey('ALERTS.NO_RECORDS_FOUND'));
                }
            },
            error => {
                let message : string = this.translate.translateKeyP('ALERTS.CONNECTION_PROBLEMS',{$PH:error});
                this.alertService.error(message);
            });
    }

    consultaTiposCambio(obj: InvTipoMoneda) : void {

        this.inversionesService.getTipoCambio(obj.id, this.companiaObservable.id, '%%')
            .pipe(first())
            .subscribe(responseTiposCambio => {

                if ( responseTiposCambio && responseTiposCambio.length > 0 ) {

                    this.habilitaListaTipoCambio = true ;

                    this.inicializaFormularioTipoCambio(responseTiposCambio[0]);

                    if (!this.listObjetosTipoCambio) this.listObjetosTipoCambio = [] ;
                    this.listObjetosTipoCambio = responseTiposCambio ;

                } else { 

                    this.listObjetosTipoCambio = null ;

                    this.habilitaListaTipoCambio = false ;

                    this.inicializaFormularioTipoCambio();
                }
            });
    }

    selectMoneda(moneda : InvTipoMoneda) : void {

        this.inicializaFormTipoMoneda(moneda);
        this.consultaTiposCambio(moneda);
    }
    selectObjectListTipoCambio(objeto : InvTipoCambio) : void {

        this.inicializaFormularioTipoCambio(objeto);
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
                bccrIndicadorCompra : [objetoMoneda.bccrIndicadorCompra, Validators.required],
                bccrIndicadorVenta   : [objetoMoneda.bccrIndicadorVenta, Validators.required],
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
                bccrIndicadorCompra : [null, Validators.required],
                bccrIndicadorVenta   : [null, Validators.required],
                estado          : [true, Validators.required]
            });
        }
    }

    inicializaFormularioTipoCambio(objeto : InvTipoCambio = null) : void {

        this.habilitaTipoCambioMoneda = true ;
        this.habilitaFormularioTipoCambio =  true ;

        if (objeto) {

            this.habilitaBtnRegistroTC = false ;
            this.habilitaBtnActualizaTC = true ;
            this.habilitaBtnNuevoTC = true ;
            this.habilitaBtnEliminarTC = true;

            this.formTipoCambio    = this.formBuilder.group({
                id              : [objeto.id],
                idMoneda        : [this.listTiposMonedas.find( x => x.id === objeto.idMoneda )],
                montoCompra     : [objeto.montoCompra, Validators.required],
                montoVenta      : [objeto.montoVenta, Validators.required],
                fechaConsulta   : [objeto.fechaConsulta, Validators.required]
            });
        } else {

            this.habilitaBtnRegistroTC = true ;
            this.habilitaBtnActualizaTC= false;
            this.habilitaBtnNuevoTC = false ;
            this.habilitaBtnEliminarTC = false;

            this.formTipoCambio    = this.formBuilder.group({
                id              : [null],
                idMoneda        : [null],
                montoCompra     : [null, Validators.required],
                montoVenta      : [null, Validators.required],
                fechaConsulta   : [this.today, Validators.required]
            });
        }
    }

    crearMonedaObjectForm() : InvTipoMoneda {

        var codigo_moneda   = this.formTipoMoneda.controls['codigo_moneda'].value;
        var simbolo         = this.formTipoMoneda.controls['simbolo'].value;
        var descripcion     = this.formTipoMoneda.controls['descripcion'].value;
        var bccrIndicadorCompra = this.formTipoMoneda.controls['bccrIndicadorCompra'].value;
        var bccrIndicadorVenta   = this.formTipoMoneda.controls['bccrIndicadorVenta'].value;
        var estado          = this.formTipoMoneda.controls['estado'].value;

        var monedaForm = new InvTipoMoneda (codigo_moneda, this.companiaObservable.id, descripcion, simbolo, bccrIndicadorCompra, bccrIndicadorVenta, estado) ;

        return monedaForm ;
    }
    createObjectFormTipoCambio() : InvTipoCambio {

        // toma la moneda del formulario del tipo de moneda
        var idMoneda        = this.formTipoMoneda.controls['id'].value;

        var montoCompra     = this.formTipoCambio.controls['montoCompra'].value;
        var montoVenta      = this.formTipoCambio.controls['montoVenta'].value;
        var fechaConsulta   = this.formTipoCambio.controls['fechaConsulta'].value;

        var objectForm = new InvTipoCambio (this.companiaObservable.id, idMoneda, montoCompra, montoVenta, fechaConsulta) ;

        return objectForm ;
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

                    this.alertService.success( this.translate.translateKeyP('ALERTS.SUCCESSFUL_CURRENCY_REGISTRATION',{$PH:response.codigoMoneda}) );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_CURRENCY_REGISTRATION')); }

            }, error => {
                this.alertService.error( this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }
    submitFormTipoCambio() : void {

        this.alertService.clear();
        this.submittedFormTipoCambio = true;

        if ( this.formTipoCambio.invalid ) return;

        var objectForm : InvTipoCambio = this.createObjectFormTipoCambio();
        
        objectForm.adicionadoPor    = this.userObservable.identificacion;
        objectForm.fechaAdicion     = this.today;

        this.inversionesService.postTipoCambio(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if (!this.listObjetosTipoCambio) this.listObjetosTipoCambio = [] ;

                    this.listObjetosTipoCambio.push(response);

                    this.inicializaFormularioTipoCambio();

                    this.habilitaListaTipoCambio = true ;

                    this.alertService.success( this.translate.translateKey('ALERTS.SUCCESSFUL_REGISTRATION') );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_REGISTRATION')); }

            }, error => {
                this.alertService.error( this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }

    eliminarMoneda() : void {

        this.alertService.clear();
        this.submittedTipoMonedaForm = true;

        if ( this.formTipoMoneda.invalid ) return;

        var id : number = this.formTipoMoneda.controls['id'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: this.translate.translateKey('ALERTS.dialogConfirmDelete')
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deleteTipoMoneda( id )
                    .pipe(first())
                    .subscribe(response => {
                        if (response.exito) {

                            this.listTiposMonedas.splice(this.listTiposMonedas.findIndex( m => m.id == id ), 1);

                            if (this.listTiposMonedas.length===0) this.habilitaListaTipoCambio = false ;

                            this.inicializaFormTipoMoneda();

                            this.alertService.success(response.responseMesagge);
                            
                        } else { this.alertService.error(response.responseMesagge); }
                    });
                
            } else { return; }
        });
    }
    eliminarTipoCambio() : void {

        this.alertService.clear();
        this.submittedFormTipoCambio = true;

        if ( this.formTipoCambio.invalid ) return;

        var id : number = this.formTipoCambio.controls['id'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: this.translate.translateKey('ALERTS.dialogConfirmDelete')
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deleteTipoCambio( id )
                    .pipe(first())
                    .subscribe(response => {
                        if (response.exito) {

                            this.listObjetosTipoCambio.splice(this.listObjetosTipoCambio.findIndex( m => m.id == id ), 1);

                            if (this.listObjetosTipoCambio.length === 0) this.habilitaListaTipoCambio = false ;

                            this.inicializaFormularioTipoCambio();

                            this.alertService.success(response.responseMesagge);
                            
                        } else { this.alertService.error(response.responseMesagge); }
                    });
                
            } else { return; }
        });
    }

    limpiarFormularioMoneda() : void {

        this.inicializaFormTipoMoneda();
    }
    limpiarFormularioTipoCambio() : void {

        this.inicializaFormularioTipoCambio();
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

                    this.alertService.success( this.translate.translateKeyP('ALERTS.SUCCESSFUL_CURRENCY_UPDATE',{$PH:response.codigoMoneda}) );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_UPDATE')); }

            }, error => {
                this.alertService.error( this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }
    actualizaObjetoMontoPersona() : void {

        this.alertService.clear();
        this.submittedFormTipoCambio = true;

        if ( this.formTipoCambio.invalid ) return;

        var objectForm : InvTipoCambio = this.createObjectFormTipoCambio();

        objectForm.id =  this.formTipoCambio.controls['id'].value;
        
        objectForm.modificadoPor        = this.userObservable.identificacion;
        objectForm.fechaModificacion    = this.today;

        this.inversionesService.putTipoCambio(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if( this.listObjetosTipoCambio.find( m => m.id == response.id ) ) {
                        this.listObjetosTipoCambio.splice(this.listObjetosTipoCambio.findIndex( m => m.id == response.id ), 1);
                    }
                    this.listObjetosTipoCambio.push(response);

                    this.inicializaFormularioTipoCambio();

                    this.alertService.success( this.translate.translateKey('ALERTS.SUCCESSFUL_UPDATE') );

                } else { this.alertService.error(this.translate.translateKey('ALERTS.FAILED_UPDATE')); }

            }, error => {
                this.alertService.error( this.translate.translateKeyP('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }
}