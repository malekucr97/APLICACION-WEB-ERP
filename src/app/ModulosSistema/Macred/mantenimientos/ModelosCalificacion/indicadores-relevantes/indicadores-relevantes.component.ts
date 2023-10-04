import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Compania, Module, User } from '@app/_models';
import {
  MacIndicadoresRelevantes,
  MacNivelCapacidadPago,
  MacNivelesXIndicador,
} from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-indicadores-relevantes',
  templateUrl: './indicadores-relevantes.component.html',
  styleUrls: [
    '../../../../../../assets/scss/app.scss',
    '../../../../../../assets/scss/macred/app.scss',
    '../../../../../../assets/scss/tailwind.scss',
  ],
})
export class IndicadoresRelevantesComponent implements OnInit {
  private nombrePantalla: string = 'indicadores-relevantes';

  // ## -- objetos suscritos -- ## //
  private userObservable: User;
  private moduleObservable: Module;
  private companiaObservable: Compania;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private macredService: MacredService,
    private alertService: AlertService
  ) {
    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.companiaObservable = this.accountService.businessValue;
  }

  ngOnInit(): void {
    this.consultarIndicadoresRelevantes();
  }

  //#region INDICADORES RELEVANTES

  lstIndicadoresRelevantes: MacIndicadoresRelevantes[] = [];
  indicadorRelevanteSeleccionado: MacIndicadoresRelevantes = undefined;

  // FORMULARIO INDICADORES RELEVANTES
  formIndicadoresRelevantes: FormGroup;
  submittedIndicadoresRelevantes: boolean = false;
  get f() {
    return this.formIndicadoresRelevantes.controls;
  }

  private IniciarVariablesIndicadoresRelevantes() {
    this.submittedIndicadoresRelevantes = false;
    this.indicadorRelevanteSeleccionado = undefined;
  }

  private consultarIndicadoresRelevantes() {
    this.IniciarVariablesIndicadoresRelevantes();
    this.formIndicadoresRelevantes = this.formBuilder.group({
      codigoIndicador: [null],
      descripcion: [null, [Validators.required, Validators.maxLength(100)]],
      estado: [true],
    });
    this.obtenerListaIndicadoresRelevantes();
  }

  private obtenerListaIndicadoresRelevantes() {
    this.lstIndicadoresRelevantes = [];
    this.macredService
      .getIndicadoresRelevantes(this.companiaObservable.id)
      .pipe(first())
      .subscribe((response) => {
        this.lstIndicadoresRelevantes = response;
      });
  }

  private cargarIndicadorRelevante(
    inIndicadorRelevante: MacIndicadoresRelevantes
  ) {
    this.IniciarVariablesIndicadoresRelevantes();
    if (!inIndicadorRelevante) {
      return;
    }

    this.indicadorRelevanteSeleccionado = inIndicadorRelevante;
    this.formIndicadoresRelevantes = this.formBuilder.group({
      codigoIndicador: [this.indicadorRelevanteSeleccionado.codIndicador],
      descripcion: [
        this.indicadorRelevanteSeleccionado.descripcion,
        [Validators.required, Validators.maxLength(100)],
      ],
      estado: [this.indicadorRelevanteSeleccionado.estado],
    });
  }

  //EVENTOS
  handleCrearIndicadorRelevante() {
    this.alertService.clear();
    this.submittedIndicadoresRelevantes = true;
    if (this.formIndicadoresRelevantes.invalid) {
      return;
    }

    const { codigoIndicador, descripcion, estado } =
      this.formIndicadoresRelevantes.controls;

    let oIndicadoresRelevantes: MacIndicadoresRelevantes = {
      codIndicador: codigoIndicador.value ? codigoIndicador.value : 0,
      codigoCompania: this.companiaObservable.id,
      descripcion: descripcion.value,
      estado: estado.value,
      fechaCreacion: new Date(),
      usuarioCreacion: this.userObservable.nombreCompleto,
      fechaModificacion: new Date(),
      usuarioModificacion: this.userObservable.nombreCompleto,
    };

    if (!this.indicadorRelevanteSeleccionado?.codIndicador) {
      this.macredService
        .postIndicadoresRelevantes(oIndicadoresRelevantes)
        .pipe(first())
        .subscribe((response) => {
          if (response.exito) {
            this.alertService.success(response.responseMesagge);
            this.consultarIndicadoresRelevantes();
          } else {
            this.alertService.error(response.responseMesagge);
          }
        });
    } else {
      this.macredService
        .putIndicadoresRelevantes(
          this.indicadorRelevanteSeleccionado.codIndicador,
          oIndicadoresRelevantes
        )
        .pipe(first())
        .subscribe((response) => {
          if (response.exito) {
            this.alertService.success(response.responseMesagge);
            this.consultarIndicadoresRelevantes();
          } else {
            this.alertService.error(response.responseMesagge);
          }
        });
    }
  }

  handleEditarIndicadorRelevante(
    inIndicadorRelevante: MacIndicadoresRelevantes
  ) {
    this.cargarIndicadorRelevante(inIndicadorRelevante);
  }

  handleEliminarIndicadorRelevante(
    inIndicadorRelevante: MacIndicadoresRelevantes
  ) {
    if (!inIndicadorRelevante) {
      return;
    }

    this.macredService
      .deleteIndicadoresRelevantes(inIndicadorRelevante.codIndicador)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.alertService.success(response.responseMesagge);
          this.consultarIndicadoresRelevantes();
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  handleSeleccionarIndicadorRelevante(
    inIndicadorRelevante: MacIndicadoresRelevantes
  ) {
    if (!inIndicadorRelevante) {
      return;
    }
    this.indicadorRelevanteSeleccionado = inIndicadorRelevante;
    this.inicializarNivelesPorIndicador();
  }

  //#endregion

  //#region NIVELES POR INDICADORES RELEVANTES

  //VARIABLES
  mostrarSectionNivel: boolean = false;
  habilitarComboNiveles: boolean = false;
  lstNivelesxIndicador: MacNivelesXIndicador[] = [];
  lstNivelesCapacidadPago: MacNivelCapacidadPago[] = [];

  formNivelesPorIndicador: FormGroup;
  submittedNivelPorIndicador: boolean = false;
  get n() {
    return this.formNivelesPorIndicador.controls;
  }

  //METODOS Y FUNCIONES
  private inicializarVariablesNivelesPorIndicador() {
    this.submittedNivelPorIndicador = false;
    this.habilitarComboNiveles = true;
    this.mostrarSectionNivel = true;
    this.lstNivelesxIndicador = [];
    this.lstNivelesCapacidadPago = [];
  }

  private inicializarFormulario(inNivelIndicador?: MacNivelesXIndicador) {
    this.formNivelesPorIndicador = this.formBuilder.group({
      codigoIndicador: [this.indicadorRelevanteSeleccionado.codIndicador],
      CodNivel: [ inNivelIndicador?.codNivel || null, [Validators.required]],
      RangoInicial: [inNivelIndicador?.rangoInicial || null, [Validators.required, Validators.maxLength(100)]],
      RangoFinal: [inNivelIndicador?.rangoFinal || null, [Validators.required, Validators.maxLength(100)]],
    });

    if (inNivelIndicador) {
      this.habilitarComboNiveles = false;
    }
  }

  /**
   * METODO GENERAL PARA INICIALIZAR LO RELACIONADO A LOS NIVELES POR INDICADORES
   * @param inNivelIndicador PARAMETRO OPCIONAL CUANDO SE DEBE ACTUALIZAR LA INFORMACIÓN DE UN NIVEL AL INDICADOR
   */
  private inicializarNivelesPorIndicador(inNivelIndicador?: MacNivelesXIndicador) {
    this.inicializarVariablesNivelesPorIndicador();
    this.inicializarFormulario(inNivelIndicador);
    this.consultarNivelesCapacidadPago();
  }

  private consultarNivelesCapacidadPago() {
    let idCompania = this.companiaObservable.id;
    this.macredService
      .getNivelesCapacidadPago(idCompania, false)
      .pipe(first())
      .subscribe((response) => {
        this.lstNivelesCapacidadPago = response;
        this.consultarNivelesPorIndicador();
      });
  }

  private consultarNivelesPorIndicador() {
    let idCompania = this.companiaObservable.id;
    let idIndicador = this.indicadorRelevanteSeleccionado.codIndicador;
    this.macredService
      .getNivelesXIndicadoresRelevantes(idCompania, idIndicador)
      .pipe(first())
      .subscribe((response) => {
        this.lstNivelesxIndicador = response;
      });
  }

  obtenerNombreNivel(idCodNivel: number): string {
    return (
      this.lstNivelesCapacidadPago.find((x) => x.id == idCodNivel)
        ?.descripcion || ''
    );
  }

  //EVENTOS
  handleAsociarNivelPorIndicador() {
    this.alertService.clear();
    this.submittedNivelPorIndicador = true;
    if (this.formNivelesPorIndicador.invalid) {
      return;
    }

    const { codigoIndicador, CodNivel, RangoInicial, RangoFinal } =
      this.formNivelesPorIndicador.controls;

    let oNivelPorIndicador: MacNivelesXIndicador = {
      codigoCompania: this.companiaObservable.id,
      codIndicador: codigoIndicador.value,
      codNivel: CodNivel.value,
      rangoInicial: RangoInicial.value,
      rangoFinal: RangoFinal.value,
      usuarioCreacion: this.userObservable.nombreCompleto,
      fechaCreacion: new Date(),
      usuarioModificacion: this.userObservable.nombreCompleto,
      fechaModificacion: new Date(),
    };

    this.macredService
      .postNivelesXIndicadoresRelevantes(oNivelPorIndicador)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.alertService.success(response.responseMesagge);
          this.inicializarNivelesPorIndicador();
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });

  }

  handleActualizarNivelPorIndicador(inNivelIndicador: MacNivelesXIndicador) {
    if (!inNivelIndicador) {
      return;
    }
    this.inicializarNivelesPorIndicador(inNivelIndicador);
  }

  handleEliminarNivelPorIndicador(inNivelIndicador: MacNivelesXIndicador) {
    if (!inNivelIndicador) {
      return;
    }

    this.macredService
      .deleteNivelesXIndicadoresRelevantes(
        this.companiaObservable.id,
        inNivelIndicador.codIndicador,
        inNivelIndicador.codNivel
      )
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.alertService.success(response.responseMesagge);
          this.inicializarNivelesPorIndicador();
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  //#endregion
}
