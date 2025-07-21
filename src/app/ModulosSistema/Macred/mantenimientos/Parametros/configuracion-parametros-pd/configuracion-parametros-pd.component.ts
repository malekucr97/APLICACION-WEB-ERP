import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Compania, Module, User } from '@app/_models';
import { VariablesPD } from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { first } from 'rxjs/operators';

@Component({
    templateUrl: './configuracion-parametros-pd.component.html',
    styleUrls: [
        '../../../../../../assets/scss/app.scss',
        '../../../../../../assets/scss/macred/app.scss',
        '../../../../../../assets/scss/tailwind.scss',
    ],
    standalone: false
})
export class ConfiguracionParametrosPdComponent implements OnInit {
  private nombrePantalla: string = 'configuracion-parametros-pd.html';

  // ## -- objetos suscritos -- ## //
  private userObservable: User;
  private moduleObservable: Module;
  private companiaObservable: Compania;

  // FORMULARIO PD
  formVariablesPD: UntypedFormGroup;
  submittedModeloPDForm: boolean = false;
  get f() {
    return this.formVariablesPD.controls;
  }

  mostrarLista: boolean = true;
  lstVariables: VariablesPD[] = [];

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
    this.consultarVariablesPD();
  }

  private consultarVariablesPD() {
    this.formVariablesPD = this.formBuilder.group({
      codigoVariablePD: [null],
      descripcion: [null, Validators.required],
      coeficiente: [null, Validators.required],
      campoEquivalente: [null, Validators.required],
      estado: [true],
    });

    this.macredService
      .getPDVariables(this.companiaObservable.id)
      .pipe(first())
      .subscribe((response) => {
        this.lstVariables = response;
      });
  }

  handleRegistrarVariable() {
    this.alertService.clear();
    this.submittedModeloPDForm = true;

    if (this.formVariablesPD.invalid) {
      return;
    }

    const { codigoVariablePD, descripcion, coeficiente, campoEquivalente, estado } =
      this.formVariablesPD.controls;

    let oVariablePD: VariablesPD = {
      id: codigoVariablePD.value ? codigoVariablePD.value : 0,
      codigoCompania: this.companiaObservable.id,
      descripcionVariable: descripcion.value,
      valorCoeficiente: coeficiente.value,
      codCampoEquivalente: campoEquivalente.value,
      usuarioCreacion: '',
      fechaCreacion: new Date(),
      estado: estado.value,
      usuarioModificacion: this.userObservable.nombreCompleto,
      fechaModificacion: new Date(),
    };

    this.macredService
      .createUpdatePDVariable(oVariablePD)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.alertService.success(response.responseMesagge);
          this.consultarVariablesPD();
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  handleEditarVariable(inVariable: VariablesPD) {
    this.formVariablesPD.patchValue({ codigoVariablePD: inVariable.id });
    this.formVariablesPD.patchValue({
      descripcion: inVariable.descripcionVariable,
    });
    this.formVariablesPD.patchValue({
      coeficiente: inVariable.valorCoeficiente,
    });
    this.formVariablesPD.patchValue({
      campoEquivalente: inVariable.codCampoEquivalente ?? '',
    });
    this.formVariablesPD.patchValue({ estado: inVariable.estado });
  }

  handleEliminarVariable({ id }: VariablesPD) {
    this.macredService
      .deletePDVariable(id)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.alertService.success(response.responseMesagge);
          this.consultarVariablesPD();
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }
}
