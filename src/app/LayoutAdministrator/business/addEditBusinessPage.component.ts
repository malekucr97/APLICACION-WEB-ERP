import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { Compania } from '../../_models/modules/compania';
import { User } from '@app/_models';
import { httpAccessAdminPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';

@Component({ templateUrl: 'HTML_AddEditBusinessPage.html' })
export class AddEditBusinessComponent extends OnSeguridad implements OnInit {
  form: FormGroup;
  userObserver: User;

  business: Compania;

  pidBusiness: number;

  loading = false;
  submitted = false;

  updateBusiness: boolean;
  addBusiness: boolean;

  public urladminListBusiness: string = httpAccessAdminPage.urlPageListBusiness;

  // public IdUserSessionRequest : string ;
  // public UserSessionRequest : string ;
  // public BusinessSessionRequest : string ;
  // public ModuleSessionRequest : string ;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private alertService: AlertService ) {

    super(alertService, accountService, router);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
    if (!super.userAuthenticateAdmin()) { this.accountService.logout(); return; }
    // ***************************************************************

    this.userObserver = this.accountService.userValue;

    // this.inicializaHeaders();
  }

  // inicializaHeaders() : void {
  //   this.IdUserSessionRequest = this.userObserver ? this.userObserver.id.toString() : 'noIdUserValue';
  //   this.UserSessionRequest = this.userObserver ? this.userObserver.nombreCompleto.toString() : 'noUserNameValue';
  //   this.BusinessSessionRequest = this.userObserver ? this.userObserver.empresa.toString() : 'noBusinessValue';
  //   this.ModuleSessionRequest = 'admin';

  //   // this.IdUserSessionRequest = this.userObserver.id.toString();
  //   // this.UserSessionRequest = this.userObserver.nombreCompleto.toString();
  //   // this.BusinessSessionRequest = this.userObserver.empresa.toString();
  //   // this.ModuleSessionRequest = 'admin';
  // }

  ngOnInit() {

    this.updateBusiness = false;
    this.addBusiness = false;

    if (this.route.snapshot.params.pidBusiness) {
      this.pidBusiness = this.route.snapshot.params.pidBusiness;
      this.updateBusiness = true;
    } else {
      this.addBusiness = true;
    }

    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      cedulajuridica: ['', Validators.required],
      mantenimientoReportes: [false, Validators.required],
      cuentaCorreoDefecto: [false, Validators.required],
      tamanoModuloDefecto: [false, Validators.required],
    });

    if (this.updateBusiness) {
      this.accountService.getBusinessById(this.pidBusiness,this._HIdUserSessionRequest, this._HBusinessSessionRequest)
        .pipe(first())
        .subscribe(
          (responseBusiness) => {
            this.f.nombre.setValue(responseBusiness.nombre);
            this.f.cedulajuridica.setValue(responseBusiness.cedulaJuridica);
            this.f.mantenimientoReportes.setValue(responseBusiness.mantenimientoReportes);
            this.f.cuentaCorreoDefecto.setValue(responseBusiness.cuentaCorreoDefecto);
            this.f.tamanoModuloDefecto.setValue(responseBusiness.tamanoModuloDefecto);
          },
          (error) => {
            this.alertService.error(error);
          }
        );
    }
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    let currentDate = new Date();

    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    this.business = new Compania();

    this.business.nombre = this.form.get('nombre').value;
    this.business.cedulaJuridica = this.form.get('cedulajuridica').value;
    this.business.adicionadoPor = this.userObserver.identificacion;
    this.business.fechaAdicion = currentDate;
    this.business.correoElectronico = 'No registrado';
    this.business.tipoIdentificacion = 'NA';
    this.business.detalleDireccion = 'No registrado';
    this.business.telefono = 'NA';
    this.business.mantenimientoReportes = this.form.get('mantenimientoReportes').value;
    this.business.cuentaCorreoDefecto = this.form.get('cuentaCorreoDefecto').value;
    this.business.tamanoModuloDefecto = this.form.get('tamanoModuloDefecto').value;

    if (this.addBusiness) {
      this.accountService.addBusiness(this.business,this._HIdUserSessionRequest,
                                                    // this.UserSessionRequest,
                                                    this._HBusinessSessionRequest)
        .pipe(first())
        .subscribe(
          (response) => {
            this.router.navigate([this.urladminListBusiness], {
              relativeTo: this.route,
            });

            if (response.exito) {
              this.alertService.success(response.responseMesagge, {
                keepAfterRouteChange: true,
              });
            } else {
              this.alertService.error(response.responseMesagge, {
                keepAfterRouteChange: true,
              });
            }
            this.loading = false;
          },
          (error) => {
            this.alertService.error(error);
            this.loading = false;
          }
        );
    }

    if (this.updateBusiness) {
      this.business.id = this.pidBusiness;

      this.accountService.updateBusiness(this.business, this._HIdUserSessionRequest, this._HBusinessSessionRequest)
        .pipe(first())
        .subscribe(
          (response) => {
            this.router.navigate([this.urladminListBusiness], {
              relativeTo: this.route,
            });

            if (response.exito) {
              this.alertService.success(response.responseMesagge, {
                keepAfterRouteChange: true,
              });
            } else {
              this.alertService.error(response.responseMesagge, {
                keepAfterRouteChange: true,
              });
            }
            this.loading = false;
          },
          (error) => {
            this.alertService.error(error);
            this.loading = false;
          }
        );
    }
  }
}
