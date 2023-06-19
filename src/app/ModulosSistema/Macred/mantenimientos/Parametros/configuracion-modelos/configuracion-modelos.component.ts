import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Compania, User, Module } from '@app/_models';
import {
  GruposPD,
  IndicadoresPorGrupoPD,
  ModelosPD,
  VariablesPD,
} from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { from } from 'rxjs';
import { filter, first } from 'rxjs/operators';

@Component({
  templateUrl: './configuracion-modelos.component.html',
  styleUrls: [
    '../../../../../../assets/scss/app.scss',
    '../../../../../../assets/scss/macred/app.scss',
    '../../../../../../assets/scss/tailwind.scss',
  ],
})
export class ConfiguracionModelosComponent implements OnInit {
  private nombrePantalla: string = 'configuracion-modelos.html';

  // ## -- objetos suscritos -- ## //
  private userObservable: User;
  private moduleObservable: Module;
  private companiaObservable: Compania;

  // FORMULARIO MODELOS PD
  formModeloPD: FormGroup;
  submittedModeloPDForm: boolean = false;
  get f() {
    return this.formModeloPD.controls;
  }

  mostrarLista: boolean = true;
  lstModelos: ModelosPD[] = [];

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
    // this.accountService
    //   .validateAccessUser(
    //     this.userObservable.id,
    //     this.moduleObservable.id,
    //     this.nombrePantalla,
    //     this.companiaObservable.id
    //   )
    //   .pipe(first())
    //   .subscribe((response) => {
    //     // ## -->> redirecciona NO ACCESO
    //     if (!response.exito)
    //       this.router.navigate([this.moduleObservable.indexHTTP]);

    //     // this.macredService
    //     //   .GetParametroGeneralVal1(
    //     //     this.companiaObservable.id,
    //     //     'COD_MONEDA_PRINCIPAL',
    //     //     true
    //     //   )
    //     //   .pipe(first())
    //     //   .subscribe((response) => {
    //     //     this._globalCodMonedaPrincipal = +response;
    //     //   });

    //   });

    this.consultarModelosPD();
  }

  private consultarModelosPD() {
    this.formModeloPD = this.formBuilder.group({
      codigoModeloPD: [null],
      descripcion: [null, [Validators.required, Validators.maxLength(100)]],
      estado: [true],
    });

    this.macredService
      .getPDModelos(this.companiaObservable.id)
      .pipe(first())
      .subscribe((response) => {
        this.lstModelos = response;
      });
  }

  handleRegistrarModelo() {
    this.alertService.clear();
    this.submittedModeloPDForm = true;

    if (this.formModeloPD.invalid) {
      return;
    }

    const { codigoModeloPD, descripcion, estado } = this.formModeloPD.controls;

    let oModeloPD: ModelosPD = {
      id: codigoModeloPD.value ? codigoModeloPD.value : 0,
      codigoCompania: this.companiaObservable.id,
      descripcion: descripcion.value,
      estado: estado.value,
      usuarioCreacion: '',
      fechaCreacion: new Date(),
      usuarioModificacion: this.userObservable.nombreCompleto,
      fechaModificacion: new Date(),
    };

    this.macredService
      .createUpdatePDModelo(oModeloPD)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.alertService.success(response.responseMesagge);
          this.IniciarVariablesGrupos();
          this.consultarModelosPD();
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  handleEditarModelo(modelo: ModelosPD) {
    this.IniciarVariablesGrupos();
    this.formModeloPD.patchValue({ codigoModeloPD: modelo.id });
    this.formModeloPD.patchValue({ descripcion: modelo.descripcion });
    this.formModeloPD.patchValue({ estado: modelo.estado });
  }

  handleEliminarModelo(modeloId: number) {
    this.macredService
      .deletePDModelo(modeloId)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.alertService.success(response.responseMesagge);
          this.IniciarVariablesGrupos();
          this.consultarModelosPD();
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  //#region GRUPOS PD

  // VARIABLES
  modeloSeleccionado: ModelosPD = undefined;
  habilitarGrupos: boolean = false;
  lstGruposDelModelo: GruposPD[] = [];

  //FORMULARIO GRUPOS PD
  formGrupoPD: FormGroup;
  submittedGrupoPDForm: boolean = false;
  get g() {
    return this.formGrupoPD.controls;
  }

  //METODOS - FUNCIONES
  IniciarVariablesGrupos() {
    this.submittedGrupoPDForm = false;
    this.modeloSeleccionado = undefined;
    this.habilitarGrupos = false;
    this.lstGruposDelModelo = [];
    this.IniciarVariablesIndicadoresPorGrupos();
  }

  CargarDatosGruposPD(inModeloSeleccionado: ModelosPD) {
    this.IniciarVariablesGrupos();
    if (!inModeloSeleccionado) {
      return;
    }

    this.modeloSeleccionado = inModeloSeleccionado;
    this.submittedGrupoPDForm = false;
    this.habilitarGrupos = true;
    this.formGrupoPD = this.formBuilder.group({
      codigoGrupoPD: [null],
      modelo: [this.modeloSeleccionado.descripcion, Validators.required],
      nombreGrupo: [null, [Validators.required, Validators.maxLength(100)]],
      estado: [true],
    });

    this.macredService
      .getGruposPDVariable(inModeloSeleccionado.id)
      .pipe(first())
      .subscribe((response) => {
        this.lstGruposDelModelo = response;
      });
  }

  //EVENTOS
  handleRegistrarGrupo() {
    this.alertService.clear();
    this.submittedGrupoPDForm = true;

    if (this.formGrupoPD.invalid || !this.modeloSeleccionado) {
      return;
    }

    const { codigoGrupoPD, nombreGrupo, estado } = this.formGrupoPD.controls;

    let oGrupoPD: GruposPD = {
      idGrupoPd: codigoGrupoPD.value ? codigoGrupoPD.value : 0,
      codModeloPd: this.modeloSeleccionado.id,
      descripcion: nombreGrupo.value,
      estado: estado.value,
      usuarioCreacion: this.userObservable.nombreCompleto,
      fechaCreacion: new Date(),
      usuarioModificacion: this.userObservable.nombreCompleto,
      fechaModificacion: new Date(),
    };

    if (oGrupoPD.idGrupoPd == 0) {
      this.macredService
        .postGrupoPDVariable(oGrupoPD)
        .pipe(first())
        .subscribe((response) => {
          if (response.exito) {
            this.alertService.success(response.responseMesagge);
            this.CargarDatosGruposPD(this.modeloSeleccionado);
          } else {
            this.alertService.error(response.responseMesagge);
          }
        });
    } else {
      this.macredService
        .putGrupoPDVariable(oGrupoPD.idGrupoPd, oGrupoPD)
        .pipe(first())
        .subscribe((response) => {
          if (response.exito) {
            this.alertService.success(response.responseMesagge);
            this.CargarDatosGruposPD(this.modeloSeleccionado);
          } else {
            this.alertService.error(response.responseMesagge);
          }
        });
    }
  }

  handleEliminarGrupo(inGrupoPD: GruposPD) {
    this.macredService
      .deleteGrupoPDVariable(inGrupoPD.idGrupoPd)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.alertService.success(response.responseMesagge);
          this.CargarDatosGruposPD(this.modeloSeleccionado);
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  handleEditarGrupo(inGrupoPD: GruposPD) {
    this.CargarDatosGruposPD(this.modeloSeleccionado);
    this.formGrupoPD.patchValue({ codigoGrupoPD: inGrupoPD.idGrupoPd });
    this.formGrupoPD.patchValue({ nombreGrupo: inGrupoPD.descripcion });
    this.formGrupoPD.patchValue({ estado: inGrupoPD.estado });
  }

  //#endregion

  //#region VARIABLES POR GRUPO

  // VARIABLES
  grupoSeleccionado: GruposPD = undefined;
  habilitarVariablesPorGrupos: boolean = false;
  lstVariablesDisponible: VariablesPD[] = [];
  lstIndicadoresPorGrupo: IndicadoresPorGrupoPD[] = [];

  //FORMULARIO VARIABLES POR GRUPOS PD
  formIndicadorGrupoPD: FormGroup;
  submittedIndicadorGrupoPDForm: boolean = false;
  get ig() {
    return this.formIndicadorGrupoPD.controls;
  }

  //METODOS - FUNCIONES
  IniciarVariablesIndicadoresPorGrupos() {
    this.lstVariablesDisponible = [];
    this.lstIndicadoresPorGrupo = [];
    this.grupoSeleccionado = undefined;
    this.habilitarVariablesPorGrupos = false;
  }

  CargarDatosVariablesPorGruposPD(inGrupoSeleccionado: GruposPD) {
    this.IniciarVariablesIndicadoresPorGrupos();

    if (!inGrupoSeleccionado) {
      return;
    }

    this.grupoSeleccionado = inGrupoSeleccionado;
    this.habilitarVariablesPorGrupos = true;
    this.submittedIndicadorGrupoPDForm = false;
    this.formIndicadorGrupoPD = this.formBuilder.group({
      grupo: [this.grupoSeleccionado.descripcion, Validators.required],
      indicador: [null, Validators.required],
    });

    this.CargarVariablesDisponibles(this.grupoSeleccionado);
  }

  private CargarVariablesDisponibles(inGrupoSeleccionado: GruposPD) {
    //SE OBTIENE LOS DATOS DE LAS VARIABLES QUE SE PUEDEN ASIGNAR
    this.macredService
      .getPDVariables(this.companiaObservable.id)
      .pipe(first())
      .subscribe((response) => {
        let lstIndicadores: VariablesPD[] = [];
        from(response)
          .pipe(filter((variable) => variable.estado === true))
          .subscribe(
            (val: VariablesPD) => {
              lstIndicadores = [...lstIndicadores, val];
            },
            (err) => {
              console.error(err);
            },
            () => {
              this.CargarIndicadoresPorGrupo(
                inGrupoSeleccionado,
                lstIndicadores
              );
            }
          );
      });
  }

  private CargarIndicadoresPorGrupo(
    inGrupoSeleccionado: GruposPD,
    lstIndicadores: VariablesPD[]
  ) {
    //SE OTBIENEN LAS VARIABLES
    this.macredService
      .getIndicadoresGrupoPD(inGrupoSeleccionado.idGrupoPd)
      .pipe(first())
      .subscribe((response: IndicadoresPorGrupoPD[]) => {
        this.lstIndicadoresPorGrupo = [
          ...response.map((x) => ({
            ...x,
            grupo: this.lstGruposDelModelo.find(
              (g) => g.idGrupoPd == x.codGrupoPd
            ),
            indicador: lstIndicadores.find((i) => i.id == x.codIndicadorPd),
          })),
        ];
        this.lstVariablesDisponible = [
          ...lstIndicadores.filter(
            (x) =>
              !response.some((indGrupo) => indGrupo.codIndicadorPd === x.id)
          ),
        ];
      });
  }

  //EVENTOS

  handleRegistrarIndicadorPorGrupo() {
    this.alertService.clear();
    this.submittedIndicadorGrupoPDForm = true;

    if (this.formIndicadorGrupoPD.invalid || !this.grupoSeleccionado) {
      return;
    }

    const { indicador } = this.formIndicadorGrupoPD.controls;

    let oIndicadorGrupoPD: IndicadoresPorGrupoPD = {
      codGrupoPd: this.grupoSeleccionado.idGrupoPd,
      codIndicadorPd: indicador.value,
      usuarioCreacion: this.userObservable.nombreCompleto,
      fechaCreacion: new Date(),
      usuarioModificacion: this.userObservable.nombreCompleto,
      fechaModificacion: new Date(),
    };

    this.macredService
      .postIndicadorGrupoPD(oIndicadorGrupoPD)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.alertService.success(response.responseMesagge);
          this.CargarDatosVariablesPorGruposPD(this.grupoSeleccionado);
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  handleEliminarIndicadorPorGrupo(inIndicadorPorGrupo: IndicadoresPorGrupoPD) {
    this.macredService
    .deleteIndicadorGrupoPD(inIndicadorPorGrupo.codIndicadorPd, inIndicadorPorGrupo.codGrupoPd)
    .pipe(first())
    .subscribe((response) => {
      if (response.exito) {
        this.alertService.success(response.responseMesagge);
        this.CargarDatosVariablesPorGruposPD(this.grupoSeleccionado);
      } else {
        this.alertService.error(response.responseMesagge);
      }
    });
  }

  //#endregion
}
