import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, ResponseMessage } from '@app/_models';
import { administrator, amdinBusiness, httpAccessAdminPage } from '@environments/environment-access-admin';

@Component({ templateUrl: 'HTML_ListUserPage.html' })
export class ListUserComponent implements OnInit {
    user: User;
    userList: User;
    response: ResponseMessage;

    listUsers: User[] = [];

    isActivating: boolean;
    isDeleting: boolean;
    adminBoss: boolean;
    adminBusiness: boolean;

    URLAddEditUsertPage: string;
    URLAddBusinessUsertPage: string;
    URLAddRoleUsertPage: string;
    URLAdministratorPage: string;

    constructor(private accountService: AccountService, private alertService: AlertService) {
                this.user = this.accountService.userValue;  }

    ngOnInit() {
        this.isActivating   = false;
        this.isDeleting     = false;

        this.URLAddEditUsertPage        = httpAccessAdminPage.urlPageAddEditUser;
        this.URLAddBusinessUsertPage    = httpAccessAdminPage.urlPageAddBUser;
        this.URLAddRoleUsertPage        = httpAccessAdminPage.urlPageAddRUser;
        this.URLAdministratorPage       = httpAccessAdminPage.urlPageAdministrator;

        this.alertService.clear();

        this.adminBoss = false;
        this.adminBusiness = false;

        if (this.user.esAdmin) {

            this.adminBoss = true;

            this.accountService.getAllUsers()
            .pipe(first())
            .subscribe(users => this.listUsers = users );
        }

        if (this.user.idRol === amdinBusiness.adminSociedad && this.user.empresa) {

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
                .subscribe( responseDessA => {

                    if (responseDessA.exito) {

                        this.accountService.deleteUser(identificacionUsuario)
                            .pipe(first())
                            .subscribe( responseObj => {

                                if (responseObj.exito) {
                                    this.alertService.success(responseObj.responseMesagge, { keepAfterRouteChange: true });
                                } else {
                                    this.alertService.error(responseObj.responseMesagge, { keepAfterRouteChange: true });
                                }
                                this.ngOnInit();
                            },
                            (error) => { console.log(error); this.alertService.error(error); this.ngOnInit(); });
                    } else {
                        this.alertService.error(responseDessA.responseMesagge, { keepAfterRouteChange: true });
                    }
                },
                error => { console.log(error); this.alertService.error(error); this.ngOnInit(); });
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
                    this.ngOnInit();
                },
                (error) => { console.log(error); this.alertService.error(error); this.ngOnInit();
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
                    this.ngOnInit();
                },
                (error) => { console.log(error); this.alertService.error(error); this.ngOnInit();
                });
        } else {
            this.response.responseMesagge = 'No se puede modificar el estado de la cuenta administradora del sistema';
            this.alertService.info(this.response.responseMesagge, { keepAfterRouteChange: true });
            this.ngOnInit();
        }
    }
}
