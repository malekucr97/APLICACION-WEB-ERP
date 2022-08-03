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

    public URLAddEditUsertPage: string     = httpAccessAdminPage.urlPageAddEditUser;
    public URLAddBusinessUsertPage: string = httpAccessAdminPage.urlPageAddBUser;
    public URLAddRoleUsertPage: string     = httpAccessAdminPage.urlPageAddRUser;
    public URLAdministratorPage: string    = httpAccessAdminPage.urlPageAdministrator;

    constructor(private accountService: AccountService, 
                private alertService: AlertService)
    {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {

        // Realizar validación de usuario que tenga permisos para el listado
        // redireccionamiento si el usuario no tiene acceso a una página o template de no acceso 

        this.isActivating   = false;
        this.isDeleting     = false;

        this.alertService.clear();

        this.adminBoss = false;

        if (this.user.esAdmin) {

            this.adminBoss = true;

            this.accountService.getAllUsers()
            .pipe(first())
            .subscribe(users => this.listUsers = users );

        } else if (this.user.idRol === amdinBusiness.adminSociedad && this.user.empresa) {

            // lista los usuarios activos con acceso a la compañía
            this.accountService.getUsersBusiness(this.user.empresa)
            .pipe(first())
            .subscribe(users => this.listUsers = users );
        }
    }

    deleteUser(identificacionUsuario: string, idUser: number) {

        this.isDeleting = true;
        let message : string;

        if (identificacionUsuario !== administrator.id) {

            this.accountService.dessAssignAllBusinessUser(idUser)
                .pipe(first())
                .subscribe( responseDesAsign => {

                    if (responseDesAsign.exito) {

                        this.accountService.deleteUser(idUser)
                            .pipe(first())
                            .subscribe( responseDelete => {

                                if (responseDelete.exito) {
                                    this.alertService.success(responseDelete.responseMesagge, { keepAfterRouteChange: true });
                                } else {
                                    this.alertService.error(responseDelete.responseMesagge, { keepAfterRouteChange: true });
                                }
                                this.ngOnInit();
                            },
                            (error) => { console.log(error); this.alertService.error(error); this.ngOnInit(); });
                    } else {
                        this.alertService.error(responseDesAsign.responseMesagge, { keepAfterRouteChange: true });
                    }
                },
                error => { console.log(error); this.alertService.error(error); this.ngOnInit(); });
        } else {
            message = 'No se puede eliminar la cuenta administradora del sistema';
            this.alertService.info(message, { keepAfterRouteChange: true });
            this.ngOnInit();
        }
        this.isDeleting = false;
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
