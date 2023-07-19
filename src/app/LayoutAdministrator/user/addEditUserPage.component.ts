import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import {
  amdinBusiness,
  httpAccessAdminPage
} from '@environments/environment-access-admin';
import { User, Role, ResponseMessage } from '@app/_models';
import { Compania } from '../../_models/modules/compania';
import { httpLandingIndexPage } from '@environments/environment';

@Component({ templateUrl: 'HTML_AddEditUserPage.html' })
export class AddEditUserComponent implements OnInit {
  form: FormGroup;

  user: User;
  role: Role;
  response: ResponseMessage;
  business: Compania;

  loading = false;
  submitted = false;

  pidentificationUser: string;
  URLRedirectPage: string;

  esAdmin: boolean;
  updateUser: boolean;
  addUser: boolean;

  listRolesBusiness: Role[] = [];

  private Home: string = httpLandingIndexPage.homeHTTP;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {
    this.user = this.accountService.userValue;
    this.business = this.accountService.businessValue;
  }

  ngOnInit() {
    this.addUser = false;
    this.updateUser = false;

    this.role = new Role();

    // valida si se va a registrar o modificar un usuario
    if (this.route.snapshot.params.id) {
      this.updateUser = true;
      this.pidentificationUser = this.route.snapshot.params.id;
    } else {
      this.addUser = true;
    }

    if (this.user.esAdmin || this.user.idRol === amdinBusiness.adminSociedad) {
      this.URLRedirectPage = httpAccessAdminPage.urlPageListUsers;
    } else {
      this.URLRedirectPage = this.Home;
    }

    if (this.addUser) {
      this.form = this.formBuilder.group({
        identificacion: ['', Validators.required],
        nombre: ['', Validators.required],
        primerApellido: ['', Validators.required],
        segundoApellido: [''],
        email: ['', Validators.required],
        numeroTelefono: ['', Validators.required],
        role: [''],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    }

    if (this.updateUser) {
      this.form = this.formBuilder.group({
        identificacion: ['', Validators.required],
        nombre: ['', Validators.required],
        primerApellido: ['', Validators.required],
        segundoApellido: [''],
        email: ['', Validators.required],
        numeroTelefono: ['', Validators.required],
        role: [''],
        password: [''],
      });

      this.form.controls.identificacion.disable();
      this.form.controls.role.disable();

      this.accountService
        .getUserByIdentification(this.pidentificationUser)
        .pipe(first())
        .subscribe(
          (responseUser) => {
            this.f.identificacion.setValue(responseUser.identificacion);

            let arrayNombre = responseUser.nombreCompleto.split(' ');

            this.f.nombre.setValue(arrayNombre[0]);
            this.f.primerApellido.setValue(arrayNombre[1]);
            this.f.segundoApellido.setValue(arrayNombre[2]);

            this.f.email.setValue(responseUser.email);
            this.f.numeroTelefono.setValue(responseUser.numeroTelefono);

            if (responseUser.idRol) {
              this.accountService
                .getRoleById(responseUser.idRol)
                .pipe(first())
                .subscribe(
                  (responseRole) => {
                    this.role = responseRole;
                    this.f.role.setValue(this.role.nombre);
                  },
                  (error) => {
                    this.alertService.error(error);
                    this.loading = false;
                  }
                );
            } else {
              this.role = null;
            }
          },
          (error) => {
            this.alertService.error(error);
            this.loading = false;
          }
        );
    }
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;

    this.alertService.clear();

    if (this.form.invalid) {
      return;
    }

    let userForm: User = new User();

    userForm.identificacion = this.form.get('identificacion').value;

    userForm.nombreCompleto =
      this.form.get('nombre').value +
      ' ' +
      this.form.get('primerApellido').value +
      ' ' +
      this.form.get('segundoApellido').value;

    userForm.email = this.form.get('email').value;
    userForm.numeroTelefono = this.form.get('numeroTelefono').value;

    userForm.password = this.form.get('password').value;

    if (this.addUser) {
      this.accountService
        .addUser(userForm)
        .pipe(first())
        .subscribe(
          (responseAddUser) => {
            if (responseAddUser.exito) {
              if (responseAddUser.objetoDb) {
                this.asociarUsuarioEmpresa(responseAddUser.objetoDb);
              }
            } else {
              this.alertService.error(responseAddUser.responseMesagge, {
                keepAfterRouteChange: true,
              });
            }
            this.loading = false;
          },
          (error) => {
            console.log(error);
            this.alertService.error(error);
            this.loading = false;
          }
        );
    }

    if (this.updateUser) {
      this.accountService
        .updateUser(this.pidentificationUser, userForm)
        .pipe(first())
        .subscribe(
          (responseUpdate) => {
            if (responseUpdate.exito) {
              this.alertService.success(responseUpdate.responseMesagge, {
                keepAfterRouteChange: true,
              });
              this.router.navigate([this.URLRedirectPage], {
                relativeTo: this.route,
              });
            } else {
              this.alertService.error(responseUpdate.responseMesagge, {
                keepAfterRouteChange: true,
              });
            }
            this.loading = false;
          },
          (error) => {
            console.log(error);
            this.alertService.error(error);
            this.loading = false;
          }
        );
    }
  }

  //#region METODOS-FUNCIONES

  private asociarUsuarioEmpresa(inUsuarioCreado: User) {
      // SE VALIDA QUE LA COMPAÑÍA EXISTA
      if (this.business) {
        // SE CONSUME EL SERVICIO PARA ASIGNAR LA EMPRESA AL USUARIO CREADO
        this.accountService
          .assignBusinessUser(inUsuarioCreado.id, this.business.id)
          .pipe(first())
          .subscribe(
            (response) => {
              if (response.exito) {
                this.alertService.success(response.responseMesagge);
                this.router.navigate([this.URLRedirectPage], {
                  relativeTo: this.route,
                });
              } else {
                this.alertService.error(response.responseMesagge);
              }
            },
            (error) => {
              this.alertService.error(error);
            }
          );
      }
  }

  //#endregion
}
