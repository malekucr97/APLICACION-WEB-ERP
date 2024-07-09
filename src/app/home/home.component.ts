import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '@app/_models';
import { Compania } from '../_models/modules/compania';
import { AccountService, AlertService } from '@app/_services';
import { active, administrator, httpLandingIndexPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { Bitacora } from '@app/_models/bitacora';

@Component({templateUrl: 'HTML_HomePage.html',
            styleUrls: ['../../assets/scss/app.scss']
})
export class HomeComponent extends OnSeguridad implements OnInit {

    userObservable: User;
    listBusiness: Compania[] = [];

    conexion : boolean = false;
    message  : string = 'Esperando respuesta del servidor';

    _httpNoBusinessUserPage : string = httpLandingIndexPage.indexHTTPNoBussinesUser;
    _httpInactiveRolUserPage : string = httpLandingIndexPage.indexHTTPInactiveRolUser;

    public today : Date ;

    constructor(private accountService: AccountService,
                private alertService: AlertService,
                private router: Router) {

        super(alertService, accountService, router);

        // *********************************************************
        // VALIDA ACCESO PANTALLA
        if (!super.userAuthenticateHome()) { this.accountService.logout(); return; }
        // *********************************************************

        this.accountService.clearObjectBusinesObservable();

        this.userObservable = this.accountService.userValue;
        this.today = new Date();
    }

    ngOnInit() {

        this.conexion   = true;
        this.message    = 'Seleccione la Compañía';

        if (this.userObservable && this.userObservable.esAdmin) {

            this.accountService.getAllBusiness(this._HIdUserSessionRequest)
                .pipe(first())
                .subscribe(listBusinessResponse => {

                    if (listBusinessResponse && listBusinessResponse.length > 0) {
                        this.listBusiness = listBusinessResponse;

                        if (this.listBusiness.length === 1) this.selectBusiness(this.listBusiness[0]);

                    } else {
                        this.userObservable.codeNoLogin = '404';
                        this.userObservable.messageNoLogin = 'Sin compañías.';
                        this.userObservable.idRol = null;
                        this.userObservable.token = null;
                        this.accountService.loadUserAsObservable(this.userObservable);

                        // redirect http nologin **
                        this.router.navigate([this._httpNoBusinessUserPage]);
                    }
                });

        } else if (this.userObservable && !this.userObservable.esAdmin) {

            this.accountService.getBusinessActiveUser(this.userObservable.id, this._HIdUserSessionRequest)
                .pipe(first())
                .subscribe(listBusinessResponse => {

                    if (listBusinessResponse && listBusinessResponse.length > 0) {
                        this.listBusiness = listBusinessResponse;

                        if (this.listBusiness.length === 1) this.selectBusiness(this.listBusiness[0]);

                    } else {
                        this.userObservable.codeNoLogin = '404';
                        this.userObservable.messageNoLogin = 'Sin compañías.';
                        this.userObservable.idRol = null;
                        this.userObservable.token = null;
                        this.accountService.loadUserAsObservable(this.userObservable);

                        // redirect http nologin **
                        this.router.navigate([this._httpNoBusinessUserPage]);
                    }
                });
        }
    }

    selectBusiness(business: Compania) {

        let rolId : string = this.userObservable.idRol;
        let businessId : number = business.id;

        this.accountService.getRolUserBusiness(rolId, businessId, this._HIdUserSessionRequest, this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe(responseRole => { 
                
                if (responseRole.estado===active.state || responseRole.estado===administrator.state) {

                    this.userObservable.empresa = businessId;

                    this.accountService.loadUserAsObservable(this.userObservable);
                    this.accountService.loadBusinessAsObservable(business);

                    // *****************************************************************
                    // redirect http index /* ** INDEX MÓDULOS ** */ .html
                    this.router.navigate([httpLandingIndexPage.indexHTTP]);
                    // *****************************************************************

                } else {

                    let bit : Bitacora = new Bitacora(  'NO-LOG07', /** codigoInterno */
                                                        true, /** sesion */
                                                        false, /** consulta */
                                                        businessId, /** idCompania */
                                                        0, /** idModulo */
                                                        this.userObservable.id, /** idUsuario */
                                                        'Rol asignado a usuario inactivo en la compañía seleccionada.', /** descripcion */
                                                        0, /** contadorSesion */
                                                        this.today, /** fechaSesion */
                                                        '', /** lugarSesion */
                                                        '', /** token */
                                                        '' /** urlConsulta */ )

                    // *****************************************************************
                    // REGISTRA EN BITÁCORA INTENTO DE INICIO DE SESIÓN DE ROL SIN PERMISOS
                    this.accountService.postBitacora(bit, this._HIdUserSessionRequest)
                        .pipe(first())
                        .subscribe(response => {

                            if (response) {

                                this.userObservable.codeNoLogin = '404';
                                this.userObservable.messageNoLogin = 'Rol inactivo.';
                                this.userObservable.idRol = null;
                                this.userObservable.token = null;
                                this.accountService.loadUserAsObservable(this.userObservable);

                                // redirect http nologin **
                                this.router.navigate([this._httpInactiveRolUserPage]);
                            }
                        });
                }
            });
    }

    logout() { this.accountService.logout(); }
}
