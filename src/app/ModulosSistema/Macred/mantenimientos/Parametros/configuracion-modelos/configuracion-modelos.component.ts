import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Compania, User, Module } from '@app/_models';
import { ModelosPD } from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { first } from 'rxjs/operators';

@Component({
  templateUrl: './configuracion-modelos.component.html',
  styleUrls: [
    '../../../../../../assets/scss/app.scss',
    '../../../../../../assets/scss/macred/app.scss',
  ],
})
export class ConfiguracionModelosComponent implements OnInit {
  private nombrePantalla: string = 'configuracion-modelos.html';

  // ## -- objetos suscritos -- ## //
  private userObservable: User;
  private moduleObservable: Module;
  private companiaObservable: Compania;

  // FORMULARIO PD
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
    private router: Router,
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
      descripcion: [null, Validators.required],
      estado: [null],
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

    const { codigoModeloPD, descripcion } = this.formModeloPD.controls;

    let oModeloPD: ModelosPD = {
      id: 0,
      codigoCompania: this.companiaObservable.id,
      codigoModeloPD: codigoModeloPD.value,
      descripcion: descripcion.value,
      estado: true,
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
          this.consultarModelosPD();
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  handleEditarModelo(modelo: ModelosPD) {}

  handleEliminarModelo(modeloId: number) {
    this.macredService
      .deletePDModelo(modeloId)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.alertService.success(response.responseMesagge);
          this.consultarModelosPD();
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }
}
