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
import { InvPeriocidad } from '@app/_models/Inversiones/Periocidad';
import { InvInversionEncabezado } from '@app/_models/Inversiones/InversionEncabezado';
import { InvInversionDetalle } from '@app/_models/Inversiones/InversionDetalle';
import { InvTitulo } from '@app/_models/Inversiones/Titulo';
import { InvTipoMercado } from '@app/_models/Inversiones/TipoMercado';
import { InvTipoSector } from '@app/_models/Inversiones/TipoSector';
import { InvPlazoInversion } from '@app/_models/Inversiones/PlazoInversion';
import { InvTipoAnio } from '@app/_models/Inversiones/TipoAnio';
import { InvEmisor } from '@app/_models/Inversiones/Emisor';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
    templateUrl: 'HTML_InclusionOperacionInversiones.html',
    styleUrls: ['../../../../../assets/scss/app.scss', '../../../../../assets/scss/inversiones/app.scss'],
})
export class InvInclusionInversionOperacionesComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'HTML_InclusionOperacionInversiones.html';
    public nombreModulo     : string ;

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private moduleObservable    : Module;
    private companiaObservable  : Compania;

    // ## -- formularios -- ## //
    formularioEncabezado  : FormGroup;
    formularioDetalle  : FormGroup;

    // ## -- submitEncabezado formularios -- ## //
    submittedFormEncabezado    : boolean = false;
    submittedFormDetalle     : boolean = false;
    
    // ## -- habilita botones -- ## //
    habilitaBtnRegistroEncabezado     : boolean = true;
    habilitaBtnActualizaEncabezado    : boolean = false;
    habilitaBtnNuevoEncabezado        : boolean = false;
    habilitaBtnElimibarEncabezado     : boolean = false;
    habilitaBtnRegistroDetalle     : boolean = true;
    habilitaBtnActualizaDetalle    : boolean = false;
    habilitaBtnNuevoDetalle        : boolean = false;
    habilitaBtnElimibarDetalle     : boolean = false;

    // ## -- listas analisis -- ## //
    public listObjetosEncabezado    : InvInversionEncabezado    [] = [];
    public listObjetosDetalle       : InvInversionDetalle       [] = [];

    public listTitulos          : InvTitulo[]           = [];
    public listMonedas          : InvTipoMoneda[]       = [];
    public listMercados         : InvTipoMercado[]      = [];
    public listSectores         : InvTipoSector[]       = [];
    public listPlazosInversion  : InvPlazoInversion[]   = [];
    public listPeriocidad  : InvPeriocidad[]   = [];
    public listAnio  : InvTipoAnio[]   = [];
    public listEmisores  : InvEmisor[]   = [];

    public today : Date ;

    constructor (   private alertService:      AlertService,
                    private inversionesService:     InversionesService,
                    private formBuilder:       FormBuilder,
                    private accountService:     AccountService,
                    private dialogo:           MatDialog,
                    private translate: TranslateService ) {

        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue;

        this.today = new Date();
    }

    get m () { return this.formularioEncabezado.controls; }
    get s () { return this.formularioDetalle.controls; }


    ngOnInit() {

        this.formularioEncabezado    = this.formBuilder.group({
            idEncabezado                    : [null],
            idTituloEncabezado              : [null],
            idMonedaEncabezado              : [null],
            idPeriocidadEncabezado          : [null],
            idAnioEncabezado                : [null],
            idMercadoEncabezado             : [null],
            idSectorEncabezado              : [null],
            idPlazoEncabezado               : [null],
            numeroInversionEncabezado       : [null],
            numeroCuentaEncabezado          : [null],
            certificadoBancarioEncabezado   : [null],
            fechaInversionEncabezado        : [null],
            fechaInicioEncabezado           : [null],
            fechaFinalEncabezado            : [null],
            diasDiferenciaEncabezado        : [null],
            diasAcumuladosEncabezado        : [null],
            calculaCuponEncabezado          : [null],
            fechaUltimoCuponEncabezado      : [null],
            inversionNetaEncabezado         : [null],
            venceEncabezado                 : [null],
            observacionesEncabezado         : [null],
            estadoEncabezado                : [null],
            usuarioAprueba1Encabezado       : [null],
            usuarioAprueba2Encabezado       : [null]
        });
        this.formularioDetalle    = this.formBuilder.group({
            idDetalle                   : [null],
            idEncabezadoDetalle         : [null],
            idEmisorDetalle             : [null],
            tasaInteresFacialDetalle    : [null],
            tasaInteresRealDetalle      : [null],
            interesInversionDetalle     : [null],
            interesNetoDetalle          : [null],
            interesDiarioDetalle        : [null],
            impuestoRentaDetalle        : [null],
            cantidadCuponesDetalle      : [null],
            montoCuponesDetalle         : [null],
            observacionesDetalle        : [null],
            estadoDetalle               : [null]
        });
        this.nombreModulo = this.moduleObservable.nombre ;

        this.inversionesService.getTitulo('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listTitulos = response ; });

        this.inversionesService.getTiposMonedas('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listMonedas = response ; });

        this.inversionesService.getTipoMercado('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listMercados = response ; });

        this.inversionesService.getTipoSector('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listSectores = response ; });

        this.inversionesService.getPlazoInversion('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listPlazosInversion = response ; });

        this.inversionesService.getPeriocidad('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listPeriocidad = response ; });

        this.inversionesService.getTipoAnio('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listAnio = response ; });

        this.inversionesService.getEmisor('%%', this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => { this.listEmisores = response ; });

        this.buscarObjetoEncabezado(true);
        // this.buscarObjetoDetalleXEncabezado(true);
    }

    public itemTituloSelected(objectTitleSelected : InvTitulo) : void {

        let idTitulo    : number = objectTitleSelected.id;

        let idMoneda: number    = objectTitleSelected.idMoneda;
        let idMercado: number   = objectTitleSelected.idMercado;
        let idSector: number    = objectTitleSelected.idSector;
        let idPlazo: number     = objectTitleSelected.idPlazo;

        this.formularioEncabezado.patchValue({
            idMonedaEncabezado  : [idMoneda]
            //  ,
            // idMonedaEncabezado  : [this.listMonedas.find( x => x.id === idMoneda )],
            // idMercadoEncabezado : [this.listMercados.find( x => x.id === idMercado )],
            // idSectorEncabezado  : [this.listSectores.find( x => x.id === idSector )],
            // idPlazoEncabezado   : [this.listPlazosInversion.find( x => x.id === idPlazo )]
        });
    }

    buscarObjetoEncabezado(getAll : boolean = false) : void {

        this.alertService.clear();
        this.submittedFormEncabezado = true;

        let numero = this.formularioEncabezado.controls['numeroInversionEncabezado'].value ;

        if (getAll) numero = "%%" ;

        this.inversionesService.getEncabezadoInversion(numero, this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {
                    
                    this.inicializaFormularioEncabezado(response[0]);
                    this.buscarObjetoDetalleXEncabezado(response[0].id);

                    this.listObjetosEncabezado = response ;

                } else { 
                
                    this.inicializaFormularioEncabezado();
                    this.alertService.info(this.translate.instant('ALERTS.NO_RECORDS_FOUND'));
                }
            },
            error => { this.alertService.error(this.translate.instant('ALERTS.CONNECTION_PROBLEMS',{$PH:error})); });
    }
    buscarObjetoDetalleXEncabezado(idEncabezado : number) : void {

        this.alertService.clear();
        this.submittedFormDetalle = true;

        this.inversionesService.getDetalleInversion(idEncabezado, this.companiaObservable.id, false)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {
                    
                    this.inicializaFormularioDetalle(response[0]);

                    this.listObjetosDetalle = response ;

                } else { 
                
                    this.inicializaFormularioDetalle();
                    this.alertService.info(this.translate.instant('ALERTS.NO_RECORDS_FOUND'));
                }
            },
            error => { this.alertService.error(this.translate.instant('ALERTS.CONNECTION_PROBLEMS',{$PH:error})); });
    }
    inicializaFormularioEncabezado(objeto : InvInversionEncabezado = null) : void {

        if (objeto) {

            this.habilitaBtnRegistroEncabezado = false ;
            this.habilitaBtnActualizaEncabezado= true ;
            this.habilitaBtnNuevoEncabezado = true ;
            this.habilitaBtnElimibarEncabezado = true ;

            this.formularioEncabezado    = this.formBuilder.group({
                idEncabezado                    : [objeto.id],

                idTituloEncabezado              : [this.listTitulos.find( x => x.id === objeto.idTitulo ), Validators.required],//
                idMonedaEncabezado              : [this.listMonedas.find( x => x.id === objeto.idMoneda ), Validators.required],
                idPeriocidadEncabezado          : [this.listPeriocidad.find( x => x.id === objeto.idPeriocidad ), Validators.required],
                idAnioEncabezado                : [this.listAnio.find( x => x.id === objeto.idAnio ), Validators.required],
                idMercadoEncabezado             : [this.listMercados.find( x => x.id === objeto.idMercado ), Validators.required],
                idSectorEncabezado              : [this.listSectores.find( x => x.id === objeto.idSector ), Validators.required],
                idPlazoEncabezado               : [this.listPlazosInversion.find( x => x.id === objeto.idPlazo ), Validators.required],
                numeroInversionEncabezado       : [objeto.numeroInversion, Validators.required],//
                numeroCuentaEncabezado          : [objeto.numeroCuenta],
                certificadoBancarioEncabezado   : [objeto.certificadoBancario],
                fechaInversionEncabezado        : [objeto.fechaInversion, Validators.required],
                fechaInicioEncabezado           : [objeto.fechaInicio, Validators.required],
                fechaFinalEncabezado            : [objeto.fechaFinal, Validators.required],
                diasDiferenciaEncabezado        : [objeto.diasDiferencia],
                diasAcumuladosEncabezado        : [objeto.diasAcumulados],
                calculaCuponEncabezado          : [objeto.calculaCupon, Validators.required],
                fechaUltimoCuponEncabezado      : [objeto.fechaUltimoCupon],
                inversionNetaEncabezado         : [objeto.inversionNeta, Validators.required],
                venceEncabezado                 : [objeto.vence, Validators.required],
                observacionesEncabezado         : [objeto.observaciones],
                estadoEncabezado                : [objeto.estado, Validators.required],
                usuarioAprueba1Encabezado       : [objeto.usuarioAprueba1],
                usuarioAprueba2Encabezado       : [objeto.usuarioAprueba2]
            });
        } else {
            this.habilitaBtnRegistroEncabezado = true ;
            this.habilitaBtnActualizaEncabezado= false;
            this.habilitaBtnNuevoEncabezado = false ;
            this.habilitaBtnElimibarEncabezado = false;

            this.formularioEncabezado    = this.formBuilder.group({
                idEncabezado                    : [null], //

                idTituloEncabezado              : [null, Validators.required],
                idMonedaEncabezado              : [null, Validators.required],
                idPeriocidadEncabezado          : [null, Validators.required],
                idAnioEncabezado                : [null, Validators.required],
                idMercadoEncabezado             : [null, Validators.required],
                idSectorEncabezado              : [null, Validators.required],
                idPlazoEncabezado               : [null, Validators.required],
                numeroInversionEncabezado       : [null, Validators.required], //
                numeroCuentaEncabezado          : [null],
                certificadoBancarioEncabezado   : [null],
                fechaInversionEncabezado        : [this.today, Validators.required],
                fechaInicioEncabezado           : [this.today, Validators.required],
                fechaFinalEncabezado            : [this.today, Validators.required],
                diasDiferenciaEncabezado        : [null],
                diasAcumuladosEncabezado        : [null],
                calculaCuponEncabezado          : [null, Validators.required],
                fechaUltimoCuponEncabezado      : [this.today],
                inversionNetaEncabezado         : [null, Validators.required],
                venceEncabezado                 : [true, Validators.required],
                observacionesEncabezado         : [null],
                estadoEncabezado                : [true, Validators.required],
                usuarioAprueba1Encabezado       : [this.userObservable.nombreCompleto],
                usuarioAprueba2Encabezado       : [null]
            });
        }
    }
    inicializaFormularioDetalle(objeto : InvInversionDetalle = null)   : void {

        if (objeto) {

            this.habilitaBtnRegistroDetalle = false ;
            this.habilitaBtnActualizaDetalle= true ;
            this.habilitaBtnNuevoDetalle = true ;
            this.habilitaBtnElimibarDetalle = true;

            // // detalle
            // idEmisor = this.listEmisores.find( x => x.id === objeto.idem ).idPlazo;

            this.formularioDetalle    = this.formBuilder.group({
                idDetalle                   : [objeto.id],
                idEncabezadoDetalle         : [objeto.idEncabezado, Validators.required],
                idEmisorDetalle             : [this.listEmisores.find( x => x.id === objeto.idEmisor ), Validators.required],
                tasaInteresFacialDetalle    : [objeto.tasaInteresFacial, Validators.required],
                tasaInteresRealDetalle      : [objeto.tasaInteresReal, Validators.required],
                interesInversionDetalle     : [objeto.interesInversion, Validators.required],
                interesNetoDetalle          : [objeto.interesNeto, Validators.required],
                interesDiarioDetalle        : [objeto.interesDiario, Validators.required],
                impuestoRentaDetalle        : [objeto.impuestoRenta, Validators.required],
                cantidadCuponesDetalle      : [objeto.cantidadCupones, Validators.required],
                montoCuponesDetalle         : [objeto.montoCupones, Validators.required],
                observacionesDetalle        : [objeto.observaciones, Validators.required],
                estadoDetalle               : [objeto.estado, Validators.required]
            });
        } else {
            this.habilitaBtnRegistroDetalle = true ;
            this.habilitaBtnActualizaDetalle= false;
            this.habilitaBtnNuevoDetalle = false ;
            this.habilitaBtnElimibarDetalle = false;

            this.formularioDetalle    = this.formBuilder.group({
                idDetalle                   : [null],
                idEncabezadoDetalle         : [null, Validators.required],
                idEmisorDetalle             : [null, Validators.required],
                tasaInteresFacialDetalle    : [null, Validators.required],
                tasaInteresRealDetalle      : [null, Validators.required],
                interesInversionDetalle     : [null, Validators.required],
                interesNetoDetalle          : [null, Validators.required],
                interesDiarioDetalle        : [null, Validators.required],
                impuestoRentaDetalle        : [null, Validators.required],
                cantidadCuponesDetalle      : [null, Validators.required],
                montoCuponesDetalle         : [null, Validators.required],
                observacionesDetalle        : [null, Validators.required],
                estadoDetalle               : [null, Validators.required]
            });
        }
    }

    selectObjetoEncabezado(objeto : InvInversionEncabezado) : void {
        this.inicializaFormularioEncabezado(objeto);
    }
    selectObjetoDetalle(objeto : InvInversionDetalle) : void {
        this.inicializaFormularioDetalle(objeto);
    }

    crearObjectFormEncabezado() : InvInversionEncabezado {
        
        var idTituloEncabezado   = this.formularioEncabezado.controls['idTituloEncabezado'].value;
        var idMonedaEncabezado   = this.formularioEncabezado.controls['idMonedaEncabezado'].value;
        var idPeriocidadEncabezado   = this.formularioEncabezado.controls['idPeriocidadEncabezado'].value;
        var idAnioEncabezado   = this.formularioEncabezado.controls['idAnioEncabezado'].value;
        var idMercadoEncabezado   = this.formularioEncabezado.controls['idMercadoEncabezado'].value;
        var idSectorEncabezado   = this.formularioEncabezado.controls['idSectorEncabezado'].value;
        var idPlazoEncabezado   = this.formularioEncabezado.controls['idPlazoEncabezado'].value;
        var numeroInversionEncabezado   = this.formularioEncabezado.controls['numeroInversionEncabezado'].value;
        var numeroCuentaEncabezado   = this.formularioEncabezado.controls['numeroCuentaEncabezado'].value;
        var certificadoBancarioEncabezado   = this.formularioEncabezado.controls['certificadoBancarioEncabezado'].value;
        var fechaInversionEncabezado   = this.formularioEncabezado.controls['fechaInversionEncabezado'].value;
        var fechaInicioEncabezado   = this.formularioEncabezado.controls['fechaInicioEncabezado'].value;
        var fechaFinalEncabezado   = this.formularioEncabezado.controls['fechaFinalEncabezado'].value;
        var diasDiferenciaEncabezado   = this.formularioEncabezado.controls['diasDiferenciaEncabezado'].value;
        var diasAcumuladosEncabezado   = this.formularioEncabezado.controls['diasAcumuladosEncabezado'].value;
        var calculaCuponEncabezado   = this.formularioEncabezado.controls['calculaCuponEncabezado'].value;
        var fechaUltimoCuponEncabezado   = this.formularioEncabezado.controls['fechaUltimoCuponEncabezado'].value;
        var inversionNetaEncabezado   = this.formularioEncabezado.controls['inversionNetaEncabezado'].value;
        var venceEncabezado   = this.formularioEncabezado.controls['venceEncabezado'].value;
        var observacionesEncabezado   = this.formularioEncabezado.controls['observacionesEncabezado'].value;
        var estadoEncabezado   = this.formularioEncabezado.controls['estadoEncabezado'].value;
        var usuarioAprueba1Encabezado   = this.formularioEncabezado.controls['usuarioAprueba1Encabezado'].value;
        var usuarioAprueba2Encabezado   = this.formularioEncabezado.controls['usuarioAprueba2Encabezado'].value;

        var objForm = new InvInversionEncabezado (  this.companiaObservable.id, idTituloEncabezado, idMonedaEncabezado, idPeriocidadEncabezado, 
                                                    idAnioEncabezado, idMercadoEncabezado, idSectorEncabezado, idPlazoEncabezado, numeroInversionEncabezado, 
                                                    numeroCuentaEncabezado, certificadoBancarioEncabezado, fechaInversionEncabezado, fechaInicioEncabezado, 
                                                    fechaFinalEncabezado, diasDiferenciaEncabezado, diasAcumuladosEncabezado, calculaCuponEncabezado, 
                                                    fechaUltimoCuponEncabezado, inversionNetaEncabezado, venceEncabezado, observacionesEncabezado, estadoEncabezado, 
                                                    usuarioAprueba1Encabezado, usuarioAprueba2Encabezado ) ;
        return objForm ;
    }
    crearObjectFormDetalle() : InvInversionDetalle {

        // llave foranea
        var idEncabezadoDetalle   = this.formularioEncabezado.controls['idEncabezado'].value;

        var idEmisorDetalle   = this.formularioDetalle.controls['idEmisorDetalle'].value;
        var tasaInteresFacialDetalle   = this.formularioDetalle.controls['tasaInteresFacialDetalle'].value;
        var tasaInteresRealDetalle   = this.formularioDetalle.controls['tasaInteresRealDetalle'].value;
        var interesInversionDetalle   = this.formularioDetalle.controls['interesInversionDetalle'].value;
        var interesNetoDetalle   = this.formularioDetalle.controls['interesNetoDetalle'].value;
        var interesDiarioDetalle   = this.formularioDetalle.controls['interesDiarioDetalle'].value;
        var impuestoRentaDetalle   = this.formularioDetalle.controls['impuestoRentaDetalle'].value;
        var cantidadCuponesDetalle   = this.formularioDetalle.controls['cantidadCuponesDetalle'].value;
        var montoCuponesDetalle   = this.formularioDetalle.controls['montoCuponesDetalle'].value;
        var observacionesDetalle   = this.formularioDetalle.controls['observacionesDetalle'].value;
        var estadoDetalle   = this.formularioDetalle.controls['estadoDetalle'].value;

        var objForm = new InvInversionDetalle ( this.companiaObservable.id, idEncabezadoDetalle, idEmisorDetalle, tasaInteresFacialDetalle,
                                                tasaInteresRealDetalle, interesInversionDetalle, interesNetoDetalle, interesDiarioDetalle, 
                                                impuestoRentaDetalle, cantidadCuponesDetalle, montoCuponesDetalle, observacionesDetalle,estadoDetalle ) ;

        return objForm ;
    }

    submitEncabezado() : void {

        this.alertService.clear();
        this.submittedFormEncabezado = true;

        if ( this.formularioEncabezado.invalid ) return;

        var objectForm : InvInversionEncabezado = this.crearObjectFormEncabezado();
        
        objectForm.adicionadoPor    = this.userObservable.identificacion;
        objectForm.fechaAdicion     = this.today;

        this.inversionesService.postEncabezadoInversion(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    this.listObjetosEncabezado.push(response);

                    this.inicializaFormularioEncabezado();

                    this.alertService.success( this.translate.instant('ALERTS.SUCCESSFUL_REGISTRATION') );

                } else { this.alertService.error(this.translate.instant('ALERTS.FAILED_CURRENCY_REGISTRATION')); }

            }, error => { this.alertService.error( this.translate.instant('ALERTS.errorConnectionServer',{$PH:error}) ); });
    }
    submitDetalle() : void {

        this.alertService.clear();
        this.submittedFormDetalle = true;

        if ( this.formularioDetalle.invalid ) return;

        var objectForm : InvInversionDetalle = this.crearObjectFormDetalle();
        
        objectForm.adicionadoPor    = this.userObservable.identificacion;
        objectForm.fechaAdicion     = this.today;

        this.inversionesService.postDetalleInversion(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    this.listObjetosDetalle.push(response);

                    this.inicializaFormularioDetalle();

                    this.alertService.success( this.translate.instant('ALERTS.SUCCESSFUL_REGISTRATION') );

                } else { this.alertService.error(this.translate.instant('ALERTS.FAILED_CURRENCY_REGISTRATION')); }

            }, error => { this.alertService.error( this.translate.instant('ALERTS.errorConnectionServer',{$PH:error}) ); });
    }

    eliminarObjetoEncabezado() : void {

        this.alertService.clear();
        this.submittedFormEncabezado = true;

        if ( this.formularioEncabezado.invalid ) return;

        var id : number = this.formularioEncabezado.controls['idEncabezado'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: this.translate.instant('ALERTS.dialogConfirmDelete')
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deleteEncabezadoInversion( id )
                    .pipe(first())
                    .subscribe(response => {
                        if (response.exito) {

                            this.listObjetosEncabezado.splice(this.listObjetosEncabezado.findIndex( m => m.id == id ), 1);

                            this.inicializaFormularioEncabezado();

                            this.alertService.success(response.responseMesagge);
                            
                        } else { this.alertService.error(response.responseMesagge); }
                    });
                
            } else { return; }
        });
    }
    eliminarObjetoDetalle() : void {

        this.alertService.clear();
        this.submittedFormEncabezado = true;

        if ( this.formularioDetalle.invalid ) return;

        var id : number = this.formularioDetalle.controls['idDetalle'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: this.translate.instant('ALERTS.dialogConfirmDelete')
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deleteDetalleInversion( id )
                    .pipe(first())
                    .subscribe(response => {
                        if (response.exito) {

                            this.listObjetosDetalle.splice(this.listObjetosDetalle.findIndex( m => m.id == id ), 1);

                            this.inicializaFormularioDetalle();

                            this.alertService.success(response.responseMesagge);
                            
                        } else { this.alertService.error(response.responseMesagge); }
                    });
                
            } else { return; }
        });
    }

    limpiarFormularioEncabezado()   : void { this.inicializaFormularioEncabezado(); }
    limpiarFormularioDetalle()      : void { this.inicializaFormularioDetalle();    }

    actualizaObjetoEncabezado() : void {

        this.alertService.clear();
        this.submittedFormEncabezado = true;

        if ( this.formularioEncabezado.invalid ) return;

        var objectForm : InvInversionEncabezado = this.crearObjectFormEncabezado();

        objectForm.id = this.formularioEncabezado.controls['idEncabezado'].value;
        
        objectForm.modificadoPor        = this.userObservable.identificacion;
        objectForm.fechaModificacion    = this.today;

        this.inversionesService.putEncabezadoInversion(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if( this.listObjetosEncabezado.find( m => m.id == response.id ) ) {
                        this.listObjetosEncabezado.splice(this.listObjetosEncabezado.findIndex( m => m.id == response.id ), 1);
                    }
                    this.listObjetosEncabezado.push(response);

                    this.inicializaFormularioEncabezado();

                    this.alertService.success( this.translate.instant('ALERTS.SUCCESSFUL_UPDATE') );

                } else { this.alertService.error(this.translate.instant('ALERTS.FAILED_UPDATE')); }

            }, error => {
                this.alertService.error( this.translate.instant('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }

    actualizaObjetoSector() : void {

        this.alertService.clear();
        this.submittedFormDetalle = true;

        if ( this.formularioDetalle.invalid ) return;

        var objectForm : InvInversionDetalle = this.crearObjectFormDetalle();

        objectForm.id = this.formularioDetalle.controls['idDetalle'].value;
        
        objectForm.modificadoPor        = this.userObservable.identificacion;
        objectForm.fechaModificacion    = this.today;

        this.inversionesService.putDetalleInversion(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if( this.listObjetosDetalle.find( m => m.id == response.id ) ) {
                        this.listObjetosDetalle.splice(this.listObjetosDetalle.findIndex( m => m.id == response.id ), 1);
                    }
                    this.listObjetosDetalle.push(response);

                    this.inicializaFormularioDetalle();

                    this.alertService.success( this.translate.instant('ALERTS.SUCCESSFUL_UPDATE') );

                } else { this.alertService.error(this.translate.instant('ALERTS.FAILED_UPDATE')); }

            }, error => {
                this.alertService.error( this.translate.instant('ALERTS.errorConnectionServer',{$PH:error}) );
            });
    }
}