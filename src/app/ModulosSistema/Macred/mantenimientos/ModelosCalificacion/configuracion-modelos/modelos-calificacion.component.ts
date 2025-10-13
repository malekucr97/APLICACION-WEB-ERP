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
import { MacGrupoModeloCalificacion, MacIndicadorGrupoModeloCalificacion, MacModeloCalificacion } from '@app/_models/Macred/ModeloCalificacion';
import { MacIndicadoresRelevantes } from '@app/_models/Macred';

declare var $: any;

@Component({selector: 'app-modelos-calificacion-macred',
            templateUrl: './modelos-calificacion.html',
            styleUrls: ['../../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class ModelosCalificacionComponent extends OnSeguridad implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'configuracion-modelos.html';

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private companiaObservable  : Compania;
    moduleObservable: Module;

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
    listModelos: MacModeloCalificacion[] = [];
    listGrupos: MacGrupoModeloCalificacion[] = [];
    listIndicadoresModelos: MacIndicadorGrupoModeloCalificacion[] = [];
    listIndicadoresRelevantes: MacIndicadoresRelevantes[] = [];

    objSeleccionadoModelo: MacModeloCalificacion = undefined;
    objSeleccionadoGrupo: MacGrupoModeloCalificacion = undefined;
    objSeleccionadoIndicador: MacIndicadorGrupoModeloCalificacion = undefined;

    public today : Date = new Date();

    public sumatoriaPesoGrupo : number ;
    public sumatoriaPesoIndicador : number ;

    oIndicador : MacIndicadoresRelevantes = undefined;

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
                this.getIndicadoresRelevantesActivos();
        });
    }

    public redirectIndexModule() : void { this.router.navigate([this.URLIndexModulePage]); }

    buscarModuloId(moduleId : number) : void {
        this.accountService.getModuleId(moduleId)
            .pipe(first())
            .subscribe(response => { 
                if (response) this.moduleScreen = response ; });
    }
    private getIndicadoresRelevantesActivos() : void {
        this.macredService.getIndicadoresRelevantesActivos()
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0)  this.listIndicadoresRelevantes = response;
                
            }, error => { this.alertService.error(error); });
    }

    onChangeEventIndicador() {
        this.oIndicador = this.formIndicador.get('indicadorRelevante')?.value;
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

    selectModelo(objeto : MacModeloCalificacion = null) : void {

        this.sumatoriaPesoGrupo = 0;
        this.habilitaFormularioGrupo = true;
        this.habilitaFormularioIndicador = false;

        this.inicializaFormularioModelo(objeto);
        this.inicializaFormularioGrupo();

        // consultar grupos modelos
        this.getGruposModelosCalificacion(objeto.id);
    }
    selectGrupo(objeto : MacGrupoModeloCalificacion = null) : void {
        
        this.sumatoriaPesoIndicador = 0;
        this.habilitaFormularioIndicador = true;

        this.inicializaFormularioGrupo(objeto);
        this.inicializaFormularioIndicador();

        // consultar indicadores grupo
        this.getIndicadoresGruposCalif(objeto.id);
    }
    selectIndicador(objeto : MacIndicadorGrupoModeloCalificacion = null) : void {
        
        this.inicializaFormularioIndicador(objeto);
        this.formIndicador.get('indicadorRelevante')?.disable();
    }

    private inicializaFormularioModelo(objeto : MacModeloCalificacion = null) : void {

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
    private inicializaFormularioGrupo(objeto : MacGrupoModeloCalificacion = null) : void {

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
                pesoGrupo : [null, Validators.required],
                pesoTotalGrupo : [this.sumatoriaPesoGrupo],
                estadoGrupo : [false]
            });
            this.objSeleccionadoGrupo = undefined;
            this.iniciarBotonesGrupo(true);
        }
    }
    private inicializaFormularioIndicador(objeto : MacIndicadorGrupoModeloCalificacion = null) : void {

        if (objeto) {

            this.formIndicador = this.formBuilder.group({
                indicadorRelevante : [this.listIndicadoresRelevantes.find(v => v.codIndicador === objeto.idIndicador), Validators.required],
                pesoIndicador : [objeto.peso, Validators.required],
                pesoTotalIndicador : [this.sumatoriaPesoIndicador],
                estadoIndicador : [objeto.estado]
            });
            this.objSeleccionadoIndicador = objeto;
            this.iniciarBotonesIndicador(false);

            this.oIndicador = this.listIndicadoresRelevantes.find(v => v.codIndicador === objeto.idIndicador);
        } 
        else {

            this.formIndicador = this.formBuilder.group({
                indicadorRelevante : [null, Validators.required],
                pesoIndicador : [null, Validators.required],
                pesoTotalIndicador : [this.sumatoriaPesoIndicador],
                estadoIndicador : [false]
            });
            this.objSeleccionadoIndicador = undefined;
            this.iniciarBotonesIndicador(true);
        }
    }

    private createModeloForm(registra : boolean = false) : MacModeloCalificacion {

        const { descripcionModelo,
                estadoModelo
        } = this.formModelo.controls;

        var objeto = new MacModeloCalificacion();

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
    private createGrupoForm(registra : boolean = false) : MacGrupoModeloCalificacion {

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

        var objeto = new MacGrupoModeloCalificacion();

        objeto.descripcion = descripcionGrupo.value;
        objeto.peso = pesoGrupo.value;
        objeto.estado = estadoGrupo.value;

        if (registra) {

            objeto.idCompania = this.companiaObservable.id;
            objeto.idModulo = this.moduleObservable.id;

            objeto.idModeloCalificacion = this.objSeleccionadoModelo.id;

            objeto.adicionadoPor = this.userObservable.identificacion;
            objeto.fechaAdicion = this.today;

        } else {
            objeto.id = this.objSeleccionadoGrupo.id;

            objeto.modificadoPor = this.userObservable.identificacion; 
            objeto.fechaModificacion = this.today;
        }
        return objeto;
    }
    private createIndicadorForm(registra : boolean = false) : MacIndicadorGrupoModeloCalificacion {

        let totalPeso : number = 0;

        const { indicadorRelevante,
                pesoIndicador, 
                pesoTotalIndicador, 
                estadoIndicador
            } = this.formIndicador.controls;

        if (registra) {

            totalPeso = pesoIndicador.value + pesoTotalIndicador.value;

        } else {

            totalPeso = pesoIndicador.value;

            this.listIndicadoresModelos.forEach(element => {
                if (element.id != this.objSeleccionadoIndicador.id) totalPeso += element.peso;
            });
        }

        if (totalPeso > 100) return null;

        this.sumatoriaPesoIndicador = totalPeso;
        this.formIndicador.get('pesoTotalIndicador')?.setValue(this.sumatoriaPesoIndicador);

        var objeto = new MacIndicadorGrupoModeloCalificacion();

        objeto.idIndicador = indicadorRelevante.value.codIndicador;
        objeto.descripcion = indicadorRelevante.value.descripcion;
        objeto.peso = pesoIndicador.value;
        objeto.estado = estadoIndicador.value;

        if (registra) {

            objeto.idCompania = this.companiaObservable.id;
            objeto.idModulo = this.moduleObservable.id;

            objeto.idGrupoModeloCalificacion = this.objSeleccionadoGrupo.id;

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

        let objeto : MacModeloCalificacion = this.createModeloForm(true);

        this.macredService.postModeloCalificacion(objeto)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this.submitFormModelo = false;
                    this.listModelos.push(response.objetoDb);
                    this.inicializaFormularioModelo();

                    if (!this.habilitaListaModelo) this.habilitaListaModelo = true;
                    
                    this.alertService.success( 
                        `Modelo ${ response.objetoDb.descripcion } registrado.`
                    );
                } else { this.alertService.error('Problemas al registrar objeto.'); }
            }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
        });
    }
    postGrupo() : void {

        this.alertService.clear();
        this.submitFormGrupo = true;

        if ( this.formGrupo.invalid ) return;

        let objeto : MacGrupoModeloCalificacion = this.createGrupoForm(true);

        if (objeto) {
            this.macredService.postGrupoModeloCalificacion(objeto)
                .pipe(first())
                .subscribe(response => {

                    if (response.exito) {

                        this.submitFormGrupo = false;
                        this.listGrupos.push(response.objetoDb);
                        this.inicializaFormularioGrupo();

                        this.habilitaListaGrupo = true;
                        
                        this.alertService.success( `Grupo guardado correctamente.` );

                    } else { this.alertService.error(response.responseMesagge); }
                }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
            });

        } else { this.alertService.error( 'La sumatoria de los pesos no puede superar los 100.' ); }
    }
    postIndicador() : void {

        this.alertService.clear();
        this.submitFormIndicador = true;

        if ( this.formIndicador.invalid ) return;

        let objeto : MacIndicadorGrupoModeloCalificacion = this.createIndicadorForm(true);

        if (objeto) {

            if (!this.listIndicadoresModelos.find(x => x.idIndicador === objeto.idIndicador)) {

                this.macredService.postIndicadoresGrupoModCalif(objeto)
                    .pipe(first())
                    .subscribe(response => {

                        if (response.exito) {

                            this.submitFormIndicador = false;
                            this.listIndicadoresModelos.push(response.objetoDb);
                            this.inicializaFormularioIndicador();

                            this.habilitaListaIndicador = true;
                            
                            this.alertService.success( response.responseMesagge );

                        } else { this.alertService.error(response.responseMesagge); }

                    }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
                });
                
            } else { this.alertService.error( 'El Indicador ya se encuentra registrado.' ); }
        } else { this.alertService.error( 'La sumatoria de los pesos no puede superar los 100.' ); }
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

                this.macredService.deleteModeloCalificacion(this.objSeleccionadoModelo.id)
                    .pipe(first())
                    .subscribe(response => {

                        if (response) {

                            this.submitFormModelo = false;
                            this.listModelos.splice(this.listModelos.findIndex( m => m.id == this.objSeleccionadoModelo.id ), 1);
                            this.inicializaFormularioModelo();

                            if (this.listModelos.length === 0) {
                                this.habilitaListaModelo = false;
                                this.habilitaFormularioGrupo = false;
                            }

                            this.alertService.success( `Modelo eliminado correctamente.` );

                        } else { this.alertService.error('Problemas al eliminar objeto.'); }
                    }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error);
                });
            } else { return; }
        });
    }
    deleteGrupo() {

        let totalPeso : number = 0;

        this.alertService.clear();

        if (this.listIndicadoresModelos && this.listIndicadoresModelos.length > 0) {
            this.alertService.error('Debe eliminar los indicadores asociados al grupo.');
            return;
        }

        this.dialogo.open(DialogoConfirmacionComponent, { 
            data: 'Seguro que desea eliminar el grupo ' + this.objSeleccionadoGrupo.descripcion + '?' 
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.macredService.deleteGrupoModeloCalificacion(this.objSeleccionadoGrupo.id)
                    .pipe(first())
                    .subscribe(response => {

                        if (response) {

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

                            this.alertService.success( `Crédito eliminado correctamente!` );

                        } else { this.alertService.error(response.responseMesagge); }
                    }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error);
                });
            } else { return; }
        });
    }
    deleteIndicador() {

        let totalPeso : number = 0;

        this.alertService.clear();

        this.dialogo.open(DialogoConfirmacionComponent, { 
            data: 'Seguro que desea eliminar el indicador ' + this.objSeleccionadoIndicador.descripcion + '?' 
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                this.macredService.deleteIndicadoresGrupoModCalif(this.objSeleccionadoIndicador.id)
                    .pipe(first())
                    .subscribe(response => {

                        if (response) {

                            this.submitFormIndicador = false;
                            this.listIndicadoresModelos.splice(this.listIndicadoresModelos.findIndex( m => m.id == this.objSeleccionadoIndicador.id ), 1);
                            this.inicializaFormularioIndicador();

                            if (this.listIndicadoresModelos.length === 0) this.habilitaListaIndicador = false;

                            this.listIndicadoresModelos.forEach(element => {
                                totalPeso += element.peso;
                            });

                            this.sumatoriaPesoIndicador = totalPeso;
                            this.formIndicador.get('pesoTotalIndicador')?.setValue(this.sumatoriaPesoIndicador);

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

        let obj : MacModeloCalificacion = this.createModeloForm(false);

        this.macredService.putModeloCalificacion(obj)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this.submitFormModelo = false;
                    this.listModelos.splice(this.listModelos.findIndex( m => m.id == response.objetoDb.id ), 1);
                    this.listModelos.push(response.objetoDb);
                    
                    this.inicializaFormularioModelo();
                    this.inicializaFormularioGrupo();

                    this.habilitaFormularioGrupo = false;

                    this.alertService.success(
                        `Modelo ${response.objetoDb.descripcion} actualizado correctamente.`
                    );

                } else { this.alertService.error('Problemas al actualizar objeto.'); }
            
            }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
        });
    }
    putGrupo() : void {

        this.alertService.clear();
        this.submitFormGrupo = true;

        if ( this.formGrupo.invalid ) return;

        let objeto : MacGrupoModeloCalificacion = this.createGrupoForm(false);

        if (objeto) {

            this.macredService.putGrupoModeloCalificacion(objeto)
                .pipe(first())
                .subscribe(response => {

                    if (response) {

                        this.submitFormGrupo = false;
                        this.listGrupos.splice(this.listGrupos.findIndex( m => m.id == response.objetoDb.id ), 1);
                        this.listGrupos.push(response.objetoDb);
                        this.inicializaFormularioGrupo();

                        this.habilitaFormularioIndicador = false;

                        this.alertService.success(
                            `Grupo ${response.objetoDb.id} actualizado correctamente.`
                        );

                    } else { this.alertService.error(response.responseMesagge); }
                }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
            });

        } else { this.alertService.error( 'La sumatoria de los pesos no puede superar los 100.' ); }
    }
    putIndicador() : void {

        this.alertService.clear();
        this.submitFormIndicador = true;

        if ( this.formIndicador.invalid ) return;

        let objeto : MacIndicadorGrupoModeloCalificacion = this.createIndicadorForm(false);

        if (objeto) {

            this.macredService.putIndicadoresGrupoModCalif(objeto)
                .pipe(first())
                .subscribe(response => {

                    if (response) {

                        this.submitFormIndicador = false;
                        this.listIndicadoresModelos.splice(
                            this.listIndicadoresModelos.findIndex( m => m.id == response.objetoDb.id ), 1
                        );
                        this.listIndicadoresModelos.push(response.objetoDb);
                        this.inicializaFormularioIndicador();

                        this.alertService.success( response.responseMesagge );

                    } else { this.alertService.error(response.responseMesagge); }
                }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
            });

        } else { this.alertService.error( 'La sumatoria de los pesos no puede superar los 100.' ); }
    }
    
    private getModelos() : void {
        this.macredService.getModelosCalificacion()
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0) {
                    this.habilitaListaModelo = true;
                    this.listModelos = response;
                }
            }, error => { this.alertService.error(error); });
    }
    private getGruposModelosCalificacion(pidModelo : number) : void {

        this.macredService.getGruposModelosCalificacion(pidModelo)
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0) {
                    this.habilitaListaGrupo = true;
                    this.listGrupos = response;

                    this.listGrupos.forEach(element => { this.sumatoriaPesoGrupo += element.peso; });

                    this.formGrupo.get('pesoTotalGrupo')?.setValue(this.sumatoriaPesoGrupo);

                } else { this.listGrupos = []; this.habilitaListaGrupo = false; }
                
            }, error => { this.alertService.error(error); });
    }
    private getIndicadoresGruposCalif(pidGrupo : number) : void {

        this.macredService.getIndicadoresGrupoModCalif(pidGrupo)
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0) {
                    this.habilitaListaIndicador = true;
                    this.listIndicadoresModelos = response;

                    this.listIndicadoresModelos.forEach(element => { this.sumatoriaPesoIndicador += element.peso; });

                    this.formIndicador.get('pesoTotalIndicador')?.setValue(this.sumatoriaPesoIndicador);

                } else { this.listIndicadoresModelos = []; this.habilitaListaIndicador = false; }
                
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
