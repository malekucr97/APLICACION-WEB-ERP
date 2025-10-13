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

declare var $: any;

@Component({selector: 'app-analisis-asociados-macred',
            templateUrl: './analisis-asociados.html',
            styleUrls: [
                '../../../../assets/scss/app.scss',
                '../../../../assets/scss/macred/app.scss',
            ],
            standalone: false
})
export class AnalisisAsociadosComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @ViewChild(MatSidenav) sidenav2: MatSidenav;

  //#region COMPONENTES HIJOS -- PARA OBTENER LOS METODOS DEL MISMO Y EVITAR DUPLICIDAD

  @ViewChild(DatosAnalisisComponent, { static: false })
  _DatosAnalisisComponent: DatosAnalisisComponent;

  //#endregion

  private nombrePantalla: string = 'analisis-asociados.html';
  // listScreenAccessUser    : ScreenAccessUser[];

  // objetos seleccionados
  _per: MacPersona = undefined;
  _cre: MacInformacionCreditoPersona = undefined;

  _globalCodMonedaPrincipal: number;
  _globalMesesAplicaExtras: number;
  // _personaMacred: MacPersona = null;
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
  listTipoFormaPagoAnalisis: MacTipoFormaPagoAnalisis[];
  listTipoIngresoAnalisis: MacTipoIngresoAnalisis[];
  listModelosAnalisis: MacModeloAnalisis[];
  listNivelesCapacidadpago: MacNivelCapacidadPago[];
  listTiposGeneradores: MacTipoGenerador[];
  listTiposMonedas: MacTiposMoneda[];
  // ## -- *************** -- ## //

  // ## -- listas ingresos -- ## //
  listTiposIngresos: MacTipoIngreso[];
  listMatrizAceptacionIngreso: MacMatrizAceptacionIngreso[];
  listTiposDeducciones: MacTipoDeducciones[];
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

    this.inicializaFormularioPersona();
    this.inicializaFormularioCredito();

    this.getPersonasActivas();

    this.getTiposAsociados();
    this.getCategoriasCreditos();
    this.getEstadosCiviles();
    this.getCondicionesLaborales();
    this.getTiposHabitaciones();
  }

  get f () { return this.formPersona.controls; }
  get c () { return this.formCredito.controls; }

  public redirectIndexModule() : void { this.router.navigate([this.URLIndexModulePage]); }


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

    this._per.descEstadoCivil = 
      this.listEstadosCiviles.find(x => x.id === this._per.codigoEstadoCivil)?.descripcion;

    this._per.descCondicionLaboral = 
      this.listCondicionesLaborales.find(x => x.id === this._per.codigoCondicionLaboral)?.descripcion;

      this._per.descTipoHabitacion = 
        this.listTiposHabitaciones.find(x => x.id === this._per.codigoTipoHabitacion)?.descripcion;

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

  private habilitarDatosAnalisis() : void {

    if (this.srvDatosAnalisisService._analisisCapacidadpago) {
      
      this.dialogo.open(DialogoConfirmacionComponent, {
          data: 'Existe un análisis en proceso, seguro que desea continuar ?',
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {
          
          if (confirmado) {

            this.listSubMenu = [];
            this.limpiarTabs();

            this._per = null;
            this._cre = null;

            this.srvDatosAnalisisService._analisisCapacidadpago = null;
            this.menuItem = null;

            this.habilitarItemSubMenu(new ModuleSubMenu( 1, 'Datos de Análisis'));
          
          } else { return; }

        });
    } else { this.habilitarItemSubMenu(new ModuleSubMenu( 1, 'Datos de Análisis')); }
  }

  // separador de funciones anteriores

  ngOnInit() {

    this.formAnalisis = this.formBuilder.group({
      fechaAnalisis: [null],
      tipoIngresoAnalisis: [null],
      tipoFormaPagoAnalisis: [null],
      tipoMoneda: [null],
      analisisDefinitivo: [null],
      estado: [null],
      modeloAnalisis: [null],
      indicadorCsd: [null],
      ponderacionLvt: [null],
      capacidadPago: [null],
      tipoGenerador: [null],
      numeroDependientes: [null],
      puntajeAnalisis: [null],
      calificacionCic: [null],
      calificacionFinalCic: [null],
      observaciones: [null],
    });

    this.accountService.validateAccessUser(this.userObservable.id,
                                          this.moduleObservable.id,
                                          this.nombrePantalla,
                                          this.companiaObservable.id)
      .pipe(first())
      .subscribe((response) => {

        // ## -->> redirecciona NO ACCESO
        if ( !response.exito ) this.router.navigate([this.moduleObservable.indexHTTP]);

        // carga datos parámetros generales
        this.macredService.GetParametroGeneralVal1( this.companiaObservable.id, 'COD_MONEDA_PRINCIPAL', true )
          .pipe(first())
          .subscribe((response) => {
            this._globalCodMonedaPrincipal = +response;
          });

        this.macredService.GetParametroGeneralVal1( this.companiaObservable.id, 'MESES_APLICABLES_EXTRAS', true )
          .pipe(first())
          .subscribe((response) => {
            this._globalMesesAplicaExtras = +response;
          });

        //#region CARGAR DATOS DE DATOS ANALISIS
        this.macredService
          .getTiposMonedas(this.companiaObservable.id)
          .pipe(first())
          .subscribe((response) => {
            this.listTiposMonedas = response;
          });
        this.macredService
          .getTiposFormaPagoAnalisis(this.companiaObservable.id)
          .pipe(first())
          .subscribe((response) => {
            this.listTipoFormaPagoAnalisis = response;
          });

        this.macredService
          .getTiposIngresoAnalisis(this.companiaObservable.id)
          .pipe(first())
          .subscribe((response) => {
            this.listTipoIngresoAnalisis = response;
          });

        this.macredService
          .getModelosAnalisis(false)
          .pipe(first())
          .subscribe((response) => {
            this.listModelosAnalisis = response;
          });

        this.macredService
          .getNivelesCapacidadPago(false)
          .pipe(first())
          .subscribe((response) => {
            this.listNivelesCapacidadpago = response;
          });

        this.macredService
          .getTiposGenerador(this.companiaObservable.id, false)
          .pipe(first())
          .subscribe((response) => {
            this.listTiposGeneradores = response;
          });
        //#endregion

        //#region carga datos ingresos
        this.macredService
          .getTiposIngresos(this.companiaObservable.id, false)
          .pipe(first())
          .subscribe((response) => {
            this.listTiposIngresos = response;
          });

        this.macredService
          .getTiposDeducciones(this.companiaObservable.id, false)
          .pipe(first())
          .subscribe((response) => {
            this.listTiposDeducciones = response;
          });

        this.macredService
          .getMatrizAceptacionIngreso(this.companiaObservable.id, false)
          .pipe(first())
          .subscribe((response) => {
            this.listMatrizAceptacionIngreso = response;
          });

        //#endregion

        this.srvDatosAnalisisService.InicializarVariablesGenerales();
      });
  }

  ngOnDestroy(): void {
   this.srvDatosAnalisisService._analisisCapacidadpago = undefined;
   this.srvDatosAnalisisService._personaAnalisis = undefined;
  }

  SubmitPerson(): void {
    this.alertService.clear();
    this.submittedPersonForm = true;

    if (this.formPersona.invalid) return;

    let identificacionPersona =
      this.formPersona.controls['identificacion'].value;

    if (this.srvDatosAnalisisService._analisisCapacidadpago) {
      
      this.dialogo.open(DialogoConfirmacionComponent, {
          data: 'Existe un análisis en proceso, seguro que desea continuar ?',
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {
          
          if (confirmado) {
            this.listSubMenu = [];
            this.limpiarTabs();

            this.srvDatosAnalisisService._analisisCapacidadpago = null;
            this._per = null;
            this._cre = null;
            this.menuItem = null;

            // this.cargaInformacionPersona(identificacionPersona);
            // this._DatosAnalisisComponent.inicializaFormDatosAnalisis();

            // this.muestraTabs = true;
          
          } else { return; }

        });
    } else {
      // this.cargaInformacionPersona(identificacionPersona);
      // this._DatosAnalisisComponent.inicializaFormDatosAnalisis();
    }
  }

  // cargaInformacionPersona(pidentPersona: string): void {
    
  //   // this.macredService.getPersonaMacred(pidentPersona, this.companiaObservable.id)
  //   //   .pipe(first())
  //   //   .subscribe(
  //   //     (response) => {
  //   //       if (response) {

  //   //         this._personaMacred = response;

  //   //         this.inicializaFormPersonaAnalisis();


  //           this.habilitarItemSubMenu(new ModuleSubMenu( 1, 'Datos de Análisis'));

  //           // this.selectModule(new ModuleSubMenu( 1, 'Datos de Análisis'));

  //           // this.habilitarItemSubMenu(new Module( 1,
  //           //                                       'Datos de Análisis',
  //           //                                       'Datos de Análisis',
  //           //                                       'Datos de Análisis',
  //           //                                       'A',
  //           //                                       '.png',
  //           //                                       '.ico',
  //           //                                       'http'));

  //           // this.selectModule(new Module( 1,
  //           //                               'Datos de Análisis',
  //           //                               'Datos de Análisis',
  //           //                               'Datos de Análisis',
  //           //                               'A',
  //           //                               '.png',
  //           //                               '.ico',
  //           //                               'http'));

  //     //     } else {
  //     //       this.alertService.info('No se encontraron registros.');
  //     //     }
  //     //   },
  //     //   (error) => {
  //     //     let message: string = 'Problemas de conexión: ' + error;
  //     //     this.alertService.error(message);
  //     //   }
  //     // );
  // }

  // inicializaFormPersonaAnalisis(): void {
  //   this.formPersona = this.formBuilder.group({
  //     id: [this._personaMacred.id, Validators.required],
  //     nombre: [this._personaMacred.nombre, Validators.required],
  //     primerApellido: [this._personaMacred.primerApellido, Validators.required],
  //     segundoApellido: [
  //       this._personaMacred.segundoApellido,
  //       Validators.required,
  //     ],
  //     identificacion: [this._personaMacred.identificacion, Validators.required],
  //   });
  // }

  //#region TABS

  addListMenu(modItem: Module): void {
    this.listSubMenu.push(modItem);
    // this.listSubMenu.push(new Module(2,'Flujo de Caja','Flujo de Caja','Flujo de Caja','I','.png','.ico','http'));
    // this.listSubMenu.push(new Module(3,'Probability of Default','Probability of Default','Probability of Default','I','.png','.ico','http'));
    // this.listSubMenu.push(new Module(4,'Scoring Crediticio','Scoring Crediticio','Scoring Crediticio','I','.png','.ico','http'));
    // this.listSubMenu.push(new Module(5,'Ingresos','Ingresos','Ingresos','I','.png','.ico','http'));
    // this.listSubMenu.push(new Module(6,'Obligaciones Supervisadas','Obligaciones Supervisadas','Obligaciones Supervisadas','I','.png','.ico','http'));
    // this.listSubMenu.push(new Module(7,'O. No Supervisadas','O. No Supervisadas','O. No Supervisadas','I','.png','.ico','http'));
    // this.listSubMenu.push(new Module(8,'LVT','LVT','LVT','I','.png','.ico','http'));
    // this.listSubMenu.push(new Module(9,'Escenarios','Escenarios','Escenarios','I','.png','.ico','http'));
    // this.listSubMenu.push(new Module(10,'Escenarios FCL','Escenarios FCL','Escenarios FCL','I','.png','.ico','http'));
  }

  habilitaTab(mod: ModuleSubMenu) : void {

    switch (mod.id) {
      case 1:
        this.datosAnalisis = true;
        break;

      case 2:
        this.flujoCaja = true;
        break;

      case 3:
        this.pd = true;
        break;

      case 4:
        this.scoring = true;
        break;

      case 5:
        this.ingresos = true;
        break;

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

  limpiarTabs(): void {
    this.datosAnalisis = false;
    this.flujoCaja = false;
    this.pd = false;
    this.scoring = false;
    this.ingresos = false;
    this.obligacionesSupervisadas = false;
    this.oNoSupervisadas = false;
    this.lvt = false;
    this.escenarios = false;
    this.escenariosFcl = false;
  }

  // habilitarItemSubMenu(mod: Module): void {
  //   var modTemp: Module = mod;

  //   if (this.listSubMenu.find((b) => b.id == mod.id)) {
  //     this.listSubMenu.splice(
  //       this.listSubMenu.findIndex((b) => b.id == mod.id),
  //       1
  //     );
  //   }
  //   this.listSubMenu.push(modTemp);
  // }
  // selectModule(mod: Module) {
  //   this.limpiarTabs();

  //   if(this.menuItem && mod.id == this.menuItem.id) {
  //       this.menuItem = null;
  //       return;
  //   }

  //   this.menuItem = this.listSubMenu.find((x) => x.id === mod.id);
  //   this.habilitaTab(this.menuItem);
  // }

  habilitarItemSubMenu(pmodSubMenu: ModuleSubMenu): void {

    this.menuItem = pmodSubMenu;
    this.listSubMenu.push(this.menuItem);

    this.habilitaTab(this.menuItem);
  }
  selectModule(pmodSubMenu: ModuleSubMenu) {

    this.menuItem = this.listSubMenu.find((x) => x.id === pmodSubMenu.id);
    this.habilitaTab(this.menuItem);
  }

  //#endregion

  //#region DATOS GENERALES ANALISIS

  habilitaFormularioIngreso(): void {
    this.habilitarItemSubMenu(
      new Module(
        5,
        'Ingresos',
        'Ingresos',
        'Ingresos',
        'A',
        '.png',
        '.ico',
        'http'
      )
    );
    // this.selectModule(
    //   new Module(
    //     5,
    //     'Ingresos',
    //     'Ingresos',
    //     'Ingresos',
    //     'I',
    //     '.png',
    //     '.ico',
    //     'http'
    //   )
    // );
  }

  //#endregion

  //#region INGRESOS

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

  //#endregion

  //#region PD

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

  //#endregion

  //#region FCL

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

  //#endregion

  //#region ESCENARIOS FCL

  //#endregion


  // consulta de listas privadas

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
  private getTiposAsociados() : void {
    this.macredService.getTiposAsociadosCompania(this.userObservable.empresa)
    .pipe(first())
    .subscribe(response => {

        if (response && response.length > 0) this.listTiposAsociados = response;
        
    }, error => { this.alertService.error('Problemas al consultar los tipos de asociados. ' + error); });
  }
  private getCategoriasCreditos() : void {
    this.macredService.getCategoriasCreditosCompania(this.userObservable.empresa)
    .pipe(first())
    .subscribe(response => {

        if (response && response.length > 0) this.listCategoriasCreditos = response;
        
    }, error => { this.alertService.error('Problemas al consultar las categorias de créditos. ' + error); });
  }
  private getEstadosCiviles() : void {
    this.macredService.getEstadosCiviles()
    .pipe(first())
    .subscribe(response => {

        if (response && response.length > 0) this.listEstadosCiviles = response;
        
    }, error => { this.alertService.error('Problemas al consultar los estados civiles.' + error); });
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
}
