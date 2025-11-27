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

@Component({selector: 'home',
            templateUrl: 'HTML_HomePage.html',
            styleUrls: ['../../assets/scss/app.scss'],
            standalone: false
})
export class HomeComponent extends OnSeguridad implements OnInit {

    userObservable: User;
    listBusiness: Compania[] = [];

    conexion : boolean;
    message : string = 'Esperando respuesta del servidor';

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
        if (!super.userAuthenticateHome()) { this.accountService.logout().subscribe(); return; }
        // *********************************************************

        this.accountService.clearObjectBusinesObservable();

        this.userObservable = this.accountService.userValue;
        this.today = new Date();

        this.conexion = false;
    }

    ngOnInit() {

        if (this.userObservable.esAdmin) {

            this.accountService.getAllBusiness()
                .pipe(first())
                .subscribe(listBusinessResponse => {

                    if (listBusinessResponse && listBusinessResponse.length > 0) {
                        
                        this.message = 'Seleccione la Compañía para Iniciar la Sesión';
                        this.conexion = true;
                        this.listBusiness = listBusinessResponse;

                        if (this.listBusiness.length === 1) this.selectBusiness(this.listBusiness[0]) ;

                    } else { this.createBitacora('NO-LOG11','Sin compañías para el usuario al iniciar sesión.');  }
                });

        } else {

            this.accountService.getBusinessActiveUser(this.userObservable.id)
                .pipe(first())
                .subscribe(listBusinessResponse => {

                    if (listBusinessResponse && listBusinessResponse.length > 0) {
                        
                        this.message = 'Seleccione la Compañía para Iniciar la Sesión';
                        this.conexion = true;
                        this.listBusiness = listBusinessResponse;

                        if (this.listBusiness.length === 1) this.selectBusiness(this.listBusiness[0]);

                    } else { this.createBitacora('NO-LOG10','Sin compañías para el usuario al iniciar sesión.'); }
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

                    console.log(responseRole.estado);

                    if (responseRole.estado===active.state || responseRole.estado===administrator.state ) {
                        
                        this.userObservable.empresa = businessId;
                        this.accountService.loadUserAsObservable(this.userObservable);
                        this.accountService.loadBusinessAsObservable(business);
    
                        // *****************************************************************
                        // redirect http index /* ** INDEX MÓDULOS ** */ .html
                        this.router.navigate([httpLandingIndexPage.indexHTTP]);

                    } else { this.createBitacora('NO-LOG9','Rol asignado a usuario inactivo.', businessId); }

                } else { this.createBitacora('NO-LOG8','Sin roles para el usuario al iniciar sesión.', businessId); }
            });
    }

    private createBitacora(pcod:string,pdesc:string, pidbussiness : number = null) : void {
        
        let bit : Bitacora = new Bitacora(  pcod, /** codigoInterno */
                                            true, /** sesion */
                                            false, /** consulta */
                                            pidbussiness ? pidbussiness : 0, /** idCompania */
                                            // 0, /** idCompania */
                                            0, /** idModulo */
                                            this.userObservable.id, /** idUsuario */
                                            pdesc, /** descripcion */
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
                if (pidbussiness) {
                    this.router.navigate([this._httpInactiveRolUserPage]);
                } else { 
                    this.router.navigate([this._httpNoBusinessUserPage]); 
                }
            });
    }

    logout() { this.accountService.logout() }
}
