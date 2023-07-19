import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User, ResponseMessage } from '@app/_models';

import {
  httpAccessAdminPage,
} from '@environments/environment-access-admin';

import { Compania } from '@app/_models/modules/compania';

// validar si al copilar a producción se mantienen las propiedades del archivo prod
import { administrator, httpLandingIndexPage } from '@environments/environment';

@Component({ templateUrl: 'HTML_ListUserPage.html' })
export class ListUserComponent implements OnInit {
  userObservable: User;
  businessObservable: Compania;

  response: ResponseMessage;

  listUsers: User[] = [];

  isActivating: boolean = false;
  isDeleting: boolean = false;
  isActivatePanelAdmin: boolean = false;
  isUserSuperAdmin: boolean = false;
  isUserAdminBusiness: boolean = false;

  private Home: string = httpLandingIndexPage.homeHTTP;

  public URLAddEditUsertPage: string = httpAccessAdminPage.urlPageAddEditUser;
  public URLAddBusinessUsertPage: string = httpAccessAdminPage.urlPageAddBUser;
  public URLAddRoleUsertPage: string = httpAccessAdminPage.urlPageAddRUser;
  public URLAdministratorPage: string = httpAccessAdminPage.urlPageAdministrator;

  constructor(  private accountService: AccountService,
                private alertService: AlertService,
                private router: Router ) {

    this.userObservable = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;

    if (!this.userObservable)     { this.router.navigate([this.Home]); return; }
    if (!this.businessObservable) { this.router.navigate([this.Home]); return; }

    this.activarOpcionesUsuario();
  }

  ngOnInit() {

    // if (!this.businessObservable) this.router.navigate([this.Home]);

    if (this.userObservable.esAdmin) {
      
      this.accountService
          .getAllUsers()
          .pipe(first())
          .subscribe((users) => {
            if (users) {
              this.listUsers = users;
              this.accountService.suscribeListUser(this.listUsers);
            }  
          });

    } else if ( this.userObservable.idRol === administrator.adminSociedad )  {

      this.accountService
        .getUsersBusiness(this.userObservable.empresa)
        .pipe(first())
        .subscribe((users) => {
          if (users && users.length > 0) {
            this.listUsers = users;
            this.accountService.suscribeListUser(this.listUsers);
          }
        });

    } else { this.router.navigate([this.Home]); }
  }

  //#region METODOS-FUNCIONES

  activarOpcionesUsuario() {

    this.isActivatePanelAdmin = false;

    if (this.userObservable.esAdmin) this.isUserSuperAdmin = true;

    if (this.userObservable.idRol == administrator.adminSociedad) this.isUserAdminBusiness = true;

    if (this.isUserAdminBusiness || this.isUserSuperAdmin) this.isActivatePanelAdmin = true;
  }

  //#endregion

  //#region EVENTOS

  deleteUser(identificacionUsuario: string, idUser: number) {
    this.alertService.clear();

    if (identificacionUsuario !== administrator.identification) {
      this.isDeleting = true;

      this.accountService
        .deleteUser(idUser)
        .pipe(first())
        .subscribe(
          (responseDelete) => {

            if (responseDelete.exito) {
              this.alertService.success(responseDelete.responseMesagge);
              this.listUsers.splice( this.listUsers.findIndex((u) => u.id == idUser), 1 );

              this.accountService.loadListUsers(this.listUsers);

            } else {

              // agregar control de errores:
              // FK_PANTALLAXUSUARIOS_USUARIOS = se debe eliminar al usuario de la asignacion de acceso por pantallas
              // FK_USUARIOSXEMPRESAS_USUARIOS = se debe eliminar al usuario de la asignacion de empresas

              this.alertService.error(responseDelete.responseMesagge);
              console.log(responseDelete.responseMesagge);
            }

            this.isDeleting = false;
          },
          (error) => { this.isDeleting = false; this.alertService.error(error.message); }
        );
    } else { this.alertService.info('No se puede eliminar la cuenta administradora del sistema'); }
  }

  activateUser(identificacion, idUser: number) {
    this.alertService.clear();

    if (identificacion !== administrator.identification) {
      this.isActivating = true;

      let userList: User = this.listUsers.find((x) => x.id === idUser);
      let userUpdate: User = new User();
      userUpdate.id = idUser;

      this.accountService
        .activateUser(userUpdate)
        .pipe(first())
        .subscribe(
          (responseActivate) => {
            if (responseActivate.exito) {
              userList.estado = 'Activo';
              this.listUsers[this.listUsers.findIndex((u) => u.id == idUser)] =
                userList;

              this.alertService.success(responseActivate.responseMesagge, {
                keepAfterRouteChange: false,
              });
            } else {
              this.alertService.warn(
                'Problemas al activar el usuario. Error: ' +
                  responseActivate.responseMesagge,
                { keepAfterRouteChange: false }
              );
            }
            this.isActivating = false;
          },
          (error) => {
            this.isActivating = false;
            this.alertService.error(error, { keepAfterRouteChange: false });
          }
        );
    } else {
      let message: string =
        'No se puede modificar el estado de la cuenta administradora del sistema';
      this.alertService.info(message, { keepAfterRouteChange: false });
    }
  }

  inActivateUser(identificacion: string, idUser: number) {
    this.alertService.clear();

    if (identificacion !== administrator.identification) {
      this.isActivating = true;

      let userList: User = this.listUsers.find((x) => x.id === idUser);
      let userUpdate: User = new User();
      userUpdate.id = idUser;

      this.accountService
        .inActivateUser(userUpdate)
        .pipe(first())
        .subscribe(
          (responseInActivate) => {
            if (responseInActivate.exito) {
              userList.estado = 'Inactivo';
              this.listUsers[this.listUsers.findIndex((u) => u.id == idUser)] =
                userList;
              this.alertService.success(responseInActivate.responseMesagge, {
                keepAfterRouteChange: false,
              });
            } else {
              this.alertService.warn(
                'Problemas al inactivar el usuario. Error: ' +
                  responseInActivate.responseMesagge,
                { keepAfterRouteChange: false }
              );
            }
            this.isActivating = false;
          },
          (error) => {
            this.isActivating = false;
            this.alertService.error(error, { keepAfterRouteChange: false });
          }
        );
    } else {
      let message: string =
        'No se puede modificar el estado de la cuenta administradora del sistema';
      this.alertService.info(message, { keepAfterRouteChange: false });
    }
  }

  //#endregion
}
