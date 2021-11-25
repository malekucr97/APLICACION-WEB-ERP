import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User, Role } from '@app/_models';

import { amdinBusiness, administrator, httpAccessPage } from '@environments/environment';

import {AddBusinessUserComponent} from '../business/addBusinessUserPage.component';

@Component({ templateUrl: 'HTML_ListRolePage.html' })
export class ListRoleComponent implements OnInit {
    user: User;
    public listRoles: Role[] = [];

    public isActivating: boolean;
    public isDeleting: boolean;

    URLAddModuleRolPage: string;
    URLAdministratorPage: string;

    rolList: Role;

    ABUC: AddBusinessUserComponent;

    loading = false;

    idBusiness: string;

    message: string;

    public adminBoss: boolean;
    public adminBusiness: boolean;

    constructor(private accountService: AccountService,
                private route: ActivatedRoute,
                private router: Router,
                private alertService: AlertService) {

            this.user = this.accountService.userValue;
        }

    ngOnInit() {
        this.isActivating   = false;
        this.isDeleting     = false;

        this.URLAddModuleRolPage      = httpAccessPage.urlPageAddModuleRol;
        this.URLAdministratorPage = httpAccessPage.urlPageAdministrator;
        // this.URLAddBusinessUsertPage   = httpAccessPage.urlPageAddBUser;
        // this.URLAddRoleUsertPage       = httpAccessPage.urlPageAddRUser;

        this.alertService.clear();

        this.adminBoss = false;
        this.adminBusiness = false;

        this.accountService.getAllRoles()
        .pipe(first())
        .subscribe(responseRoles =>
            this.listRoles = responseRoles
        );
    }

    activateRole(rol: string) {

        if (rol !== administrator.id) {

            this.isActivating = true;

            this.rolList = this.listRoles.find(x => x.id === rol);
            this.rolList.estado = 'Activo';

            this.accountService.updateRol(this.rolList)
                .pipe(first())
                .subscribe( response => {
                    this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                    this.isActivating = false;
                    this.ngOnInit();
                },
                (error) => {
                    console.log(error);
                    this.isActivating = false;
                });
        } else {
            this.message = 'No se puede modificar el estado de la cuenta administradora del sistema';
            this.alertService.info(this.message, { keepAfterRouteChange: true });
            this.ngOnInit();
        }
    }

    inActivateRole(rol: string) {

        if (rol !== administrator.id) {

            this.isActivating = true;

            this.rolList = this.listRoles.find(x => x.id === rol);
            this.rolList.estado = 'Inactivo';

            this.accountService.updateRol(this.rolList)
                .pipe(first())
                .subscribe( response => {
                    this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                    this.isActivating = false;
                    this.ngOnInit();
                },
                (error) => {
                    console.log(error);
                    this.isActivating = false;
                });
        } else {
            this.message = 'No se puede modificar el estado de la cuenta administradora del sistema';
            this.alertService.info(this.message, { keepAfterRouteChange: true });
            this.ngOnInit();
        }
    }

    escritura(rol: string) {

        if (rol !== administrator.id  || rol !== amdinBusiness.adminSociedad) {

            this.isActivating = true;

            this.rolList = this.listRoles.find(x => x.id === rol);
            this.rolList.tipo = 'Escritura';

            this.accountService.updateRol(this.rolList)
                .pipe(first())
                .subscribe( response => {
                    this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                    this.isActivating = false;
                    this.ngOnInit();
                },
                (error) => {
                    console.log(error);
                    this.isActivating = false;
                });
        } else {
            this.message = 'La cuenta administradora tiene permisos de escritura y lectura sobre los modulos de la empresa.';
            this.alertService.info(this.message, { keepAfterRouteChange: true });
            this.ngOnInit();
        }
    }

    lectura(rol: string) {

        if (rol !== administrator.id || rol !== amdinBusiness.adminSociedad) {

            this.isActivating = true;

            this.rolList = this.listRoles.find(x => x.id === rol);
            this.rolList.tipo = 'Lectura';

            this.accountService.updateRol(this.rolList)
                .pipe(first())
                .subscribe( response => {
                    this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                    this.isActivating = false;
                    this.ngOnInit();
                },
                (error) => {
                    console.log(error);
                    this.isActivating = false;
                });
        } else {
            this.message = 'La cuenta administradora tiene permisos de escritura y lectura sobre los modulos de la empresa.';
            this.alertService.info(this.message, { keepAfterRouteChange: true });
            this.ngOnInit();
        }
    }
}
