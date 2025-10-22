import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User, Module, Compania, ModuleScreen, ModuleSubMenu } from '@app/_models';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';
import { MacredService } from '@app/_services/macred.service';
import {  MacAnalisisCapacidadPago,
          MacEstadoCivil,
          MacInformacionCreditoPersona,
          MacMatrizAceptacionIngreso,
          MacModeloAnalisis,
          MacNivelCapacidadPago,
          MacPersona,
          MacTipoDeducciones,
          MacTipoFormaPagoAnalisis,
          MacTipoGenerador,
          MacTipoIngreso,
          MacTipoIngresoAnalisis,
          MacTiposMoneda,
          ScoringFlujoCajaLibre } from '@app/_models/Macred';
import { DatosAnalisisComponent } from './datos-analisis/datos-analisis.component';
import { SrvDatosAnalisisService } from './servicios/srv-datos-analisis.service';
import { ModulesSystem } from '@environments/environment';
import { MacTipoAsociado } from '@app/_models/Macred/TipoAsociado';
import { MacCategoriaCredito } from '@app/_models/Macred/CategoriaCredito';
import { MacCondicionLaboral } from '@app/_models/Macred/CondicionLaboral';
import { MacTipoHabitacion } from '@app/_models/Macred/TipoHabitacion';
import { firstValueFrom, forkJoin } from 'rxjs';

declare var $: any;

@Component({selector: 'app-analisis-asociados-macred',
            templateUrl: './analisis-asociados.html',
            styleUrls: ['../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class AnalisisAsociadosComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  // @ViewChild(MatSidenav) sidenav2: MatSidenav;

  @ViewChild(DatosAnalisisComponent, { static: false })
  _cDatosAnalisisComponent: DatosAnalisisComponent;

  private nombrePantalla: string = 'analisis-asociados.html';

  // objetos seleccionados
  _per: MacPersona = undefined;
  _cre: MacInformacionCreditoPersona = undefined;

  _globalCodMonedaPrincipal: number;
  // _globalMesesAplicaExtras: number;
  _analisisCapacidadpago: MacAnalisisCapacidadPago;

  // ## -- objetos suscritos -- ## //
  private userObservable: User;
  private moduleObservable: Module;
  private companiaObservable: Compania;
  // ## -- ----------------- -- ## //

  // ## -- submit formularios -- ## //
  submittedPersonForm: boolean = false;
  // ## -- ------------------ -- ## //

  // muestraTabs: boolean = false;
  datosAnalisis: boolean = false;
  flujoCaja: boolean = false;
  pd: boolean = false;
  scoring: boolean = false;
  ingresos: boolean = false;
  obligacionesSupervisadas: boolean = false;
  oNoSupervisadas: boolean = false;
  lvt: boolean = false;
  escenarios: boolean = false;
  escenariosFcl: boolean = false;
  isDeleting: boolean = false;

  // ## -- habilita botones -- ## //
  habilitaBtnPD: boolean = false;
  // ## -- ---------------- -- ## //

  public listSubMenu: ModuleSubMenu[] = [];
  public menuItem: ModuleSubMenu = null;
  // public menuItem: Module = null;

  // ## -- listas datos análisis -- ## //
  // listTipoFormaPagoAnalisis: MacTipoFormaPagoAnalisis[];
  // listTipoIngresoAnalisis: MacTipoIngresoAnalisis[];
  // listModelosAnalisis: MacModeloAnalisis[];
  // listNivelesCapacidadpago: MacNivelCapacidadPago[];
  // listTiposGeneradores: MacTipoGenerador[];
  // listTiposMonedas: MacTiposMoneda[];
  // ## -- *************** -- ## //

  // ## -- listas ingresos -- ## //
  // listTiposIngresos: MacTipoIngreso[];
  // listMatrizAceptacionIngreso: MacMatrizAceptacionIngreso[];
  // listTiposDeducciones: MacTipoDeducciones[];
  // ## -- *************** -- ## //

  // ## -- formularios -- ## //
  formPersona: UntypedFormGroup;
  formCredito: UntypedFormGroup;
  formAnalisis: UntypedFormGroup;
  // ## -- *********** -- ## //


  // ## -- acts 2025 -- ## //

  URLIndexModulePage: string;

  public moduleScreen : ModuleScreen = new ModuleScreen;

  submitFormPersona : boolean = false;
  submitFormCredito : boolean = false;

  habilitaBtnSeleccionaCredito : boolean = false;
  habilitaBtnSeleccionaPersona : boolean = false;

  // ## -- habilita grids -- ## //

  habilitaCredito : boolean = false;
  habilitaPersona : boolean = false;

  habilitaListasPersonas : boolean = false;
  habilitaFormularioCredito : boolean = false;
  habilitaListaCredito : boolean = false;

  objSeleccionadoPersona: MacPersona = undefined;
  objSeleccionadoCredito: MacInformacionCreditoPersona = undefined;

  listPersonas: MacPersona[] = [];
  listInfoCreditoPersonas: MacInformacionCreditoPersona[] = [];

  listTiposAsociados: MacTipoAsociado[];
  listCategoriasCreditos: MacCategoriaCredito[];
  listEstadosCiviles: MacEstadoCivil[];
  listCondicionesLaborales: MacCondicionLaboral[];
  listTiposHabitaciones: MacTipoHabitacion[];

  public today : Date = new Date();

  public test : boolean = true;

  constructor(private formBuilder: UntypedFormBuilder,
              private macredService: MacredService,
              private accountService: AccountService,
              private alertService: AlertService,
              private router: Router,
              private dialogo: MatDialog,
              public srvDatosAnalisisService: SrvDatosAnalisisService) {

    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.companiaObservable = this.accountService.businessValue;

    this.URLIndexModulePage = ModulesSystem.macredbasehref + 'index.html';

    this.buscarModuloId(this.moduleObservable.id);

    this.getPersonasActivas();
    this.getListasAnalisis();

    this.inicializaFormularioPersona();
    this.inicializaFormularioCredito();
  }

  get f () { return this.formPersona.controls; }
  get c () { return this.formCredito.controls; }

  public redirectIndexModule() : void { this.router.navigate([this.URLIndexModulePage]); }

  async ngOnInit() : Promise<void> {

    const response = await firstValueFrom( 
      this.accountService.validateAccessUser( this.userObservable.id,
                                              this.moduleObservable.id,
                                              this.nombrePantalla,
                                              this.companiaObservable.id ));
        // ## -->> redirecciona NO ACCESO
        if ( !response.exito ) this.router.navigate([this.moduleObservable.indexHTTP]);
  }

  // selecciona items pruebas
  public selectItems() : void {

    this.selectPersona(this.listPersonas[0]);
    this.seleccionarPersona();
  }
  //

  private inicializaFormularioPersona(objeto : MacPersona = null) : void {

    if (objeto) {

        this.formPersona = this.formBuilder.group({
            identificacion : [objeto.identificacion, Validators.required],
            nombre : [objeto.nombre, Validators.required],
            primerApellido : [objeto.primerApellido, Validators.required],
            segundoApellido : [objeto.segundoApellido]
        });
        this.objSeleccionadoPersona = objeto;
    } 
    else {

        this.formPersona = this.formBuilder.group({
            identificacion : ['', Validators.required],
            nombre : ['', Validators.required],
            primerApellido : ['', Validators.required],
            segundoApellido : ['']
        });
        this.objSeleccionadoPersona = undefined;
    }
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
    }
  }

  public selectPersona(objeto : MacPersona = null) : void {

    this.habilitaBtnSeleccionaPersona = false;
    if (objeto.estado) this.habilitaBtnSeleccionaPersona = true;
      
    this.habilitaFormularioCredito = true;

    this.inicializaFormularioPersona(objeto);

    this.inicializaFormularioCredito();
    this.getInfoCreditoActivosPersonas(objeto.id);

    this.formPersona.get('segundoApellido')?.disable();
  }
  public seleccionarPersona() : void {

    this._per = this.objSeleccionadoPersona;
    this.srvDatosAnalisisService._personaAnalisis = this._per;

    this._per.descEstadoCivil = 
      this.srvDatosAnalisisService.listEstadosCiviles.find(x => x.id === this._per.codigoEstadoCivil)?.descripcion;

    this._per.descCondicionLaboral = 
      this.srvDatosAnalisisService.listCondicionesLaborales.find(x => x.id === this._per.codigoCondicionLaboral)?.descripcion;

      this._per.descTipoHabitacion = 
        this.srvDatosAnalisisService.listTiposHabitaciones.find(x => x.id === this._per.codigoTipoHabitacion)?.descripcion;

    this.habilitaPersona = true;
    this.inicializaFormularioCredito();
  }
  public limpiarSeleccionPersona() : void {

    this.limpiarSeleccionCredito();
    this.habilitaFormularioCredito = false;
    
    this.habilitaBtnSeleccionaPersona = false;
    this.habilitaBtnSeleccionaCredito = false;

    this._per = undefined;
    this._cre = undefined;
    this.inicializaFormularioPersona();

    this.habilitaPersona = false;
  }

  public selectCredito(objeto : MacInformacionCreditoPersona = null) : void {
    
    this.inicializaFormularioCredito(objeto);

    if (this._per) this.habilitaBtnSeleccionaCredito = true;

    this.formCredito.disable();
  }
  public seleccionarCredito() : void {

    this._cre = this.objSeleccionadoCredito;

    this._cre.descCategoriaCredito = 
      this.listCategoriasCreditos.find(x => x.id === this._cre.codigoCategoriaCredito)?.descripcion;

    this._cre.descTipoAsociado = 
      this.listTiposAsociados.find(x => x.id === this._cre.codigoTipoAsociado)?.descripcion;

    this.habilitaCredito = true;

    this.habilitarDatosAnalisis();
  }
  public limpiarSeleccionCredito() : void {

    this.habilitaBtnSeleccionaCredito = false;

    this._cre = undefined;
    this.inicializaFormularioCredito();

    this.habilitaCredito = false;
  }

  public buscarPersona() : void {

    this.alertService.clear();

    this.habilitaListasPersonas = false;
    this.habilitaFormularioCredito = false;

    this.listPersonas = [];

    let identificacion = this.formPersona.controls['identificacion'].value ;
    let nombre = this.formPersona.controls['nombre'].value ;
    let apellido = this.formPersona.controls['primerApellido'].value ;

    let busqueda : string = '';
    
    if (!identificacion && !nombre && !apellido) busqueda = '%%' ;

    if (busqueda !== '%%') {
        
        if (identificacion) {

            this.getPersonasIdentificacion(identificacion);

        } else if (nombre) {

            this.getPersonasNombre(nombre);

        } else { this.getPersonasApellido(apellido); }

        this.inicializaFormularioPersona();

    } else { this.getPersonasActivas(); }
  }

  habilitarItemSubMenu(pmodSubMenu: ModuleSubMenu): void {

    this.menuItem = pmodSubMenu;
    this.listSubMenu.push(this.menuItem);

    this.habilitaTab(this.menuItem);
  }
  selectModule(pmodSubMenu: ModuleSubMenu) {

    this.limpiarTabs();
    this.menuItem = this.listSubMenu.find((x) => x.id === pmodSubMenu.id);
    this.habilitaTab(this.menuItem);
  }

  async habilitarDatosAnalisis() : Promise<boolean> {

    if (this.srvDatosAnalisisService.getAnalisisCapacidadPago()) {

      const confirmado = await firstValueFrom(
        this.dialogo.open(DialogoConfirmacionComponent, {
          data: 'Existe un análisis en proceso, seguro que desea continuar ?',
        }).afterClosed()
      );

      if ( confirmado ) {
        this.listSubMenu = [];
        this.srvDatosAnalisisService.setAnalisisCapacidadPago();

        this.habilitarItemSubMenu(new ModuleSubMenu(1, 'Datos de Análisis'));
        return true;
      }
      return false;
    
    } else {
      this.listSubMenu = [];
      this.habilitarItemSubMenu(new ModuleSubMenu( 1, 'Datos de Análisis')); 
      return true; 
    }
  }

  habilitaIngresos(): void {

    const item = this.listSubMenu.find(x => x.id === 5);

    if (item) {

      this.selectModule(item);

    } else { this.limpiarTabs(); this.habilitarItemSubMenu(new ModuleSubMenu( 5, 'Ingresos')); }
  }

  private habilitaTab(mod: ModuleSubMenu) : void {

    switch (mod.id) {

      case 1: this.datosAnalisis = true; break;

      case 2:
        this.flujoCaja = true;
        break;

      case 3:
        this.pd = true;
        break;

      case 4:
        this.scoring = true;
        break;

      case 5: this.ingresos = true; break;

      case 6:
        this.obligacionesSupervisadas = true;
        break;
      case 7:
        this.oNoSupervisadas = true;
        break;
      case 8:
        this.lvt = true;
        break;
      case 9:
        this.escenarios = true;
        break;
      case 10:
        this.escenariosFcl = true;
        break;

      default:
        return;
    }
  }

  private getPersonasActivas() : void {
    this.macredService.getPersonasActivas()
      .pipe(first())
      .subscribe(response => {
          if (response && response.length > 0) {
            this.habilitaListasPersonas = true;
            this.listPersonas = response;
          }
      }, error => { this.alertService.error('Problemas al consultar las personas. ' + error);
    });
  }
  private getInfoCreditoActivosPersonas(pidPersona : number) : void {
    this.macredService.getInfoCreditoActivosPersonas(pidPersona)
      .pipe(first())
      .subscribe(response => {
          if (response && response.length > 0) {
            this.habilitaListaCredito = true;
            this.listInfoCreditoPersonas = response;

            // selecciona items pruebas
            this.selectCredito(this.listInfoCreditoPersonas[0]);
            this.seleccionarCredito();
            this.test = false;
          } else {
            this.habilitaListaCredito = false; this.listInfoCreditoPersonas = [];
          }
      }, error => { this.alertService.error('Problemas al consultar los créditos. ' + error);
    });
  }

  private buscarModuloId(moduleId : number) : void {
    this.accountService.getModuleId(moduleId)
        .pipe(first())
        .subscribe(response => { if (response) this.moduleScreen = response ; });
  }

  private getPersonasIdentificacion(pidentificacion: string): void {
    this.macredService.getPersonasIdentificacion(pidentificacion)
      .pipe(first())
      .subscribe({
        next: (response) => {
          if (response?.length) {
            this.habilitaListasPersonas = true;
            this.listPersonas = response;
          }
        },
        error: (error) => {
          this.alertService.error(`Problemas al consultar las personas. ${error}`);
        }
      });
  }
  private getPersonasNombre(pnombre: string): void {
    this.macredService.getPersonasNombre(pnombre)
      .pipe(first())
      .subscribe({
        next: (response) => {
          if (response?.length) {
            this.habilitaListasPersonas = true;
            this.listPersonas = response;
          }
        },
        error: (error) => {
          this.alertService.error(`Problemas al consultar las personas. ${error}`);
        }
      });
  }
  private getPersonasApellido(papellido: string): void {
    this.macredService.getPersonasApellido(papellido)
      .pipe(first())
      .subscribe({
        next: (response) => {
          if (response?.length) {
            this.habilitaListasPersonas = true;
            this.listPersonas = response;
          }
        },
        error: (error) => {
          this.alertService.error(`Problemas al consultar las personas. ${error}`);
        }
      });
  }

  private getListasAnalisis() : void {

    this.macredService.getCategoriasCreditos()
      .pipe(first())
      .subscribe({ next: (response) => { 
        if (response?.length) {
          this.listCategoriasCreditos = response;
          this.srvDatosAnalisisService.listCategoriasCreditos = this.listCategoriasCreditos;
        }
      }});

    this.macredService.getEstadosCiviles()
      .pipe(first())
      .subscribe({ next: (response) => {
        if (response?.length) {
          this.listEstadosCiviles = response;
          this.srvDatosAnalisisService.listEstadosCiviles = this.listEstadosCiviles;
        }
      }});

    this.macredService.getCondicionesLaborales()
      .pipe(first())
      .subscribe({ next: (response) => { 
        if (response?.length) {
          this.listCondicionesLaborales = response;
          this.srvDatosAnalisisService.listCondicionesLaborales = this.listCondicionesLaborales;
        }
      }});

    this.macredService.getTiposHabitaciones()
      .pipe(first())
      .subscribe({ next: (response) => { 
        if (response?.length) {
          this.listTiposHabitaciones = response;
          this.srvDatosAnalisisService.listTiposHabitaciones = this.listTiposHabitaciones;
        }
      }});

      // listas generales
      this.macredService.getTiposAsociados()
        .pipe(first())
        .subscribe({ next: (response) => { 
          if (response?.length) {
            this.listTiposAsociados = response;
            this.srvDatosAnalisisService.listTiposAsociados = this.listTiposAsociados;
          }
        }});

      this.macredService.getTiposMonedas(this.companiaObservable.id)
        .pipe(first())
        .subscribe({ next: (response) => { 
          if (response?.length) this.srvDatosAnalisisService.listTiposMonedas = response;
        }});

      this.macredService.getTiposIngresoAnalisis(this.companiaObservable.id)
        .pipe(first())
        .subscribe({ next: (response) => { 
          if (response?.length) {
            // this.listTipoIngresoAnalisis = response;
            this.srvDatosAnalisisService.listTipoIngresoAnalisis = response;
          }
        }});

      // listas datos analisis
      this.macredService.getTiposFormaPagoAnalisis(this.companiaObservable.id)
        .pipe(first())
        .subscribe({ next: (response) => { 
          if (response?.length) {
            // this.listTipoFormaPagoAnalisis = response;
            this.srvDatosAnalisisService.listTipoFormaPagoAnalisis = response;
          }
        }});

      this.macredService.getModelosCalificacionActivos()
        .pipe(first())
        .subscribe({ next: (response) => { 
          if (response?.length) {
            // this.listModelosAnalisis = response;
            this.srvDatosAnalisisService.listModelosAnalisis = response;
          }
        }});

      this.macredService.getNivelesCapacidadPago(false)
        .pipe(first())
        .subscribe({ next: (response) => { 
          if (response?.length) {
            // this.listNivelesCapacidadpago = response;
            this.srvDatosAnalisisService.listNivelesCapacidadpago = response;
          }
        }});

      this.macredService.getTiposGenerador(this.companiaObservable.id, false)
        .pipe(first())
        .subscribe({ next: (response) => { 
          if (response?.length) {
            // this.listTiposGeneradores = response;
            this.srvDatosAnalisisService.listTiposGeneradores = response;
          }
        }});

      // listas ingresos
      this.macredService.getTiposIngresos(this.companiaObservable.id, false)
        .pipe(first())
        .subscribe({ next: (response) => { if (response?.length) this.srvDatosAnalisisService.listTiposIngresos = response; }});

      this.macredService.getTiposDeducciones(this.companiaObservable.id, false)
        .pipe(first())
        .subscribe({ next: (response) => { if (response?.length) this.srvDatosAnalisisService.listTiposDeducciones = response; }});

      // info parametros generales
      this.macredService.GetParametroGeneralVal1('COD_MONEDA_PRINCIPAL', true)
        .pipe(first())
        .subscribe({ next: (response) => { 
          this._globalCodMonedaPrincipal = +response;
          this.srvDatosAnalisisService._globalCodMonedaPrincipal = this._globalCodMonedaPrincipal;
        }});

      this.macredService.GetParametroGeneralVal1('MESES_APLICABLES_EXTRAS', true)
        .pipe(first())
        .subscribe({ next: (response) => { 
          // this._globalMesesAplicaExtras = +response; 
          this.srvDatosAnalisisService._globalMesesAplicaExtras = +response;
        }});
  }

  public limpiarTabs(): void {
    
    this.datosAnalisis = false;
    this.ingresos = false;
    
    this.flujoCaja = false;
    this.pd = false;
    this.scoring = false;
    this.obligacionesSupervisadas = false;
    this.oNoSupervisadas = false;
    this.lvt = false;
    this.escenarios = false;
    this.escenariosFcl = false;
  }
  ngOnDestroy(): void {
    this.srvDatosAnalisisService.setAnalisisCapacidadPago();
    this.srvDatosAnalisisService._personaAnalisis = undefined;
  }

  habilitarFormPD(): void {
    this.habilitarItemSubMenu(
      new Module(
        3,
        'PD',
        'Probability Of Default',
        'Probability Of Default',
        'A',
        '.png',
        '.ico',
        'http'
      )
    );
    // this.selectModule(
    //   new Module(
    //     3,
    //     'PD',
    //     'Probability Of Default',
    //     'Probability Of Default',
    //     'I',
    //     '.png',
    //     '.ico',
    //     'http'
    //   )
    // );
    this.habilitaBtnPD = false;
  }

  habilitarFormFCL(): void {
    this.habilitarItemSubMenu(
      new Module(
        2,
        'FCL',
        'Flujo de Caja Libre',
        'Flujo de Caja Libre',
        'A',
        '.png',
        '.ico',
        'http'
      )
    );
    // this.selectModule(
    //   new Module(
    //     2,
    //     'FCL',
    //     'Flujo de Caja Libre',
    //     'Flujo de Caja Libre',
    //     'I',
    //     '.png',
    //     '.ico',
    //     'http'
    //   )
    // );
    this.habilitaBtnPD = false;
  }

  _analisisScoringFCL: ScoringFlujoCajaLibre = undefined;
  handleHabilitarEscenariosFCL(inScoring: ScoringFlujoCajaLibre) {
    this._analisisScoringFCL = inScoring;
    this.habilitarItemSubMenu(
      new Module(
        10,
        'EscenariosFCL',
        'Escenarios FCL',
        'Escenarios FCL',
        'A',
        '.png',
        '.ico',
        'http'
      )
    );
    // this.selectModule(
    //   new Module(
    //     10,
    //     'EscenariosFCL',
    //     'Escenarios FCL',
    //     'Escenarios FCL',
    //     'I',
    //     '.png',
    //     '.ico',
    //     'http'
    //   )
    // );
  }
}



  // SubmitPerson(): void {
  //   this.alertService.clear();
  //   this.submittedPersonForm = true;

  //   if (this.formPersona.invalid) return;

  //   let identificacionPersona =
  //     this.formPersona.controls['identificacion'].value;

  //   if (this.oAnalisis) {
      
  //     this.dialogo.open(DialogoConfirmacionComponent, {
  //         data: 'Existe un análisis en proceso, seguro que desea continuar ?',
  //       })
  //       .afterClosed()
  //       .subscribe((confirmado: Boolean) => {
          
  //         if (confirmado) {
  //           this.listSubMenu = [];
  //           this.limpiarTabs();

  //           this.srvDatosAnalisisService.setAnalisisCapacidadPago();
  //           this._per = null;
  //           this._cre = null;
  //           this.menuItem = null;

  //           // this.cargaInformacionPersona(identificacionPersona);
  //           // this._cDatosAnalisisComponent.inicializaFormDatosAnalisis();

  //           // this.muestraTabs = true;
          
  //         } else { return; }

  //       });
  //   } else {
  //     // this.cargaInformacionPersona(identificacionPersona);
  //     // this._cDatosAnalisisComponent.inicializaFormDatosAnalisis();
  //   }
  // }

  // addListMenu(modItem: Module): void {
  //   this.listSubMenu.push(modItem);
  //   // this.listSubMenu.push(new Module(2,'Flujo de Caja','Flujo de Caja','Flujo de Caja','I','.png','.ico','http'));
  //   // this.listSubMenu.push(new Module(3,'Probability of Default','Probability of Default','Probability of Default','I','.png','.ico','http'));
  //   // this.listSubMenu.push(new Module(4,'Scoring Crediticio','Scoring Crediticio','Scoring Crediticio','I','.png','.ico','http'));
  //   // this.listSubMenu.push(new Module(5,'Ingresos','Ingresos','Ingresos','I','.png','.ico','http'));
  //   // this.listSubMenu.push(new Module(6,'Obligaciones Supervisadas','Obligaciones Supervisadas','Obligaciones Supervisadas','I','.png','.ico','http'));
  //   // this.listSubMenu.push(new Module(7,'O. No Supervisadas','O. No Supervisadas','O. No Supervisadas','I','.png','.ico','http'));
  //   // this.listSubMenu.push(new Module(8,'LVT','LVT','LVT','I','.png','.ico','http'));
  //   // this.listSubMenu.push(new Module(9,'Escenarios','Escenarios','Escenarios','I','.png','.ico','http'));
  //   // this.listSubMenu.push(new Module(10,'Escenarios FCL','Escenarios FCL','Escenarios FCL','I','.png','.ico','http'));
  // }