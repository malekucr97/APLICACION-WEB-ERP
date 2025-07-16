import { PercentPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Compania, Module, User } from '@app/_models';
import { AnalisisHistoricoPD, GruposPD, MacPersona, MacTipoIngresoAnalisis, ModelosPD } from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { first } from 'rxjs/operators';
import { SrvDatosAnalisisService } from '../servicios/srv-datos-analisis.service';

declare var $: any;

@Component({
  selector: 'app-pd',
  templateUrl: './pd.component.html',
  styleUrls: [
    '../../../../../assets/scss/app.scss',
    '../../../../../assets/scss/macred/app.scss',
  ],
})
export class PdComponent implements OnInit {
  @Input() _personaAnalisis: MacPersona;
  @Input() _globalCodMonedaPrincipal: number;
  @Input() listTipoIngresoAnalisis: MacTipoIngresoAnalisis[];

  @Output() onFCL = new EventEmitter();

  private userObservable: User;
  private companiaObservable: Compania;
  private moduleObservable: Module;
  public today: Date;

  _analisisPD: AnalisisHistoricoPD = undefined;


  modeloPDSeleccionado: ModelosPD = undefined;
  lstGruposPD: GruposPD[] = [];
  grupoPDSeleccionado: GruposPD = undefined;

  habilitarBtnEditarDatos: boolean = false;
  habilitarBtnGuardarDatos: boolean = false;
  habilitarBtnCalcularDatosPD: boolean = false;
  habilitarBtnPD_ContinuarScoring: boolean = false;
  habilitarBtnPD_ContinuarFCL: boolean = false;
  disabledDatosPD: boolean = true;


  formPD: UntypedFormGroup;
  submittedPDForm: boolean = false;
  get j() {
    return this.formPD.controls;
  }


  constructor(
    private formBuilder: UntypedFormBuilder,
    private macredService: MacredService,
    private accountService: AccountService,
    private alertService: AlertService,
    public srvDatosAnalisisService: SrvDatosAnalisisService
  ) {
    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.companiaObservable = this.accountService.businessValue;
    this.today = new Date();
    this.procesarAnalisisPDInicial();
  }

  ngOnInit(): void {
  }

  private procesarAnalisisPDInicial() {
    if (this.srvDatosAnalisisService._analisisCapacidadpago) {
      this.obtenerAnalisisPD();
    }
  }

  private crearAnalisisPD() {
    let oAnalisisPD: AnalisisHistoricoPD = {
      pdhCodAnalisisPd: 0,
      codAnalisis: this.srvDatosAnalisisService._analisisCapacidadpago.codigoAnalisis,
      codPersona: this._personaAnalisis.id,
      identificacion: this._personaAnalisis.identificacion,
      fechaCreacion: new Date(),
      usuarioCreacion: this.userObservable.nombreCompleto,
      codModeloPd: 0,
      codGrupoPd: 0,
      datoHabitacasa: 0,
      datoProvincia: 0,
      pdhAnalisisDefinitivo: false,
      pdhEstado: false,
      edadAsociado: 0,
      cantidadHijos: 0,
      anosLaborales: 0,
      salarioBruto: 0,
      atrasoMaximo: 0,
      nCreditosVigentes: 0,
      saldoTotal: 0,
      codGenero: 0,
      codEstadoCivil: 0,
      codCondicionLaboral: 0,
    };

    this.macredService
      .postAnalisisPD(oAnalisisPD)
      .pipe(first())
      .subscribe(
        (response) => {
          this._analisisPD = response;
          this.inicializarFormPD();
        },
        (error) => {
          let message: string = 'Problemas de conexión. Detalle: ' + error;
          this.alertService.error(message);
        }
      );
  }

  private obtenerAnalisisPD() {
    this.macredService
      .getAnalisisPD(this.srvDatosAnalisisService._analisisCapacidadpago.codigoAnalisis)
      .pipe(first())
      .subscribe(
        (response) => {
          if (response) {
            this._analisisPD = response;
            this.inicializarFormPD();
          } else {
            this.crearAnalisisPD();
          }
        },
        (error) => {
          let message: string = 'Problemas de conexión. Detalle: ' + error;
          this.alertService.error(message);
        }
      );
  }

  private cargarGruposPD(inModeloPD: ModelosPD) {
    return new Promise((resolve, reject) => {
      //OBTENER LOS GRUPOS ASOCIADOS AL MODELO
      this.macredService
        .getGruposPDVariable(inModeloPD.id)
        .pipe(first())
        .subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject('Problemas de conexión. Detalle: ' + error);
          }
        );
    });
  }

  private inicializarFormPD() {
    this.habilitarBtnEditarDatos = true;
    this.disabledDatosPD = true;
    this.habilitarBtnPD_ContinuarScoring = false;
    this.habilitarBtnPD_ContinuarFCL = false;
    this.habilitarBtnCalcularDatosPD = true;

    this.formPD = this.formBuilder.group({
      codigoGenero: [
        this.srvDatosAnalisisService.listTipoGenero.find(
          (x) => x.id === this._personaAnalisis.codigoGenero
        ),
      ],
      codigoEstadoCivil: [
        this.srvDatosAnalisisService.lstEstadoCivil.find(
          (x) => x.id === this._personaAnalisis.codigoEstadoCivil
        ),
      ],
      codigoTipoHabitacion: [
        this.srvDatosAnalisisService.listTipoHabitaciones.find(
          (x) => x.id === this._personaAnalisis.codigoTipoHabitacion
        ),
      ],
      edad: [this._personaAnalisis.edad ?? 0],
      tienePropiedades: [this._personaAnalisis.pdTienePropiedad ?? false],
      tieneVehiculo: [this._personaAnalisis.pdTieneVehiculo ?? false],
      numeroHijos: [this._personaAnalisis.cantidadHijos ?? 0],
      numeroFianzas: [this._personaAnalisis.cantidadFianzas ?? 0],
      creditosActivos: [this._personaAnalisis.nCreditosVigentes ?? 0],
      csd: [this._personaAnalisis.pdCsd ?? 0],
      segmento: [this._personaAnalisis.perSegmentoAsociado ?? 0],
      salarioBruto: [this._personaAnalisis.salarioBruto ?? 0],
      montoAprobadoTotal: [this._personaAnalisis.montoAprobadoTotal ?? 0],
      endeudamientoTotalCIC: [this._personaAnalisis.perEndeudamientoTotal ?? 0],
      constante: [this._personaAnalisis.constante ?? 0],
      modeloAnalisis: [''],
      modeloAnalisisConglomerado: [''],
      zScore: [this._analisisPD.pdhDZscore ?? 0],
      pdResult: [ this._analisisPD.pdhDPdFinal ?? 0],
    });

    // EL ANALISIS YA ESTA CREADO
    if (this._analisisPD.pdhEstado) {
      // SE DEBE OCULTAR LOS BOTONES DE EDITAR Y CALCULAR Y CONTINUAR CON EL SIGUIENTE TAB
      let modeloAnalisis = this.srvDatosAnalisisService.lstModelosPD.find(
        (x) => x.id == this._analisisPD.codModeloPd
      );
      this.formPD.patchValue({ modeloAnalisis: modeloAnalisis.descripcion });

      this.cargarGruposPD(modeloAnalisis).then((respuesta: GruposPD[]) => {
        let grupoAsignado = respuesta.find(
          (x) => x.idGrupoPd == this._analisisPD.codGrupoPd
        );
        this.formPD.patchValue({
          modeloAnalisisConglomerado: grupoAsignado.descripcion,
        });

        this.habilitarBtnEditarDatos = false;
        this.habilitarBtnCalcularDatosPD = false;
        this.habilitarBotonParaContinuar();
      });
    }
  }

  private habilitarBotonParaContinuar() {
    if (
      this.listTipoIngresoAnalisis
        .find(
          (x) => x.id == this.srvDatosAnalisisService._analisisCapacidadpago.codigoTipoIngresoAnalisis
        )
        .descripcion.toLocaleLowerCase() == 'independiente'
    ) {
      this.habilitarBtnPD_ContinuarFCL = true;
    } else {
      this.habilitarBtnPD_ContinuarScoring = true;
    }
  }

  habilitarCamposPDEditar(_estado: boolean) {
    this.habilitarBtnEditarDatos = !_estado;
    this.habilitarBtnCalcularDatosPD = !_estado;
    this.disabledDatosPD = !_estado;
    this.habilitarBtnGuardarDatos = _estado;
  }

  procesoGuardarDatosPD() {
    // SE OBTIENE LA INFORMACIÓN A GUARDAR DE LA PERSONA
    this.alertService.clear();
    this.submittedPDForm = true;

    if (this.formPD.invalid) {
      this.alertService.error('La información indicada no es válida.');
      return;
    }

    // SE OBTIENE LA INFORMACIÓN INGRESADA DEL USUARIO
    const {
      codigoGenero,
      codigoEstadoCivil,
      codigoTipoHabitacion,
      edad,
      tienePropiedades,
      tieneVehiculo,
      numeroHijos,
      numeroFianzas,
      creditosActivos,
      csd,
      segmento,
      salarioBruto,
      montoAprobadoTotal,
      endeudamientoTotalCIC,
      constante,
    } = this.formPD.controls;

    let oPersonaActualizar: MacPersona = {
      ...this._personaAnalisis,
      codigoGenero: codigoGenero.value.id,
      codigoEstadoCivil: codigoEstadoCivil.value.id,
      codigoTipoHabitacion: codigoTipoHabitacion.value.id,
      edad: edad.value,
      cantidadHijos: numeroHijos.value,
      cantidadFianzas: numeroFianzas.value,
      nCreditosVigentes: creditosActivos.value,
      perSegmentoAsociado: segmento.value,
      salarioBruto: salarioBruto.value,
      montoAprobadoTotal: montoAprobadoTotal.value,
      perEndeudamientoTotal: endeudamientoTotalCIC.value,
      constante: constante.value,
      pdCsd: csd.value,
      pdTienePropiedad: tienePropiedades.value,
      pdTieneVehiculo: tieneVehiculo.value,
    };

    // SE GUARDA LOS DATOS DE LA PERSONA.
    this.macredService
      .putPersona(oPersonaActualizar)
      .pipe(first())
      .subscribe(
        (response) => {
          if (response) {
            this._personaAnalisis = response;

            this.alertService.success(
              `Persona ${this._personaAnalisis.identificacion} actualizada correctamente!`
            );
            this.habilitarCamposPDEditar(false);
          } else {
            let message: string = 'Problemas al actualizar la persona.';
            this.alertService.error(message);
          }
        },
        (error) => {
          let message: string = 'Problemas de conexión. Detalle: ' + error;
          this.alertService.error(message);
        }
      );
  }

  procesoCalculaPD() {
    $('#modalModelosPD').modal({ backdrop: 'static', keyboard: false }, 'show');
  }

  handleModalPDSelececionarModelo(inModeloPD: ModelosPD) {
    this.alertService.clear();

    if (!inModeloPD) {
      this.alertService.error('No se ha seleccionado un modelo correcto.');
      return;
    }

    // CERRAR EL MODAL DE LOS MODELOS
    $('#modalModelosPD').modal('hide');

    // ASIGNAR LAS VARIABLES
    this.modeloPDSeleccionado = inModeloPD;
    this.formPD.patchValue({ modeloAnalisis: inModeloPD.descripcion });

    this.cargarGruposPD(this.modeloPDSeleccionado)
      .then((respuesta: GruposPD[]) => {
        this.lstGruposPD = respuesta;
        // ACTIVAR EL MODAL DE LOS GRUPOS ASIGNADOS AL MODELO
        $('#modalGruposPD').modal(
          { backdrop: 'static', keyboard: false },
          'show'
        );
      })
      .catch((error) => {
        this.alertService.error(error);
      });
  }

  handleModalPDSeleccionarGrupo(inGruposPD: GruposPD) {
    this.alertService.clear();

    if (!inGruposPD) {
      this.alertService.error('No se ha seleccionado un grupo correcto.');
      return;
    }

    // CERRAR EL MODAL DE LOS MODELOS
    $('#modalGruposPD').modal('hide');

    // ASIGNAR LAS VARIABLES
    this.grupoPDSeleccionado = inGruposPD;
    this.formPD.patchValue({
      modeloAnalisisConglomerado: inGruposPD.descripcion,
    });

    //SE GENERA LA INFORMACIÓN DEL PD
    const oAnalisisPD = {
      codAnalisis: this.srvDatosAnalisisService._analisisCapacidadpago.codigoAnalisis,
      codModeloPd: this.modeloPDSeleccionado.id,
      codGrupoPd: this.grupoPDSeleccionado.idGrupoPd,
      codPersona: this._personaAnalisis.id,
      identificacion: this._personaAnalisis.identificacion,
      usuarioCreacion: this.userObservable.nombreCompleto,
      pdhEstado: true,
    } as AnalisisHistoricoPD;

    // PROCESO PARA GENERAR UN NUEVO CALCULO DE PD
    this.macredService
      .calculoAnalisisPD(oAnalisisPD)
      .pipe(first())
      .subscribe(
        (response) => {
          if (response.exito) {
            this.obtenerAnalisisPD();
          } else {
            this.alertService.error(response.responseMesagge);
          }
        },
        (error) => {
          let message: string = 'Problemas de conexión. Detalle: ' + error;
          this.alertService.error(message);
        }
      );
  }

  handleHabilitarFCL(){
    this.onFCL.emit();
  }


}
