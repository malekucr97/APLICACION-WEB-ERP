import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

import { administrator } from '@environments/environment';

import { usAuth } from '@environments/environment';
import { rolAuth } from '@environments/environment';

import { httpAccessPage } from '@environments/environment';
import { User } from '@app/_models';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    UrlHome: string;
    user: User;

    public nologin: boolean;
    public messageNoLogin: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {

        this.alertService.clear();

        this.user = null;

        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.UrlHome = this.route.snapshot.queryParams.returnUrl || '/';
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) return;

        this.loading = true;
        this.accountService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe( responseObjectLogin => {

                if(responseObjectLogin) {

                    this.nologin = false;

                    this.user = responseObjectLogin;

                    // -- >> valida que el estado del usuario sea válido
                    if (usAuth.us_inactive === this.user.estado) { this.router.navigate([httpAccessPage.urlPageInactiveUser]); return; }
                    if (usAuth.us_pending === this.user.estado) { this.router.navigate([httpAccessPage.urlPagePending]); return; }
                    if (!this.user.idRol) { this.router.navigate( [httpAccessPage.urlPageNotRol] ); return; }

                    this.accountService.getRoleById(this.user.idRol)
                        .pipe(first())
                        .subscribe( responseObjectRol => {

                            // -- >> valida que el rol del usuario no esté inactivo
                            if (rolAuth.rol_inactive === responseObjectRol.estado) { this.router.navigate([httpAccessPage.urlPageInactiveRol]); return; }

                            this.user.esAdmin = false;

                            // valida si el usuario que inicia sesión es el administrador
                            if (administrator.flag === responseObjectRol.esAdministrador) {

                                // valida si el usuario que inicia sesión es el administrador del sistema
                                if (administrator.id === responseObjectRol.id){ this.user.esAdmin = true; }

                                this.accountService.updateLocalUser(this.user);

                                this.router.navigate([administrator.urlRedirect]);
                                return;
                            
                            } else {
                                this.accountService.updateLocalUser(this.user);
                                this.router.navigate([this.UrlHome]);
                                return;
                            }
                        });
                    // -- >> si el usuario no está registrado en el sistema
                    } else {
                        this.nologin = true;
                        this.loading = false;
                        this.messageNoLogin = 'Usuario o contraseña incorrectos';
                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
