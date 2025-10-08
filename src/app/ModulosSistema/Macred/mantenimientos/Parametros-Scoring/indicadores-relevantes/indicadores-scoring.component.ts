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
import { MacIndicadorScoring } from '@app/_models/Macred/IndicadorScoring';
import { MacNivelesXIndicadorScoring } from '@app/_models/Macred/NivelXIndicadorScoring';
import { MacNivelRiesgo } from '@app/_models/Macred/NivelRiesgo';

declare var $: any;

@Component({selector: 'app-indicadores-scoring-macred',
            templateUrl: './indicadores-scoring.html',
            styleUrls: ['../../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class IndicadoresScoringComponent extends OnSeguridad implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'indicadores-scoring.html';

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private companiaObservable  : Compania;
    private moduleObservable    : Module;

    // ## -- formularios -- ## //
    formIndicadorScoring : UntypedFormGroup;
    formNivel : UntypedFormGroup;

    // ## -- submit formularios -- ## //
    submitFormIndicador : boolean = false;
    submitFormNiveles : boolean = false;

    // ## -- habilita botones -- ## //
    habilitaBtnRegistro     : boolean = true;
    habilitaBtnActualiza    : boolean = false;
    habilitaBtnNuevo        : boolean = false;
    habilitaBtnEliminar     : boolean = false;

    habilitaBtnRegistroNivel     : boolean = true;
    habilitaBtnActualizaNivel    : boolean = false;
    habilitaBtnNuevoNivel        : boolean = false;
    habilitaBtnEliminarNivel     : boolean = false;

    // ## -- habilita grids -- ## //
    habilitaListaIndicadores : boolean = false;
    habilitaListaNiveles : boolean = false;
    habilitaFormularioNiveles : boolean = false;

    public moduleScreen : ModuleScreen = new ModuleScreen;

    URLIndexModulePage: string;

    // ## -- listas -- ## //
    listIndicadores: MacIndicadorScoring[] = [];
    listNiveles: MacNivelRiesgo[] = [];
    listNivelesIndicadorScoring: MacNivelRiesgo[] = [];

    objSeleccionadoIndicador: MacIndicadorScoring = undefined;
    objSeleccionadoNivel: MacNivelRiesgo = undefined;

    public today : Date = new Date();

    oNivelIndicador : MacNivelRiesgo = undefined;

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

        this.inicializaFormularioIndScoring();
        this.inicializaFormularioNivelRiesgo();
    }
    
    get f () { return this.formIndicadorScoring.controls; }
    get i () { return this.formNivel.controls; }

    ngOnInit() {

        this.accountService.validateAccessUser( this.userObservable.id,
                                                this.moduleObservable.id,
                                                this.nombrePantalla,
                                                this.companiaObservable.id )
            .pipe(first())
            .subscribe(response => {

                // ## -->> redirecciona NO ACCESO
                if(!response.exito) this.router.navigate([this.URLIndexModulePage]);

                this.getIndicadoresScoring();
                this.getNivelesRiesgo();
        });
    }

    redirectIndexModule() : void { this.router.navigate([this.URLIndexModulePage]); }

    onChangeEvent() {

        this.oNivelIndicador = this.formNivel.get('descripcionNivel')?.value;
        this.objSeleccionadoNivel = this.oNivelIndicador;

        let nivel : MacNivelRiesgo = this.listNiveles.find(e => e.id == this.objSeleccionadoNivel.id);

        this.formNivel.get('rangoInicial')?.setValue(nivel.rangoInicial);;
        this.formNivel.get('rangoFinal')?.setValue(nivel.rangoFinal);;
    }

    consultaRangosNiveles() : void {
        this.getNivelesRiesgo();
        this.inicializaFormularioNivelRiesgo();
    }

    nuevoIndicadorScoring() : void { 

        this.submitFormIndicador = false;
        this.inicializaFormularioIndScoring();

        this.habilitaFormularioNiveles = false;
    }
    nuevoNivelXIndicador() : void { 

        this.submitFormNiveles = false;
        this.inicializaFormularioNivelRiesgo();
    }

    selectIndicadorRelevante(objeto : MacIndicadorScoring = null) : void {

        this.habilitaFormularioNiveles = true;

        this.inicializaFormularioIndScoring(objeto);
        this.inicializaFormularioNivelRiesgo();

        // consultar niveles por indicador
        this.getNivelesPorIndicadorScoring(objeto.id);
    }
    selectNivel(objeto : MacNivelRiesgo = null) : void {

        this.inicializaFormularioNivelRiesgo(objeto);
        this.formNivel.get('descripcionNivel')?.disable();
    }

    private getNivelesPorIndicadorScoring(pidIndicador : number) {

        let listNivelesTemp : MacNivelRiesgo[] = null;

        this.macredService.getNivelesXIndicadorScoring(pidIndicador)
            .pipe(first())
            .subscribe((response) => {

                if (response && response.length > 0) {

                    listNivelesTemp = [];
                    this.habilitaListaNiveles = true;

                    response.forEach(element => {

                        let nivel : MacNivelRiesgo = this.listNiveles.find(e => e.id == element.idNivel);

                        nivel.rangoInicial = element.rangoInicial;
                        nivel.rangoFinal = element.rangoFinal;

                        listNivelesTemp.push(nivel);
                    });
                    this.listNivelesIndicadorScoring = listNivelesTemp;

                } else {
                    this.habilitaListaNiveles = false;
                    this.listNivelesIndicadorScoring = [];
                }
            });
    }

    private inicializaFormularioIndScoring(objeto : MacIndicadorScoring = null) : void {

        if (objeto) {

            this.formIndicadorScoring = this.formBuilder.group({
                descripcionIndScoring : [objeto.descripcion, Validators.required],
                estadoIndScoring : [objeto.estado]
            });
            this.objSeleccionadoIndicador = objeto;
            this.iniciarBotonesModelo(false);
        } 
        else {

            this.formIndicadorScoring = this.formBuilder.group({
                descripcionIndScoring : ['', Validators.required],
                estadoIndScoring : [false]
            });
            this.objSeleccionadoIndicador = undefined;
            this.iniciarBotonesModelo(true);
        }
    }
    private inicializaFormularioNivelRiesgo(objeto : MacNivelRiesgo = null) : void {

        if (objeto) {

            this.formNivel = this.formBuilder.group({
                descripcionNivel : [this.listNiveles.find(v => v.id === objeto.id), Validators.required],
                rangoInicial : [objeto.rangoInicial, Validators.required],
                rangoFinal : [objeto.rangoFinal, Validators.required]
            });
            this.objSeleccionadoNivel = objeto;
            this.iniciarBotonesNivel(false);
        } 
        else {

            this.formNivel = this.formBuilder.group({
                descripcionNivel : [null, Validators.required],
                rangoInicial : [null, Validators.required],
                rangoFinal : [null, Validators.required]
            });
            this.objSeleccionadoNivel = undefined;
            this.iniciarBotonesNivel(true);
        }
    }

    private createIndScoringForm(registra : boolean = false) : MacIndicadorScoring {

        const { descripcionIndScoring,
                estadoIndScoring
            } = this.formIndicadorScoring.controls;

        var objeto = new MacIndicadorScoring();

        objeto.idCompania = this.companiaObservable.id;
        objeto.idModulo = this.moduleObservable.id;

        objeto.descripcion = descripcionIndScoring.value;
        objeto.estado = estadoIndScoring.value;

        if (registra) {

            objeto.adicionadoPor = this.userObservable.identificacion;
            objeto.fechaAdicion = this.today;

        } else {
            objeto.id = this.objSeleccionadoIndicador.id;
            objeto.modificadoPor = this.userObservable.identificacion;
            objeto.fechaModificacion = this.today;
        }
        return objeto;
    }
    private createNivelesForm(registra : boolean = false) : MacNivelesXIndicadorScoring {

        this.submitFormNiveles = false;

        const { rangoInicial, 
                rangoFinal,
            } = this.formNivel.controls;

        var objeto = new MacNivelesXIndicadorScoring();

        objeto.idIndicador = this.objSeleccionadoIndicador.id;
        objeto.idNivel = this.objSeleccionadoNivel.id;

        objeto.rangoInicial = rangoInicial.value;
        objeto.rangoFinal = rangoFinal.value;

        if (registra) {

            objeto.adicionadoPor = this.userObservable.identificacion;
            objeto.fechaAdicion = this.today;

        } else {

            objeto.modificadoPor = this.userObservable.identificacion; 
            objeto.fechaModificacion = this.today;
        }
        return objeto;
    }

    postIndicadorScoring() : void {

        this.alertService.clear();
        this.submitFormIndicador = true;

        if ( this.formIndicadorScoring.invalid ) return;

        let objeto : MacIndicadorScoring = this.createIndScoringForm(true);

        this.macredService.postIndicadorScoring(objeto)
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {

                    this.submitFormIndicador = false;

                    this.listIndicadores.push(response.objetoDb);

                    this.selectIndicadorRelevante(response.objetoDb);

                    if (!this.habilitaListaIndicadores) this.habilitaListaIndicadores = true;
                    
                    this.alertService.success( response.responseMesagge );

                } else { this.alertService.error(response.responseMesagge); }
            }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
        });
    }
    postNivelXIndicador() : void {

        this.alertService.clear();
        this.submitFormNiveles = true;

        let registrar : boolean = true;

        if ( this.formNivel.invalid ) return;

        let objeto : MacNivelesXIndicadorScoring = this.createNivelesForm(true);

        if (objeto.rangoInicial <= objeto.rangoFinal) {

            if (this.listNivelesIndicadorScoring.find(e => e.id == this.objSeleccionadoNivel.id)) registrar = false;

            if (registrar) {

                this.macredService.postNivelXIndicadorScoring(objeto)
                    .pipe(first())
                    .subscribe(response => {

                        if (response.exito) {

                            this.submitFormNiveles = false;

                            let objPost : MacNivelRiesgo = 
                                this.listNiveles.find(e => e.id == response.objetoDb.idNivel);
                                
                            objPost.rangoInicial = response.objetoDb.rangoInicial;
                            objPost.rangoFinal = response.objetoDb.rangoFinal;

                            this.listNivelesIndicadorScoring.push(objPost);

                            this.inicializaFormularioNivelRiesgo();

                            if (!this.habilitaListaNiveles) this.habilitaListaNiveles = true;
                            
                            this.alertService.success( response.responseMesagge );

                        } else { this.alertService.error(response.responseMesagge); }
                    }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
                });

            } else { this.alertService.error('El nivel ya se encuentra registrado.'); }
        } else { this.alertService.error('El rango Inicial no puede ser menor al rango Final.'); } 
    }

    deleteIndicadorScoring() {

        this.alertService.clear();

        if (this.listNivelesIndicadorScoring && this.listNivelesIndicadorScoring.length > 0) {
            this.alertService.error('Deben eliminar los niveles de riesgo asociados al indicador.');
            return;
        }

        let existeIndicadorGrupo : boolean = false;
        let idIndicador : number = this.objSeleccionadoIndicador.id;
        
        this.dialogo.open(DialogoConfirmacionComponent, { 
            data: 'Seguro que desea eliminar : ' + this.objSeleccionadoIndicador.descripcion + ' ?' 
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                // this.macredService.getIndicadoresGrupoModCalifXIndicador(idIndRelevante)
                //     .pipe(first())
                //     .subscribe(response => {

                //         if (response && response.length > 0) existeIndicadorGrupo = true;

                        if (!existeIndicadorGrupo) {

                            this.macredService.deleteIndicadorScoring(idIndicador)
                                .pipe(first())
                                .subscribe(response => {

                                    if (response.exito) {

                                        this.submitFormIndicador = false;

                                        this.listIndicadores.splice(
                                            this.listIndicadores.findIndex( m => m.id == idIndicador ), 1
                                        );
                                        this.inicializaFormularioIndScoring();

                                        if (this.listIndicadores.length === 0) this.habilitaListaIndicadores = false;

                                        this.habilitaFormularioNiveles = false;

                                        this.alertService.success( response.responseMesagge );

                                    } else { this.alertService.error(response.responseMesagge); }
                                }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error);
                            });
                            
                        } else {
                             
                            this.alertService.error(
                                'El indicador : ' + 
                                this.objSeleccionadoIndicador.descripcion + 
                                ' está asociado a uno o más Grupos en: Modelos de Calificación, Configuración de Modelos.' +
                                ' Debe eliminar el Indicador en los Indicadores por Grupos de Modelos de Calificación.'
                            );
                        }
                    // }, error => { this.alertService.error(error); });
            } else { return; }
        });
    }
    deleteNivelXIndicador() {

        this.alertService.clear();

        this.dialogo.open(DialogoConfirmacionComponent, { 
            data: 'Seguro que desea eliminar el nivel ' + this.objSeleccionadoNivel.descripcion + '?' 
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                let idIndicador : number = this.objSeleccionadoIndicador.id;
                let idNivel : number = this.objSeleccionadoNivel.id;
                
                this.macredService.deleteNivelXIndicadorScoring(idIndicador, idNivel)
                    .pipe(first())
                    .subscribe(response => {

                        if (response.exito) {

                            this.listNivelesIndicadorScoring.splice(
                                this.listNivelesIndicadorScoring.findIndex( m => m.id == idNivel ), 1
                            );
                            this.inicializaFormularioNivelRiesgo();

                            if (this.listNivelesIndicadorScoring.length === 0) this.habilitaListaNiveles = false;

                            this.alertService.success( response.responseMesagge );

                        } else { this.alertService.error(response.responseMesagge); }
                    }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error);
                });
            } else { return; }
        });
    }

    putIndicadorScoring() : void {

        this.alertService.clear();
        this.submitFormIndicador = true;

        if ( this.formIndicadorScoring.invalid ) return;

        let obj : MacIndicadorScoring = this.createIndScoringForm(false);

        this.macredService.putIndicadorScoring(obj)
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {

                    this.submitFormIndicador = false;
                    this.listIndicadores.splice(
                        this.listIndicadores.findIndex( m => m.id == response.objetoDb.id ), 1
                    );
                    this.listIndicadores.push(response.objetoDb);

                    this.selectIndicadorRelevante(response.objetoDb);

                    this.alertService.success( response.responseMesagge );

                } else { this.alertService.error(response.responseMesagge); }
            }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
        });
    }
    putNivelXIndicador() : void {

        this.alertService.clear();
        this.submitFormNiveles = true;

        if ( this.formNivel.invalid ) return;

        let objeto : MacNivelesXIndicadorScoring = this.createNivelesForm(false);

        if (objeto.rangoInicial <= objeto.rangoFinal) {

            this.macredService.putNivelXIndicadorScoring(objeto)
                .pipe(first())
                .subscribe(response => {

                    if (response.exito) {

                        this.submitFormNiveles = false;

                        let objPut : MacNivelRiesgo = 
                            this.listNiveles.find(e => e.id == response.objetoDb.idNivel);

                        objPut.rangoInicial = response.objetoDb.rangoInicial;
                        objPut.rangoFinal = response.objetoDb.rangoFinal;

                        this.listNivelesIndicadorScoring.splice(
                            this.listNivelesIndicadorScoring.findIndex( m => m.id == objPut.id ), 1
                        );
                        this.listNivelesIndicadorScoring.push(objPut);

                        this.inicializaFormularioNivelRiesgo();

                        this.alertService.success( response.responseMesagge );

                    } else { this.alertService.error(response.responseMesagge); }
                }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
            });
        } else { this.alertService.error('El rango Inicial no puede ser menor al rango final.'); } 
    }
    
    private getIndicadoresScoring() : void {
        this.macredService.getIndicadoresScoring()
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0) {
                    this.habilitaListaIndicadores = true;
                    this.listIndicadores = response;
                }
            }, error => { this.alertService.error(error); });
    }
    private getNivelesRiesgo() : void {

        this.macredService.getNivelesRiesgos(false)
            .pipe(first())
            .subscribe(response => {

                if (response && response.length > 0) this.listNiveles = response;

            }, error => { this.alertService.error(error); });
    }

    private iniciarBotonesModelo(esParaAgregar: boolean) {
        this.habilitaBtnNuevo = !esParaAgregar;
        this.habilitaBtnRegistro = esParaAgregar;
        this.habilitaBtnActualiza = !esParaAgregar;
        this.habilitaBtnEliminar = !esParaAgregar;
    }
    private iniciarBotonesNivel(esParaAgregar: boolean) {
        this.habilitaBtnNuevoNivel = !esParaAgregar;
        this.habilitaBtnRegistroNivel = esParaAgregar;
        this.habilitaBtnActualizaNivel = !esParaAgregar;
        this.habilitaBtnEliminarNivel = !esParaAgregar;
    }

    private buscarModuloId(moduleId : number) : void {
        this.accountService.getModuleId(moduleId)
            .pipe(first())
            .subscribe(response => { 
                if (response) this.moduleScreen = response ; });
    }
}
