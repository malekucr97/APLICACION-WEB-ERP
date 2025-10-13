import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { administrator, environment, httpLandingIndexPage } from '@environments/environment';
import { User } from '@app/_models';
import { TranslateService } from '@ngx-translate/core';

@Component({selector: 'login',
            templateUrl: 'login.component.html',
            standalone: false
})
export class LoginComponent implements OnInit {

    form : UntypedFormGroup ;

    userLog : User = new User ;

    pathImageInitial : string = './assets/images/inra/BANKAP_Header_2023-02.jpg';
    
    pwdPattern : string = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{5,12}$";
    ussPattern : string = "^[a-zA-Z0-9]{5,15}$";

    loading     : boolean = false;
    submitted   : boolean = false;

    intentosFallidosInicioSesion: number = 0;
    mostrarContrasena: boolean = false;

    private UrlHome : string;
    private SSLState : boolean;

    _httpInactiveUserPage   : string = httpLandingIndexPage.indexHTTPInactiveUser;
    _httpPendingUserPage    : string = httpLandingIndexPage.indexHTTPPendingUser;
    _httpNotRoleUserPage    : string = httpLandingIndexPage.indexHTTPNotRolUser;
    _httpBlockedUserPage    : string = httpLandingIndexPage.indexHTTPBlockedUser;
    _httpInactiveRolePage   : string = httpLandingIndexPage.indexHTTPInactiveRolUser;

    private KeySessionStorageUserName : string = environment.sessionStorageIdentificationUserKey;

    constructor(private formBuilder: UntypedFormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private accountService: AccountService,
                private alertService: AlertService,
                private translate: TranslateService ) {

                    this.userLog.codeNoLogin = '404';

                    this.inicializaFormularioLogin();

                    this.UrlHome = this.route.snapshot.queryParams.returnUrl || '/';
    }

    get f() { return this.form.controls; }

    get username() { return this.form.get('username'); } 
    get password() { return this.form.get('password'); }

    ngOnInit() { }

    inicializaFormularioLogin () : void {

        let username : string = '';
        this.intentosFallidosInicioSesion = 0;

        this.SSLState = false;
        if (sessionStorage.getItem(this.KeySessionStorageUserName)) this.SSLState = true;

        if (this.SSLState) username = sessionStorage.getItem(this.KeySessionStorageUserName);

        this.form = this.formBuilder.group({username:   [username,  Validators.required],
                                            password:   ['',        Validators.required],
                                            rememberme: [this.SSLState] });
    }

    onSubmit() {

        this.alertService.clear();

        this.submitted  = true;
        this.loading    = true;

        if (this.form.invalid) return;

        let userName : string = this.f.username.value;
        let password : string = this.f.password.value;

        if (this.f.rememberme.value) { 
            sessionStorage.setItem(this.KeySessionStorageUserName, userName); 
        }
        else { sessionStorage.removeItem(this.KeySessionStorageUserName); }

        this.accountService.login(userName.trim(), password.trim())
            .pipe(first())
            .subscribe( responseLogin => {

                if ( responseLogin ) {

                    this.userLog = responseLogin;

                    switch(this.userLog.codeNoLogin) {

                        // ************************
                        // grant access response **
                        case "202": {
                            this.userLog.esAdmin = administrator.identification === this.userLog.idRol ? true : false;
                            this.router.navigate([this.UrlHome]);
                            break;
                        }

                        case "404": { this.alertService.warn(
                            this.translate.instant('ALERTS.USER_NOT_REGISTERED')); break; }         // usuario no registrado 

                        case "403": { this.router.navigate([this._httpBlockedUserPage]);   break; } // usuario bloqueado
                        case "423": { this.router.navigate([this._httpInactiveUserPage]);  break; } // usuario inactivo
                        case "409": { this.router.navigate([this._httpPendingUserPage]);   break; } // usuario pendiente
                        case "405": { this.router.navigate([this._httpNotRoleUserPage]);   break; } // usuario sin rol
                        case "401": {
                            this.intentosFallidosInicioSesion++;
                            this.alertService.warn(this.translate.instant('ALERTS.PASSWORD_ERROR'));
                            break;
                        } // contraseña incorrecta
                        case "424": {
                            this.alertService.error(this.translate.instant('ALERTS.ACTIVATE_EMAIL_NOT_SEND'));
                            break;
                        } // correo no enviado revisar bitacoras y logs

                        case "500": {
                            this.alertService.error(responseLogin.messageNoLogin);
                            break;
                        } // error interno del servidor

                        default: { this.alertService.error(this.translate.instant('ALERTS.EXCEPTION_NOT_CONTROLLED')); break; }
                    }

                // ************************
                // http null response *****
                } else { this.alertService.error(this.translate.instant('ALERTS.WITHOUT_RESULTS')); }

                this.loading    = false;
                this.submitted  = false;
                
            }, (error) => { this.loading = false; this.submitted = false; this.alertService.error(this.translate.instant('ALERTS.ERROR_CATCH', {ERROR: error})); });
    }

    visualizarContrasena() { this.mostrarContrasena = !this.mostrarContrasena; }
}
