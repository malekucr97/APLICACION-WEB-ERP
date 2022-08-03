import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User } from '@app/_models';
import { administrator, httpAccessAdminPage, AuthStatesApp } from '@environments/environment-access-admin';
import { httpAccessPage } from '@environments/environment';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {

    form: FormGroup;
    // user: User;

    loading = false;
    submitted = false;
    // login: boolean;

    userName: string; password: string; UrlHome: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService ) { }

    ngOnInit() {

        this.alertService.clear();

        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.UrlHome = this.route.snapshot.queryParams.returnUrl || '/';
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) 
            return;

        this.loading = true;

        this.userName = this.f.username.value;
        this.password = this.f.password.value;

        // -- >> bandera inicio sesión
        // this.login = false;

        this.accountService.login(this.userName, this.password)
            .pipe(first())
            .subscribe( responseObjectLogin => {

                if (responseObjectLogin) {

                    // this.user = responseObjectLogin;

                    // -- >> valida que el estado del usuario sea válido
                    if (AuthStatesApp.inactive === responseObjectLogin.estado) { 
                        this.router.navigate([httpAccessPage.urlPageInactiveUser]); 
                        return; 
                    }
                    if (AuthStatesApp.pending === responseObjectLogin.estado) { 
                        this.router.navigate([httpAccessPage.urlPagePending]); 
                        return; 
                    }
                    if (!responseObjectLogin.idRol) { 
                        this.router.navigate( [httpAccessPage.urlPageNotRol] ); 
                        return; 
                    }

                    responseObjectLogin.esAdmin = false;
                    this.accountService.getRoleById(responseObjectLogin.idRol)
                        .pipe(first())
                        .subscribe( responseObjectRol => {

                            // -- >> valida que el rol del usuario esté activo
                            if (AuthStatesApp.inactive === responseObjectRol.estado) {
                                this.router.navigate([httpAccessPage.urlPageInactiveRol]); 
                                return;
                            }

                            // -- >> inicio de sesión exitoso
                            // this.login = true;

                            // si el usuario que inicia sesión es administrador
                            if (administrator.esAdministrador === responseObjectRol.esAdministrador) {

                                // si es administrador del sistema
                                if (administrator.id === responseObjectRol.id) { 
                                    responseObjectLogin.esAdmin = true;
                                }

                                this.accountService.updateLocalUser(responseObjectLogin);
                                this.router.navigate([httpAccessAdminPage.urlPageAdministrator]);
                                return;

                            } else {
                                // this.accountService.updateLocalUser(responseObjectLogin);
                                this.router.navigate([this.UrlHome]);
                                return;
                            }
                        });
                    }
                },
                error => {
                    this.alertService.error('Usuario o contraseña incorrectos.');
                    this.loading = false;
                });
    }
}
