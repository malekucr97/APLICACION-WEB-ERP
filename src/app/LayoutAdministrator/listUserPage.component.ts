import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';

import { User } from '@app/_models';
import { ResponseMessage } from '@app/_models/response';

import { amdinBusiness } from '@environments/environment';
import { administrator } from '@environments/environment';
import { httpAccessPage } from '@environments/environment';

@Component({ templateUrl: 'HTML_ListUserPage.html' })
export class ListUserComponent implements OnInit {
    user: User;
    listUsers: User[] = [];

    isActivating: boolean;
    isDeleting: boolean;

    URLAddEditUsertPage: string;
    URLAddBusinessUsertPage: string;
    URLAddRoleUsertPage: string;
    URLAdministratorPage: string;

    userList: User;

    adminBoss: boolean;
    adminBusiness: boolean;

    response: ResponseMessage;

    constructor(private accountService: AccountService,
                private alertService: AlertService) {

            this.user = this.accountService.userValue;
        }

    ngOnInit() {
        this.isActivating   = false;
        this.isDeleting     = false;

        this.URLAddEditUsertPage        = httpAccessPage.urlPageAddEditUser;
        this.URLAddBusinessUsertPage    = httpAccessPage.urlPageAddBUser;
        this.URLAddRoleUsertPage        = httpAccessPage.urlPageAddRUser;
        this.URLAdministratorPage       = httpAccessPage.urlPageAdministrator;

        this.alertService.clear();

        this.adminBoss = false;
        this.adminBusiness = false;

        if (this.user.esAdmin) {

            this.adminBoss = true;

            this.accountService.getAllUsers()
            .pipe(first())
            .subscribe(users => this.listUsers = users );
        }

        if (this.user.idRol === amdinBusiness.adminSociedad){

            this.adminBusiness = true;

            this.accountService.getUsersBusiness(this.user.empresa)
            .pipe(first())
            .subscribe(users => this.listUsers = users );
        }
    }

    deleteUser(identificacionUsuario: string) {

        if (identificacionUsuario !== administrator.id) {

            this.isDeleting = true;

            this.accountService.dessAssignAllBusinessUser(identificacionUsuario)
                .pipe(first())
                .subscribe(
                    responseDessA => {

                        if (responseDessA.exito) {

                            this.accountService.deleteUser(identificacionUsuario)
                                .pipe(first())
                                .subscribe( responseObj => {

                                    if (responseObj.exito) {
                                        this.alertService.success(responseObj.responseMesagge, { keepAfterRouteChange: true });
                                    } else {
                                        this.alertService.error(responseObj.responseMesagge, { keepAfterRouteChange: true });
                                    }
                                    this.isDeleting = false;
                                    this.ngOnInit();
                                },
                                (error) => {
                                    console.log(error);
                                    this.isActivating = false;
                                    this.alertService.error(error, { keepAfterRouteChange: true });
                                    this.ngOnInit();
                                });
                        } else {
                            this.alertService.error(responseDessA.responseMesagge, { keepAfterRouteChange: true });
                        }
                    },
                    error => {
                        console.log(error);
                        this.isActivating = false;
                        this.alertService.error(error, { keepAfterRouteChange: true });
                        this.ngOnInit();
                    });
        } else {
            this.response.responseMesagge = 'No se puede eliminar la cuenta administradora del sistema';
            this.alertService.info(this.response.responseMesagge, { keepAfterRouteChange: true });
            this.ngOnInit();
        }
    }

    activateUser(identificacion: string) {

        if (identificacion !== administrator.id) {

            this.isActivating = true;

            this.userList = this.listUsers.find(x => x.identificacion === identificacion);

            this.accountService.activateUser(this.userList)
                .pipe(first())
                .subscribe( responseActivate => {
                    this.alertService.success(responseActivate.responseMesagge, { keepAfterRouteChange: true });
                    this.isActivating = false;
                    this.ngOnInit();
                },
                (error) => {
                    console.log(error);
                    this.isActivating = false;
                    this.alertService.error(error, { keepAfterRouteChange: true });
                    this.ngOnInit();
                });
        } else {
            this.response.responseMesagge = 'No se puede modificar el estado de la cuenta administradora del sistema';
            this.alertService.info(this.response.responseMesagge, { keepAfterRouteChange: true });
            this.ngOnInit();
        }
    }

    inActivateUser(identificacion: string) {

        if (identificacion !== administrator.id) {

            this.userList = this.listUsers.find(x => x.identificacion === identificacion);
            this.isActivating = true;

            this.accountService.inActivateUser(this.userList)
                .pipe(first())
                .subscribe( responseInActivate => {
                    this.alertService.success(responseInActivate.responseMesagge, { keepAfterRouteChange: true });
                    this.isActivating = false;
                    this.ngOnInit();
                },
                (error) => {
                    console.log(error);
                    this.isActivating = false;
                    this.alertService.error(error, { keepAfterRouteChange: true });
                    this.ngOnInit();
                });
        } else {
            this.response.responseMesagge = 'No se puede modificar el estado de la cuenta administradora del sistema';
            this.alertService.info(this.response.responseMesagge, { keepAfterRouteChange: true });
            this.ngOnInit();
        }
    }
}
