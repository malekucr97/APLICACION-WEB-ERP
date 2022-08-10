import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User, ResponseMessage } from '@app/_models';
import { administrator, amdinBusiness, httpAccessAdminPage, httpLandingIndexPage } from '@environments/environment-access-admin';
import { Compania } from '@app/_models/modules/compania';

@Component({ templateUrl: 'HTML_ListUserPage.html' })
export class ListUserComponent implements OnInit {
    userObservable: User;
    businessObservable: Compania;

    response: ResponseMessage;

    listUsers: User[] = [];

    isActivating: boolean = false;
    isDeleting: boolean = false;

    private Home:string = httpLandingIndexPage.homeHTTP;

    public URLAddEditUsertPage: string     = httpAccessAdminPage.urlPageAddEditUser;
    public URLAddBusinessUsertPage: string = httpAccessAdminPage.urlPageAddBUser;
    public URLAddRoleUsertPage: string     = httpAccessAdminPage.urlPageAddRUser;
    public URLAdministratorPage: string    = httpAccessAdminPage.urlPageAdministrator;

    constructor(private accountService: AccountService, 
                private alertService: AlertService,
                private router: Router)
    {
        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;
    }

    ngOnInit() {

        if (!this.businessObservable) {
            this.router.navigate([this.Home]);
            return;
        }

        if (this.userObservable.esAdmin) {

            this.accountService.getAllUsers()
                .pipe(first())
                .subscribe(users => {
                    this.listUsers = users;
                    this.accountService.suscribeListUser(this.listUsers);
                });
                    
                

        } else if (this.userObservable.idRol && this.userObservable.idRol === amdinBusiness.adminSociedad) {

            this.accountService.getUsersBusiness(this.userObservable.empresa)
            .pipe(first())
            .subscribe(users => {
                this.listUsers = users;
                this.accountService.suscribeListUser(this.listUsers);
                
            });
        }
    }
    deleteUser(identificacionUsuario: string, idUser: number) {

        this.alertService.clear();

        if (identificacionUsuario !== administrator.id) {

            this.isDeleting = true;

            this.accountService.deleteUser(idUser)
                .pipe(first())
                .subscribe( responseDelete => {

                    if (responseDelete.exito) {

                        this.alertService.success(responseDelete.responseMesagge, { keepAfterRouteChange: false });
                        this.listUsers.splice(this.listUsers.findIndex( u => u.id == idUser ), 1);

                    } else {
                        this.alertService.warn('No se puede eliminar un usuario con acceso a una compañía.', { keepAfterRouteChange: false });
                        console.log(responseDelete.responseMesagge);
                    }
                    this.isDeleting = false;
                },
                (error) => { 
                    this.isDeleting = false; this.alertService.error(error.message, { keepAfterRouteChange: false }); 
                });

        } else {
            let message = 'No se puede eliminar la cuenta administradora del sistema';
            this.alertService.info(message, { keepAfterRouteChange: false });
        }
    }

    activateUser(identificacion, idUser: number) {

        this.alertService.clear();

        if (identificacion !== administrator.id) {

            this.isActivating = true;

            let userList : User = this.listUsers.find(x => x.id === idUser);
            let userUpdate : User = new User();
            userUpdate.id = idUser;

            this.accountService.activateUser(userUpdate)
                .pipe(first())
                .subscribe( responseActivate => {

                    if (responseActivate.exito) {

                        userList.estado = 'Activo';
                        this.listUsers[this.listUsers.findIndex( u => u.id == idUser )] = userList;

                        this.alertService.success(responseActivate.responseMesagge, { keepAfterRouteChange: false });

                    } else {
                        this.alertService.warn('Problemas al activar el usuario. Error: ' + responseActivate.responseMesagge, { keepAfterRouteChange: false });
                    }
                    this.isActivating = false;
                },
                (error) => { 
                    this.isActivating = false; this.alertService.error(error, { keepAfterRouteChange: false });
                });
        } else {
            let message : string = 'No se puede modificar el estado de la cuenta administradora del sistema';
            this.alertService.info(message, { keepAfterRouteChange: false });
        }
    }

    inActivateUser(identificacion: string, idUser: number) {

        this.alertService.clear();

        if (identificacion !== administrator.id) {

            this.isActivating = true;

            let userList : User = this.listUsers.find(x => x.id === idUser);
            let userUpdate : User = new User();
            userUpdate.id = idUser;
            
            this.accountService.inActivateUser(userUpdate)
                .pipe(first())
                .subscribe( responseInActivate => {

                    if (responseInActivate.exito) {

                        userList.estado = 'Inactivo';
                        this.listUsers[this.listUsers.findIndex( u => u.id == idUser )] = userList;
                        this.alertService.success(responseInActivate.responseMesagge, { keepAfterRouteChange: false });

                    } else {
                        this.alertService.warn('Problemas al inactivar el usuario. Error: ' + responseInActivate.responseMesagge, { keepAfterRouteChange: false });
                    }
                    this.isActivating = false;
                },
                (error) => { 
                    this.isActivating = false; this.alertService.error(error, { keepAfterRouteChange: false });
                });
        } else {
            let message : string = 'No se puede modificar el estado de la cuenta administradora del sistema';
            this.alertService.info(message, { keepAfterRouteChange: false });
        }
    }
}
