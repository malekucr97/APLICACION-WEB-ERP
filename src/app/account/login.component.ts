import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { administrator, httpAccessAdminPage, AuthStatesApp } from '@environments/environment-access-admin';
import { httpAccessPage } from '@environments/environment';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {

    form: FormGroup;

    loading = false;
    submitted = false;

    private UrlHome : string;

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
        this.loading = true;

        if (this.form.invalid)
            return;

        let userName : string = this.f.username.value;
        let password : string = this.f.password.value;

        this.accountService.login(userName, password)
            .pipe(first())
            .subscribe( responseObjectLogin => {

                if (responseObjectLogin) {

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

                            // si el usuario que inicia sesión es administrador
                            if (administrator.esAdministrador === responseObjectRol.esAdministrador) {

                                // si es administrador del sistema
                                if (administrator.id === responseObjectRol.id) { 
                                    responseObjectLogin.esAdmin = true;
                                }

                                this.accountService.updateLocalUser(responseObjectLogin);
                                this.router.navigate([httpAccessAdminPage.urlPageAdministrator]);
                                return;

                                // inicia sesión como usuario normal del sistema
                                // redirecciona a home
                            } else {
                                this.accountService.updateLocalUser(responseObjectLogin);
                                this.router.navigate([this.UrlHome]);
                                return;
                            }
                        });
                        this.loading = false;
                        this.submitted = false;
                    }
                },
                error => {
                    this.alertService.error('Usuario o contraseña incorrectos.');
                    this.loading = false;
                });
    }
}
