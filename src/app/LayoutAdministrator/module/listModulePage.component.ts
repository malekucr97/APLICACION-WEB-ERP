import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User, Module } from '@app/_models';
import { Compania } from '../../_models/modules/compania';
import { httpAccessAdminPage } from '@environments/environment-access-admin';
import { httpLandingIndexPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';

@Component({templateUrl: 'HTML_ListModulePage.html',
            styleUrls: [ '../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss']
})
export class ListModuleComponent extends OnSeguridad implements OnInit {

    userObservable : User;
    businessObservable : Compania;

    listModules : Module[] = [];
    listModulesSystem : Module[] = [];

    private Home : string = httpLandingIndexPage.homeHTTP;

    public URLIndexAdminPage : string = httpAccessAdminPage.urlPageAdministrator;
    public URLAdminModulePage : string = httpAccessAdminPage.urlPageAdminModule;
    habilitarBtnMantenimientoReportes: boolean = false;

    constructor(private accountService: AccountService,
                private alertService: AlertService,
                private router: Router) {

            super(alertService, accountService, router);

            // ***************************************************************
            // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
            if (!super.userAuthenticateAdmin()) this.accountService.logout();
            // ***************************************************************

            this.userObservable     = this.accountService.userValue;
            this.businessObservable = this.accountService.businessValue;
            this.habilitarBtnMantenimientoReportes = this.businessObservable.mantenimientoReportes;
    }

    ngOnInit() {

        this.accountService.getModulesSystem()
            .pipe(first())
            .subscribe(response => { this.listModulesSystem = response; });

        this.accountService.getModulesBusiness(this.businessObservable.id)
            .pipe(first())
            .subscribe(response => { this.listModules = response; });
    }

    activate(identificadorModulo: string) {

        this.alertService.clear();

        let moduleList = this.listModulesSystem.find(x => x.identificador === identificadorModulo);

        this.accountService.activateModule(moduleList.id, this.businessObservable.id)
            .pipe(first())
            .subscribe( responseActivate => {

                if ( responseActivate.exito ) {

                    this.alertService.success(responseActivate.responseMesagge);

                    moduleList.estado = 'Activo';

                    this.listModules[ this.listModules.findIndex( (u) => u.identificador == moduleList.identificador ) ] = moduleList; 

                } else { this.alertService.error(responseActivate.responseMesagge); }
            },
            (error) => {
                let message : string = 'Problemas al activar el estado del módulo seleccionado.' + error;
                this.alertService.error(message);
            });
    }

    inActivate(identificadorModulo: string) {

        this.alertService.clear();

        let moduleList = this.listModulesSystem.find(x => x.identificador === identificadorModulo);

        this.accountService.inActivateModule(moduleList.id, this.businessObservable.id)
            .pipe(first())
            .subscribe( responseInActivate => {

                if ( responseInActivate.exito ) {

                    this.alertService.success(responseInActivate.responseMesagge);

                    moduleList.estado = 'Inactivo';
                    this.listModules[ this.listModules.findIndex( (u) => u.identificador == moduleList.identificador ) ] = moduleList;

                } else { this.alertService.error(responseInActivate.responseMesagge); }
            },
            (error) => {
                let message : string = 'Problemas al inactivar el estado del módulo seleccionado.' + error;
                this.alertService.error(message);
            });
    }

    // **
    // ** redirect http add access PANTALLAS
    selectModuleScreenUser(idModule: number) {
        this.router.navigate(['/admin-module/adminpage-addaccessuserpagemodule.html/' + idModule]);
    }
    // **
}
