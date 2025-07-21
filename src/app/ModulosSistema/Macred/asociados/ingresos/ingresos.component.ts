import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';
import { Compania, Module, User } from '@app/_models';
import {
  MacDeduccionesAnalisis,
  MacExtrasAplicables,
  MacIngresosXAnalisis,
  MacMatrizAceptacionIngreso,
  MacPersona,
  MacTipoDeducciones,
  MacTipoIngreso,
  MacTiposMoneda,
} from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { first } from 'rxjs/operators';
import { SrvDatosAnalisisService } from '../servicios/srv-datos-analisis.service';

declare var $: any;

@Component({
    selector: 'app-ingresos',
    templateUrl: './ingresos.component.html',
    styleUrls: [
        '../../../../../assets/scss/app.scss',
        '../../../../../assets/scss/macred/app.scss',
    ],
    standalone: false
})
export class IngresosComponent implements OnInit {
  @Input() _personaAnalisis: MacPersona;
  @Input() _globalCodMonedaPrincipal: number;
  @Input() listTiposIngresos: MacTipoIngreso[];
  @Input() listTiposDeducciones: MacTipoDeducciones[];
  @Input() listMatrizAceptacionIngreso: MacMatrizAceptacionIngreso[];
  @Input() listTiposMonedas: MacTiposMoneda[];
  @Input() habilitaBtnPD: boolean = false;

  @Output() onHabilitarPD = new EventEmitter();

  private userObservable: User;
  private companiaObservable: Compania;
  private moduleObservable: Module;
  public today: Date;

  listIngresosAnalisis: MacIngresosXAnalisis[];
  listDeduccionesAnalisis: MacDeduccionesAnalisis[];
  listTotalDeduccionesAnalisis: MacDeduccionesAnalisis[];
  listTempExtrasAplicables: MacExtrasAplicables[];
  listExtrasAplicables: MacExtrasAplicables[];

  _ingresoAnalisisSeleccionado: MacIngresosXAnalisis;
  _deduccion: MacDeduccionesAnalisis;
  _extrasAplicables: MacExtrasAplicables;

  habilitaBtnRegistrarIngreso: boolean = false;
  habilitaBtnActualizaIngreso: boolean = false;
  habilitaIcoOpenModalExtras: boolean = false;
  habilitaIcoOpenModalDeducciones: boolean = false;
  habilitarBtnActualizaDeduccion: boolean = false;
  habilitarBtnRegistraDeduccion: boolean = false;
  habilitarBtnSubmitExtras: boolean = false;
  habilitarBtnFinalizarExtras: boolean = false;
  habilitarBtnEliminarExtras: boolean = false;
  habilitarBtnFinalizarDeducciones: boolean = false;

  formIngresos: UntypedFormGroup;
  formExtras: UntypedFormGroup;
  formDeducciones: UntypedFormGroup;
  submittedIngresosForm: boolean = false;
  submittedExtrasForm: boolean = false;
  submittedDeduccionesForm: boolean = false;
  get i() {
    return this.formIngresos.controls;
  }
  get e() {
    return this.formExtras.controls;
  }
  get d() {
    return this.formDeducciones.controls;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private macredService: MacredService,
    private accountService: AccountService,
    private alertService: AlertService,
    private dialogo: MatDialog,
    public srvDatosAnalisisService: SrvDatosAnalisisService
  ) {
    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.companiaObservable = this.accountService.businessValue;
    this.today = new Date();
  }

  ngOnInit(): void {
    this.inicializarFormulariosInit();
    this.inicializaFormIngreso();
  }

  private inicializarFormulariosInit() {
    this.formExtras = this.formBuilder.group({
      montoExtra: [null],
      desviacionEstandar: [null],
      coeficienteVarianza: [null],
      porcentajeExtrasAplicable: [null],
      promedioExtrasAplicables: [null],
      // ,
      // mesesExtrasAplicables       : [null]
    });
    this.formDeducciones = this.formBuilder.group({
      codigoTipoDeduccion: [null],
      codigoTipoMoneda: [null],
      tipoCambio: [null],
      montoDeduccion: [null],
    });
    this.formIngresos = this.formBuilder.group({
      codigoTipoIngreso: [null],
      montoBruto: [null],
      montoExtras: [null],
      cargasSociales: [null],
      impuestoRenta: [null],
      montoNeto: [null],
      montoDeducciones: [null],

      totalMontoAnalisis: [null],
      totalIngresoBruto: [null],
      totalIngresoNeto: [null],
      totalCargaImpuestos: [null],
      totalExtrasAplicables: [null],
      totalDeducciones: [null],
    });
    this.macredService
      .getIngresosAnalisis(
        this.companiaObservable.id,
        this.srvDatosAnalisisService._analisisCapacidadpago.codigoAnalisis
      )
      .pipe(first())
      .subscribe((response) => {
        if (!this.listIngresosAnalisis) this.listIngresosAnalisis = [];
        this.listIngresosAnalisis = response;
      });
  }

  inicializaFormDeducciones(): void {
    if (this._deduccion) {
      this.habilitarBtnActualizaDeduccion = true;
      this.habilitarBtnRegistraDeduccion = false;

      this.formDeducciones = this.formBuilder.group({
        codigoTipoDeduccion: [
          this.listTiposDeducciones.find(
            (x) => x.id === this._deduccion.codigoTipoDeduccion
          ),
          Validators.required,
        ],
        codigoTipoMoneda: [
          this.listTiposMonedas.find(
            (x) => x.id === this._deduccion.codigoMoneda
          ),
          Validators.required,
        ],
        tipoCambio: [this._deduccion.tipoCambio, Validators.required],
        montoDeduccion: [this._deduccion.monto, Validators.required],
      });
    } else {
      this.habilitarBtnActualizaDeduccion = false;
      this.habilitarBtnRegistraDeduccion = true;

      this.formDeducciones = this.formBuilder.group({
        codigoTipoDeduccion: [null, Validators.required],
        codigoTipoMoneda: [
          this.listTiposMonedas.find(
            (x) => x.id === this._globalCodMonedaPrincipal
          ),
          Validators.required,
        ],
        tipoCambio: [1, Validators.required],
        montoDeduccion: [null, Validators.required],
      });
    }
  }

  inicializaFormIngreso(): void {
    if (this._ingresoAnalisisSeleccionado) {
      this.habilitaBtnActualizaIngreso = true;
      this.habilitaBtnRegistrarIngreso = false;
      this.habilitaBtnPD = true;

      this.habilitaIcoOpenModalExtras = true;
      this.habilitaIcoOpenModalDeducciones = true;

      this.formIngresos = this.formBuilder.group({
        codigoTipoIngreso: [
          this.listTiposIngresos.find(
            (x) => x.id === this._ingresoAnalisisSeleccionado.codigoTipoIngreso
          ),
          Validators.required,
        ],
        montoBruto: [
          this._ingresoAnalisisSeleccionado.montoBruto,
          Validators.required,
        ],
        montoExtras: this._ingresoAnalisisSeleccionado.montoExtras,
        cargasSociales: this._ingresoAnalisisSeleccionado.cargasSociales,
        impuestoRenta: this._ingresoAnalisisSeleccionado.impuestoRenta,
        montoNeto: [
          this._ingresoAnalisisSeleccionado.montoNeto,
          Validators.required,
        ],
        montoDeducciones: this._ingresoAnalisisSeleccionado.montoDeducciones,

        totalMontoAnalisis:
          this.srvDatosAnalisisService._analisisCapacidadpago
            .totalMontoAnalisis,
        totalIngresoBruto:
          this.srvDatosAnalisisService._analisisCapacidadpago.totalIngresoBruto,
        totalIngresoNeto:
          this.srvDatosAnalisisService._analisisCapacidadpago.totalIngresoNeto,
        totalCargaImpuestos:
          this.srvDatosAnalisisService._analisisCapacidadpago
            .totalCargaImpuestos,
        totalExtrasAplicables:
          this.srvDatosAnalisisService._analisisCapacidadpago
            .totalExtrasAplicables,
        totalDeducciones:
          this.srvDatosAnalisisService._analisisCapacidadpago.totalDeducciones,
      });
    } else {
      this.habilitaBtnActualizaIngreso = false;
      this.habilitaBtnRegistrarIngreso = true;
      this.habilitaBtnPD = false;

      this.habilitaIcoOpenModalExtras = false;
      this.habilitaIcoOpenModalDeducciones = false;

      this.formIngresos = this.formBuilder.group({
        codigoTipoIngreso: [null, Validators.required],
        // codigoTipoIngreso       : [null, Validators.required],
        montoBruto: [0, Validators.required],
        // montoBruto              : [null, Validators.required],
        montoExtras: 0,
        cargasSociales: 0,
        impuestoRenta: 0,
        montoNeto: [0, Validators.required],
        // montoNeto               : [null, Validators.required],
        montoDeducciones: 0,

        totalMontoAnalisis: 0,
        totalIngresoBruto: 0,
        totalIngresoNeto: 0,
        totalCargaImpuestos: 0,
        totalExtrasAplicables: 0,
        totalDeducciones: 0,
      });
    }
  }

  CerrarExtrasModal(): void {
    $('#extrasModal').modal('hide');
  }

  CerrarDeduccionesModal(): void {
    $('#deduccionesModal').modal('hide');
  }

  RegistrarIngresoAnalisis(): void {
    this.alertService.clear();

    this.submittedIngresosForm = true;

    if (this.formIngresos.invalid) return;

    if (this.formIngresos.controls['montoBruto'].value === 0) {
      this.formIngresos.controls['montoBruto'].setErrors({ error: true });
      return;
    }

    var ingreso: MacIngresosXAnalisis = this.createIngresoObjectForm();
    ingreso.adicionadoPor = this.userObservable.identificacion;
    ingreso.fechaAdicion = this.today;

    this.macredService
      .postIngresosAnalisis(ingreso)
      .pipe(first())
      .subscribe((response) => {
        if (response) {
          if (!this.listIngresosAnalisis) this.listIngresosAnalisis = [];

          this.listIngresosAnalisis.push(response);

          this.totalizarMontosIngreso();

          this._ingresoAnalisisSeleccionado = null;
          this.inicializaFormIngreso();

          this.srvDatosAnalisisService
          .procesoActualizarAnalisisCapacidadPago(this.srvDatosAnalisisService._analisisCapacidadpago)
          .then((response: any) => {
            if (response) {
              this.srvDatosAnalisisService._analisisCapacidadpago = response;
              this.alertService.success(
                `Análisis ${this.srvDatosAnalisisService._analisisCapacidadpago.codigoAnalisis} actualizado con éxito.`
              );
            } else {
              this.alertService.error(`No fue posible actualizar el análisis.`);
            }
          })
          .catch((error) => {
            this.alertService.error(
              `Problemas al establecer la conexión con el servidor. Detalle: ${error}`
            );
          });

          this.alertService.success(`Registro de Ingreso realizado con éxito.`);
        } else {
          this.alertService.error(
            `Ocurrió un error al registrar el ingreso para el análisis seleccionado.`
          );
        }
      });
  }

  ActualizaFormIngresos(): void {
    this.alertService.clear();

    this.submittedIngresosForm = true;

    if (this.formIngresos.invalid) return;

    var ingreso: MacIngresosXAnalisis = this.createIngresoObjectForm();
    ingreso.id = this._ingresoAnalisisSeleccionado.id;
    ingreso.modificadoPor = this.userObservable.identificacion;
    ingreso.fechaModificacion = this.today;

    this.macredService
      .putIngresosAnalisis(ingreso)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.listIngresosAnalisis.splice(
            this.listIngresosAnalisis.findIndex((m) => m.id == ingreso.id),
            1
          );
          this.listIngresosAnalisis.push(ingreso);

          this.totalizarMontosIngreso();

          this._ingresoAnalisisSeleccionado = null;
          this.inicializaFormIngreso();

          this.srvDatosAnalisisService
          .procesoActualizarAnalisisCapacidadPago(this.srvDatosAnalisisService._analisisCapacidadpago)
          .then((response: any) => {
            if (response) {
              this.srvDatosAnalisisService._analisisCapacidadpago = response;
            } else {
              this.alertService.error(`No fue posible actualizar el análisis.`);
            }
          })
          .catch((error) => {
            this.alertService.error(
              `Problemas al establecer la conexión con el servidor. Detalle: ${error}`
            );
          });

          this.alertService.success(
            response.responseMesagge + '. ID Ingreso Actualizado: ' + ingreso.id
          );
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  openExtrasModal(): void {
    this.inicializaFormExtrasAplicables();

    $('#extrasModal').modal({ backdrop: 'static', keyboard: false }, 'show');
  }

  openDeduccionesModal(): void {
    this.inicializaFormDeducciones();

    $('#deduccionesModal').modal(
      { backdrop: 'static', keyboard: false },
      'show'
    );
  }

  selectDeduccionAnalisis(deduccion: MacDeduccionesAnalisis): void {
    // limpia formulario
    if (this._deduccion && this._deduccion.id === deduccion.id) {
      this._deduccion = null;
      this.inicializaFormDeducciones();
      return;
    }
    this._deduccion = deduccion;
    this.inicializaFormDeducciones();
  }
  selectIngresoAnalisis(ingreso: MacIngresosXAnalisis): void {
    // limpia formulario
    if (
      this._ingresoAnalisisSeleccionado &&
      this._ingresoAnalisisSeleccionado.id === ingreso.id
    ) {
      this._ingresoAnalisisSeleccionado = null;
      this._extrasAplicables = null;
      this._deduccion = null;
      this.listDeduccionesAnalisis = null;

      this.inicializaFormIngreso();
      return;
    }

    this._ingresoAnalisisSeleccionado = ingreso;
    this.inicializaFormIngreso();

    this.obtenerExtrasAplicablesAnalisis();
    this.obtenerDeduccionesAnalisis();
  }

  /*
   * OBTENER DEDUCCIONES
   */
  obtenerDeduccionesAnalisis(): void {
    this.listTotalDeduccionesAnalisis = [];
    this.listDeduccionesAnalisis = [];

    this.macredService
      .getDeduccionesAnalisis(
        this.companiaObservable.id,
        this.srvDatosAnalisisService._analisisCapacidadpago.codigoAnalisis
      )
      .pipe(first())
      .subscribe((response) => {
        this.listTotalDeduccionesAnalisis = response;

        this.listTotalDeduccionesAnalisis.forEach((element) => {
          if (element.codigoIngreso === this._ingresoAnalisisSeleccionado.id)
            this.listDeduccionesAnalisis.push(element);
        });

        this.totalizarDeducciones();
      });
  }
  obtenerExtrasAplicablesAnalisis(): void {
    this.macredService
      .getExtrasAnalisisIngreso(
        this.companiaObservable.id,
        this.srvDatosAnalisisService._analisisCapacidadpago.codigoAnalisis,
        this._ingresoAnalisisSeleccionado.id
      )
      .pipe(first())
      .subscribe((response) => {
        this._extrasAplicables = response;
        this.inicializaFormExtrasAplicables();
      });
  }

  // setFormExtrasIngresosAnalisis(clearExtras : boolean = false) : void {
  //     if (clearExtras) {
  //         this.formIngresos.patchValue({ montoExtras  : 0 });
  //     } else {
  //         this.formIngresos.patchValue({ montoExtras  : this._extrasAplicables.montoExtras });
  //     }
  // }

  deleteIngreso(ingreso: MacIngresosXAnalisis): void {
    this.alertService.clear();

    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: `Seguro que desea eliminar el ingreso seleccionado ?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          // elimina registros de dependencia del ingreso: deducciones y extras aplicables
          if (this.listDeduccionesAnalisis) {
            this.listDeduccionesAnalisis.forEach((element) => {
              if (element.codigoIngreso == ingreso.id)
                this.eliminarRegistroDeduccion(element.id);
            });
          }
          if (
            this._extrasAplicables &&
            this._extrasAplicables.codigoIngreso == ingreso.id
          ) {
            this.eliminarRegistroExtra(this._extrasAplicables.id);
          }
          // ***

          this.macredService
            .deleteIngreso(ingreso.id)
            .pipe(first())
            .subscribe((response) => {
              if (response.exito) {
                this.listIngresosAnalisis.splice(
                  this.listIngresosAnalisis.findIndex(
                    (m) => m.id == ingreso.id
                  ),
                  1
                );

                if (this.listIngresosAnalisis.length === 0)
                  this.listIngresosAnalisis = null;

                this._ingresoAnalisisSeleccionado = null;
                this._deduccion = null;
                this._extrasAplicables = null;

                this.inicializaFormIngreso();

                this.alertService.success(response.responseMesagge);
              } else {
                this.alertService.error(response.responseMesagge);
              }
            });
        } else {
          return;
        }
      });
  }

  eliminarDeduccion(deduccion: MacDeduccionesAnalisis): void {
    this.alertService.clear();

    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: `Seguro que desea eliminar la deducción seleccionada ?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.macredService
            .deleteDeduccion(deduccion.id)
            .pipe(first())
            .subscribe((response) => {
              if (response.exito) {
                this.obtenerDeduccionesAnalisis();

                this.habilitarBtnFinalizarDeducciones = true;

                this._deduccion = null;
                this.inicializaFormDeducciones();

                this.alertService.success(response.responseMesagge);
              } else {
                this.alertService.error(response.responseMesagge);
              }
            });
        } else {
          return;
        }
      });
  }

  eliminarRegistroDeduccion(idDeduccion: number): void {
    this.macredService
      .deleteDeduccion(idDeduccion)
      .pipe(first())
      .subscribe((response) => {
        if (!response.exito) {
          this.alertService.error(response.responseMesagge);
          return;
        }
      });
  }
  // *** //

  totalizarDeducciones(): void {
    var totalDeducciones: number = 0;
    var totalDeduccionesIngreso: number = 0;

    this.formIngresos.patchValue({ montoDeducciones: 0 });
    this.formIngresos.patchValue({ totalDeducciones: 0 });

    if (this.listDeduccionesAnalisis)
      this.listDeduccionesAnalisis.forEach((element) => {
        totalDeduccionesIngreso += element.monto;
      });

    if (this.listTotalDeduccionesAnalisis)
      this.listTotalDeduccionesAnalisis.forEach((element) => {
        totalDeducciones += element.monto;
      });

    this.formIngresos.patchValue({ montoDeducciones: totalDeduccionesIngreso });
    this.formIngresos.patchValue({ totalDeducciones: totalDeducciones });

    // this.habilitarBtnFinalizarDeducciones = false;
  }

  finalizarFormularioDeducciones(): void {
    var totalDeducciones: number = 0;
    var totalDeduccionesIngreso: number = 0;

    this.formIngresos.patchValue({ montoDeducciones: 0 });
    this.formIngresos.patchValue({ totalDeducciones: 0 });

    if (this.listDeduccionesAnalisis)
      this.listDeduccionesAnalisis.forEach((element) => {
        totalDeduccionesIngreso += element.monto;
      });

    if (this.listTotalDeduccionesAnalisis)
      this.listTotalDeduccionesAnalisis.forEach((element) => {
        totalDeducciones += element.monto;
      });

    this.formIngresos.patchValue({ montoDeducciones: totalDeduccionesIngreso });
    this.formIngresos.patchValue({ totalDeducciones: totalDeducciones });

    this.habilitarBtnFinalizarDeducciones = false;

    this.ActualizaFormIngresos();

    $('#deduccionesModal').modal('hide');
  }

  SubmitFormDeducciones(): void {
    this.alertService.clear();
    this.submittedDeduccionesForm = true;

    if (this.formDeducciones.invalid) return;

    var deduccion: MacDeduccionesAnalisis = this.createDeduccionObjectForm();
    deduccion.adicionadoPor = this.userObservable.identificacion;
    deduccion.fechaAdicion = this.today;

    this.macredService
      .postDeduccionesAnalisis(deduccion)
      .pipe(first())
      .subscribe((response) => {
        if (response) {
          this.obtenerDeduccionesAnalisis();

          this.inicializaFormDeducciones();

          // if (!this.listDeduccionesAnalisis) this.listDeduccionesAnalisis = [];

          // this.listDeduccionesAnalisis.push(response);

          this.habilitarBtnFinalizarDeducciones = true;

          this.alertService.success(
            `Registro de Deducciones realizado con éxito.`
          );
        } else {
          this.alertService.error(
            `Problemas al registrar las Deducciones del Análisis de Capacidad de Pago.`
          );
        }
      });
  }

  inicializaFormExtrasAplicables(): void {
    this.habilitarBtnSubmitExtras = true;

    if (this._extrasAplicables) {
      this.habilitarBtnEliminarExtras = true;

      this.formExtras = this.formBuilder.group({
        montoExtra: [this._extrasAplicables.montoExtras, Validators.required],
        desviacionEstandar: this._extrasAplicables.desviacionEstandar,
        coeficienteVarianza: this._extrasAplicables.coeficienteVarianza,
        porcentajeExtrasAplicable:
          this._extrasAplicables.porcentajeExtrasAplicables,
        promedioExtrasAplicables:
          this._extrasAplicables.promedioExtrasAplicables,
        // ,
        // mesesExtrasAplicables       : this._globalMesesAplicaExtras
      });
    } else {
      this.habilitarBtnEliminarExtras = false;

      this.formExtras = this.formBuilder.group({
        montoExtra: [0, Validators.required],
        desviacionEstandar: 0,
        coeficienteVarianza: 0,
        porcentajeExtrasAplicable: 0,
        promedioExtrasAplicables: 0,
        // ,
        // mesesExtrasAplicables       : this._globalMesesAplicaExtras
      });
    }
  }

  FinalizarRegistroExtras(): void {
    this.alertService.clear();
    var extrasAplicables: MacExtrasAplicables = new MacExtrasAplicables();

    var sumatoriaMontoExtras: number = 0.0;

    // registro automático meses aplicables
    // if (this.listExtrasAplicables.length > 1) {
    //     if (this.listExtrasAplicables.length < this._globalMesesAplicaExtras ) {
    //         var iteraciones = this._globalMesesAplicaExtras - this.listExtrasAplicables.length;
    //         for ( let index = 0; index < iteraciones ; index++ ) { this.SubmitFormExtras(true); }
    //     }
    // }

    this.listTempExtrasAplicables.forEach((extra) => {
      sumatoriaMontoExtras += extra.montoExtras;
    });

    extrasAplicables =
      this.listExtrasAplicables[this.listExtrasAplicables.length - 1];
    extrasAplicables.montoExtras = sumatoriaMontoExtras;

    this.macredService
      .postExtrasAplicables(extrasAplicables)
      .pipe(first())
      .subscribe((response) => {
        if (response) {
          this.listExtrasAplicables = null;
          this.listTempExtrasAplicables = null;

          this.habilitarBtnFinalizarExtras = false;
          this.habilitarBtnSubmitExtras = false;

          this._extrasAplicables = response;
          this.inicializaFormExtrasAplicables();

          this.formIngresos.patchValue({
            montoExtras: this._extrasAplicables.porcentajeExtrasAplicables,
          });

          this.alertService.success(`Registro de Extras realizado con éxito..`);
        } else {
          let message: string =
            'Problemas al registrar el Análisis de Capacidad de Pago.';
          this.alertService.error(message);
        }
      });
  }

  SubmitFormExtras(): void {
    this.alertService.clear();
    this.submittedExtrasForm = true;

    var sumatoriaMontoExtras: number = 0.0;
    var potenciaSaldo: number = 0.0;
    var promedioExtras: number = 0.0;
    // var factorAceptacion        : number = 0    ;

    var cantidadRegistrosExtras: number = 0;

    if (this.formExtras.invalid) return;

    if (this.formExtras.controls['montoExtra'].value === 0) {
      this.formExtras.controls['montoExtra'].setErrors({ error: true });
      return;
    }

    if (this._extrasAplicables) {
      this.eliminarRegistroExtra(this._extrasAplicables.id);
      this.listTempExtrasAplicables = [];
      this.listExtrasAplicables = [];
      this._extrasAplicables = null;
      this.habilitarBtnEliminarExtras = false;
    }

    if (!this.listExtrasAplicables) this.listExtrasAplicables = [];

    if (!this.listTempExtrasAplicables) this.listTempExtrasAplicables = [];

    var extrasTempAplicables: MacExtrasAplicables = new MacExtrasAplicables();
    extrasTempAplicables.montoExtras =
      this.formExtras.controls['montoExtra'].value;

    this.listTempExtrasAplicables.push(extrasTempAplicables);
    cantidadRegistrosExtras = this.listTempExtrasAplicables.length;

    // sumatoria total extras
    this.listTempExtrasAplicables.forEach((extra) => {
      sumatoriaMontoExtras += extra.montoExtras;
    });

    if (cantidadRegistrosExtras == 1) {
      promedioExtras = sumatoriaMontoExtras;

      extrasTempAplicables.desviacionEstandar = 0;
      extrasTempAplicables.coeficienteVarianza = 0;

      extrasTempAplicables.promedioExtrasAplicables = sumatoriaMontoExtras;
      extrasTempAplicables.porcentajeExtrasAplicables = sumatoriaMontoExtras;
    } else {
      var temPromedioTotalExtrasPermitidas =
        sumatoriaMontoExtras / cantidadRegistrosExtras;

      promedioExtras = temPromedioTotalExtrasPermitidas;

      this.listTempExtrasAplicables.forEach((extra) => {
        potenciaSaldo += Math.pow(extra.montoExtras - promedioExtras, 2);
      });

      var tempDesviacionEstandar = Math.sqrt(
        potenciaSaldo / (cantidadRegistrosExtras - 1)
      );
      extrasTempAplicables.desviacionEstandar = tempDesviacionEstandar;

      var tempCoeficienteVarianza =
        extrasTempAplicables.desviacionEstandar / promedioExtras;
      extrasTempAplicables.coeficienteVarianza = tempCoeficienteVarianza * 100;

      var tempCoeficienteVarianzaPorcentual =
        extrasTempAplicables.coeficienteVarianza;

      tempCoeficienteVarianzaPorcentual =
        tempCoeficienteVarianzaPorcentual >= 1
          ? 1
          : tempCoeficienteVarianzaPorcentual;

      // this.listMatrizAceptacionIngreso.forEach(element => {
      //     if ( element.rangoDesviacion1   <= tempCoeficienteVarianzaPorcentual &&
      //         element.rangoDesviacion2    >= tempCoeficienteVarianzaPorcentual   ) factorAceptacion = element.factor ;
      // });

      extrasTempAplicables.promedioExtrasAplicables = promedioExtras;

      extrasTempAplicables.porcentajeExtrasAplicables =
        extrasTempAplicables.promedioExtrasAplicables *
        (1 - extrasTempAplicables.coeficienteVarianza / 100);
    }

    this.inicializaFormExtrasAplicables();

    var extrasAplicables: MacExtrasAplicables = new MacExtrasAplicables();
    extrasAplicables.codigoAnalisis =
    this.srvDatosAnalisisService._analisisCapacidadpago.codigoAnalisis;
    extrasAplicables.codigoCompania = this.companiaObservable.id;
    extrasAplicables.codigoIngreso = this._ingresoAnalisisSeleccionado.id;
    extrasAplicables.adicionadoPor = this.userObservable.identificacion;
    extrasAplicables.fechaAdicion = this.today;

    extrasAplicables.montoExtras = extrasTempAplicables.montoExtras;
    extrasAplicables.desviacionEstandar =
      extrasTempAplicables.desviacionEstandar;
    extrasAplicables.coeficienteVarianza =
      extrasTempAplicables.coeficienteVarianza;
    extrasAplicables.porcentajeExtrasAplicables =
      extrasTempAplicables.porcentajeExtrasAplicables;
    extrasAplicables.promedioExtrasAplicables =
      extrasTempAplicables.promedioExtrasAplicables;

    this.listExtrasAplicables.push(extrasAplicables);

    this.habilitarBtnFinalizarExtras = true;
  }

  deleteExtra(): void {
    this.alertService.clear();

    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: `Seguro que desea eliminar el registro de extras ?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.macredService
            .deleteExtra(this._extrasAplicables.id)
            .pipe(first())
            .subscribe((response) => {
              if (response.exito) {
                this._extrasAplicables = null;

                this.listExtrasAplicables = null;
                this.listTempExtrasAplicables = null;
                this.habilitarBtnFinalizarExtras = false;

                this.formIngresos.patchValue({ montoExtras: 0 });

                $('#extrasModal').modal('hide');

                this.alertService.success(response.responseMesagge);
              } else {
                this.alertService.error(response.responseMesagge);
              }
            });
        } else {
          return;
        }
      });
  }

  // elimina registros de forma interna para el ingreso y ejecución de procesos sin confirmación
  eliminarRegistroExtra(idExtras: number): void {
    this.macredService
      .deleteExtra(idExtras)
      .pipe(first())
      .subscribe((response) => {
        if (!response.exito) {
          this.alertService.error(response.responseMesagge);
          return;
        }
      });
  }

  createIngresoObjectForm(): MacIngresosXAnalisis {
    var ingresoAnalisis: MacIngresosXAnalisis = new MacIngresosXAnalisis();

    ingresoAnalisis.codigoAnalisis = this.srvDatosAnalisisService._analisisCapacidadpago.codigoAnalisis;
    ingresoAnalisis.codigoCompania = this.companiaObservable.id;

    ingresoAnalisis.codigoTipoIngreso =
      this.formIngresos.controls['codigoTipoIngreso'].value.id;
    ingresoAnalisis.codigoTipoMoneda = this.srvDatosAnalisisService._analisisCapacidadpago.codigoMoneda;
    ingresoAnalisis.montoBruto = this.formIngresos.controls['montoBruto'].value;
    ingresoAnalisis.montoExtras =
      this.formIngresos.controls['montoExtras'].value;
    ingresoAnalisis.cargasSociales =
      this.formIngresos.controls['cargasSociales'].value;
    ingresoAnalisis.impuestoRenta =
      this.formIngresos.controls['impuestoRenta'].value;
    ingresoAnalisis.montoNeto = this.formIngresos.controls['montoNeto'].value;
    ingresoAnalisis.montoDeducciones =
      this.formIngresos.controls['montoDeducciones'].value;

    return ingresoAnalisis;
  }

  createDeduccionObjectForm(): MacDeduccionesAnalisis {
    var deduccion: MacDeduccionesAnalisis = new MacDeduccionesAnalisis();

    deduccion.codigoAnalisis = this.srvDatosAnalisisService._analisisCapacidadpago.codigoAnalisis;
    deduccion.codigoCompania = this.companiaObservable.id;
    deduccion.codigoIngreso = this._ingresoAnalisisSeleccionado.id;

    deduccion.codigoTipoDeduccion =
      this.formDeducciones.controls['codigoTipoDeduccion'].value.id;
    deduccion.codigoMoneda =
      this.formDeducciones.controls['codigoTipoMoneda'].value.id;
    deduccion.tipoCambio = this.formDeducciones.controls['tipoCambio'].value;
    deduccion.monto = this.formDeducciones.controls['montoDeduccion'].value;

    return deduccion;
  }

  ActualizaFormDeducciones(): void {
    this.alertService.clear();
    this.submittedDeduccionesForm = true;

    if (this.formDeducciones.invalid) return;

    var deduccion: MacDeduccionesAnalisis = this.createDeduccionObjectForm();
    deduccion.id = this._deduccion.id;
    deduccion.modificadoPor = this.userObservable.identificacion;
    deduccion.fechaModificacion = this.today;

    this.macredService
      .putDeduccionAnalisis(deduccion)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.obtenerDeduccionesAnalisis();

          this.habilitarBtnFinalizarDeducciones = true;

          this._deduccion = null;
          this.inicializaFormDeducciones();

          this.alertService.success(response.responseMesagge);
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  totalizarMontosIngreso(): void {
    let totalDeducciones: number = 0;
    let totalIngresoBruto: number = 0;
    let totalCargasImpuestos: number = 0;
    let totalExtrasAplicables: number = 0;

    let totalIngresoNeto: number = 0;
    let totalIngresoAnalisis: number = 0;

    if (this.listTotalDeduccionesAnalisis) {
      this.listTotalDeduccionesAnalisis.forEach((deduccion) => {
        totalDeducciones += deduccion.monto;
      });
    }

    this.listIngresosAnalisis.forEach((ingreso) => {
      totalIngresoBruto += ingreso.montoBruto;
      totalCargasImpuestos += ingreso.cargasSociales + ingreso.impuestoRenta;

      totalExtrasAplicables += ingreso.montoExtras;
    });

    totalIngresoNeto = totalIngresoBruto - totalCargasImpuestos;
    totalIngresoAnalisis = totalIngresoNeto + totalExtrasAplicables;

    this.srvDatosAnalisisService._analisisCapacidadpago.totalCargaImpuestos = totalCargasImpuestos;
    this.srvDatosAnalisisService._analisisCapacidadpago.totalDeducciones = totalDeducciones;
    this.srvDatosAnalisisService._analisisCapacidadpago.totalExtrasAplicables = totalExtrasAplicables;
    this.srvDatosAnalisisService._analisisCapacidadpago.totalIngresoBruto = totalIngresoBruto;
    this.srvDatosAnalisisService._analisisCapacidadpago.totalIngresoNeto = totalIngresoNeto;
    this.srvDatosAnalisisService._analisisCapacidadpago.totalMontoAnalisis = totalIngresoAnalisis;
  }

  handleHabilitarPD(): void {
    this.onHabilitarPD.emit();
  }
}
