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

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private alertService: AlertService ) {

    super(alertService, accountService, router);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
    if (!super.userAuthenticateAdmin()) this.accountService.logout();
    // ***************************************************************

    this.userObserver = this.accountService.userValue;
  }

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
    });

    if (this.updateBusiness) {
      this.accountService
        .getBusinessById(this.pidBusiness)
        .pipe(first())
        .subscribe(
          (responseBusiness) => {
            this.f.nombre.setValue(responseBusiness.nombre);
            this.f.cedulajuridica.setValue(responseBusiness.cedulaJuridica);
            this.f.mantenimientoReportes.setValue(responseBusiness.mantenimientoReportes);
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

    if (this.addBusiness) {
      this.accountService
        .addBusiness(this.business)
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

      this.accountService
        .updateBusiness(this.business)
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
