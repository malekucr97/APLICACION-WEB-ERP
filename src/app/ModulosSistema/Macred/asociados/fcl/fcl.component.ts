import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Compania, Module, User } from '@app/_models';
import {
  MacAnalisisCapacidadPago,
  MacPersona,
  ScoringFlujoCajaLibre,
  TipoActividadEconomica
} from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { first } from 'rxjs/operators';
import { Output, EventEmitter } from '@angular/core';
import { SrvDatosAnalisisService } from '../servicios/srv-datos-analisis.service';

@Component({
    selector: 'app-fcl',
    templateUrl: './fcl.component.html',
    styleUrls: [
        '../../../../../assets/scss/app.scss',
        '../../../../../assets/scss/macred/app.scss',
    ],
    standalone: false
})
export class FclComponent implements OnInit {
  //VARIABLES INPUT DEL COMPONENTE PADRE
  @Input() _analisisCapacidadpago: MacAnalisisCapacidadPago;
  // @Input() oPersona: MacPersona;

  //VARIABLES OUTPUT PARA ENVIAR AL COMPONENTE PADRE
  @Output() onEscenariosFCL = new EventEmitter<ScoringFlujoCajaLibre>();

  // ## -- objetos suscritos -- ## //
  private userObservable: User;
  private moduleObservable: Module;
  private companiaObservable: Compania;

  // ## -- formularios -- ## //
  formularioFCL: UntypedFormGroup;
  submittedFCLForm: boolean = false;
  get j() {
    return this.formularioFCL.controls;
  }

  // ## -- variables -- ## //
  analisisFlujoCajaLibre: ScoringFlujoCajaLibre = undefined;
  lstTiposActividadEconomica: TipoActividadEconomica[] = [];
  editarCamposFCL: boolean = true;
  habilitarFinalizacion: boolean = false;

  oPersona : MacPersona;
  oAnalisis : MacAnalisisCapacidadPago;

  constructor(private formBuilder: UntypedFormBuilder,
              private macredService: MacredService,
              private accountService: AccountService,
              private alertService: AlertService,
              public srvDatosAnalisisService: SrvDatosAnalisisService) {

    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.companiaObservable = this.accountService.businessValue;

    this.formularioFCL = this.formBuilder.group({
      actividadEconomica: [null, [Validators.required]],
      proyeccionMeses: [
        0,
        [Validators.required, Validators.min(0), Validators.max(500)],
      ],
      ajusteSalario: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      flujoEfectivoInicial: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      requerimientoCT: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      ingresosMensuales: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      gastosNegocio: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      gastosPersonalesFamiliares: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      obligacionesCuotasPrestamos: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      obligacionesNuevaObligacion: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      obligacionAhorroGenerado: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      ingsIngresosIndirectos: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      ingsMejoradorCrediticio: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      ingsAporteEfectivo: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      ingsGastosIndirectos: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      estimacionesSaldoTotalDeudaUno: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      estimacionesSaldoTotalDeudaDos: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      estimacionesValorPatrimonialActual: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      estimacionesValorPatrimonialFuturo: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      estimacionesCuotaMonedaExtranjeraAnoUno: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      estimacionesCuotaMonedaExtranjeraAnoDos: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999999),
        ],
      ],
      observaciones: [
        'Observación Generación FCL Inicial',
        [Validators.required],
      ],
    });
  }

  ngOnInit(): void {
    this.ObtenerActividadesEconomicas();
    this.IniciarFlujoCajaLibre();

    this.srvDatosAnalisisService.personaAnalisis$.subscribe(
      persona => { 
        if (persona) {
          this.oPersona = persona;
        }
    });

    this.srvDatosAnalisisService.analisisCapacidadPago$.subscribe(
      analisis => { 
        if (analisis) this.oAnalisis = analisis; 
    });
  }

  private IniciarFlujoCajaLibre() {
    let oAnalisisConsulta = {
      codAnalisis: this._analisisCapacidadpago.codigoAnalisis,
      codPersona: this.oPersona.id,
      usuarioCreacion: this.userObservable.nombreCompleto,
      fechaCreacion: new Date(),
    } as ScoringFlujoCajaLibre;

    this.macredService
      .postFlujoCajaLibre(oAnalisisConsulta)
      .pipe(first())
      .subscribe((response) => {
        if (response) {
          this.alertService.success('Se obtiene correctamente la información del FCL');
          this.analisisFlujoCajaLibre = response;
          this.inicializarFormularioFCL();
        } else {
          this.alertService.error('Error al generar el flujo de caja libre');
          this.analisisFlujoCajaLibre = undefined;
        }
      });
  }

  private inicializarFormularioFCL() {
    if (this.analisisFlujoCajaLibre.scofclEstado) {
      this.habilitarFinalizacion = true;
    }

    this.formularioFCL.patchValue({
      actividadEconomica: this.lstTiposActividadEconomica.find(
        (x) =>
          x.codActividadEconomica ==
          this.analisisFlujoCajaLibre.codActividadEconomica
      )
        ? this.lstTiposActividadEconomica.find(
            (x) =>
              x.codActividadEconomica ==
              this.analisisFlujoCajaLibre.codActividadEconomica
          ).codActividadEconomica
        : this.lstTiposActividadEconomica[0].codActividadEconomica,
    });
    this.formularioFCL.patchValue({
      proyeccionMeses:
        this.analisisFlujoCajaLibre.mesesProyectarObligaciones ?? 0,
    });
    this.formularioFCL.patchValue({
      ajusteSalario: this.analisisFlujoCajaLibre.ajusteSalario ?? 0,
    });
    this.formularioFCL.patchValue({
      flujoEfectivoInicial:
        this.analisisFlujoCajaLibre.flujoEfectivoInicial ?? 0,
    });
    this.formularioFCL.patchValue({
      ingresosMensuales:
        this.analisisFlujoCajaLibre.ingresosMensualesActividad ?? 0,
    });
    this.formularioFCL.patchValue({
      gastosNegocio: this.analisisFlujoCajaLibre.gastosNegocio ?? 0,
    });
    this.formularioFCL.patchValue({
      gastosPersonalesFamiliares:
        this.analisisFlujoCajaLibre.gastosPersonalesFamiliares ?? 0,
    });
    this.formularioFCL.patchValue({
      obligacionesCuotasPrestamos:
        this.analisisFlujoCajaLibre.cuotasPrestamosSistema ?? 0,
    });
    this.formularioFCL.patchValue({
      obligacionesNuevaObligacion:
        this.analisisFlujoCajaLibre.nuevaObligacion ?? 0,
    });
    this.formularioFCL.patchValue({
      obligacionAhorroGenerado:
        this.analisisFlujoCajaLibre.ahorroNuevaObligacion ?? 0,
    });
    this.formularioFCL.patchValue({
      requerimientoCT:
        this.analisisFlujoCajaLibre.requerimietoCapitalTrabajo ?? 0,
    });
    this.formularioFCL.patchValue({
      ingsIngresosIndirectos:
        this.analisisFlujoCajaLibre.otrosIngresosIndirectos ?? 0,
    });
    this.formularioFCL.patchValue({
      ingsMejoradorCrediticio:
        this.analisisFlujoCajaLibre.mejoradorCrediticio ?? 0,
    });
    this.formularioFCL.patchValue({
      ingsAporteEfectivo: this.analisisFlujoCajaLibre.aporteEfectivo ?? 0,
    });
    this.formularioFCL.patchValue({
      ingsGastosIndirectos:
        this.analisisFlujoCajaLibre.otrosGastosIndirectos ?? 0,
    });
    this.formularioFCL.patchValue({
      estimacionesSaldoTotalDeudaUno:
        this.analisisFlujoCajaLibre.saldoTotalDeudaAnoBase ?? 0,
    });
    this.formularioFCL.patchValue({
      estimacionesSaldoTotalDeudaDos:
        this.analisisFlujoCajaLibre.saldoTotalDeudaAno2 ?? 0,
    });
    this.formularioFCL.patchValue({
      estimacionesValorPatrimonialActual:
        this.analisisFlujoCajaLibre.valorPatrimonioActual ?? 0,
    });
    this.formularioFCL.patchValue({
      estimacionesValorPatrimonialFuturo:
        this.analisisFlujoCajaLibre.valorPatrimonioFuturoEstimado ?? 0,
    });
    this.formularioFCL.patchValue({
      observaciones:
        this.analisisFlujoCajaLibre.observacionValorPatrimonio ??
        'Observación Generación FCL Inicial',
    });
    this.formularioFCL.patchValue({
      estimacionesCuotaMonedaExtranjeraAnoUno:
        this.analisisFlujoCajaLibre.cuotaMonedaExtraAno1 ?? 0,
    });
    this.formularioFCL.patchValue({
      estimacionesCuotaMonedaExtranjeraAnoDos:
        this.analisisFlujoCajaLibre.cuotaMonedaExtraAno2 ?? 0,
    });
  }

  private ObtenerActividadesEconomicas() {
    this.macredService
      .getTiposActividadesEconomicas(this.companiaObservable.id)
      .pipe(first())
      .subscribe((response) => {
        this.lstTiposActividadEconomica = response.filter(
          (x) => x.estado === true
        );
      });
  }

  handleEditarCampos() {
    this.editarCamposFCL = false;
    this.habilitarFinalizacion = false;
  }

  handleGuardarInformacion() {
    // SE OBTIENE LA INFORMACIÓN A GUARDAR
    this.alertService.clear();
    this.submittedFCLForm = true;

    if (this.formularioFCL.invalid) {
      this.alertService.error('La información indicada no es válida.');
      return;
    }

    // SE OBTIENE LA INFORMACIÓN INGRESADA DEL USUARIO
    const {
      actividadEconomica,
      proyeccionMeses,
      ajusteSalario,
      flujoEfectivoInicial,
      requerimientoCT,
      ingresosMensuales,
      gastosNegocio,
      gastosPersonalesFamiliares,
      obligacionesCuotasPrestamos,
      obligacionesNuevaObligacion,
      obligacionAhorroGenerado,
      ingsIngresosIndirectos,
      ingsMejoradorCrediticio,
      ingsAporteEfectivo,
      ingsGastosIndirectos,
      estimacionesSaldoTotalDeudaUno,
      estimacionesSaldoTotalDeudaDos,
      estimacionesValorPatrimonialActual,
      estimacionesValorPatrimonialFuturo,
      estimacionesCuotaMonedaExtranjeraAnoUno,
      estimacionesCuotaMonedaExtranjeraAnoDos,
      observaciones,
    } = this.formularioFCL.controls;

    let oAnalisis: ScoringFlujoCajaLibre = {
      ...this.analisisFlujoCajaLibre,
      codAnalisis: this._analisisCapacidadpago.codigoAnalisis,
      codPersona: this.oPersona.id,
      codActividadEconomica: actividadEconomica.value,
      nuevaObligacion: obligacionesNuevaObligacion.value,
      ahorroNuevaObligacion: obligacionAhorroGenerado.value,
      ajusteSalario: ajusteSalario.value,
      aporteEfectivo: ingsAporteEfectivo.value,
      flujoEfectivoInicial: flujoEfectivoInicial.value,
      cuotaMonedaExtraAno1: estimacionesCuotaMonedaExtranjeraAnoUno.value,
      cuotaMonedaExtraAno2: estimacionesCuotaMonedaExtranjeraAnoDos.value,
      gastosNegocio: gastosNegocio.value,
      mesesProyectarObligaciones: proyeccionMeses.value,
      requerimietoCapitalTrabajo: requerimientoCT.value,
      ingresosMensualesActividad: ingresosMensuales.value,
      gastosPersonalesFamiliares: gastosPersonalesFamiliares.value,
      cuotasPrestamosSistema: obligacionesCuotasPrestamos.value,
      otrosIngresosIndirectos: ingsIngresosIndirectos.value,
      mejoradorCrediticio: ingsMejoradorCrediticio.value,
      otrosGastosIndirectos: ingsGastosIndirectos.value,
      saldoTotalDeudaAnoBase: estimacionesSaldoTotalDeudaUno.value,
      saldoTotalDeudaAno2: estimacionesSaldoTotalDeudaDos.value,
      valorPatrimonioActual: estimacionesValorPatrimonialActual.value,
      valorPatrimonioFuturoEstimado: estimacionesValorPatrimonialFuturo.value,
      observacionValorPatrimonio: observaciones.value,
      usuarioModificacion: this.userObservable.nombreCompleto,
      fechaModificacion: new Date(),
      scofclEstado: true,
    };

    this.macredService
      .putFlujoCajaLibre(oAnalisis)
      .pipe(first())
      .subscribe(
        (response) => {
          if (response.exito) {
            this.editarCamposFCL = true;
            this.habilitarFinalizacion = true;
            this.alertService.success(response.responseMesagge);
          } else {
            this.alertService.error(response.responseMesagge);
          }
        },
        (error) => {
          this.alertService.error(error.message);
        }
      );
  }

  handleOnEscenariosFCL() {
    this.macredService
      .getFlujoCajaLibre(this.analisisFlujoCajaLibre.codScoringFlujoCaja)
      .pipe(first())
      .subscribe((response) => {
        if (response) {
          this.onEscenariosFCL.emit(response);
        }
      });
  }
}
