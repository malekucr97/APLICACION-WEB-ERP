import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { administrator, httpLandingIndexPage, inactive } from '@environments/environment';
import { User } from '@app/_models';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {

    form : FormGroup ;

    userLog : User = new User ;

    loading     : boolean = false;
    submitted   : boolean = false;

    private UrlHome : string;

    _httpInactiveUserPage   : string = httpLandingIndexPage.indexHTTPInactiveUser;
    _httpPendingUserPage    : string = httpLandingIndexPage.indexHTTPPendingUser;
    _httpNotRoleUserPage    : string = httpLandingIndexPage.indexHTTPNotRolUser;
    _httpBlockedUserPage    : string = httpLandingIndexPage.indexHTTPBlockedUser;

    _httpInactiveRolePage   : string = httpLandingIndexPage.indexHTTPInactiveRolUser;

    constructor(private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private accountService: AccountService,
                private alertService: AlertService ) {

                    this.userLog.codeNoLogin = '404';

                    this.inicializaFormularioLogin();

                    this.UrlHome = this.route.snapshot.queryParams.returnUrl || '/';
    }

    get f() { return this.form.controls; }

    ngOnInit() { }

    inicializaFormularioLogin () :void {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onSubmit() {

        this.alertService.clear();

        this.submitted  = true;
        this.loading    = true;

        if (this.form.invalid) return;

        let userName : string = this.f.username.value;
        let password : string = this.f.password.value;

        this.accountService.login(userName.trim(), password.trim())
            .pipe(first())
            .subscribe( responseLogin => {

                if (responseLogin) {

                    this.userLog = responseLogin;

                    switch(this.userLog.codeNoLogin) {

                        // **********************************
                        // inicio de sesión exitoso
                        case "202": {

                            this.userLog.esAdmin = administrator.identification === this.userLog.idRol ? true : false;
                            this.router.navigate([this.UrlHome]);

                           break;
                        }
                        // **********************************

                        case "NO-LOG01": { this.alertService.info(this.userLog.messageNoLogin); break; } // usuario no registrado
                        case "NO-LOG02": { this.router.navigate([this._httpBlockedUserPage]);   break; } // usuario bloqueado
                        case "NO-LOG03": { this.router.navigate([this._httpInactiveUserPage]);  break; } // usuario inactivo
                        case "NO-LOG04": { this.router.navigate([this._httpPendingUserPage]);   break; } // usuario pendiente
                        case "NO-LOG05": { this.router.navigate([this._httpNotRoleUserPage]);   break; } // usuario sin rol
                        case "NO-LOG06": { this.alertService.info(this.userLog.messageNoLogin); break; } // contraseña incorrecta
                        case "NO-LOG07": { this.router.navigate([this._httpInactiveRolePage]);  break; } // rol inactivo

                        default: { this.alertService.info("Excepción no controlada."); break; }
                    }

                    if (this.userLog.codeNoLogin !== '202') this.userLog.codeNoLogin = '404';

                // **********************************
                // catch de login en backend
                } else { this.alertService.error('Ocurrió un error al procesar los credenciales del usuario.'); }

                // **********************************
                // carga al usuario al local storage
                this.accountService.loadUserAsObservable(this.userLog);

                this.loading    = false;
                this.submitted  = false;
            },
            (error) => {
                this.alertService.error('Problemas al obtener respuesta del Servidor. Por favor contacte al administrador.' + error);
            });
    }
}
