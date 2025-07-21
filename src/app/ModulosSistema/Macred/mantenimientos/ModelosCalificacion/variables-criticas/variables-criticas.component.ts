import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { Compania, Module, User } from '@app/_models';
import { MacVariablesCriticas } from '@app/_models/Macred';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-variables-criticas',
    templateUrl: './variables-criticas.component.html',
    styleUrls: [
        '../../../../../../assets/scss/app.scss',
        '../../../../../../assets/scss/macred/app.scss',
        '../../../../../../assets/scss/tailwind.scss',
    ],
    standalone: false
})
export class VariablesCriticasComponent implements OnInit {
  private nombrePantalla: string = 'variables-criticas';

  private userObservable: User;
  private moduleObservable: Module;
  private companiaObservable: Compania;

  lstVariablesCriticas: MacVariablesCriticas[] = [];
  variableCritidaSeleccionada: MacVariablesCriticas = undefined;

  formVariableCritica: UntypedFormGroup;
  submittedIndicadoresRelevantes: boolean = false;
  get f() {
    return this.formVariableCritica.controls;
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

  //METODOS - FUNCIONES

  private inicializarDatosComponente() {
    this.variableCritidaSeleccionada = undefined;
    this.formVariableCritica = this.formBuilder.group({
      codVariable: [0],
      descripcion: [null, [Validators.required, Validators.maxLength(100)]],
      estado: [true],
    });
    this.submittedIndicadoresRelevantes = false;
    this.listarVariablesCriticas();
  }

  private listarVariablesCriticas() {
    this.lstVariablesCriticas = [];
    this.macredService
      .getVariablesCriticas(this.companiaObservable.id)
      .pipe(first())
      .subscribe((response) => {
        this.lstVariablesCriticas = response;
      });
  }

  //EVENTOS

  handleSubmitVariableCritica() {
    this.alertService.clear();
    this.submittedIndicadoresRelevantes = true;
    if (this.formVariableCritica.invalid) {
      return;
    }

    const { codVariable, descripcion, estado } =
      this.formVariableCritica.controls;

    let oVariableCritica: MacVariablesCriticas = {
      codigoCompania: this.companiaObservable.id,
      codVariable: this.variableCritidaSeleccionada?.codVariable
        ? this.variableCritidaSeleccionada.codVariable
        : codVariable.value,
      descripcion: descripcion.value,
      estado: estado.value,
      usuarioCreacion: this.userObservable.nombreCompleto,
      fechaCreacion: new Date(),
      usuarioModificacion: this.userObservable.nombreCompleto,
      fechaModificacion: new Date(),
    };

    if (this.variableCritidaSeleccionada && oVariableCritica.codVariable > 0) {
      this.macredService
        .putVariablesCriticas(
          this.variableCritidaSeleccionada.codVariable,
          oVariableCritica
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
      this.macredService
        .postVariablesCriticas(oVariableCritica)
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
  }

  handleSeleccionarVariableCritica(inVariableCritica: MacVariablesCriticas) {
    if (!inVariableCritica) {
      return;
    }
    this.variableCritidaSeleccionada = inVariableCritica;
    this.formVariableCritica = this.formBuilder.group({
      codVariable: [this.variableCritidaSeleccionada.codVariable],
      descripcion: [
        this.variableCritidaSeleccionada.descripcion,
        [Validators.required, Validators.maxLength(100)],
      ],
      estado: [this.variableCritidaSeleccionada.estado],
    });
  }

  handleEliminarVariableCritica(inVariableCritica: MacVariablesCriticas) {
    if (!inVariableCritica) {
      return;
    }

    this.macredService
      .deleteVariablesCriticas(inVariableCritica.codVariable)
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
}
