import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { amdinBusiness, httpAccessAdminPage } from '@environments/environment-access-admin';
import { User, Business, Role, ResponseMessage } from '@app/_models';

@Component({ templateUrl: 'HTML_AddEditUserPage.html' })
export class AddEditUserComponent implements OnInit {
    form: FormGroup;

    user: User;
    role: Role;
    response: ResponseMessage;
    business: Business;

    loading = false;
    submitted = false;

    id: string;
    URLRedirectPage: string;

    esAdmin: boolean;
    listRoles: boolean;
    updateUser: boolean;
    addUser: boolean;

    listRolesBusiness: Role[] = [];

    userForm = new User();

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {

        this.listRoles = true;

        this.updateUser = false;
        this.addUser = false;

        this.role = new Role();

        if (this.route.snapshot.params.id){ this.updateUser = true; } else { this.addUser = true; }

        if (this.user.esAdmin || this.user.idRol === amdinBusiness.adminSociedad) {
            this.URLRedirectPage = httpAccessAdminPage.urlPageListUsers;
        } else { this.URLRedirectPage = '/'; }

        if (this.addUser) {

            this.form = this.formBuilder.group({
                identificacion: ['', Validators.required],
                nombre: ['', Validators.required],
                primerApellido: ['', Validators.required],
                segundoApellido: [''],
                email: ['', Validators.required],
                numeroTelefono: ['', Validators.required],
                role: [''],
                bus: [''],
                roles: [''],
                password: ['',  [Validators.required, Validators.minLength(6)]]
            });
        }

        if (this.updateUser) {

            this.id = this.route.snapshot.params.id;

            this.form = this.formBuilder.group({
                identificacion: ['', Validators.required],
                nombre: ['', Validators.required],
                primerApellido: ['', Validators.required],
                segundoApellido: [''],
                email: ['', Validators.required],
                numeroTelefono: ['', Validators.required],
                role: [''],
                bus: [''],
                roles: [''],
                password: ['']
            });

            this.form.controls.identificacion.disable();
            this.form.controls.role.disable();

            this.accountService.getUserById(this.id)
                .pipe(first())
                .subscribe(responseUser => {

                    this.f.identificacion.setValue(responseUser.identificacion);

                    const arrayNombre = responseUser.nombreCompleto.split(' ');

                    this.f.nombre.setValue(arrayNombre[0]);
                    this.f.primerApellido.setValue(arrayNombre[1]);
                    this.f.segundoApellido.setValue(arrayNombre[2]);

                    this.f.email.setValue(responseUser.email);
                    this.f.numeroTelefono.setValue(responseUser.numeroTelefono);

                    if (responseUser.idRol) {

                        this.accountService.getRoleById(responseUser.idRol)
                            .pipe(first())
                            .subscribe(responseRole => {

                                this.role = responseRole;
                                this.f.role.setValue(this.role.nombre);
                            },
                            error => { this.alertService.error(error); this.loading = false; });
                    } else { this.role = null; }
                },
                error => { this.alertService.error(error); this.loading = false; });
        }
    }

    get f() { return this.form.controls; }

    onSubmit() {

        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }
        this.loading = true;

        this.userForm.identificacion = this.form.get('identificacion').value;

        this.userForm.nombreCompleto =  this.form.get('nombre').value + ' ' +
                                        this.form.get('primerApellido').value + ' ' +
                                        this.form.get('segundoApellido').value;

        this.userForm.email = this.form.get('email').value;
        this.userForm.numeroTelefono = this.form.get('numeroTelefono').value;

        this.userForm.password = this.form.get('password').value;

        if (this.addUser) {
            this.accountService.addUser(this.userForm)
            .pipe(first())
            .subscribe( responseAddUser => {

                if (responseAddUser.exito) {
                    this.router.navigate([this.URLRedirectPage], { relativeTo: this.route });
                    this.alertService.success(responseAddUser.responseMesagge, { keepAfterRouteChange: true });
                }else{
                    this.alertService.error(responseAddUser.responseMesagge, { keepAfterRouteChange: true });
                }
                this.loading = false;
            },
            error => { console.log(error); this.alertService.error(error); this.loading = false; });
        }

        if (this.updateUser) {
            this.accountService.updateUser(this.id, this.userForm)
            .pipe(first())
            .subscribe(
                response => {
                    this.router.navigate([this.URLRedirectPage], { relativeTo: this.route });
                    this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                    this.loading = false;
                },
                error => { console.log(error); this.alertService.error(error); this.loading = false; });
        }
    }
}
