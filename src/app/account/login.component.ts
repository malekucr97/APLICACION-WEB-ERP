import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { administrator, AuthStatesApp, httpLandingIndexPage } from '@environments/environment-access-admin';
import { User } from '@app/_models';

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

                    if (AuthStatesApp.inactive === responseObjectLogin.estado) {
                        this.router.navigate([httpLandingIndexPage.indexHTTPInactiveUser]);
                        return;
                    }
                    if (AuthStatesApp.pending === responseObjectLogin.estado) {
                        this.router.navigate([httpLandingIndexPage.indexHTTPPendingUser]);
                        return;
                    }
                    if (!responseObjectLogin.idRol) { 
                        this.router.navigate( [httpLandingIndexPage.indexHTTPNotRolUser] ); 
                        return; 
                    }

                    responseObjectLogin.esAdmin = false;
                    this.accountService.getRoleById(responseObjectLogin.idRol)
                    .pipe(first())
                    .subscribe( responseObjectRol => {
    
                        if (responseObjectRol.estado === AuthStatesApp.inactive) {
                            this.router.navigate([httpLandingIndexPage.indexHTTPInactiveRolUser]);
                            return;
                        }

                        // si el usuario que inicia sesión es administrador
                        if (administrator.id === responseObjectRol.id) {
                                
                                responseObjectLogin.esAdmin = true;
                        }
                        this.loading = false;
                        this.submitted = false;

                        let user : User = responseObjectLogin;
                        
                        this.accountService.updateLocalUser(user);
                        this.router.navigate([this.UrlHome]);
                    });
                }
            },
            (error) => {
                this.alertService.error('Problemas al obtener respuesta del Servidor. Por favor contacte al administrador.');
            });
    }
}
