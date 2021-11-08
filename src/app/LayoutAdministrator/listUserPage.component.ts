import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User } from '@app/_models';

import { amdinBusiness } from '@environments/environment';
import { administrator } from '@environments/environment';
import { httpAccessPage } from '@environments/environment';

import {AddBusinessUserComponent} from './addBusinessUserPage.component';

@Component({ templateUrl: 'HTML_ListUserPage.html' })
export class ListUserComponent implements OnInit {
    user: User;
    public listUsers: User[] = [];

    public isActivating: boolean;
    public isDeleting: boolean;

    URLAddEditUsertPage: string;
    URLAddBusinessUsertPage: string;
    URLAddRoleUsertPage: string;

    userList: User;

    ABUC: AddBusinessUserComponent;

    loading = false;

    idBusiness: string;

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

        this. URLAddEditUsertPage      = httpAccessPage.urlPageAddEditUser;
        this.URLAddBusinessUsertPage   = httpAccessPage.urlPageAddBUser;
        this.URLAddRoleUsertPage       = httpAccessPage.urlPageAddRUser;

        this.alertService.clear();

        this.adminBoss = false;
        this.adminBusiness = false;

        if (this.user.esAdmin) {

            this.adminBoss = true;

            this.accountService.getAllUsers()
            .pipe(first())
            .subscribe(users =>
                this.listUsers = users
            );
        }

        if (this.user.idRol === amdinBusiness.adminSociedad){

            this.adminBusiness = true;

            this.accountService.getUsersBusiness(this.user.empresa)
            .pipe(first())
            .subscribe(users =>
                this.listUsers = users
            );
        }
    }

    deleteUser(identificacionUsuario: string) {

        if (identificacionUsuario !== administrator.id) {

            this.isDeleting = true;

            this.accountService.dessAssignAllBusinessUser(identificacionUsuario)
                .pipe(first())
                .subscribe(
                    responseDessA => {

                        if (responseDessA.exito){

                            this.accountService.deleteUser(identificacionUsuario)
                                .pipe(first())
                                .subscribe( responseObj => {

                                    this.isActivating = false;

                                    if (responseObj.exito === true){
                                        this.alertService.success(responseObj.responseMesagge, { keepAfterRouteChange: true });
                                    }else {
                                        this.alertService.error(responseObj.responseMesagge, { keepAfterRouteChange: true });
                                    }

                                    this.ngOnInit();
                                },
                                (error) => {
                                    console.log(error);
                                    this.isActivating = false;
                                });
                        } else {
                            this.alertService.error(responseDessA.responseMesagge, { keepAfterRouteChange: true });
                        }

                        this.ngOnInit();
                    },
                    error => {
                        console.log(error);
                        this.alertService.error(error);
                        this.loading = false;
                    });
        } else {
            this.alertService.info('No se puede eliminar la cuenta administradora del sistema', { keepAfterRouteChange: true });
            this.ngOnInit();
        }
    }

    activateUser(identificacion: string) {

        if (identificacion !== administrator.id) {

            this.userList = this.listUsers.find(x => x.identificacion === identificacion);
            this.isActivating = true;
    
            this.accountService.activateUser(this.userList)
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
            this.alertService.info('No se puede modificar el estado de la cuenta administradora del sistema', { keepAfterRouteChange: true });
            this.ngOnInit();
        }
    }

    inActivateUser(identificacion: string) {

        if (identificacion !== administrator.id){

            this.userList = this.listUsers.find(x => x.identificacion === identificacion);
            this.isActivating = true;

            this.accountService.inActivateUser(this.userList)
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
            this.alertService.info('No se puede modificar el estado de la cuenta administradora del sistema', { keepAfterRouteChange: true });
            this.ngOnInit();
        }
    }
}
