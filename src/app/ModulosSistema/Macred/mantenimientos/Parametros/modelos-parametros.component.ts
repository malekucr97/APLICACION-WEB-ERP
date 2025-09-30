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
import { MacGrupoModeloPD, MacIndicadorGrupoModeloPD, MacModeloPD } from '@app/_models/Macred/ModeloPD';
import { VariablesPD } from '@app/_models/Macred';

declare var $: any;

@Component({selector: 'app-modelos-parametros-macred',
            templateUrl: './modelos-parametros.html',
            styleUrls: ['../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class ModelosParametrosComponent extends OnSeguridad implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'configuracion-modelos.html';

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private companiaObservable  : Compania;
    public moduleObservable     : Module;

    // ## -- formularios -- ## //
    formModelo : UntypedFormGroup;
    formGrupo : UntypedFormGroup;
    formIndicador : UntypedFormGroup;

    // ## -- submit formularios -- ## //
    submitFormModelo : boolean = false;
    submitFormGrupo : boolean = false;
    submitFormIndicador : boolean = false;

    // ## -- habilita botones -- ## //
    habilitaBtnRegistro     : boolean = true;
    habilitaBtnActualiza    : boolean = false;
    habilitaBtnNuevo        : boolean = false;
    habilitaBtnEliminar     : boolean = false;

    habilitaBtnRegistroGrupo     : boolean = true;
    habilitaBtnActualizaGrupo    : boolean = false;
    habilitaBtnNuevoGrupo        : boolean = false;
    habilitaBtnEliminarGrupo     : boolean = false;

    habilitaBtnRegistroIndicador     : boolean = true;
    habilitaBtnActualizaIndicador    : boolean = false;
    habilitaBtnNuevoIndicador        : boolean = false;
    habilitaBtnEliminarIndicador     : boolean = false;

    // ## -- habilita grids -- ## //
    habilitaListaModelo : boolean = false;
    habilitaListaGrupo : boolean = false;
    habilitaListaIndicador : boolean = false;
    habilitaFormularioGrupo : boolean = false;
    habilitaFormularioIndicador : boolean = false;

    public moduleScreen : ModuleScreen = new ModuleScreen;
    public moduleItemList : Module;

    URLIndexModulePage: string;

    // ## -- listas -- ## //
    listModelos: MacModeloPD[] = [];
    listGrupos: MacGrupoModeloPD[] = [];
    listIndicadores: MacIndicadorGrupoModeloPD[] = [];

    listVariablesPD: VariablesPD[] = [];

    objSeleccionadoModelo: MacModeloPD = undefined;
    objSeleccionadoGrupo: MacGrupoModeloPD = undefined;
    objSeleccionadoIndicador: MacIndicadorGrupoModeloPD = undefined;

    public today : Date = new Date();

    public sumatoriaPesoGrupo : number ;

    oVariablePD : VariablesPD = undefined;

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
        this.getVariablesActivasPD();

        this.inicializaFormularioModelo();
        this.inicializaFormularioGrupo();
        this.inicializaFormularioIndicador();
    }
    
    get f () { return this.formModelo.controls; }
    get g () { return this.formGrupo.controls; }
    get i () { return this.formIndicador.controls; }

    ngOnInit() { 

        this.accountService.validateAccessUser( this.userObservable.id,
                                                this.moduleObservable.id,
                                                this.nombrePantalla,
                                                this.companiaObservable.id )
            .pipe(first())
            .subscribe(response => {

                // ## -->> redirecciona NO ACCESO
                if(!response.exito) this.router.navigate([this.URLIndexModulePage]);

                this.getModelos();
        });
    }

    onChangeEvent() {
        this.oVariablePD = this.formIndicador.get('descripcionIndicador')?.value;
        this.formIndicador.get('pesoTotalIndicador')?.setValue(this.oVariablePD.valorCoeficiente);
    }

    redirectIndexModule() : void { this.router.navigate([this.URLIndexModulePage]); }

    private getVariablesActivasPD() : void {

        this.macredService.getVariablesActivasPD()
            .pipe(first())
            .subscribe(response => {

                if (response && response.length > 0) this.listVariablesPD = response;
                
            }, error => { this.alertService.error('Problemas al consultar los estados civiles.' + error); });
    }

    private buscarModuloId(moduleId : number) : void {
        this.accountService.getModuleId(moduleId)
            .pipe(first())
            .subscribe(response => { 
                if (response) this.moduleScreen = response ; });
    }

    nuevoModelo() : void { 

        this.submitFormModelo = false;
        this.inicializaFormularioModelo();

        this.habilitaFormularioGrupo = false;
        this.habilitaFormularioIndicador = false;
    }
    nuevoGrupo() : void { 

        this.submitFormGrupo = false;
        this.inicializaFormularioGrupo();

        this.habilitaFormularioIndicador = false;
    }
    nuevoIndicador() : void { 

        this.submitFormIndicador = false;
        this.inicializaFormularioIndicador();
    }

    selectModelo(objeto : MacModeloPD = null) : void {

        this.sumatoriaPesoGrupo = 0;
        this.habilitaFormularioGrupo = true;
        this.habilitaFormularioIndicador = false;

        this.inicializaFormularioModelo(objeto);
        this.inicializaFormularioGrupo();

        // consultar grupos modelos
        this.getGruposModelos(objeto.id);
    }
    selectGrupo(objeto : MacGrupoModeloPD = null) : void {
        
        this.habilitaFormularioIndicador = true;

        this.inicializaFormularioGrupo(objeto);
        this.inicializaFormularioIndicador();

        // consultar indicadores grupo
        this.getIndicadoresGrupos(objeto.id);
    }
    selectIndicador(objeto : MacIndicadorGrupoModeloPD = null) : void {

        this.inicializaFormularioIndicador(objeto);
        this.formIndicador.get('descripcionIndicador')?.disable();
    }

    private inicializaFormularioModelo(objeto : MacModeloPD = null) : void {

        if (objeto) {

            this.formModelo = this.formBuilder.group({
                descripcionModelo : [objeto.descripcion, Validators.required],
                estadoModelo : [objeto.estado]
            });
            this.objSeleccionadoModelo = objeto;
            this.iniciarBotonesModelo(false);
        } 
        else {

            this.formModelo = this.formBuilder.group({
                descripcionModelo : ['', Validators.required],
                estadoModelo : [false]
            });
            this.objSeleccionadoModelo = undefined;
            this.iniciarBotonesModelo(true);
        }
    }
    private inicializaFormularioGrupo(objeto : MacGrupoModeloPD = null) : void {

        if (objeto) {

            this.formGrupo = this.formBuilder.group({
                descripcionGrupo : [objeto.descripcion, Validators.required],
                pesoGrupo : [objeto.peso, Validators.required],
                pesoTotalGrupo : [this.sumatoriaPesoGrupo],
                estadoGrupo : [objeto.estado]
            });
            this.objSeleccionadoGrupo = objeto;
            this.iniciarBotonesGrupo(false);
        } 
        else {

            this.formGrupo = this.formBuilder.group({
                descripcionGrupo : [null, Validators.required],
                pesoGrupo : [0, Validators.required],
                pesoTotalGrupo : [this.sumatoriaPesoGrupo],
                estadoGrupo : [false]
            });
            this.objSeleccionadoGrupo = undefined;
            this.iniciarBotonesGrupo(true);
        }
    }
    private inicializaFormularioIndicador(objeto : MacIndicadorGrupoModeloPD = null) : void {

        if (objeto) {

            this.formIndicador = this.formBuilder.group({
                descripcionIndicador : [this.listVariablesPD.find(v => v.id === objeto.idVariablePD), Validators.required],
                pesoIndicador : [objeto.peso, Validators.required],
                pesoTotalIndicador : [this.listVariablesPD.find(v => v.id === objeto.idVariablePD).valorCoeficiente],
                estadoIndicador : [objeto.estado]
            });
            this.objSeleccionadoIndicador = objeto;
            this.iniciarBotonesIndicador(false);

            this.oVariablePD = this.listVariablesPD.find(v => v.id === objeto.idVariablePD);
        } 
        else {

            this.formIndicador = this.formBuilder.group({
                descripcionIndicador : [null, Validators.required],
                pesoIndicador : [0, Validators.required],
                pesoTotalIndicador : [null],
                estadoIndicador : [false]
            });
            this.objSeleccionadoIndicador = undefined;
            this.iniciarBotonesIndicador(true);

            this.oVariablePD = undefined;
        }
    }

    private createModeloForm(registra : boolean = false) : MacModeloPD {

        const { descripcionModelo,
                estadoModelo
             } = this.formModelo.controls;

        var objeto = new MacModeloPD();

        objeto.descripcion = descripcionModelo.value;
        objeto.estado = estadoModelo.value;

        if (registra) {

            objeto.idCompania = this.companiaObservable.id;
            objeto.idModulo = this.moduleObservable.id;
            objeto.adicionadoPor = this.userObservable.identificacion;
            objeto.fechaAdicion = this.today;

        } else {
            objeto.id = this.objSeleccionadoModelo.id;
            objeto.modificadoPor = this.userObservable.identificacion; 
            objeto.fechaModificacion = this.today;
        }
        return objeto;
    }
    private createGrupoForm(registra : boolean = false) : MacGrupoModeloPD {

        let totalPeso : number = 0;

        const { descripcionGrupo, 
                pesoGrupo, 
                pesoTotalGrupo, 
                estadoGrupo
            } = this.formGrupo.controls;

        if (registra) {

            totalPeso = pesoGrupo.value + pesoTotalGrupo.value;

        } else {

            totalPeso = pesoGrupo.value;

            this.listGrupos.forEach(element => {
                if (element.id != this.objSeleccionadoGrupo.id) totalPeso += element.peso;
            });
        }

        if (totalPeso > 100) return null;

        this.sumatoriaPesoGrupo = totalPeso;
        this.formGrupo.get('pesoTotalGrupo')?.setValue(this.sumatoriaPesoGrupo);

        var objeto = new MacGrupoModeloPD();

        objeto.descripcion = descripcionGrupo.value;
        objeto.peso = pesoGrupo.value;
        objeto.estado = estadoGrupo.value;

        if (registra) {

            objeto.idCompania = this.companiaObservable.id;
            objeto.idModulo = this.moduleObservable.id;

            objeto.idModeloPD = this.objSeleccionadoModelo.id;

            objeto.adicionadoPor = this.userObservable.identificacion;
            objeto.fechaAdicion = this.today;

        } else {
            objeto.id = this.objSeleccionadoGrupo.id;

            objeto.modificadoPor = this.userObservable.identificacion; 
            objeto.fechaModificacion = this.today;
        }
        return objeto;
    }
    private createIndicadorForm(registra : boolean = false) : MacIndicadorGrupoModeloPD {

        const { descripcionIndicador, 
                pesoIndicador, 
                estadoIndicador
            } = this.formIndicador.controls;

        var objeto = new MacIndicadorGrupoModeloPD();

        objeto.idVariablePD = this.oVariablePD.id;

        objeto.descripcion = descripcionIndicador.value.descripcionVariable;
        objeto.peso = pesoIndicador.value;
        objeto.estado = estadoIndicador.value;

        if (registra) {

            objeto.idCompania = this.companiaObservable.id;
            objeto.idModulo = this.moduleObservable.id;

            objeto.idGrupoModeloPD = this.objSeleccionadoGrupo.id;

            objeto.adicionadoPor = this.userObservable.identificacion;
            objeto.fechaAdicion = this.today;

        } else {
            objeto.id = this.objSeleccionadoIndicador.id;

            objeto.modificadoPor = this.userObservable.identificacion; 
            objeto.fechaModificacion = this.today;
        }
        return objeto;
    }

    postModelo() : void {

        this.alertService.clear();
        this.submitFormModelo = true;

        if ( this.formModelo.invalid ) return;

        let objeto : MacModeloPD = this.createModeloForm(true);

        this.macredService.postModeloPD(objeto)
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {

                    this.submitFormModelo = false;
                    this.listModelos.push(response.objetoDb);
                    this.inicializaFormularioModelo();

                    if (!this.habilitaListaModelo) this.habilitaListaModelo = true;
                    
                    this.alertService.success( response.responseMesagge );

                } else { this.alertService.error(response.responseMesagge); }
            }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
        });
    }
    postGrupo() : void {

        this.alertService.clear();
        this.submitFormGrupo = true;

        if ( this.formGrupo.invalid ) return;

        let objeto : MacGrupoModeloPD = this.createGrupoForm(true);

        if (objeto) {
            this.macredService.postGrupoModeloPD(objeto)
                .pipe(first())
                .subscribe(response => {

                    if (response.exito) {

                        this.submitFormGrupo = false;
                        this.listGrupos.push(response.objetoDb);
                        this.inicializaFormularioGrupo();

                        this.habilitaListaGrupo = true;
                        
                        this.alertService.success( response.responseMesagge );

                    } else { this.alertService.error(response.responseMesagge); }
                }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
            });

        } else { this.alertService.error( 'La sumatoria de los pesos no puede superar los 100.' ); }
    }
    postIndicador() : void {

        this.alertService.clear();
        this.submitFormIndicador = true;

        let registrar : boolean = true;

        if ( this.formIndicador.invalid ) return;

        let objeto : MacIndicadorGrupoModeloPD = this.createIndicadorForm(true);

        // valida registro duplicado
        this.listIndicadores.forEach(element => {
            if (objeto.idVariablePD === element.idVariablePD) registrar = false;
        });

        if (registrar) {

            this.macredService.postIndicadoresGrupoModPD(objeto)
                .pipe(first())
                .subscribe(response => {

                    if (response.exito) {

                        this.submitFormIndicador = false;
                        this.listIndicadores.push(response.objetoDb);
                        this.inicializaFormularioIndicador();

                        this.habilitaListaIndicador = true;
                        
                        this.alertService.success( response.responseMesagge );

                    } else { this.alertService.error(response.responseMesagge); }
                }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
            });
        } else { this.alertService.error('La variable ya se encuentra registrada.'); }
    }

    deleteModelo() {

        this.alertService.clear();

        if (this.listGrupos && this.listGrupos.length > 0) {
            this.alertService.error('Debe eliminar los grupos asociados al modelo.');
            return;
        }

        this.dialogo.open(DialogoConfirmacionComponent, { 
            data: 'Seguro que desea eliminar a ' + this.objSeleccionadoModelo.descripcion + '?' 
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.macredService.deleteModeloPD(this.objSeleccionadoModelo.id)
                    .pipe(first())
                    .subscribe(response => {

                        if (response.exito) {

                            this.submitFormModelo = false;
                            this.listModelos.splice(this.listModelos.findIndex( m => m.id == this.objSeleccionadoModelo.id ), 1);
                            this.inicializaFormularioModelo();

                            if (this.listModelos.length === 0) {
                                this.habilitaListaModelo = false;
                                this.habilitaFormularioGrupo = false;
                            }

                            this.alertService.success( response.responseMesagge );

                        } else { this.alertService.error(response.responseMesagge); }
                    }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error);
                });
            } else { return; }
        });
    }
    deleteGrupo() {

        let totalPeso : number = 0;

        this.alertService.clear();

        if (this.listIndicadores && this.listIndicadores.length > 0) {
            this.alertService.error('Debe eliminar los indicadores asociados al grupo.');
            return;
        }

        this.dialogo.open(DialogoConfirmacionComponent, { 
            data: 'Seguro que desea eliminar el grupo ' + this.objSeleccionadoGrupo.descripcion + '?' 
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.macredService.deleteGrupoModeloPD(this.objSeleccionadoGrupo.id)
                    .pipe(first())
                    .subscribe(response => {

                        if (response.exito) {

                            this.submitFormGrupo = false;
                            this.listGrupos.splice(this.listGrupos.findIndex( m => m.id == this.objSeleccionadoGrupo.id ), 1);
                            this.inicializaFormularioGrupo();

                            if (this.listGrupos.length === 0) {
                                this.habilitaListaGrupo = false;
                                this.habilitaFormularioIndicador = false;
                            }

                            this.listGrupos.forEach(element => { totalPeso += element.peso; });

                            this.sumatoriaPesoGrupo = totalPeso;
                            this.formGrupo.get('pesoTotalGrupo')?.setValue(this.sumatoriaPesoGrupo);

                            this.alertService.success( response.responseMesagge );

                        } else { this.alertService.error(response.responseMesagge); }
                    }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error);
                });
            } else { return; }
        });
    }
    deleteIndicador() {

        this.alertService.clear();

        this.dialogo.open(DialogoConfirmacionComponent, { 
            data: 'Seguro que desea eliminar el indicador ' + this.objSeleccionadoIndicador.descripcion + '?' 
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.macredService.deleteIndicadoresGrupoModPD(this.objSeleccionadoIndicador.id)
                    .pipe(first())
                    .subscribe(response => {

                        if (response.exito) {

                            this.submitFormIndicador = false;
                            this.listIndicadores.splice(this.listIndicadores.findIndex( m => m.id == this.objSeleccionadoIndicador.id ), 1);
                            this.inicializaFormularioIndicador();

                            if (this.listIndicadores.length === 0) this.habilitaListaIndicador = false;

                            this.alertService.success( response.responseMesagge );

                        } else { this.alertService.error(response.responseMesagge); }
                    }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error);
                });
            } else { return; }
        });
    }

    putModelo() : void {

        this.alertService.clear();
        this.submitFormModelo = true;

        if ( this.formModelo.invalid ) return;

        let obj : MacModeloPD = this.createModeloForm(false);

        this.macredService.putModeloPD(obj)
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {

                    this.submitFormModelo = false;
                    this.listModelos.splice(this.listModelos.findIndex( m => m.id == response.objetoDb.id ), 1);
                    this.listModelos.push(response.objetoDb);
                    
                    this.inicializaFormularioModelo();

                    this.habilitaFormularioGrupo = false;

                    this.alertService.success( response.responseMesagge );

                } else { this.alertService.error(response.responseMesagge); }
            }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
        });
    }
    putGrupo() : void {

        this.alertService.clear();
        this.submitFormGrupo = true;

        if ( this.formGrupo.invalid ) return;

        let objeto : MacGrupoModeloPD = this.createGrupoForm(false);

        if (objeto) {

            this.macredService.putGrupoModeloPD(objeto)
                .pipe(first())
                .subscribe(response => {

                    if (response.exito) {

                        this.submitFormGrupo = false;
                        this.listGrupos.splice(this.listGrupos.findIndex( m => m.id == response.objetoDb.id ), 1);
                        this.listGrupos.push(response.objetoDb);

                        this.selectGrupo(response.objetoDb);

                        this.alertService.success( response.responseMesagge );

                    } else { this.alertService.error(response.responseMesagge); }
                }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
            });

        } else { this.alertService.error( 'La sumatoria de los pesos no puede superar los 100.' ); }
    }
    putIndicador() : void {

        this.alertService.clear();
        this.submitFormIndicador = true;

        if ( this.formIndicador.invalid ) return;

        let objeto : MacIndicadorGrupoModeloPD = this.createIndicadorForm(false);

        this.macredService.putIndicadoresGrupoModPD(objeto)
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {

                    this.submitFormIndicador = false;
                    this.listIndicadores.splice(this.listIndicadores.findIndex( m => m.id == response.objetoDb.id ), 1);
                    this.listIndicadores.push(response.objetoDb);
                    this.inicializaFormularioIndicador();

                    this.alertService.success( response.responseMesagge );

                } else { this.alertService.error(response.responseMesagge); }
            }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
        });
    }
    
    private getModelos() : void {
        this.macredService.getModelosPD()
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0) {
                    this.habilitaListaModelo = true;
                    this.listModelos = response;
                }
            }, error => { this.alertService.error(error); });
    }
    private getGruposModelos(pidModelo : number) : void {

        this.macredService.getGruposModelosPD(pidModelo)
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0) {
                    this.habilitaListaGrupo = true;
                    this.listGrupos = response;

                    this.listGrupos.forEach(element => { this.sumatoriaPesoGrupo += element.peso; });

                    this.formGrupo.get('pesoTotalGrupo')?.setValue(this.sumatoriaPesoGrupo);

                } else {
                    this.habilitaListaGrupo = false;
                    this.listGrupos = [];
                }
            }, error => { this.alertService.error(error); });
    }
    private getIndicadoresGrupos(pidGrupo : number) : void {

        this.macredService.getIndicadoresGrupoModPD(pidGrupo)
            .pipe(first())
            .subscribe(response => {

                if (response && response.length > 0) {

                    this.habilitaListaIndicador = true;
                    this.listIndicadores = response;

                } else {
                    this.habilitaListaIndicador = false;
                    this.listIndicadores= [];
                }
            }, error => { this.alertService.error(error); });
    }

    private iniciarBotonesModelo(esParaAgregar: boolean) {
        this.habilitaBtnNuevo = !esParaAgregar;
        this.habilitaBtnRegistro = esParaAgregar;
        this.habilitaBtnActualiza = !esParaAgregar;
        this.habilitaBtnEliminar = !esParaAgregar;
    }
    private iniciarBotonesGrupo(esParaAgregar: boolean) {
        this.habilitaBtnNuevoGrupo = !esParaAgregar;
        this.habilitaBtnRegistroGrupo = esParaAgregar;
        this.habilitaBtnActualizaGrupo = !esParaAgregar;
        this.habilitaBtnEliminarGrupo = !esParaAgregar;
    }
    private iniciarBotonesIndicador(esParaAgregar: boolean) {
        this.habilitaBtnNuevoIndicador = !esParaAgregar;
        this.habilitaBtnRegistroIndicador = esParaAgregar;
        this.habilitaBtnActualizaIndicador = !esParaAgregar;
        this.habilitaBtnEliminarIndicador = !esParaAgregar;
    }
}
