import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { User, Module, Compania } from '@app/_models';

import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';

// ## -- servicio macred http -- ## //
import { MacredService } from '@app/_services/macred.service';
// ## -- objetos macred analisis de capacidad de pago -- ## //
import {
  MacAnalisisCapacidadPago,
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
  ScoringFlujoCajaLibre,
} from '@app/_models/Macred';
import { DatosAnalisisComponent } from './datos-analisis/datos-analisis.component';
import { SrvDatosAnalisisService } from './servicios/srv-datos-analisis.service';
// ## -- ******************************************** -- ## //

declare var $: any;

@Component({
    templateUrl: 'HTML_Asociados.html',
    styleUrls: [
        '../../../../assets/scss/app.scss',
        '../../../../assets/scss/macred/app.scss',
    ],
    standalone: false
})
export class AsociadosComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @ViewChild(MatSidenav) sidenav2: MatSidenav;

  //#region COMPONENTES HIJOS -- PARA OBTENER LOS METODOS DEL MISMO Y EVITAR DUPLICIDAD

  @ViewChild(DatosAnalisisComponent, { static: false })
  _DatosAnalisisComponent: DatosAnalisisComponent;

  //#endregion

  private nombrePantalla: string = 'calificacion-asociados.html';
  // listScreenAccessUser    : ScreenAccessUser[];

  _globalCodMonedaPrincipal: number;
  _globalMesesAplicaExtras: number;
  _personaMacred: MacPersona = null;
  _analisisCapacidadpago: MacAnalisisCapacidadPago;

  // ## -- objetos suscritos -- ## //
  private userObservable: User;
  private moduleObservable: Module;
  private companiaObservable: Compania;
  // ## -- ----------------- -- ## //

  // ## -- submit formularios -- ## //
  submittedPersonForm: boolean = false;
  // ## -- ------------------ -- ## //

  muestraTabs: boolean = false;
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

  public listSubMenu: Module[] = [];
  public menuItem: Module = null;

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
  formAnalisis: UntypedFormGroup;
  // ## -- *********** -- ## //

  public today: Date;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private macredService: MacredService,
    private accountService: AccountService,
    private alertService: AlertService,
    private router: Router,
    private dialogo: MatDialog,
    public srvDatosAnalisisService: SrvDatosAnalisisService
  ) {
    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.companiaObservable = this.accountService.businessValue;
    this.today = new Date();
  }

  get f() {
    return this.formPersona.controls;
  }
  ngOnInit() {
    this.formPersona = this.formBuilder.group({
      id: [null],
      nombre: [null],
      primerApellido: [null],
      segundoApellido: [null],
      identificacion: [null, Validators.required],
    });
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

    this.accountService
      .validateAccessUser(
        this.userObservable.id,
        this.moduleObservable.id,
        this.nombrePantalla,
        this.companiaObservable.id
      )
      .pipe(first())
      .subscribe((response) => {
        // ## -->> redirecciona NO ACCESO
        if (!response.exito)
          this.router.navigate([this.moduleObservable.indexHTTP]);

        // carga datos parámetros generales
        this.macredService
          .GetParametroGeneralVal1(
            this.companiaObservable.id,
            'COD_MONEDA_PRINCIPAL',
            true
          )
          .pipe(first())
          .subscribe((response) => {
            this._globalCodMonedaPrincipal = +response;
          });

        this.macredService
          .GetParametroGeneralVal1(
            this.companiaObservable.id,
            'MESES_APLICABLES_EXTRAS',
            true
          )
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
          .getModelosAnalisis(this.companiaObservable.id, false)
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
      this.dialogo
        .open(DialogoConfirmacionComponent, {
          data: 'Existe un análisis en proceso, seguro que desea continuar ?',
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {
          if (confirmado) {
            this.listSubMenu = [];
            this.limpiarTabs();

            this.srvDatosAnalisisService._analisisCapacidadpago = null;
            this._personaMacred = null;
            this.menuItem = null;

            this.cargaInformacionPersona(identificacionPersona);
            // this._DatosAnalisisComponent.inicializaFormDatosAnalisis();

            this.muestraTabs = true;
          } else {
            return;
          }
        });
    } else {
      this.cargaInformacionPersona(identificacionPersona);
      // this._DatosAnalisisComponent.inicializaFormDatosAnalisis();
    }
  }

  cargaInformacionPersona(identificacionPersona: string): void {
    this.macredService
      .getPersonaMacred(identificacionPersona, this.companiaObservable.id)
      .pipe(first())
      .subscribe(
        (response) => {
          if (response) {
            this._personaMacred = response;

            this.inicializaFormPersonaAnalisis();

            this.habilitarItemSubMenu(
              new Module(
                1,
                'Datos de Análisis',
                'Datos de Análisis',
                'Datos de Análisis',
                'A',
                '.png',
                '.ico',
                'http'
              )
            );
            this.selectModule(
              new Module(
                1,
                'Datos de Análisis',
                'Datos de Análisis',
                'Datos de Análisis',
                'A',
                '.png',
                '.ico',
                'http'
              )
            );
          } else {
            this.alertService.info('No se encontraron registros.');
          }
        },
        (error) => {
          let message: string = 'Problemas de conexión: ' + error;
          this.alertService.error(message);
        }
      );
  }

  inicializaFormPersonaAnalisis(): void {
    this.formPersona = this.formBuilder.group({
      id: [this._personaMacred.id, Validators.required],
      nombre: [this._personaMacred.nombre, Validators.required],
      primerApellido: [this._personaMacred.primerApellido, Validators.required],
      segundoApellido: [
        this._personaMacred.segundoApellido,
        Validators.required,
      ],
      identificacion: [this._personaMacred.identificacion, Validators.required],
    });
  }

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

  habilitaTab(mod: Module) {
    this.datosAnalisis = false;
    this.ingresos = false;

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
        mod.indexHTTP = '/';
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

  habilitarItemSubMenu(mod: Module): void {
    var modTemp: Module = mod;

    if (this.listSubMenu.find((b) => b.id == mod.id)) {
      this.listSubMenu.splice(
        this.listSubMenu.findIndex((b) => b.id == mod.id),
        1
      );
    }
    this.listSubMenu.push(modTemp);
  }

  selectModule(mod: Module) {
    this.limpiarTabs();

    // if(this.menuItem && mod.id == this.menuItem.id) {
    //     this.menuItem = null;
    //     return;
    // }

    this.menuItem = this.listSubMenu.find((x) => x.id === mod.id);
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
    this.selectModule(
      new Module(
        5,
        'Ingresos',
        'Ingresos',
        'Ingresos',
        'I',
        '.png',
        '.ico',
        'http'
      )
    );
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
    this.selectModule(
      new Module(
        3,
        'PD',
        'Probability Of Default',
        'Probability Of Default',
        'I',
        '.png',
        '.ico',
        'http'
      )
    );
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
    this.selectModule(
      new Module(
        2,
        'FCL',
        'Flujo de Caja Libre',
        'Flujo de Caja Libre',
        'I',
        '.png',
        '.ico',
        'http'
      )
    );
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
    this.selectModule(
      new Module(
        10,
        'EscenariosFCL',
        'Escenarios FCL',
        'Escenarios FCL',
        'I',
        '.png',
        '.ico',
        'http'
      )
    );
  }

  //#endregion

  //#region ESCENARIOS FCL

  //#endregion
}
