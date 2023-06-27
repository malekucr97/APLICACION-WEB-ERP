import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Compania, Module, User } from '@app/_models';
import { ScreenModule } from '@app/_models/admin/screenModule';
import { AccountService, AlertService } from '@app/_services';
import { httpAccessAdminPage } from '@environments/environment-access-admin';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-adminmodule',
  templateUrl: './adminmodule.component.html',
  styleUrls: [
    '../../../../assets/scss/app.scss',
    '../../../../assets/scss/administrator/app.scss',
  ],
})
export class AdminmoduleComponent implements OnInit {
  URLIndexAdminPage: string = httpAccessAdminPage.urlPageListModule;
  parametroTipoMantenimiento: string = undefined;

  userObservable: User;
  businessObservable: Compania;

  formAdminModule: FormGroup;
  submitFormAdminModule: boolean = false;
  get m() {
    return this.formAdminModule.controls;
  }

  tituloBasePantalla: string = 'Módulos';
  private baseIdentificadorReportesPowerBI: string = 'ID-BANKAP-BI-';
  readOnlyInputIdentficador: boolean = false;
  habilitaBtnNuevo: boolean = true;
  habilitaBtnActualiza: boolean = false;
  habilitaBtnRegistro: boolean = true;
  habilitaBtnEliminar: boolean = true;

  buscarModulo: string = '';
  lstModulos: Module[] = [];
  lstModulosComponente: Module[] = [];
  moduloSeleccionado: Module = undefined;

  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    if (this.route.snapshot.params.tipoMantenimiento) {
      this.parametroTipoMantenimiento = this.route.snapshot.params.tipoMantenimiento;
      this.userObservable = this.accountService.userValue;
      this.businessObservable = this.accountService.businessValue;
      this.iniciarFormulario();
      this.obtenerListaModulos();
    }
  }

  ngOnInit(): void {}

  //#region METODOS | FUNCIONES

  private ValidarTipoMantenimiento() {
    this.tituloBasePantalla = 'Módulos';
    if (this.parametroTipoMantenimiento == 'mantenimientoReportes') {
      this.tituloBasePantalla = 'Reportes Power BI';
      this.readOnlyInputIdentficador = true;
    } else {
      this.readOnlyInputIdentficador = false;
    }
  }

  private iniciarFormulario() {
    this.formAdminModule = this.formBuilder.group({
      Identificador: [null, [Validators.required, Validators.max(50)]],
      Nombre: [null, [Validators.required, Validators.max(50)]],
      Descripcion: [null, [Validators.required, Validators.max(200)]],
      DireccionLogo: [
        './assets/images/inra/ModulosBankap/ID-BANKAP-GENERAL.png',
        Validators.required,
      ],
      Estado: [true, Validators.required],
    });
    this.submitFormAdminModule = false;
    this.moduloSeleccionado = undefined;
    this.ValidarTipoMantenimiento();
    this.iniciarBotones(true);
  }

  private iniciarBotones(esParaAgregar: boolean) {
    this.habilitaBtnNuevo = !esParaAgregar;
    this.habilitaBtnRegistro = esParaAgregar;
    this.habilitaBtnActualiza = !esParaAgregar;
    this.habilitaBtnEliminar = !esParaAgregar;
  }

  private obtenerListaModulos() {
    // SE OBTIENE LA LISTA DE MODULOS ASOCIADOS AL NEGOCIO
    this.accountService
      .getModulesBusiness(this.businessObservable.id)
      .pipe(first())
      .subscribe((response) => {
        if (this.readOnlyInputIdentficador)
          this.lstModulos = response.filter((x) =>
            x.identificador.includes(this.baseIdentificadorReportesPowerBI)
          );
        else this.lstModulos = response;
        this.filtrarLista();
      });
  }

  private obtenerDatosFormulario(): Module {
    this.GenerarIdentificadorCuandoEsReporte();

    // SE OBTIENE LA INFORMACIÓN A GUARDAR
    this.alertService.clear();
    this.submitFormAdminModule = true;

    if (this.formAdminModule.invalid) {
      this.alertService.error('La información indicada no es válida.');
      return undefined;
    }

    // SE OBTIENE LA INFORMACIÓN INGRESADA DEL USUARIO
    const { Identificador, Nombre, Descripcion, DireccionLogo, Estado } =
      this.formAdminModule.controls;

    // SE DECLARA EL OBJETO
    let oModulo = new Module(
      this.moduloSeleccionado?.id ?? null,
      Identificador.value,
      Nombre.value,
      Descripcion.value,
      Estado.value ? 'Activo' : 'Inactivo',
      DireccionLogo.value,
      null,
      'Index'
    );

    return oModulo;
  }

  private GenerarIdentificadorCuandoEsReporte() {
    this.formAdminModule.patchValue({ Identificador: null });
    if (this.readOnlyInputIdentficador) {
      // SE OBTIENE EL NOMBRE DEL CONTROL INDICADO POR EL USUARIO
      const { Nombre } = this.formAdminModule.controls;
      let _nombre: string = Nombre.value;

      // SE VALIDA QUE EL NOMBRE NO ESTE VACÍO
      if (_nombre == '' || !_nombre) {
        this.alertService.error('La información indicada no es válida.');
        return;
      }

      // SE GENERA EL NUEVO IDENTIFICADOR ID-BANKAP-BI-[NOMBRE] PARA LOS REPORTES DE POWER BI
      let _identificadoGenerado: string = `${
        this.baseIdentificadorReportesPowerBI
      }${_nombre.replace(/\s/g, '').toLowerCase()}`;
      this.formAdminModule.patchValue({ Identificador: _identificadoGenerado });
    }
  }

  private AsignarRolEmpresa(inModulo: Module, idNegocio: number) {
    this.accountService
      .assignModuleToBusiness(inModulo.id, idNegocio)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.AsignarPantallaAModulo(inModulo, idNegocio);
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  private AsignarPantallaAModulo(inModulo: Module, idNegocio: number) {
    let estado: any = true;
    var pantallaForm = new ScreenModule(
      idNegocio,
      inModulo.id,
      '1',
      'Index',
      estado,
      null
    );
    pantallaForm.adicionadoPor = this.userObservable.identificacion;
    pantallaForm.fechaAdicion = new Date();

    this.accountService
      .postPantallaModulo(pantallaForm)
      .pipe(first())
      .subscribe(
        (response) => {
          if (response) {
            this.alertService.success(
              `Pantalla ${response.nombre} registrada con éxito.`
            );
            this.obtenerListaModulos();
            this.iniciarFormulario();
          } else {
            this.alertService.error(`No fue posible registrar la pantalla .`);
          }
        },
        (error) => {
          this.alertService.error(
            `Problemas al establecer la conexión con el servidor. Detalle: ${error}`
          );
        }
      );
  }

  //#endregion

  //#region EVENTOS

  filtrarLista() {
    if (this.buscarModulo == '') {
      this.lstModulosComponente = [...this.lstModulos];
    } else {
      this.lstModulosComponente = this.lstModulos.filter((x) =>
        x.nombre
          .toLocaleLowerCase()
          .includes(this.buscarModulo.toLocaleLowerCase())
      );
    }
  }

  seleccionarModulo(inModulo: Module) {
    this.moduloSeleccionado = inModulo;
    this.formAdminModule.patchValue({ Identificador: inModulo.identificador });
    this.formAdminModule.patchValue({ Nombre: inModulo.nombre });
    this.formAdminModule.patchValue({ Descripcion: inModulo.descripcion });
    this.formAdminModule.patchValue({ DireccionLogo: inModulo.pathLogo });
    this.iniciarBotones(false);
  }

  limpiarFormulario() {
    this.iniciarFormulario();
  }

  registrarModulo() {
    let oModuloIngresadoUsuario = this.obtenerDatosFormulario();
    if (!oModuloIngresadoUsuario) {
      return;
    }

    this.accountService
      .postModule(oModuloIngresadoUsuario)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.AsignarRolEmpresa(response.objetoDb, this.businessObservable.id);
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  actualizarModulo() {
    if (!this.moduloSeleccionado) {
      this.alertService.error('No se ha seleccionado una opción correcta.');
      return;
    }

    let oModuloIngresadoUsuario = this.obtenerDatosFormulario();
    if (!oModuloIngresadoUsuario) {
      return;
    }

    this.accountService
      .updateModule(oModuloIngresadoUsuario)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.alertService.success(response.responseMesagge);
          this.obtenerListaModulos();
          this.iniciarFormulario();
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  eliminarModulo() {
    if (!this.moduloSeleccionado) {
      return;
    }

    this.accountService
      .deleteModule(this.moduloSeleccionado)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.alertService.success(response.responseMesagge);
          this.obtenerListaModulos();
          this.iniciarFormulario();
        } else {
          this.alertService.error(response.responseMesagge);
        }
      });
  }

  //#endregion
}
