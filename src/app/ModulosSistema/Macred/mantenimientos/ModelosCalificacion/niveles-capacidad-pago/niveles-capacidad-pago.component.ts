import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Compania, Module, User } from '@app/_models';
import { MacNivelCapacidadPago } from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-niveles-capacidad-pago',
  templateUrl: './niveles-capacidad-pago.component.html',
  styleUrls: [
    '../../../../../../assets/scss/app.scss',
    '../../../../../../assets/scss/macred/app.scss',
    '../../../../../../assets/scss/tailwind.scss',
  ],
})
export class NivelesCapacidadPagoComponent implements OnInit {
  private nombrePantalla: string = 'niveles-capacidad-pago.html';

  // ## -- objetos suscritos -- ## //
  private userObservable: User;
  private moduleObservable: Module;
  private companiaObservable: Compania;

  // VARIABLES
  lstNivelesCapacidadPago: MacNivelCapacidadPago[] = [];
  nivelCapacidadPagoSeleccionado: MacNivelCapacidadPago = undefined;

  // FORMULARIO
  frmNivelCapacidadPago: UntypedFormGroup;
  submittedForm: boolean = false;
  get f() {
    return this.frmNivelCapacidadPago.controls;
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
    this.ProcesoIniciarPantalla();
  }

  private ProcesoIniciarPantalla() {
    this.ConsultarNivelesCapacidadPago();
    this.IniciarFormulario();
  }

  private ConsultarNivelesCapacidadPago() {
    this.macredService
      .getNivelesCapacidadPago(this.companiaObservable.id, true)
      .pipe(first())
      .subscribe((response) => {
        this.lstNivelesCapacidadPago = response;
      });
  }

  private IniciarFormulario() {
    this.frmNivelCapacidadPago = this.formBuilder.group({
      codNivelCapPAgo: [null],
      descripcion: [null, [Validators.required, Validators.maxLength(100)]],
      puntaje: [
        null,
        [Validators.required, Validators.min(-999), Validators.max(999)],
      ],
      rangoInicial: [
        null,
        [Validators.required, Validators.min(-999), Validators.max(999)],
      ],
      rangoFinal: [
        null,
        [Validators.required, Validators.min(-999), Validators.max(999)],
      ],
      tieneCapacidadPago: [false],
      estado: [false],
    });
    this.submittedForm = false;
  }

  handleRegistrarNivelCapacidadPago() {
    this.alertService.clear();
    this.submittedForm = true;

    if (this.frmNivelCapacidadPago.invalid) {
      return;
    }

    const {
      descripcion,
      puntaje,
      rangoInicial,
      rangoFinal,
      tieneCapacidadPago,
      estado,
    } = this.frmNivelCapacidadPago.controls;

    let oNivelCapacidadPago: MacNivelCapacidadPago = {
      id: this.nivelCapacidadPagoSeleccionado?.id ?? 0,
      codigoCompania: this.companiaObservable.id,
      descripcion: descripcion.value,
      puntaje: puntaje.value,
      rangoInicial: rangoInicial.value,
      rangoFinal: rangoFinal.value,
      tieneCapacidadPago: tieneCapacidadPago.value,
      estado: estado.value,
      adicionadoPor: this.userObservable.nombreCompleto,
      fechaAdicion: new Date(),
      modificadoPor: this.userObservable.nombreCompleto,
      fechaModificacion: new Date(),
    };

    if (this.nivelCapacidadPagoSeleccionado) {
      //SE DEBE ACTUALIZAR
      this.macredService
        .putNivelesCapacidadPago(oNivelCapacidadPago.id, oNivelCapacidadPago)
        .pipe(first())
        .subscribe((response) => {
          if (response.exito)
            this.alertService.success(response.responseMesagge);
          else this.alertService.error(response.responseMesagge);
          this.ProcesoIniciarPantalla();
        });
    } else {
      //SE DEBE AGREGAR UN NUEVO REGISTRO
      this.macredService
        .postNivelesCapacidadPago(oNivelCapacidadPago)
        .pipe(first())
        .subscribe((response) => {
          if (response.exito)
            this.alertService.success(response.responseMesagge);
          else this.alertService.error(response.responseMesagge);
          this.ProcesoIniciarPantalla();
        });
    }
  }

  handleEditarNivelCapPago(inNivelCapacidadPago: MacNivelCapacidadPago) {
    this.nivelCapacidadPagoSeleccionado = inNivelCapacidadPago;
    this.frmNivelCapacidadPago.patchValue({
      codNivelCapPAgo: inNivelCapacidadPago.id,
    });
    this.frmNivelCapacidadPago.patchValue({
      descripcion: inNivelCapacidadPago.descripcion,
    });
    this.frmNivelCapacidadPago.patchValue({
      puntaje: inNivelCapacidadPago.puntaje,
    });
    this.frmNivelCapacidadPago.patchValue({
      rangoInicial: inNivelCapacidadPago.rangoInicial,
    });
    this.frmNivelCapacidadPago.patchValue({
      rangoFinal: inNivelCapacidadPago.rangoFinal,
    });
    this.frmNivelCapacidadPago.patchValue({
      tieneCapacidadPago: inNivelCapacidadPago.tieneCapacidadPago,
    });
    this.frmNivelCapacidadPago.patchValue({
      estado: inNivelCapacidadPago.estado,
    });
  }
}
