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
import { InvPersona } from '@app/_models/Inversiones/Persona';
import { InvMontoMaximoPersona } from '@app/_models/Inversiones/MontoMaximoPersona';
import { InvTipoMoneda } from '@app/_models/Inversiones/TipoMoneda';

declare var $: any;

@Component({
    templateUrl: 'HTML_Personas.html',
    styleUrls: ['../../../../assets/scss/app.scss', '../../../../assets/scss/inversiones/app.scss'],
})
export class InvPersonasComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'HTML_Personas.html';
    public nombreModulo     : string ;

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private moduleObservable    : Module;
    private companiaObservable  : Compania;

    // ## -- formularios -- ## //
    formulario              : FormGroup;
    formularioMontosPersona : FormGroup;

    // ## -- submit formularios -- ## //
    submittedForm     : boolean = false;
    submittedFormMontosPersona     : boolean = false;

    // ## -- habilita botones -- ## //
    habilitaBtnRegistro     : boolean = true;
    habilitaBtnActualiza    : boolean = false;
    habilitaBtnNuevo        : boolean = false;
    habilitaBtnElimibar     : boolean = false;
    habilitaBtnRegistroMonto     : boolean = true;
    habilitaBtnActualizaMonto    : boolean = false;
    habilitaBtnNuevoMonto        : boolean = false;
    habilitaBtnEliminarMonto     : boolean = false;

    // ## -- habilita grids -- ## //
    habilitaMontosMaximosPersona    : boolean = false;
    habilitaFormularioMontosPersona : boolean = false;
    habilitaListaMontosPersona : boolean = false;
    

    // ## -- listas analisis -- ## //
    listTiposPersonas:    InvTipoPersona[];
    listTiposMonedas:    InvTipoMoneda[];

    public listObjetos  : InvPersona[]  = [];
    public listObjetosMontosPersonas  : InvMontoMaximoPersona[]  = [];

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
    get p () {   return this.formularioMontosPersona.controls;  }

    ngOnInit() {

        this.formulario    = this.formBuilder.group({
            id              : [null],
            idTipoPersona   : [null],
            identificacion  : [null],
            nombre          : [null],
            alias1          : [null],
            alias2          : [null],
            correo          : [null],
            telefono        : [null],
            estado          : [true]
        });
        this.formularioMontosPersona    = this.formBuilder.group({
            id : [null],
            idMoneda                : [null],
            montoMaximoInversiones  : [null],
            montoMaximoFondos       : [null]
        });

        this.nombreModulo = this.moduleObservable.nombre ;

        this.inversionesService.getTiposPersonaDescripcion('%%', this.companiaObservable.id, true)
            .pipe(first())
            .subscribe(response => { this.listTiposPersonas = response; });

        this.inversionesService.getTiposMonedas('%%', this.companiaObservable.id, true)
            .pipe(first())
            .subscribe(response => { this.listTiposMonedas = response; });

        this.buscarObjeto(true);
    }

    buscarObjeto(getAllObjects : boolean = false) : void {

        this.alertService.clear();
        this.submittedForm = true;

        let identificacion = this.formulario.controls['identificacion'].value ;

        if (getAllObjects) identificacion = "%%" ;

        let soloActivos : boolean =  identificacion === '%%' ? true : false ;

        this.inversionesService.getPersonaIdentificacion(identificacion, this.companiaObservable.id, soloActivos)
            .pipe(first())
            .subscribe(response => {

                if ( response && response.length > 0 ) {

                    this.inicializaformulario(response[0]);

                    this.listObjetos = response ;

                    // CONSULTA LOS MONTOS DE UNA PERSONA CARGADA EN EL SISTEMA
                    this.consultaMontosPersona(response[0]);
                    
                } else { 
                    this.inicializaformulario();
                    this.alertService.info('No se encontraron registros .'); 
                }
            },
            error => {
                let message : string = 'Problemas de conexión: ' + error;
                this.alertService.error(message);
            });
    }

    consultaMontosPersona(obj: InvPersona) : void {

        this.inversionesService.getMontosPersona(obj.id, this.companiaObservable.id)
        .pipe(first())
        .subscribe(responseMontos => {

            if ( responseMontos && responseMontos.length > 0 ) {

                this.habilitaListaMontosPersona = true ;

                this.inicializaFormularioMontosPersona(responseMontos[0]);

                if (!this.listObjetosMontosPersonas) this.listObjetosMontosPersonas = [] ;
                this.listObjetosMontosPersonas = responseMontos ;

            } else { 

                this.listObjetosMontosPersonas = null ;

                this.habilitaListaMontosPersona = false ;

                this.inicializaFormularioMontosPersona();
            }
        });
    }
    

    selectObjectList(objeto : InvPersona) : void {

        this.inicializaformulario(objeto);
        this.consultaMontosPersona(objeto);
    }

    selectObjectListMontosPersona(objeto : InvMontoMaximoPersona) : void {

        this.inicializaFormularioMontosPersona(objeto);
    }

    inicializaformulario(objeto : InvPersona = null) : void {

        if (objeto) {

            this.habilitaBtnRegistro = false ;
            this.habilitaBtnActualiza= true ;
            this.habilitaBtnNuevo = true ;
            this.habilitaBtnElimibar = true;

            this.formulario    = this.formBuilder.group({
                id              : [objeto.id],
                idTipoPersona   : [this.listTiposPersonas.find( x => x.id === objeto.idTipoPersona ), Validators.required],
                identificacion  : [objeto.identificacion, Validators.required],
                nombre          : [objeto.nombre, Validators.required],
                alias1          : [objeto.alias1, Validators.required],
                alias2          : [objeto.alias2],
                correo          : [objeto.correo, Validators.required],
                telefono        : [objeto.telefono, Validators.required],
                estado          : [objeto.estado, Validators.required]
            });
        } else {

            this.habilitaBtnRegistro = true ;
            this.habilitaBtnActualiza= false;
            this.habilitaBtnNuevo = false ;
            this.habilitaBtnElimibar = false;

            this.formulario    = this.formBuilder.group({
                id              : [null],
                idTipoPersona   : [null, Validators.required],
                identificacion  : [null, Validators.required],
                nombre          : [null, Validators.required],
                alias1          : [null, Validators.required],
                alias2          : [null],
                correo          : [null, Validators.required],
                telefono        : [null, Validators.required],
                estado          : [true, Validators.required]
            });
        }
    }
    inicializaFormularioMontosPersona(objeto : InvMontoMaximoPersona = null) : void {

        this.habilitaMontosMaximosPersona = true ;
        this.habilitaFormularioMontosPersona =  true ;

        if (objeto) {

            this.habilitaBtnRegistroMonto = false ;
            this.habilitaBtnActualizaMonto = true ;
            this.habilitaBtnNuevoMonto = true ;
            this.habilitaBtnEliminarMonto = true;

            this.formularioMontosPersona    = this.formBuilder.group({
                id : [objeto.id],
                idMoneda   : [this.listTiposMonedas.find( x => x.id === objeto.idMoneda ), Validators.required],
                montoMaximoInversiones   : [objeto.maximoInversiones, Validators.required],
                montoMaximoFondos   : [objeto.maximoFondos, Validators.required]
            });
        } else {

            this.habilitaBtnRegistroMonto = true ;
            this.habilitaBtnActualizaMonto= false;
            this.habilitaBtnNuevoMonto = false ;
            this.habilitaBtnEliminarMonto = false;

            this.formularioMontosPersona    = this.formBuilder.group({
                id : [null],
                idMoneda   : [null, Validators.required],
                montoMaximoInversiones   : [null, Validators.required],
                montoMaximoFondos   : [null, Validators.required]
            });
        }
    }

    createObjectForm() : InvPersona {

        var idTipoPersona   = this.formulario.controls['idTipoPersona'].value.id;
        var identificacion  = this.formulario.controls['identificacion'].value;
        var nombre          = this.formulario.controls['nombre'].value;
        var alias1          = this.formulario.controls['alias1'].value;
        var alias2          = this.formulario.controls['alias2'].value;
        var correo          = this.formulario.controls['correo'].value;
        var telefono        = this.formulario.controls['telefono'].value;
        var estado          = this.formulario.controls['estado'].value;

        var objectForm = new InvPersona (this.companiaObservable.id, idTipoPersona, identificacion, nombre, alias1, alias2, correo, telefono, estado) ;

        return objectForm ;
    }
    createObjectFormMontosPersona() : InvMontoMaximoPersona {

        var idMoneda   = this.formularioMontosPersona.controls['idMoneda'].value.id;

        var montoMaximoInversiones  = this.formularioMontosPersona.controls['montoMaximoInversiones'].value;
        var montoMaximoFondos       = this.formularioMontosPersona.controls['montoMaximoFondos'].value;

        // ** id formulario persona **
        var idPersona   = this.formulario.controls['id'].value;

        var objectForm = new InvMontoMaximoPersona (this.companiaObservable.id, idPersona, idMoneda, montoMaximoInversiones, montoMaximoFondos) ;

        return objectForm ;
    }

    submitForm() : void {

        this.alertService.clear();
        this.submittedForm = true;

        if ( this.formulario.invalid ) return;

        var objectForm : InvPersona = this.createObjectForm();
        
        objectForm.adicionadoPor    = this.userObservable.identificacion;
        objectForm.fechaAdicion     = this.today;

        this.inversionesService.postPersona(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    this.listObjetos.push(response);

                    this.inicializaformulario();

                    this.alertService.success( `Persona ${response.identificacion} registrada con éxito .` );

                } else { this.alertService.error(`No fue posible realizar el registro .`); }

            }, error => {
                this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` );
            });
    }
    submitFormMontosPersona() : void {

        this.alertService.clear();
        this.submittedFormMontosPersona = true;

        if ( this.formularioMontosPersona.invalid ) return;

        var objectForm : InvMontoMaximoPersona = this.createObjectFormMontosPersona();
        
        objectForm.adicionadoPor    = this.userObservable.identificacion;
        objectForm.fechaAdicion     = this.today;

        this.inversionesService.postMontosPersona(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if (!this.listObjetosMontosPersonas) this.listObjetosMontosPersonas = [] ;

                    this.listObjetosMontosPersonas.push(response);

                    this.inicializaFormularioMontosPersona();

                    this.habilitaListaMontosPersona = true ;

                    this.alertService.success( `Monto registrado con éxito .` );

                } else { this.alertService.error(`No fue posible realizar el registro .`); }

            }, error => {
                this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` );
            });
    }

    eliminarObjeto() : void {

        this.alertService.clear();
        this.submittedForm = true;

        if ( this.formulario.invalid ) return;

        var id : number = this.formulario.controls['id'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: `Segur@ que desea eliminar el registro para siempre ?`
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deletePersona( id )
                    .pipe(first())
                    .subscribe(response => {
                        if (response.exito) {

                            this.listObjetos.splice(this.listObjetos.findIndex( m => m.id == id ), 1);

                            this.inicializaformulario();

                            this.alertService.success(response.responseMesagge);
                            
                        } else { this.alertService.error(response.responseMesagge); }
                    });
                
            } else { return; }
        });
    }
    eliminarObjetoMontoPersona() : void {

        this.alertService.clear();
        this.submittedFormMontosPersona = true;

        if ( this.formularioMontosPersona.invalid ) return;

        var id : number = this.formularioMontosPersona.controls['id'].value;

        this.dialogo.open(DialogoConfirmacionComponent, {
            data: `Segur@ que desea eliminar el registro para siempre ?`
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.inversionesService.deleteMontoPersona( id )
                    .pipe(first())
                    .subscribe(response => {
                        if (response.exito) {

                            this.listObjetosMontosPersonas.splice(this.listObjetosMontosPersonas.findIndex( m => m.id == id ), 1);

                            if (this.listObjetosMontosPersonas.length === 0) this.habilitaListaMontosPersona = false ;

                            this.inicializaFormularioMontosPersona();

                            this.alertService.success(response.responseMesagge);
                            
                        } else { this.alertService.error(response.responseMesagge); }
                    });
                
            } else { return; }
        });
    }

    limpiarFormularioTipoPersona() : void {

        this.inicializaformulario();
        this.inicializaFormularioMontosPersona();

        this.listObjetosMontosPersonas = null ;
        this.habilitaListaMontosPersona = false ;
    }
    limpiarFormularioMontosPersona() : void {

        this.inicializaFormularioMontosPersona();
    }

    actualizaObjeto() : void {

        this.alertService.clear();
        this.submittedForm = true;

        if ( this.formulario.invalid ) return;

        var objectForm : InvPersona = this.createObjectForm();

        objectForm.id = this.formulario.controls['id'].value;
        
        objectForm.modificadoPor        = this.userObservable.identificacion;
        objectForm.fechaModificacion    = this.today;

        this.inversionesService.putPersona(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if( this.listObjetos.find( m => m.id == response.id ) ) {
                        this.listObjetos.splice(this.listObjetos.findIndex( m => m.id == response.id ), 1);
                    }
                    this.listObjetos.push(response);

                    this.inicializaformulario();

                    this.alertService.success( `Persona ${response.identificacion} actualizada con éxito.` );

                } else { this.alertService.error(`No fue posible actualizar el registro .`); }

            }, error => {
                this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` );
            });
    }
    actualizaObjetoMontoPersona() : void {

        this.alertService.clear();
        this.submittedFormMontosPersona = true;

        if ( this.formularioMontosPersona.invalid ) return;

        var objectForm : InvMontoMaximoPersona = this.createObjectFormMontosPersona();

        objectForm.id =  this.formularioMontosPersona.controls['id'].value;
        
        objectForm.modificadoPor        = this.userObservable.identificacion;
        objectForm.fechaModificacion    = this.today;

        this.inversionesService.putMontoPersona(objectForm)
            .pipe(first())
            .subscribe(response => {

                if ( response ) {

                    if( this.listObjetosMontosPersonas.find( m => m.id == response.id ) ) {
                        this.listObjetosMontosPersonas.splice(this.listObjetosMontosPersonas.findIndex( m => m.id == response.id ), 1);
                    }
                    this.listObjetosMontosPersonas.push(response);

                    this.inicializaFormularioMontosPersona();

                    this.alertService.success( `Montos de Persona actualizado con éxito.` );

                } else { this.alertService.error(`No fue posible actualizar el registro .`); }

            }, error => {
                this.alertService.error( `Problemas al establecer la conexión con el servidor. Detalle: ${ error }` );
            });
    }
}