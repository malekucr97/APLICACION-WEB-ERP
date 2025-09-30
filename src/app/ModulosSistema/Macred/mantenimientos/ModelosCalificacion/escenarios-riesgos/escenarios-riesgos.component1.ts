import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Compania, Module, User } from '@app/_models';
import { MacEscenariosRiesgos, MacModeloAnalisis } from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-escenarios-riesgos',
    templateUrl: './escenarios-riesgos.component.html',
    styleUrls: [
        '../../../../../../assets/scss/app.scss',
        '../../../../../../assets/scss/macred/app.scss',
        '../../../../../../assets/scss/tailwind.scss',
    ],
    standalone: false
})
export class EscenariosRiesgos1Component implements OnInit {
  private nombrePantalla: string = 'escenarios-riesgos';

  private userObservable: User;
  private moduleObservable: Module;
  private companiaObservable: Compania;

  lstModelosAnalisis: MacModeloAnalisis[] = [];
  lstEscenariosRiesgos: MacEscenariosRiesgos[] = [];
  escenarioRiesgoSeleccionado: MacEscenariosRiesgos = undefined;

  frmEscenariosRiesgo: UntypedFormGroup;
  sbmFrmEscenariosRiesgo: boolean = false;
  get f() {
    return this.frmEscenariosRiesgo.controls;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private accountService: AccountService,
    private macredService: MacredService,
    private alertService: AlertService
  ) {
    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.companiaObservable = this.accountService.businessValue;
  }

  ngOnInit(): void {
    this.inicializarDatosComponente();
  }

  // METODOS - FUNCIONES
  private inicializarDatosComponente() {
    this.escenarioRiesgoSeleccionado = undefined;
    this.sbmFrmEscenariosRiesgo = false;
    this.inicializarFormularioEscenarioRiesgo();
    this.obtenerModelosAnalisis();
    this.obtenerListaEscenariosRiesgos();
  }

  private inicializarFormularioEscenarioRiesgo() {
    this.frmEscenariosRiesgo = this.formBuilder.group({
      codEscenario: [
        this.escenarioRiesgoSeleccionado?.codEscenario || 0,
        [Validators.required],
      ],
      codModelo: [
        this.escenarioRiesgoSeleccionado?.codModelo || null,
        [Validators.required],
      ],
      descripcion: [
        this.escenarioRiesgoSeleccionado?.descripcion || null,
        [Validators.required, Validators.maxLength(100)],
      ],
      estado: [
        this.escenarioRiesgoSeleccionado?.estado || true,
        [Validators.required],
      ],
    });
  }

  private obtenerModelosAnalisis() {
    // this.macredService
    //   .getModelosAnalisis(this.companiaObservable.id, false)
    //   .pipe(first())
    //   .subscribe((response) => {
    //     this.lstModelosAnalisis = response;
    //   });
  }

  private obtenerListaEscenariosRiesgos() {
    // this.macredService
    //   .getEscenariosRiesgos(this.companiaObservable.id)
    //   .pipe(first())
    //   .subscribe((response) => {
    //     this.lstEscenariosRiesgos = response;
    //   });
  }

  obtenerModeloParaListaEscenariosRiesgo(inEscenarioRiesgo: MacEscenariosRiesgos) {
    return this.lstModelosAnalisis.find(x=>x.id== inEscenarioRiesgo.codModelo).descripcion;
  }

  // EVENTOS
  handleSubmitEscenariosRiesgo() {
    this.alertService.clear();
    this.sbmFrmEscenariosRiesgo = true;
    if (this.frmEscenariosRiesgo.invalid) {
      return;
    }

    const { codEscenario, codModelo, descripcion, estado } =
      this.frmEscenariosRiesgo.controls;

    let objBaseDatos: MacEscenariosRiesgos = {
      codigoCompania: this.companiaObservable.id,
      codEscenario: this.escenarioRiesgoSeleccionado?.codEscenario
        ? this.escenarioRiesgoSeleccionado.codEscenario
        : codEscenario.value,
      codModelo: codModelo.value,
      descripcion: descripcion.value,
      estado: estado.value,
      usuarioCreacion: this.userObservable.nombreCompleto,
      fechaCreacion: new Date(),
      usuarioModificacion: this.userObservable.nombreCompleto,
      fechaModificacion: new Date(),
    };

    if (this.escenarioRiesgoSeleccionado && objBaseDatos.codEscenario > 0) {
      this.macredService
        .putEscenariosRiesgos(
          this.escenarioRiesgoSeleccionado.codEscenario,
          objBaseDatos
        )
        .pipe(first())
        .subscribe((response) => {
          if (response.exito) {
            this.alertService.success(response.responseMesagge);
            this.inicializarDatosComponente();
          } else {
            this.alertService.error(response.responseMesagge);
          }
        });
    } else {
      // this.macredService
      //   .postEscenariosRiesgos(objBaseDatos)
      //   .pipe(first())
      //   .subscribe((response) => {
      //     if (response.exito) {
      //       this.alertService.success(response.responseMesagge);
      //       this.inicializarDatosComponente();
      //     } else {
      //       this.alertService.error(response.responseMesagge);
      //     }
      //   });
    }
  }

  handleEditarEscenarioRiesgo(inEscenarioRiesgo: MacEscenariosRiesgos) {
    if (!inEscenarioRiesgo) {
      return;
    }
    this.escenarioRiesgoSeleccionado = inEscenarioRiesgo;
    this.inicializarFormularioEscenarioRiesgo();
  }

  handleEliminarEscenarioRiesgo(inEscenarioRiesgo: MacEscenariosRiesgos) {
    if (!inEscenarioRiesgo) {
      return;
    }

    this.macredService
      .deleteEscenariosRiesgos(inEscenarioRiesgo.codEscenario)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.alertService.success(response.responseMesagge);
          this.inicializarDatosComponente();
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  handleSeleccionarEscenarioRiesgo(inEscenarioRiesgo: MacEscenariosRiesgos) {
    if (!inEscenarioRiesgo) {
      return;
    }
    this.escenarioRiesgoSeleccionado = inEscenarioRiesgo;
  }

}
