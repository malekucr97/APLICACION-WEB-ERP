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
import { MacEstadoCivil, MacInformacionCreditoPersona, MacPersona } from '@app/_models/Macred';
import { MacredService } from '@app/_services/macred.service';
import { MacTipoPersona } from '@app/_models/Macred/TipoPersona';
import { MacTipoGenero } from '@app/_models/Macred/TipoGenero';
import { MacCondicionLaboral } from '@app/_models/Macred/CondicionLaboral';
import { MacTipoHabitacion } from '@app/_models/Macred/TipoHabitacion';
import { MacCategoriaCredito } from '@app/_models/Macred/CategoriaCredito';
import { MacTipoAsociado } from '@app/_models/Macred/TipoAsociado';

declare var $: any;

@Component({selector: 'app-personas-analisis-macred',
            templateUrl: './personas-analisis.html',
            styleUrls: ['../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class PersonaAnalisisComponent extends OnSeguridad implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;

    private nombrePantalla  : string = 'personas-analisis.html';

    // ## -- objetos suscritos -- ## //
    private userObservable      : User;
    private companiaObservable  : Compania;
    moduleObservable: Module;

    // ## -- formularios -- ## //
    formPersona : UntypedFormGroup;
    formCredito : UntypedFormGroup;

    // ## -- submit formularios -- ## //
    submittedPantallasModuloForm : boolean = false;
    submitFormPersona : boolean = false;
    submitFormCredito : boolean = false;

    // ## -- habilita botones -- ## //
    habilitaBtnRegistro     : boolean = true;
    habilitaBtnActualiza    : boolean = false;
    habilitaBtnNuevo        : boolean = false;
    habilitaBtnEliminar     : boolean = false;

    habilitaBtnRegistroCredito     : boolean = true;
    habilitaBtnActualizaCredito    : boolean = false;
    habilitaBtnNuevoCredito        : boolean = false;
    habilitaBtnEliminarCredito     : boolean = false;

    // ## -- habilita grids -- ## //
    habilitaFormularioCredito : boolean = false;
    habilitaListasPersonas : boolean = false;
    habilitaListaCredito : boolean = false;

    public moduleScreen : ModuleScreen = new ModuleScreen;
    public moduleItemList : Module;

    URLIndexModulePage: string;

    // ## -- listas -- ## //
    listPersonas: MacPersona[] = [];
    listInfoCreditoPersonas: MacInformacionCreditoPersona[] = [];

    listEstadosCiviles: MacEstadoCivil[];
    listTiposPersonas: MacTipoPersona[];
    listTiposGeneros: MacTipoGenero[];
    listCondicionesLaborales: MacCondicionLaboral[];
    listTiposHabitaciones: MacTipoHabitacion[];
    listCategoriasCreditos: MacCategoriaCredito[];
    listTiposAsociados: MacTipoAsociado[];

    public today : Date = new Date();
    edad: number | null = null;

    objSeleccionado: MacPersona = undefined;
    objSeleccionadoCredito: MacInformacionCreditoPersona = undefined;

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

        this.inicializaFormularioPersona();
        this.inicializaFormularioCredito();
    }
    
    get f () { return this.formPersona.controls; }
    get c () { return this.formCredito.controls; }

    ngOnInit() { 

        this.accountService.validateAccessUser( this.userObservable.id,
                                                this.moduleObservable.id,
                                                this.nombrePantalla,
                                                this.companiaObservable.id )
            .pipe(first())
            .subscribe(response => {

                // ## -->> redirecciona NO ACCESO
                if(!response.exito) this.router.navigate([this.URLIndexModulePage]);

                this.getEstadosCiviles();
                this.getTiposPersonas();
                this.getTiposGeneros();
                this.getCondicionesLaborales();
                this.getTiposHabitaciones();

                this.getCategoriasCreditos();
                this.getTiposAsociados();

                this.getPersonas();
        });
    }

    public redirectIndexModule() : void { this.router.navigate([this.URLIndexModulePage]); }

    nuevo() : void { 

        this.submitFormPersona = false;
        this.inicializaFormularioPersona();

        this.habilitaFormularioCredito = false;
    }
    nuevoCredito() : void { 

        this.submitFormCredito = false;
        this.inicializaFormularioCredito();
    }

    selectPersona(objeto : MacPersona = null) : void {

        this.habilitaFormularioCredito = true;

        this.inicializaFormularioPersona(objeto);
        this.inicializaFormularioCredito();

        // consultar creditos de persona
        this.getInfoCreditoPersonas(objeto.id);
    }
    selectCredito(objeto : MacInformacionCreditoPersona = null) : void {
        
        this.inicializaFormularioCredito(objeto);
    }

    private inicializaFormularioCredito(objeto : MacInformacionCreditoPersona = null) : void {

        if (objeto) {

            this.formCredito = this.formBuilder.group({
                categoriaCredito : [objeto.codigoCategoriaCredito, Validators.required],
                tipoAsociado : [objeto.codigoTipoAsociado, Validators.required],
                cantidadFianzas : [objeto.cantidadFianzas, Validators.required],
                tiempoAfiliacion : [objeto.tiempoAfiliacion],
                cantidadCreditosHistorico : [objeto.cantidadCreditosHistorico, Validators.required],
                totalSaldoFianzas : [objeto.totalSaldoFianzas, Validators.required],
                totalCuotasFianzas : [objeto.totalCuotasFianzas, Validators.required],
                cph : [objeto.cph, Validators.required],
                cphUltimos12Meses : [objeto.cphUltimos12Meses, Validators.required],
                cphUltimos24Meses : [objeto.cphUltimos24Meses, Validators.required],
                atrasoMaximo : [objeto.atrasoMaximo, Validators.required],
                atrasosUltimos12Meses : [objeto.atrasosUltimos12Meses, Validators.required],
                atrasosUltimos24Meses : [objeto.atrasosUltimos24Meses, Validators.required],
                diasAtrasoCorte : [objeto.diasAtrasoCorte, Validators.required],
                estadoCredito : [objeto.estado]
            });
            this.objSeleccionadoCredito = objeto;
            this.iniciarBotonesCredito(false);
        } 
        else {

            this.formCredito = this.formBuilder.group({
                categoriaCredito : [null, Validators.required],
                tipoAsociado : [null, Validators.required],
                cantidadFianzas : [null, Validators.required],
                tiempoAfiliacion : [null, Validators.required],
                cantidadCreditosHistorico : [null, Validators.required],
                totalSaldoFianzas : [null, Validators.required],
                totalCuotasFianzas : [null, Validators.required],
                cph : [null, Validators.required],
                cphUltimos12Meses : [null, Validators.required],
                cphUltimos24Meses : [null, Validators.required],
                atrasoMaximo : [null, Validators.required],
                atrasosUltimos12Meses : [null, Validators.required],
                atrasosUltimos24Meses : [null, Validators.required],
                diasAtrasoCorte : [null, Validators.required],
                estadoCredito : [false]
            });
            this.objSeleccionadoCredito = undefined;
            this.iniciarBotonesCredito(true);
        }
    }
    private inicializaFormularioPersona(objeto : MacPersona = null) : void {

        if (objeto) {

            this.formPersona = this.formBuilder.group({
                identificacion : [objeto.identificacion, Validators.required],
                nombre : [objeto.nombre, Validators.required],
                primerApellido : [objeto.primerApellido, Validators.required],
                segundoApellido : [objeto.segundoApellido],
                estadoCivil : [objeto.codigoEstadoCivil, Validators.required],
                tipoPersona : [objeto.codigoTipoPersona, Validators.required],
                genero : [objeto.codigoGenero, Validators.required],
                condicionLaboral : [objeto.codigoCondicionLaboral, Validators.required],
                tipoHabitacion : [objeto.codigoTipoHabitacion, Validators.required],
                cantidadHijos : [objeto.cantidadHijos, Validators.required],
                fechaNacimiento : [objeto.fechaNacimiento, Validators.required],
                edad : [objeto.edad],
                indAsociado : [objeto.indAsociado],
                estado : [objeto.estado]
            });
            this.objSeleccionado = objeto;
            this.iniciarBotonesPersona(false);
        } 
        else {

            this.formPersona = this.formBuilder.group({
                identificacion : ['', Validators.required],
                nombre : ['', Validators.required],
                primerApellido : ['', Validators.required],
                segundoApellido : [''],
                estadoCivil : [null, Validators.required],
                tipoPersona : [null, Validators.required],
                genero : [null, Validators.required],
                condicionLaboral : [null, Validators.required],
                tipoHabitacion : [null, Validators.required],
                cantidadHijos : [null, Validators.required],
                fechaNacimiento : [null, Validators.required],
                edad : [null],
                indAsociado : [false],
                estado : [false]
            });
            this.objSeleccionado = undefined;
            this.iniciarBotonesPersona(true);
        }
    }

    private createPersonaForm(registra : boolean = false) : MacPersona {

        const { identificacion, 
                nombre, 
                primerApellido, 
                segundoApellido, 
                estadoCivil, 
                tipoPersona,
                genero, 
                condicionLaboral, 
                tipoHabitacion, 
                cantidadHijos, 
                fechaNacimiento, 
                edad,
                indAsociado,
                estado
             } = this.formPersona.controls;

        var persona = new MacPersona();

        persona.identificacion = identificacion.value;
        persona.nombre = nombre.value;
        persona.primerApellido = primerApellido.value;
        persona.segundoApellido = segundoApellido.value;
        persona.codigoEstadoCivil = estadoCivil.value;
        persona.codigoTipoPersona = tipoPersona.value;
        persona.codigoGenero = genero.value;
        persona.codigoCondicionLaboral = condicionLaboral.value;
        persona.codigoTipoHabitacion = tipoHabitacion.value;
        persona.cantidadHijos = cantidadHijos.value;
        persona.fechaNacimiento = fechaNacimiento.value;
        persona.edad = edad.value;
        persona.indAsociado = indAsociado.value;
        persona.estado = estado.value;

        if (registra) {

            persona.codigoCompania = this.companiaObservable.id;
            persona.adicionadoPor = this.userObservable.identificacion;
            persona.fechaAdicion = this.today;

        } else {
            persona.id = this.objSeleccionado.id;
            persona.modificadoPor = this.userObservable.identificacion; 
            persona.fechaModificacion = new Date();
        }
        return persona;
    }
    private createCreditoForm(registra : boolean = false) : MacInformacionCreditoPersona {

        const { categoriaCredito, 
                tipoAsociado, 
                tiempoAfiliacion, 
                estadoCredito, 
                cantidadCreditosHistorico, 
                cantidadFianzas,
                totalSaldoFianzas, 
                totalCuotasFianzas, 
                cph, 
                cphUltimos12Meses, 
                cphUltimos24Meses, 
                atrasosUltimos12Meses,
                atrasosUltimos24Meses,
                diasAtrasoCorte,
                atrasoMaximo
             } = this.formCredito.controls;

        var credito = new MacInformacionCreditoPersona();

        credito.codigoCategoriaCredito = categoriaCredito.value;
        credito.codigoTipoAsociado = tipoAsociado.value;
        credito.tiempoAfiliacion = tiempoAfiliacion.value;
        credito.estado = estadoCredito.value;
        credito.cantidadCreditosHistorico = cantidadCreditosHistorico.value;
        credito.cantidadFianzas = cantidadFianzas.value;
        credito.totalSaldoFianzas = totalSaldoFianzas.value;
        credito.totalCuotasFianzas = totalCuotasFianzas.value;
        credito.cph = cph.value;
        credito.cphUltimos12Meses = cphUltimos12Meses.value;
        credito.cphUltimos24Meses = cphUltimos24Meses.value;
        credito.atrasosUltimos12Meses = atrasosUltimos12Meses.value;
        credito.atrasosUltimos24Meses = atrasosUltimos24Meses.value;
        credito.diasAtrasoCorte = diasAtrasoCorte.value;
        credito.atrasoMaximo = atrasoMaximo.value;

        if (registra) {

            credito.idCompania = this.companiaObservable.id;
            credito.idModulo = this.moduleObservable.id;
            credito.idPersona = this.objSeleccionado.id;
            credito.adicionadoPor = this.userObservable.identificacion;
            credito.fechaAdicion = this.today;

        } else {
            credito.id = this.objSeleccionadoCredito.id;

            credito.modificadoPor = this.userObservable.identificacion; 
            credito.fechaModificacion = new Date();
        }
        return credito;
    }

    registra() : void {

        this.alertService.clear();
        this.submitFormPersona = true;

        if ( this.formPersona.invalid ) return;

        let persona : MacPersona = this.createPersonaForm(true);

        this.macredService.postPersona(persona)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this.submitFormPersona = false;
                    this.listPersonas.push(response);
                    this.inicializaFormularioPersona();

                    if (!this.habilitaListasPersonas) this.habilitaListasPersonas = true;
                    
                    this.alertService.success( 
                        `Persona ${ response.identificacion } guardado correctamente!` 
                    );
                } else { this.alertService.error('Problemas al registrar la persona.'); }
            }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
        });
    }
    registraCredito() : void {

        this.alertService.clear();
        this.submitFormCredito = true;

        if ( this.formCredito.invalid ) return;

        let credito : MacInformacionCreditoPersona = this.createCreditoForm(true);

        this.macredService.postInfoCreditoPersona(credito)
            .pipe(first())
            .subscribe(response => {

                if (response.exito) {

                    this.submitFormCredito = false;
                    this.listInfoCreditoPersonas.push(response.objetoDb);
                    this.inicializaFormularioCredito();

                    this.habilitaListaCredito = true;
                    
                    this.alertService.success( 
                        `Crédito guardado correctamente!` 
                    );
                } else { this.alertService.error('Problemas al registrar crédito.'); }
            }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
        });
    }

    elimina() {

        this.alertService.clear();

        if (this.objSeleccionado) {

            if (this.listCategoriasCreditos && this.listCategoriasCreditos.length > 0) {
                this.alertService.error('Debe eliminar los créditos asociados a la persona.');
                return;
            }

            this.dialogo.open(DialogoConfirmacionComponent, { 
                data: 'Seguro que desea eliminar a ' + this.objSeleccionado.nombre + '?' 
            })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {

                if (confirmado) {

                    this.macredService.deletePersona(this.objSeleccionado.id)
                        .pipe(first())
                        .subscribe(response => {

                            if (response) {

                                this.submitFormPersona = false;
                                this.listPersonas.splice(this.listPersonas.findIndex( m => m.id == this.objSeleccionado.id ), 1);
                                this.inicializaFormularioPersona();

                                this.alertService.success( `Persona eliminada correctamente!` );

                            } else { this.alertService.error('Problemas al eliminar la persona.'); }
                        }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error);
                    });
                } else { return; }
            });
        }
    }
    eliminaCredito() {

        this.alertService.clear();

        if (this.objSeleccionadoCredito) {

            this.dialogo.open(DialogoConfirmacionComponent, { 
                data: 'Seguro que desea eliminar el crédito ' + this.objSeleccionadoCredito.id + '?' 
            })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {

                if (confirmado) {

                    this.macredService.deleteInfoCreditoPersona(this.objSeleccionadoCredito.id)
                        .pipe(first())
                        .subscribe(response => {

                            if (response) {

                                this.submitFormCredito = false;
                                this.listInfoCreditoPersonas.splice(this.listInfoCreditoPersonas.findIndex( m => m.id == this.objSeleccionadoCredito.id ), 1);
                                this.inicializaFormularioCredito();

                                if (this.listInfoCreditoPersonas.length === 0) this.habilitaListaCredito = false; 

                                this.alertService.success( `Crédito eliminado correctamente!` );

                            } else { this.alertService.error('Problemas al eliminar la persona.'); }
                        }, error => { this.alertService.error('Problemas de conexión. Detalle: ' + error);
                    });
                } else { return; }
            });
        }
    }

    actualiza() : void {

        this.alertService.clear();
        this.submitFormPersona = true;

        if ( this.formPersona.invalid ) return;

        let persona : MacPersona = this.createPersonaForm(false);

        this.macredService.putPersona(persona)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this.submitFormPersona = false;
                    this.listPersonas.splice(this.listPersonas.findIndex( m => m.id == response.id ), 1);
                    this.listPersonas.push(response);
                    
                    this.inicializaFormularioPersona();
                    this.inicializaFormularioCredito();

                    this.habilitaFormularioCredito = false;

                    this.alertService.success(
                        `Persona ${response.identificacion} actualizada correctamente!`
                    );

                } else { this.alertService.error('Problemas al actualizar la persona.'); }
            
            }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
        });
    }
    actualizaCredito() : void {

        this.alertService.clear();
        this.submitFormCredito = true;

        if ( this.formCredito.invalid ) return;

        let credito : MacInformacionCreditoPersona = this.createCreditoForm(false);

        this.macredService.putInfoCreditoPersona(credito)
            .pipe(first())
            .subscribe(response => {

                if (response) {

                    this.submitFormCredito = false;
                    this.listInfoCreditoPersonas.splice(this.listInfoCreditoPersonas.findIndex( m => m.id == response.objetoDb.id ), 1);
                    this.listInfoCreditoPersonas.push(response.objetoDb);
                    this.inicializaFormularioCredito();

                    this.alertService.success(
                        `Crédito ${response.objetoDb.id} actualizado correctamente!`
                    );

                } else { this.alertService.error('Problemas al actualizar la persona.'); }
            }, error => { this.alertService.error(this.translate.translateKeyP('ALERTS.CONNECTION_ERROR', { ERROR: error })); 
        });
    }
    
    buscarModuloId(moduleId : number) : void {
        this.accountService.getModuleId(moduleId)
            .pipe(first())
            .subscribe(response => { 
                if (response) this.moduleScreen = response ; });
    }

    private getPersonas() : void {
        this.macredService.getPersonas()
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0) {
                    this.habilitaListasPersonas = true;
                    this.listPersonas = response;
                }
            }, error => { this.alertService.error('Problemas al consultar las personas. ' + error);
        });
    }
    private getInfoCreditoPersonas(pidPersona : number) : void {
        this.macredService.getInfoCreditoPersona(pidPersona)
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0) {
                    this.habilitaListaCredito = true;
                    this.listInfoCreditoPersonas = response;
                } else {
                    this.habilitaListaCredito = false;
                    this.listInfoCreditoPersonas= [];
                }
            }, error => { this.alertService.error('Problemas al consultar los créditos. ' + error);
        });
    }
    
    private getEstadosCiviles() : void {

        this.macredService.getEstadosCiviles()
        .pipe(first())
        .subscribe(response => {

            if (response && response.length > 0) this.listEstadosCiviles = response;
            
        }, error => { this.alertService.error('Problemas al consultar los estados civiles.' + error); });
    }
    private getTiposPersonas() : void {

        this.macredService.getTiposPersonasCompania(this.companiaObservable.id)
        .pipe(first())
        .subscribe(response => {

            if (response && response.length > 0) this.listTiposPersonas = response;
            
        }, error => { this.alertService.error('Problemas al consultar los tipos de personas. ' + error); });
    }
    private getTiposGeneros() : void {

        this.macredService.getTiposGenerosCompania(this.companiaObservable.id)
        .pipe(first())
        .subscribe(response => {

            if (response && response.length > 0) this.listTiposGeneros = response;
            
        }, error => { this.alertService.error('Problemas al consultar los tipos de generos. ' + error); });
    }
    private getCondicionesLaborales() : void {

        this.macredService.getCondicionesLaboralesCompania(this.companiaObservable.id)
        .pipe(first())
        .subscribe(response => {

            if (response && response.length > 0) this.listCondicionesLaborales = response;
            
        }, error => { this.alertService.error('Problemas al consultar las condiciones laborales. ' + error); });
    }
    private getTiposHabitaciones() : void {

        this.macredService.getTiposHabitacionesCompania(this.companiaObservable.id)
        .pipe(first())
        .subscribe(response => {

            if (response && response.length > 0) this.listTiposHabitaciones = response;
            
        }, error => { this.alertService.error('Problemas al consultar los tipos de habitaciones. ' + error); });
    }
    private getCategoriasCreditos() : void {

        this.macredService.getCategoriasCreditosCompania(this.userObservable.empresa)
        .pipe(first())
        .subscribe(response => {

            if (response && response.length > 0) this.listCategoriasCreditos = response;
            
        }, error => { this.alertService.error('Problemas al consultar las categorias de créditos. ' + error); });
    }
    private getTiposAsociados() : void {

        this.macredService.getTiposAsociadosCompania(this.userObservable.empresa)
        .pipe(first())
        .subscribe(response => {

            if (response && response.length > 0) this.listTiposAsociados = response;
            
        }, error => { this.alertService.error('Problemas al consultar los tipos de asociados. ' + error); });
    }

    private iniciarBotonesPersona(esParaAgregar: boolean) {
        this.habilitaBtnNuevo = !esParaAgregar;
        this.habilitaBtnRegistro = esParaAgregar;
        this.habilitaBtnActualiza = !esParaAgregar;
        this.habilitaBtnEliminar = !esParaAgregar;
    }
    private iniciarBotonesCredito(esParaAgregar: boolean) {
        this.habilitaBtnNuevoCredito = !esParaAgregar;
        this.habilitaBtnRegistroCredito = esParaAgregar;
        this.habilitaBtnActualizaCredito = !esParaAgregar;
        this.habilitaBtnEliminarCredito = !esParaAgregar;
    }

    buscarPersona() : void {

        this.alertService.clear();

        this.habilitaListasPersonas = false;
        this.habilitaFormularioCredito = false;
        this.habilitaListaCredito = false;

        this.listPersonas = [];
        this.listInfoCreditoPersonas = [];

        let identificacion = this.formPersona.controls['identificacion'].value;
        let nombre = this.formPersona.controls['nombre'].value;
        let apellido = this.formPersona.controls['primerApellido'].value;

        let busqueda : string = '';
        
        if (!identificacion && !nombre && !apellido) busqueda = '%%' ;

        if (busqueda !== '%%') {
            
            if (identificacion) {

                this.getPersonasIdentificacion(identificacion);

            } else if (nombre) {

                this.getPersonasNombre(nombre);

            } else { this.getPersonasApellido(apellido); }

            this.inicializaFormularioPersona();

        } else { this.getPersonas(); }
    } 

    private getPersonasIdentificacion(pidentificacion : string) : void {

        this.macredService.getPersonasIdentificacion(pidentificacion)
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0) {
                    this.habilitaListasPersonas = true;
                    this.listPersonas = response;
                }
            }, error => { this.alertService.error('Problemas al consultar las personas. ' + error);
        });
    }
    private getPersonasNombre(pnombre : string) : void {

        this.macredService.getPersonasNombre(pnombre)
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0) {
                    this.habilitaListasPersonas = true;
                    this.listPersonas = response;
                }
            }, error => { this.alertService.error('Problemas al consultar las personas. ' + error);
        });
    }
    private getPersonasApellido(papellido : string) : void {

        this.macredService.getPersonasApellido(papellido)
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0) {
                    this.habilitaListasPersonas = true;
                    this.listPersonas = response;
                }
            }, error => { this.alertService.error('Problemas al consultar las personas. ' + error);
        });
    }

    calcularEdad(event: any) {
        const fechaNacimiento = event.value;

        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) edad--;
        
        this.edad = edad;
        this.formPersona.get('edad')?.setValue(edad);
    }
}
