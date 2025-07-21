import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '@app/_models';
import { Compania } from '../_models/modules/compania';
import { AccountService, AlertService } from '@app/_services';
import { active, httpLandingIndexPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { Bitacora } from '@app/_models/bitacora';
import { administrator } from '@environments/environment.prod';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

@Component({
    templateUrl: 'HTML_HomePage.html',
    styleUrls: ['../../assets/scss/app.scss'],
    standalone: false
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
                private router: Router,
                private translate: TranslateMessagesService) {

        super(alertService, accountService, router, translate);

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
        this.message    = 'Por Favor Seleccione la Compañía para Iniciar la Sesión';

        if (this.userObservable.esAdmin) {

            this.accountService.getAllBusiness()
                .pipe(first())
                .subscribe(listBusinessResponse => {

                    if (listBusinessResponse && listBusinessResponse.length > 0) {
                        this.listBusiness = listBusinessResponse;

                        if (this.listBusiness.length === 1) this.selectBusiness(this.listBusiness[0]) ;

                    } else {
                        // #region "registro en bitácora"
                        let bit : Bitacora = new Bitacora(  'NO-LOG11', /** codigoInterno */
                                                            true, /** sesion */
                                                            false, /** consulta */
                                                            0, /** idCompania */
                                                            0, /** idModulo */
                                                            this.userObservable.id, /** idUsuario */
                                                            'No se han devuelto registros de compañías para el usuario al iniciar sesión.', /** descripcion */
                                                            0, /** contadorSesion */
                                                            this.today, /** fechaSesion */
                                                            '', /** lugarSesion */
                                                            '', /** token */
                                                            '' /** urlConsulta */ );

                        // *****************************************************************
                        // REGISTRA EN BITÁCORA INTENTO DE INICIO DE SESIÓN DE ROL SIN PERMISOS
                        this.accountService.postBitacora(bit, this._HIdUserSessionRequest)
                            .pipe(first())
                            .subscribe(response => {

                                this.userObservable.codeNoLogin = '404';
                                this.userObservable.idRol = null;
                                this.userObservable.token = null;
                                this.accountService.loadUserAsObservable(this.userObservable);

                                // redirect http nologin **
                                this.router.navigate([this._httpNoBusinessUserPage]);
                            });
                        // #endregion "registro en bitácora"
                    }
                });

        } else {

            this.accountService.getBusinessActiveUser(this.userObservable.id)
                .pipe(first())
                .subscribe(listBusinessResponse => {

                    if (listBusinessResponse && listBusinessResponse.length > 0) {
                        this.listBusiness = listBusinessResponse;

                        if (this.listBusiness.length === 1) this.selectBusiness(this.listBusiness[0]);

                    } else {
                        // #region "registro en bitácora"
                        let bit : Bitacora = new Bitacora(  'NO-LOG10', /** codigoInterno */
                                                            true, /** sesion */
                                                            false, /** consulta */
                                                            0, /** idCompania */
                                                            0, /** idModulo */
                                                            this.userObservable.id, /** idUsuario */
                                                            'No se han devuelto registros de compañías para el usuario al iniciar sesión.', /** descripcion */
                                                            0, /** contadorSesion */
                                                            this.today, /** fechaSesion */
                                                            '', /** lugarSesion */
                                                            '', /** token */
                                                            '' /** urlConsulta */ );

                        // *****************************************************************
                        // REGISTRA EN BITÁCORA INTENTO DE INICIO DE SESIÓN DE ROL SIN PERMISOS
                        this.accountService.postBitacora(bit, this._HIdUserSessionRequest)
                            .pipe(first())
                            .subscribe(response => {

                                this.userObservable.codeNoLogin = '404';
                                this.userObservable.idRol = null;
                                this.userObservable.token = null;
                                this.accountService.loadUserAsObservable(this.userObservable);

                                // redirect http nologin **
                                this.router.navigate([this._httpNoBusinessUserPage]);
                            });
                        // #endregion "registro en bitácora"
                    }
                });
        }
    }

    selectBusiness(business: Compania) {

        let rolId : string = this.userObservable.idRol;
        let businessId : number = business.id;

        this._HBusinessSessionRequest = businessId.toString();
        
        this.accountService.getRolUserBusiness(rolId, businessId)
            .pipe(first())
            .subscribe(responseRole => {

                if ( responseRole ) {

                    if (responseRole.estado===active.state || responseRole.estado===administrator.state ) {
                        
                        this.userObservable.empresa = businessId;
                        this.accountService.loadUserAsObservable(this.userObservable);
                        this.accountService.loadBusinessAsObservable(business);
    
                        // *****************************************************************
                        // redirect http index /* ** INDEX MÓDULOS ** */ .html
                        this.router.navigate([httpLandingIndexPage.indexHTTP]);

                    } else {
                        // #region "registro en bitácora"
                        let bit : Bitacora = new Bitacora(  'NO-LOG09', /** codigoInterno */
                                                            true, /** sesion */
                                                            false, /** consulta */
                                                            businessId, /** idCompania */
                                                            0, /** idModulo */
                                                            this.userObservable.id, /** idUsuario */
                                                            'Rol asignado a usuario inactivo.', /** descripcion */
                                                            0, /** contadorSesion */
                                                            this.today, /** fechaSesion */
                                                            '', /** lugarSesion */
                                                            '', /** token */
                                                            '' /** urlConsulta */ );

                        // *****************************************************************
                        // REGISTRA EN BITÁCORA INTENTO DE INICIO DE SESIÓN DE ROL SIN PERMISOS
                        this.accountService.postBitacora(bit, this._HIdUserSessionRequest)
                            .pipe(first())
                            .subscribe(response => {

                                this.userObservable.codeNoLogin = '404';
                                this.userObservable.idRol = null;
                                this.userObservable.token = null;
                                this.accountService.loadUserAsObservable(this.userObservable);

                                // redirect http nologin **
                                this.router.navigate([this._httpInactiveRolUserPage]);
                            });
                        // #endregion "registro en bitácora"
                    }

                } else {
                    // #region "registro en bitácora"
                    let bit : Bitacora = new Bitacora(  'NO-LOG08', /** codigoInterno */
                                                        true, /** sesion */
                                                        false, /** consulta */
                                                        businessId, /** idCompania */
                                                        0, /** idModulo */
                                                        this.userObservable.id, /** idUsuario */
                                                        'No se han devuelto registros de roles para el usuario al iniciar sesión.', /** descripcion */
                                                        0, /** contadorSesion */
                                                        this.today, /** fechaSesion */
                                                        '', /** lugarSesion */
                                                        '', /** token */
                                                        '' /** urlConsulta */ );

                    // *****************************************************************
                    // REGISTRA EN BITÁCORA INTENTO DE INICIO DE SESIÓN DE ROL SIN PERMISOS
                    this.accountService.postBitacora(bit, this._HIdUserSessionRequest)
                        .pipe(first())
                        .subscribe(response => {

                            this.userObservable.codeNoLogin = '404';
                            this.userObservable.idRol = null;
                            this.userObservable.token = null;
                            this.accountService.loadUserAsObservable(this.userObservable);

                            // redirect http nologin **
                            this.router.navigate([this._httpInactiveRolUserPage]);
                        });
                    // #endregion "registro en bitácora"
                }
            });
    }

    logout() { this.accountService.logout(); }
}
