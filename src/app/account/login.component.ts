import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { AuthStatesApp } from '@environments/environment-access-admin';
import { administrator, httpLandingIndexPage } from '@environments/environment';
import { User } from '@app/_models';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {

    form: FormGroup;

    userLog : User = new User ;

    loading = false;
    submitted = false;

    private UrlHome : string;

    _httpInactiveUserPage   : string = httpLandingIndexPage.indexHTTPInactiveUser;
    _httpPendingUserPage    : string = httpLandingIndexPage.indexHTTPPendingUser;
    _httpNotRoleUserPage    : string = httpLandingIndexPage.indexHTTPNotRolUser;

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
            .subscribe( responseObjectLogin => {

                if (responseObjectLogin) {

                    this.userLog = responseObjectLogin;

                    switch(this.userLog.codeNoLogin) {

                        case "202": {

                            this.userLog.esAdmin = false;

                            this.accountService.getRoleById(this.userLog.idRol)
                                .pipe(first())
                                .subscribe( responseObjectRol => {
                
                                    if (responseObjectRol.estado === AuthStatesApp.inactive) { 
                                        this.router.navigate([this._httpInactiveRolePage]);
                                        this.userLog.codeNoLogin = '404';
                                        return;
                                    }
    
                                    // si el usuario que inicia sesión es administrador
                                    if (administrator.identification === responseObjectRol.id) this.userLog.esAdmin = true;
                                    
                                    // this.accountService.loadUserAsObservable(responseObjectLogin);
                                    this.router.navigate([this.UrlHome]);
                                });

                           break;
                        }

                        case "NO-LOG01": {
                           // "El usuario o contraseña ingresadas contienen espacios en blanco."
                           this.alertService.info(this.userLog.messageNoLogin);
                           break;
                        }
                        case "NO-LOG02": { 
                            // El usuario " + username + " no está registrado en el sistema.
                            this.alertService.info(this.userLog.messageNoLogin);
                            break; 
                        }
                        case "NO-LOG03": { 
                            // El usuario se encuentra bloqueado.
                            this.alertService.info(this.userLog.messageNoLogin);
                            break; 
                        }
                        case "NO-LOG04": { 
                            // La contraseña ingresada no es correcta. Cantidad de intentos permitidos : 3
                            this.alertService.info(this.userLog.messageNoLogin);
                            break; 
                        }
                        case "NO-LOG05": { 
                            // Correo de activación enviado por correo electrónico.
                            // if (AuthStatesApp.pending === this.userLog.estado) { 
                                this.router.navigate([this._httpPendingUserPage]); 
                                // return; 
                            // }
                            break; 
                        }
                        case "NO-LOG06": { 
                            // El usuario se encuentra inactivo.
                            // if (AuthStatesApp.inactive === this.userLog.estado) { 
                                this.router.navigate([this._httpInactiveUserPage]); 
                            //     return;
                            // }
                            break; 
                        }
                        case "NO-LOG07": { 
                            // Rol de usuario no asignado
                            this.router.navigate([this._httpNotRoleUserPage]);
                            break; 
                        }
                        default: { this.alertService.info("Excepción no controlada."); break; }
                    }

                    if (this.userLog.codeNoLogin !== '202') this.userLog.codeNoLogin = '404';

                    this.loading = false;
                    this.submitted = false;
                    
                // **********************************
                // entró al catch de login en backend
                } else { this.alertService.error('Ocurrió un error al procesar los credenciales del usuario.'); }

                this.accountService.loadUserAsObservable(this.userLog);

            },
            (error) => {
                this.alertService.error('Problemas al obtener respuesta del Servidor. Por favor contacte al administrador.' + error);
            });
    }
}
