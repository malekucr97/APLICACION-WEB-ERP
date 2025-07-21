import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Compania, Module, User } from '@app/_models';
import { TipoActividadEconomica } from '@app/_models/Macred';
import { AccountService, AlertService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-tipo-actividad-economica',
    templateUrl: './Tipo-actividad-economica.component.html',
    styleUrls: [
        '../../../../../../assets/scss/app.scss',
        '../../../../../../assets/scss/macred/app.scss',
        '../../../../../../assets/scss/tailwind.scss',
    ],
    standalone: false
})
export class TipoActividadEconomicaComponent implements OnInit {
  private nombrePantalla: string =
    'tipo-actividad-economica.html';

  // ## -- objetos suscritos -- ## //
  private userObservable: User;
  private moduleObservable: Module;
  private companiaObservable: Compania;

  // FORMULARIO ACTIVIDAD ECONOMICA
  formActividadEconomica: UntypedFormGroup;
  submittedActividadEconomicaForm: boolean = false;
  get f() {
    return this.formActividadEconomica.controls;
  }

  lstActividades: TipoActividadEconomica[] = [];
  _tipoActividadEconomica: TipoActividadEconomica = undefined;


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

    this.ConsultarTipoActividadesEconomicos();

  }

  private ConsultarTipoActividadesEconomicos () {
    this.formActividadEconomica = this.formBuilder.group({
      descripcion: [null, [Validators.required, Validators.maxLength(100)]],
      estado: [true],
    });

    this.macredService
      .getTiposActividadesEconomicas(this.companiaObservable.id)
      .pipe(first())
      .subscribe((response) => {
        this.lstActividades = response;
      });
  }

  handleRegistrarTipoActividadEconomica() {
    this.alertService.clear();
    this.submittedActividadEconomicaForm = true;

    if (this.formActividadEconomica.invalid) {
      return;
    }

    const { descripcion, estado } = this.formActividadEconomica.controls;

    let oModeloActividadEconomica: TipoActividadEconomica = {
      codActividadEconomica: this._tipoActividadEconomica?.codActividadEconomica ?? 0,
      codigoCompania: this.companiaObservable.id,
      descripcion: descripcion.value,
      estado: estado.value,
      usuarioCreacion: this.userObservable.nombreCompleto,
      fechaCreacion: new Date(),
      usuarioModificacion: this.userObservable.nombreCompleto,
      fechaModificacion: new Date(),
    };

    if (!this._tipoActividadEconomica) {
      // SE CREA UNA NUEVA ACTIVIDAD ECONOMICA
      this.macredService
        .postTipoActividadEconomico(oModeloActividadEconomica)
        .pipe(first())
        .subscribe((response) => {
          if (response.exito) {
            this.alertService.success(response.responseMesagge);
            this.ConsultarTipoActividadesEconomicos();
          } else {
            this.alertService.error(response.responseMesagge);
          }
        });
    }
    else{
      // SE ACTUALIZA LA ACTIVIDAD ECONOMICA
      this.macredService
      .putTipoActividadEconomico(this._tipoActividadEconomica.codActividadEconomica,oModeloActividadEconomica)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.alertService.success(response.responseMesagge);
          this.ConsultarTipoActividadesEconomicos();
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
    }

    this._tipoActividadEconomica = undefined;

  }

  handleEditarActividadEconomica(inActividadEconomica: TipoActividadEconomica){
    this._tipoActividadEconomica = inActividadEconomica;
    this.formActividadEconomica.patchValue({ descripcion: inActividadEconomica.descripcion });
    this.formActividadEconomica.patchValue({ estado: inActividadEconomica.estado });
  }

  handleEliminarActividadEconomica(inCodigoActividadEconomica: number){
    this.macredService
    .deleteTipoActividadEconomico(inCodigoActividadEconomica, this.companiaObservable.id)
    .pipe(first())
    .subscribe((response) => {
      if (response.exito) {
        this.alertService.success(response.responseMesagge);
        this.ConsultarTipoActividadesEconomicos();
      } else {
        this.alertService.error(response.responseMesagge);
      }
    });
  }

}
