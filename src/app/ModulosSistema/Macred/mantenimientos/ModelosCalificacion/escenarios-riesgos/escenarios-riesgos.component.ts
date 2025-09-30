import { UntypedFormBuilder, UntypedFormGroup, Validators  } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { MatSidenav } from '@angular/material/sidenav';
import { User, Module, Compania, ModuleScreen } from '@app/_models';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';
import { ModulesSystem } from '@environments/environment';
import { MacredService } from '@app/_services/macred.service';
import { MacEscenariosRiesgos, MacIndicadoresRelevantes, MacNivelCapacidadPago, MacNivelesXIndicador } from '@app/_models/Macred';
import { MacModeloCalificacion } from '@app/_models/Macred/ModeloCalificacion';

declare var $: any;

@Component({selector: 'app-escenarios-riesgos-macred',
            templateUrl: './escenarios-riesgos.component.html',
            styleUrls: ['../../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class EscenariosRiesgosComponent extends OnSeguridad implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'escenarios-riesgos.html';

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private companiaObservable  : Compania;
    private moduleObservable    : Module;

    // ## -- formularios -- ## //
    formEscenario : UntypedFormGroup;
    formVariable : UntypedFormGroup;

    // ## -- submit formularios -- ## //
    submitFormEscenario : boolean = false;
    submitFormVariable : boolean = false;

    // ## -- habilita botones -- ## //
    habilitaBtnRegistro     : boolean = true;
    habilitaBtnActualiza    : boolean = false;
    habilitaBtnNuevo        : boolean = false;
    habilitaBtnEliminar     : boolean = false;

    habilitaBtnRegistroVariable     : boolean = true;
    habilitaBtnActualizaVariable    : boolean = false;
    habilitaBtnNuevoVariable        : boolean = false;
    habilitaBtnEliminarVariable     : boolean = false;

    // ## -- habilita grids -- ## //
    habilitaListaEscenario : boolean = false;
    habilitaListaVariable : boolean = false;
    habilitaFormularioVariable : boolean = false;

    public moduleScreen : ModuleScreen = new ModuleScreen;

    URLIndexModulePage: string;

    // ## -- listas -- ## //
    listEscenarios: MacEscenariosRiesgos[] = [];
    listVariables: MacNivelCapacidadPago[] = [];
    listVariablesEscenario: MacNivelCapacidadPago[] = [];

    listModelosCalificacion: MacModeloCalificacion[] = [];

    objSeleccionadoEscenario: MacEscenariosRiesgos = undefined;
    objSeleccionadoVariable: MacNivelCapacidadPago = undefined;
    objSeleccionadoModelo: MacModeloCalificacion = undefined;

    public today : Date = new Date();

    oModelo : MacModeloCalificacion = undefined;
    oVariableEscenario : MacNivelCapacidadPago = undefined;

    constructor (   private route:          ActivatedRoute,
                    private alertService:   AlertService,
                    private formBuilder:    UntypedFormBuilder,
                    private accountService: AccountService,
                    private dialogo:        MatDialog,
                    private router:         Router,
                    private translate:      TranslateMessagesService,
                    private macredService:  MacredService, ) {

        super(alertService, accountService, router, translate);

        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue;

        // **
        // ** INICIALIZACIÓN DE VARIABLES
        this.URLIndexModulePage = ModulesSystem.macredbasehref + 'index.html';

        this.buscarModuloId(this.moduleObservable.id);

        this.inicializaFormularioEscenario();
        this.inicializaFormularioVariable();
    }
    
    get f () { return this.formEscenario.controls; }
    get i () { return this.formVariable.controls; }

    ngOnInit() {

        this.accountService.validateAccessUser( this.userObservable.id,
                                                this.moduleObservable.id,
                                                this.nombrePantalla,
                                                this.companiaObservable.id )
            .pipe(first())
            .subscribe(response => {

                // ## -->> redirecciona NO ACCESO
                if(!response.exito) this.router.navigate([this.URLIndexModulePage]);

                this.getModelosActivos();

                this.getEscenariosRiesgos();
                this.getNivelesCapacidadPago();
        });
    }
    private getModelosActivos() : void {
        this.macredService.getModelosCalificacionActivos()
            .pipe(first())
            .subscribe(response => {

                if (response && response.length > 0) this.listModelosCalificacion = response;
                
            }, error => { this.alertService.error(error); });
    }

    redirectIndexModule() : void { this.router.navigate([this.URLIndexModulePage]); }

    onChangeEventModelo() {

        this.oModelo = this.formEscenario.get('modelo')?.value;
        this.objSeleccionadoModelo = this.oModelo;
    }
    onChangeEvent() {

        this.oVariableEscenario = this.formVariable.get('descripcionNivel')?.value;
        this.objSeleccionadoVariable = this.oVariableEscenario;

        let nivel : MacNivelCapacidadPago = this.listVariables.find(e => e.id == this.objSeleccionadoVariable.id);

        this.formVariable.get('rangoInicial')?.setValue(nivel.rangoInicial);;
        this.formVariable.get('rangoFinal')?.setValue(nivel.rangoFinal);;
    }

    consultaRangosNiveles() : void {
        this.getNivelesCapacidadPago();
        this.inicializaFormularioVariable();
    }

    nuevoIndicadorRelevante() : void { 

        this.submitFormEscenario = false;
        this.inicializaFormularioEscenario();

        this.habilitaFormularioVariable = false;
    }
    nuevoNivelXIndicador() : void { 

        this.submitFormVariable = false;
        this.inicializaFormularioVariable();
    }

    selectEscenario(objeto : MacEscenariosRiesgos = null) : void {

        this.habilitaFormularioVariable = true;

        this.inicializaFormularioEscenario(objeto);
        this.inicializaFormularioVariable();

        // consultar niveles por indicador
        // this.getNivelesPorIndicador(objeto.codIndicador);
    }
    selectNivel(objeto : MacNivelCapacidadPago = null) : void {

        this.inicializaFormularioVariable(objeto);
        this.formVariable.get('descripcionNivel')?.disable();
    }

    private getNivelesPorIndicador(pidIndicador : number) {

        let listNivelesTemp : MacNivelCapacidadPago[] = null;

        this.macredService.getNivelesXIndicador(pidIndicador)
            .pipe(first())
            .subscribe((response) => {

                if (response && response.length > 0) {

                    listNivelesTemp = [];
                    this.habilitaListaVariable = true;

                    response.forEach(element => {

                        let nivel : MacNivelCapacidadPago = this.listVariables.find(e => e.id == element.codNivel);

                        nivel.id
                        nivel.rangoInicial = element.rangoInicial;
                        nivel.rangoFinal = element.rangoFinal;

                        listNivelesTemp.push(nivel);
                    });
                    this.listVariablesEscenario = listNivelesTemp;

                } else {
                    this.habilitaListaVariable = false;
                    this.listVariablesEscenario = [];
                }
            });
    }

    private inicializaFormularioEscenario(objeto : MacEscenariosRiesgos = null) : void {

        if (objeto) {

            this.formEscenario = this.formBuilder.group({
                descripcionEscenario : [objeto.descripcion, Validators.required],
                modelo : [this.listModelosCalificacion.find(v => v.id === objeto.codModelo), Validators.required],
                estadoEscenario : [objeto.estado]
            });
            this.objSeleccionadoEscenario = objeto;
            this.iniciarBotonesModelo(false);
        } 
        else {

            this.formEscenario = this.formBuilder.group({
                descripcionEscenario : ['', Validators.required],
                modelo : [null, Validators.required],
                estadoEscenario : [false]
            });
            this.objSeleccionadoEscenario = undefined;
            this.iniciarBotonesModelo(true);
        }
    }
    private inicializaFormularioVariable(objeto : MacNivelCapacidadPago = null) : void {

        if (objeto) {

            this.formVariable = this.formBuilder.group({
                descripcionNivel : [this.listVariables.find(v => v.id === objeto.id), Validators.required],
                rangoInicial : [objeto.rangoInicial, Validators.required],
                rangoFinal : [objeto.rangoFinal, Validators.required]
            });
            this.objSeleccionadoVariable = objeto;
            this.iniciarBotonesNivel(false);
        } 
        else {

            this.formVariable = this.formBuilder.group({
                descripcionNivel : [null, Validators.required],
                rangoInicial : [null, Validators.required],
                rangoFinal : [null, Validators.required]
            });
            this.objSeleccionadoVariable = undefined;
            this.iniciarBotonesNivel(true);
        }
    }

    private createEscenarioForm(registra : boolean = false) : MacEscenariosRiesgos {

        const { descripcionEscenario,
                estadoEscenario
             } = this.formEscenario.controls;

        var objeto = new MacEscenariosRiesgos();

        objeto.descripcion = descripcionEscenario.value;
        objeto.codModelo = this.objSeleccionadoModelo.id;
        objeto.estado = estadoEscenario.value;

        if (registra) {

            objeto.codigoCompania = this.companiaObservable.id;
            objeto.usuarioCreacion = this.userObservable.identificacion;
            objeto.fechaCreacion = this.today;

        } else {
            objeto.codEscenario = this.objSeleccionadoEscenario.codEscenario;
            objeto.usuarioModificacion = this.userObservable.identificacion;
            objeto.fechaModificacion = this.today;
        }
        return objeto;
    }
    private createNivelesForm(registra : boolean = false) : MacNivelesXIndicador {

        this.submitFormVariable = false;

        const { rangoInicial, 
                rangoFinal,
            } = this.formVariable.controls;

        var objeto = new MacNivelesXIndicador();

        objeto.codigoCompania = this.companiaObservable.id;
        // objeto.codIndicador = this.objSeleccionadoEscenario.codIndicador;
        objeto.codNivel = this.objSeleccionadoVariable.id;

        objeto.rangoInicial = rangoInicial.value;
        objeto.rangoFinal = rangoFinal.value;

        if (registra) {

            objeto.usuarioCreacion = this.userObservable.identificacion;
            objeto.fechaCreacion = this.today;

        } else {

            objeto.usuarioModificacion = this.userObservable.identificacion; 
            objeto.fechaModificacion = this.today;
        }
        return objeto;
    }

    postEscenario() : void {

        this.alertService.clear();
        this.submitFormEscenario = true;

        if ( this.formEscenario.invalid ) return;

        let objeto : MacEscenariosRiesgos = this.createEscenarioForm(true);

        this.macredService.postEscenariosRiesgo(objeto)
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {

                    this.submitFormEscenario = false;

                    this.listEscenarios.push(response.objetoDb);

                    this.selectEscenario(response.objetoDb);

                    if (!this.habilitaListaEscenario) this.habilitaListaEscenario = true;
                    
                    this.alertService.success( response.responseMesagge );

                } else { this.alertService.error(response.responseMesagge); }
            }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
        });
    }
    postNivelXIndicador() : void {

        this.alertService.clear();
        this.submitFormVariable = true;

        let registrar : boolean = true;

        if ( this.formVariable.invalid ) return;

        let objeto : MacNivelesXIndicador = this.createNivelesForm(true);

        if (objeto.rangoInicial <= objeto.rangoFinal) {

            if (this.listVariablesEscenario.find(e => e.id == this.oVariableEscenario.id)) registrar = false;

            if (registrar) {

                this.macredService.postNivelXIndicador(objeto)
                    .pipe(first())
                    .subscribe(response => {

                        if (response.exito) {

                            this.submitFormVariable = false;

                            let objPost : MacNivelCapacidadPago = 
                                this.listVariables.find(e => e.id == response.objetoDb.codNivel);
                                
                            objPost.rangoInicial = response.objetoDb.rangoInicial;
                            objPost.rangoFinal = response.objetoDb.rangoFinal;

                            this.listVariablesEscenario.push(objPost);

                            this.inicializaFormularioVariable();

                            if (!this.habilitaListaVariable) this.habilitaListaVariable = true;
                            
                            this.alertService.success( response.responseMesagge );

                        } else { this.alertService.error(response.responseMesagge); }
                    }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
                });

            } else { this.alertService.error('El nivel ya se encuentra registrado.'); }
        } else { this.alertService.error('El rango Inicial no puede ser menor al rango Final.'); } 
    }

    deleteIndicadorRelevante() {

        this.alertService.clear();

        if (this.listVariablesEscenario && this.listVariablesEscenario.length > 0) {
            this.alertService.error('Deben eliminar los niveles de riesgo asociados al indicador.');
            return;
        }

        this.dialogo.open(DialogoConfirmacionComponent, { 
            data: 'Seguro que desea eliminar : ' + this.objSeleccionadoEscenario.descripcion + ' ?' 
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                // let idIndRelevante : number = this.objSeleccionadoEscenario.codIndicador;

                // this.macredService.deleteIndicadorRelevante(idIndRelevante)
                //     .pipe(first())
                //     .subscribe(response => {

                //         if (response.exito) {

                //             this.submitFormEscenario = false;

                //             this.listEscenarios.splice(
                //                 this.listEscenarios.findIndex( m => m.codIndicador == idIndRelevante ), 1
                //             );
                //             this.inicializaFormularioEscenario();

                //             if (this.listEscenarios.length === 0) this.habilitaListaEscenario = false;

                //             this.habilitaFormularioVariable = false;

                //             this.alertService.success( response.responseMesagge );

                //         } else { this.alertService.error(response.responseMesagge); }
                //     }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error);
                // });
            } else { return; }
        });
    }
    deleteNivelXIndicador() {

        this.alertService.clear();

        this.dialogo.open(DialogoConfirmacionComponent, { 
            data: 'Seguro que desea eliminar el nivel ' + this.objSeleccionadoVariable.descripcion + '?' 
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                // let idIndicador : number = this.objSeleccionadoEscenario.codIndicador;
                // let idNivel : number = this.objSeleccionadoVariable.id;
                
                // this.macredService.deleteNivelXIndicador(idIndicador, idNivel)
                //     .pipe(first())
                //     .subscribe(response => {

                //         if (response.exito) {

                //             this.listVariablesEscenario.splice(
                //                 this.listVariablesEscenario.findIndex( m => m.id == idNivel ), 1
                //             );
                //             this.inicializaFormularioVariable();

                //             if (this.listVariablesEscenario.length === 0) this.habilitaListaVariable = false;

                //             this.alertService.success( response.responseMesagge );

                //         } else { this.alertService.error(response.responseMesagge); }
                //     }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error);
                // });
            } else { return; }
        });
    }

    putEscenario() : void {

        this.alertService.clear();
        this.submitFormEscenario = true;

        if ( this.formEscenario.invalid ) return;

        let obj : MacEscenariosRiesgos = this.createEscenarioForm(false);

        // this.macredService.putIndicadorRelevante(obj)
        //     .pipe(first())
        //     .subscribe(response => {

        //         if (response.exito) {

        //             this.submitFormEscenario = false;
        //             this.listEscenarios.splice(
        //                 this.listEscenarios.findIndex( m => m.codIndicador == response.objetoDb.codIndicador ), 1
        //             );
        //             this.listEscenarios.push(response.objetoDb);

        //             this.selectEscenario(response.objetoDb);

        //             this.alertService.success( response.responseMesagge );

        //         } else { this.alertService.error(response.responseMesagge); }
        //     }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
        // });
    }
    putNivelXIndicador() : void {

        this.alertService.clear();
        this.submitFormVariable = true;

        if ( this.formVariable.invalid ) return;

        let objeto : MacNivelesXIndicador = this.createNivelesForm(false);

        if (objeto.rangoInicial <= objeto.rangoFinal) {

            this.macredService.putNivelXIndicador(objeto)
                .pipe(first())
                .subscribe(response => {

                    if (response.exito) {

                        this.submitFormVariable = false;

                        let objPut : MacNivelCapacidadPago = 
                            this.listVariables.find(e => e.id == response.objetoDb.codNivel);

                        objPut.rangoInicial = response.objetoDb.rangoInicial;
                        objPut.rangoFinal = response.objetoDb.rangoFinal;

                        this.listVariablesEscenario.splice(
                            this.listVariablesEscenario.findIndex( m => m.id == objPut.id ), 1
                        );
                        this.listVariablesEscenario.push(objPut);

                        this.inicializaFormularioVariable();

                        this.alertService.success( response.responseMesagge );

                    } else { this.alertService.error(response.responseMesagge); }
                }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
            });
        } else { this.alertService.error('El rango Inicial no puede ser menor al rango final.'); } 
    }
    
    private getEscenariosRiesgos() : void {
        this.macredService.getEscenariosRiesgos()
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0) {
                    this.habilitaListaEscenario = true;
                    this.listEscenarios = response;
                }
            }, error => { this.alertService.error(error); });
    }
    private getNivelesCapacidadPago() : void {

        this.macredService.getNivelesCapacidadPago(false)
            .pipe(first())
            .subscribe(response => {

                if (response && response.length > 0) {

                    this.listVariables = response;

                } else { this.listVariables = []; }

            }, error => { this.alertService.error(error); });
    }

    private iniciarBotonesModelo(esParaAgregar: boolean) {
        this.habilitaBtnNuevo = !esParaAgregar;
        this.habilitaBtnRegistro = esParaAgregar;
        this.habilitaBtnActualiza = !esParaAgregar;
        this.habilitaBtnEliminar = !esParaAgregar;
    }
    private iniciarBotonesNivel(esParaAgregar: boolean) {
        this.habilitaBtnNuevoVariable = !esParaAgregar;
        this.habilitaBtnRegistroVariable = esParaAgregar;
        this.habilitaBtnActualizaVariable = !esParaAgregar;
        this.habilitaBtnEliminarVariable = !esParaAgregar;
    }

    private buscarModuloId(moduleId : number) : void {
        this.accountService.getModuleId(moduleId)
            .pipe(first())
            .subscribe(response => { 
                if (response) this.moduleScreen = response ; });
    }
}
