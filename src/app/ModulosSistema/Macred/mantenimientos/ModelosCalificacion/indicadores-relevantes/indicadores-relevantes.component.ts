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
import { MacIndicadoresRelevantes, MacNivelCapacidadPago, MacNivelesXIndicador } from '@app/_models/Macred';

declare var $: any;

@Component({selector: 'app-indicadores-relevantes-macred',
            templateUrl: './indicadores-relevantes.component.html',
            styleUrls: ['../../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class IndicadoresRelevantesComponent extends OnSeguridad implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'indicadores-relevantes.html';

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private companiaObservable  : Compania;
    private moduleObservable    : Module;

    // ## -- formularios -- ## //
    formIndicadorRelevante : UntypedFormGroup;
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
    listIndicadores: MacIndicadoresRelevantes[] = [];
    listNiveles: MacNivelCapacidadPago[] = [];
    listNivelesIndicador: MacNivelCapacidadPago[] = [];

    objSeleccionadoIndicador: MacIndicadoresRelevantes = undefined;
    objSeleccionadoNivel: MacNivelCapacidadPago = undefined;

    public today : Date = new Date();

    oNivelIndicador : MacNivelCapacidadPago = undefined;

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

        this.inicializaFormularioIndRelevante();
        this.inicializaFormularioNivelRiesgo();
    }
    
    get f () { return this.formIndicadorRelevante.controls; }
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

                this.getIndicadoresRelevantes();
                this.getNivelesCapacidadPago();
        });
    }

    redirectIndexModule() : void { this.router.navigate([this.URLIndexModulePage]); }

    onChangeEvent() {

        this.oNivelIndicador = this.formNivel.get('descripcionNivel')?.value;
        this.objSeleccionadoNivel = this.oNivelIndicador;

        let nivel : MacNivelCapacidadPago = this.listNiveles.find(e => e.id == this.objSeleccionadoNivel.id);

        this.formNivel.get('rangoInicial')?.setValue(nivel.rangoInicial);;
        this.formNivel.get('rangoFinal')?.setValue(nivel.rangoFinal);;
    }

    consultaRangosNiveles() : void {
        this.getNivelesCapacidadPago();
        this.inicializaFormularioNivelRiesgo();
    }

    nuevoIndicadorRelevante() : void { 

        this.submitFormIndicador = false;
        this.inicializaFormularioIndRelevante();

        this.habilitaFormularioNiveles = false;
    }
    nuevoNivelXIndicador() : void { 

        this.submitFormNiveles = false;
        this.inicializaFormularioNivelRiesgo();
    }

    selectIndicadorRelevante(objeto : MacIndicadoresRelevantes = null) : void {

        this.habilitaFormularioNiveles = true;

        this.inicializaFormularioIndRelevante(objeto);
        this.inicializaFormularioNivelRiesgo();

        // consultar niveles por indicador
        this.getNivelesPorIndicador(objeto.codIndicador);
    }
    selectNivel(objeto : MacNivelCapacidadPago = null) : void {

        this.inicializaFormularioNivelRiesgo(objeto);
        this.formNivel.get('descripcionNivel')?.disable();
    }

    private getNivelesPorIndicador(pidIndicador : number) {

        let listNivelesTemp : MacNivelCapacidadPago[] = null;

        this.macredService.getNivelesXIndicador(pidIndicador)
            .pipe(first())
            .subscribe((response) => {

                if (response && response.length > 0) {

                    listNivelesTemp = [];
                    this.habilitaListaNiveles = true;

                    response.forEach(element => {

                        let nivel : MacNivelCapacidadPago = this.listNiveles.find(e => e.id == element.codNivel);

                        nivel.id
                        nivel.rangoInicial = element.rangoInicial;
                        nivel.rangoFinal = element.rangoFinal;

                        listNivelesTemp.push(nivel);
                    });
                    this.listNivelesIndicador = listNivelesTemp;

                } else {
                    this.habilitaListaNiveles = false;
                    this.listNivelesIndicador = [];
                }
            });
    }

    private inicializaFormularioIndRelevante(objeto : MacIndicadoresRelevantes = null) : void {

        if (objeto) {

            this.formIndicadorRelevante = this.formBuilder.group({
                descripcionIndRelevante : [objeto.descripcion, Validators.required],
                estadoIndRelevante : [objeto.estado]
            });
            this.objSeleccionadoIndicador = objeto;
            this.iniciarBotonesModelo(false);
        } 
        else {

            this.formIndicadorRelevante = this.formBuilder.group({
                descripcionIndRelevante : ['', Validators.required],
                estadoIndRelevante : [false]
            });
            this.objSeleccionadoIndicador = undefined;
            this.iniciarBotonesModelo(true);
        }
    }
    private inicializaFormularioNivelRiesgo(objeto : MacNivelCapacidadPago = null) : void {

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

    private createIndRelevanteForm(registra : boolean = false) : MacIndicadoresRelevantes {

        const { descripcionIndRelevante,
                estadoIndRelevante
             } = this.formIndicadorRelevante.controls;

        var objeto = new MacIndicadoresRelevantes();

        objeto.descripcion = descripcionIndRelevante.value;
        objeto.estado = estadoIndRelevante.value;

        if (registra) {

            objeto.codigoCompania = this.companiaObservable.id;
            objeto.usuarioCreacion = this.userObservable.identificacion;
            objeto.fechaCreacion = this.today;

        } else {
            objeto.codIndicador = this.objSeleccionadoIndicador.codIndicador;
            objeto.usuarioModificacion = this.userObservable.identificacion;
            objeto.fechaModificacion = this.today;
        }
        return objeto;
    }
    private createNivelesForm(registra : boolean = false) : MacNivelesXIndicador {

        this.submitFormNiveles = false;

        const { rangoInicial, 
                rangoFinal,
            } = this.formNivel.controls;

        var objeto = new MacNivelesXIndicador();

        objeto.codigoCompania = this.companiaObservable.id;
        objeto.codIndicador = this.objSeleccionadoIndicador.codIndicador;
        objeto.codNivel = this.objSeleccionadoNivel.id;

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

    postIndicadorRelevante() : void {

        this.alertService.clear();
        this.submitFormIndicador = true;

        if ( this.formIndicadorRelevante.invalid ) return;

        let objeto : MacIndicadoresRelevantes = this.createIndRelevanteForm(true);

        this.macredService.postIndicadorRelevante(objeto)
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {

                    this.submitFormIndicador = false;

                    this.listIndicadores.push(response.objetoDb);
                    // this.inicializaFormularioIndRelevante();

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

        let objeto : MacNivelesXIndicador = this.createNivelesForm(true);

        if (objeto.rangoInicial <= objeto.rangoFinal) {

            if (this.listNivelesIndicador.find(e => e.id == this.oNivelIndicador.id)) registrar = false;

            if (registrar) {

                this.macredService.postNivelXIndicador(objeto)
                    .pipe(first())
                    .subscribe(response => {

                        if (response.exito) {

                            this.submitFormNiveles = false;

                            let objPost : MacNivelCapacidadPago = 
                                this.listNiveles.find(e => e.id == response.objetoDb.codNivel);
                                
                            objPost.rangoInicial = response.objetoDb.rangoInicial;
                            objPost.rangoFinal = response.objetoDb.rangoFinal;

                            this.listNivelesIndicador.push(objPost);

                            this.inicializaFormularioNivelRiesgo();

                            if (!this.habilitaListaNiveles) this.habilitaListaNiveles = true;
                            
                            this.alertService.success( response.responseMesagge );

                        } else { this.alertService.error(response.responseMesagge); }
                    }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
                });

            } else { this.alertService.error('El nivel ya se encuentra registrado.'); }
        } else { this.alertService.error('El rango Inicial no puede ser menor al rango Final.'); } 
    }

    deleteIndicadorRelevante() {

        this.alertService.clear();

        if (this.listNivelesIndicador && this.listNivelesIndicador.length > 0) {
            this.alertService.error('Deben eliminar los niveles de riesgo asociados al indicador.');
            return;
        }

        this.dialogo.open(DialogoConfirmacionComponent, { 
            data: 'Seguro que desea eliminar : ' + this.objSeleccionadoIndicador.descripcion + ' ?' 
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {

            if (confirmado) {

                let idIndRelevante : number = this.objSeleccionadoIndicador.codIndicador;

                this.macredService.deleteIndicadorRelevante(idIndRelevante)
                    .pipe(first())
                    .subscribe(response => {

                        if (response.exito) {

                            this.submitFormIndicador = false;

                            this.listIndicadores.splice(
                                this.listIndicadores.findIndex( m => m.codIndicador == idIndRelevante ), 1
                            );
                            this.inicializaFormularioIndRelevante();

                            if (this.listIndicadores.length === 0) this.habilitaListaIndicadores = false;

                            this.habilitaFormularioNiveles = false;

                            this.alertService.success( response.responseMesagge );

                        } else { this.alertService.error(response.responseMesagge); }
                    }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error);
                });
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

                let idIndicador : number = this.objSeleccionadoIndicador.codIndicador;
                let idNivel : number = this.objSeleccionadoNivel.id;
                
                this.macredService.deleteNivelXIndicador(idIndicador, idNivel)
                    .pipe(first())
                    .subscribe(response => {

                        if (response.exito) {

                            this.listNivelesIndicador.splice(
                                this.listNivelesIndicador.findIndex( m => m.id == idNivel ), 1
                            );
                            this.inicializaFormularioNivelRiesgo();

                            if (this.listNivelesIndicador.length === 0) this.habilitaListaNiveles = false;

                            this.alertService.success( response.responseMesagge );

                        } else { this.alertService.error(response.responseMesagge); }
                    }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error);
                });
            } else { return; }
        });
    }

    putIndicadorRelevante() : void {

        this.alertService.clear();
        this.submitFormIndicador = true;

        if ( this.formIndicadorRelevante.invalid ) return;

        let obj : MacIndicadoresRelevantes = this.createIndRelevanteForm(false);

        this.macredService.putIndicadorRelevante(obj)
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {

                    this.submitFormIndicador = false;
                    this.listIndicadores.splice(
                        this.listIndicadores.findIndex( m => m.codIndicador == response.objetoDb.codIndicador ), 1
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

        let objeto : MacNivelesXIndicador = this.createNivelesForm(false);

        if (objeto.rangoInicial <= objeto.rangoFinal) {

            this.macredService.putNivelXIndicador(objeto)
                .pipe(first())
                .subscribe(response => {

                    if (response.exito) {

                        this.submitFormNiveles = false;

                        let objPut : MacNivelCapacidadPago = 
                            this.listNiveles.find(e => e.id == response.objetoDb.codNivel);

                        objPut.rangoInicial = response.objetoDb.rangoInicial;
                        objPut.rangoFinal = response.objetoDb.rangoFinal;

                        this.listNivelesIndicador.splice(
                            this.listNivelesIndicador.findIndex( m => m.id == objPut.id ), 1
                        );
                        this.listNivelesIndicador.push(objPut);

                        this.inicializaFormularioNivelRiesgo();

                        this.alertService.success( response.responseMesagge );

                    } else { this.alertService.error(response.responseMesagge); }
                }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
            });
        } else { this.alertService.error('El rango Inicial no puede ser menor al rango final.'); } 
    }
    
    private getIndicadoresRelevantes() : void {
        this.macredService.getIndicadoresRelevantes()
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0) {
                    this.habilitaListaIndicadores = true;
                    this.listIndicadores = response;
                }
            }, error => { this.alertService.error(error); });
    }
    private getNivelesCapacidadPago() : void {

        this.macredService.getNivelesCapacidadPago(false)
            .pipe(first())
            .subscribe(response => {

                if (response && response.length > 0) {

                    this.listNiveles = response;

                } else { this.listNiveles = []; }

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
