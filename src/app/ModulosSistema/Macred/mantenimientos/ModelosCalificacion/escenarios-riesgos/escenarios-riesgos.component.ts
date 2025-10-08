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
import { MacEscenariosRiesgos, MacVariableCriticaXEscenario, MacVariablesCriticas } from '@app/_models/Macred';
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
    listVariablesEscenario: MacVariableCriticaXEscenario[] = [];

    listTipoEstres = [
        {id : 'R', descripcion : 'Puntos Porcentuales'},
        {id : 'P', descripcion : 'Porcentaje'}
    ];

    listModelosCalificacion: MacModeloCalificacion[] = [];
    listVariablesCriticas : MacVariablesCriticas[] = [];

    objSeleccionadoEscenario: MacEscenariosRiesgos = undefined;
    objSeleccionadoVariable: MacVariablesCriticas = undefined;
    objSeleccionadoVariableEscenario: MacVariableCriticaXEscenario = undefined;

    objSeleccionadoModelo: MacModeloCalificacion = undefined;

    public today : Date = new Date();

    oModelo : MacModeloCalificacion = undefined;
    oVariable : MacVariablesCriticas = undefined;
    oTipoEstres : string = undefined;

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
                this.getVariablesCriticasActivas();

                this.getEscenariosRiesgos();
        });
    }
    private getModelosActivos() : void {
        this.macredService.getModelosCalificacionActivos()
            .pipe(first())
            .subscribe(response => {

                if (response && response.length > 0) this.listModelosCalificacion = response;
                
            }, error => { this.alertService.error(error); });
    }
    private getVariablesCriticasActivas() {
        this.macredService.getVariablesCriticasActivas()
            .pipe(first())
            .subscribe((response) => {

                if (response && response.length > 0) this.listVariablesCriticas = response;
                
            }, error => { this.alertService.error(error); });
    }

    redirectIndexModule() : void { this.router.navigate([this.URLIndexModulePage]); }

    onChangeEventModelo() {
        this.oModelo = this.formEscenario.get('modelo')?.value;
        this.objSeleccionadoModelo = this.oModelo;
    }
    onChangeEventVariable() {
        this.oVariable = this.formVariable.get('variableCritica')?.value;
        this.objSeleccionadoVariable = this.oVariable;
    }
    onChangeEventTipoEstres() {
        this.oTipoEstres = this.formVariable.get('tipoEstres')?.value.id;
    }

    nuevoEscenario() : void { 

        this.submitFormEscenario = false;
        this.inicializaFormularioEscenario();

        this.habilitaFormularioVariable = false;
    }
    nuevaVariableXEscenario() : void { 

        this.submitFormVariable = false;
        this.inicializaFormularioVariable();
    }

    selectEscenario(objeto : MacEscenariosRiesgos = null) : void {

        this.habilitaFormularioVariable = true;

        this.inicializaFormularioEscenario(objeto);
        this.inicializaFormularioVariable();

        // consultar variables por escenario
        this.getVariablesEscenario(objeto.codEscenario);
    }
    selectVariableEscenario(objeto : MacVariableCriticaXEscenario = null) : void {

        this.inicializaFormularioVariable(objeto);
        this.formVariable.get('variableCritica')?.disable();
    }

    private getVariablesEscenario(pidEscenario : number) {

        let listTemp : MacVariableCriticaXEscenario[] = [];

        this.macredService.getVariablesCriticasXEscenario(pidEscenario)
            .pipe(first())
            .subscribe((response) => {

                if (response && response.length > 0) {

                    this.habilitaListaVariable = true;

                    response.forEach(element => {

                        let descripcionVariable : string = 
                                this.listVariablesCriticas.find(e => e.id == element.idVariable).descripcion;
                            
                        let descripcionTipoEstres : string = 
                            this.listTipoEstres.find(t => t.id === element.tipoEstres)?.descripcion;

                        element.descripcionVariable = descripcionVariable;
                        element.descripcionTipoEstres = descripcionTipoEstres;

                        listTemp.push(element);
                    });
                    this.listVariablesEscenario = listTemp;
                    
                } else { this.habilitaListaVariable = false; this.listVariablesEscenario = []; }
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
    private inicializaFormularioVariable(objeto : MacVariableCriticaXEscenario = null) : void {

        if (objeto) {

            this.formVariable = this.formBuilder.group({
                variableCritica : [this.listVariablesCriticas.find(v => v.id === objeto.idVariable), Validators.required],
                tipoEstres : [this.listTipoEstres.find(t => t.id === objeto.tipoEstres), Validators.required],
                valorEstres : [objeto.valorEstres, Validators.required]
            });
            this.objSeleccionadoVariableEscenario = objeto;
            this.iniciarBotonesNivel(false);

            this.objSeleccionadoVariable = this.listVariablesCriticas.find(e => e.id == objeto.idVariable);
        } 
        else {

            this.formVariable = this.formBuilder.group({
                variableCritica : [null, Validators.required],
                tipoEstres : [null, Validators.required],
                valorEstres : [null, Validators.required]
            });
            this.objSeleccionadoVariableEscenario = undefined;
            this.iniciarBotonesNivel(true);

            this.objSeleccionadoVariable = undefined;
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
    private createVariableEscenarioForm(registra : boolean = false) : MacVariableCriticaXEscenario {

        this.submitFormVariable = false;

        const { valorEstres, tipoEstres } = this.formVariable.controls;

        var objeto = new MacVariableCriticaXEscenario();

        objeto.idEscenario = this.objSeleccionadoEscenario.codEscenario;
        objeto.idVariable = this.objSeleccionadoVariable.id;
        
        objeto.tipoEstres = tipoEstres.value.id;
        objeto.valorEstres = valorEstres.value;

        if (registra) {

            objeto.adicionadoPor = this.userObservable.identificacion;
            objeto.fechaAdicion = this.today;

        } else {

            objeto.id = this.objSeleccionadoVariableEscenario.id;
            objeto.modificadoPor = this.userObservable.identificacion; 
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
    postVariableXEscenario() : void {

        this.alertService.clear();
        this.submitFormVariable = true;

        let registrar : boolean = true;

        if ( this.formVariable.invalid ) return;

        let objeto : MacVariableCriticaXEscenario = this.createVariableEscenarioForm(true);

        if (this.listVariablesEscenario.find(e => e.idVariable == this.objSeleccionadoVariable.id)) registrar = false;

            if (registrar) {

                this.macredService.postVariableCriticaXEscenario(objeto)
                    .pipe(first())
                    .subscribe(response => {

                        if (response.exito) {

                            this.submitFormVariable = false;

                            let descripcionVariable : string = 
                                this.listVariablesCriticas.find(e => e.id == response.objetoDb.idVariable).descripcion;
                            
                            let descripcionTipoEstres : string = 
                                this.listTipoEstres.find(t => t.id === response.objetoDb.tipoEstres)?.descripcion;

                            response.objetoDb.descripcionVariable = descripcionVariable;
                            response.objetoDb.descripcionTipoEstres = descripcionTipoEstres;

                            this.listVariablesEscenario.push(response.objetoDb);

                            this.inicializaFormularioVariable();

                            if (!this.habilitaListaVariable) this.habilitaListaVariable = true;
                            
                            this.alertService.success( response.responseMesagge );

                        } else { this.alertService.error(response.responseMesagge); }
                    }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
                });

            } else { this.alertService.error('El nivel ya se encuentra registrado.'); }
    }

    deleteEscenario() {

        this.alertService.clear();

        if (this.listVariablesEscenario && this.listVariablesEscenario.length > 0) {
            this.alertService.error('Debe eliminar las variables asociadas al escenario.');
            return;
        }

        this.dialogo.open(DialogoConfirmacionComponent, { 
            data: 'Seguro que desea eliminar : ' + this.objSeleccionadoEscenario.descripcion + ' ?' 
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                let id : number = this.objSeleccionadoEscenario.codEscenario;

                this.macredService.deleteEscenariosRiesgos(id)
                    .pipe(first())
                    .subscribe(response => {

                        if (response.exito) {

                            this.submitFormEscenario = false;

                            this.listEscenarios.splice(
                                this.listEscenarios.findIndex( m => m.codEscenario == id ), 1
                            );
                            this.inicializaFormularioEscenario();

                            if (this.listEscenarios.length === 0) this.habilitaListaEscenario = false;

                            this.habilitaFormularioVariable = false;

                            this.alertService.success( response.responseMesagge );

                        } else { this.alertService.error(response.responseMesagge); }
                    }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error);
                });
            } else { return; }
        });
    }
    deleteVariableXEscenario() {

        this.alertService.clear();

        let idVariable : number = this.objSeleccionadoVariableEscenario.idVariable;
        let idVariableEscenario : number = this.objSeleccionadoVariableEscenario.id;

        let descripcionVariable : string = 
            this.listVariablesCriticas.find(e => e.id == idVariable).descripcion;

        this.dialogo.open(DialogoConfirmacionComponent, { 
            data: 'Seguro que desea eliminar la variable ' + descripcionVariable + '?' 
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {
                
                this.macredService.deleteVariableCriticaXEscenario(idVariableEscenario)
                    .pipe(first())
                    .subscribe(response => {

                        if (response.exito) {

                            this.listVariablesEscenario.splice(
                                this.listVariablesEscenario.findIndex( m => m.id == idVariableEscenario ), 1
                            );
                            this.inicializaFormularioVariable();

                            if (this.listVariablesEscenario.length === 0) this.habilitaListaVariable = false;

                            this.alertService.success( response.responseMesagge );

                        } else { this.alertService.error(response.responseMesagge); }
                    }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error);
                });
            } else { return; }
        });
    }

    putEscenario() : void {

        this.alertService.clear();
        this.submitFormEscenario = true;

        if ( this.formEscenario.invalid ) return;

        let obj : MacEscenariosRiesgos = this.createEscenarioForm(false);

        this.macredService.putEscenariosRiesgos(obj)
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {

                    this.submitFormEscenario = false;
                    this.listEscenarios.splice(
                        this.listEscenarios.findIndex( m => m.codEscenario == response.objetoDb.codEscenario ), 1
                    );
                    this.listEscenarios.push(response.objetoDb);

                    this.selectEscenario(response.objetoDb);

                    this.alertService.success( response.responseMesagge );

                } else { this.alertService.error(response.responseMesagge); }
            }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
        });
    }
    putNivelXIndicador() : void {

        this.alertService.clear();
        this.submitFormVariable = true;

        if ( this.formVariable.invalid ) return;

        let objeto : MacVariableCriticaXEscenario = this.createVariableEscenarioForm(false);

        this.macredService.putVariableCriticaXEscenario(objeto)
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {

                    this.submitFormVariable = false;

                    let descripcionVariable : string = 
                                this.listVariablesCriticas.find(e => e.id == response.objetoDb.idVariable).descripcion;
                            
                    let descripcionTipoEstres : string = 
                        this.listTipoEstres.find(t => t.id === response.objetoDb.tipoEstres)?.descripcion;

                    response.objetoDb.descripcionVariable = descripcionVariable;
                    response.objetoDb.descripcionTipoEstres = descripcionTipoEstres;

                    this.listVariablesEscenario.splice(
                        this.listVariablesEscenario.findIndex( m => m.id == response.objetoDb.id ), 1
                    );
                    this.listVariablesEscenario.push(response.objetoDb);

                    this.inicializaFormularioVariable();

                    this.alertService.success( response.responseMesagge );

                } else { this.alertService.error(response.responseMesagge); }
            }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
        });
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
