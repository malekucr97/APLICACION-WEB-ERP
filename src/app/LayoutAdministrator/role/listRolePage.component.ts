import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role } from '@app/_models';
import {
  administrator,
  amdinBusiness,
  httpAccessAdminPage,
  httpLandingIndexPage,
} from '@environments/environment-access-admin';
import { Compania } from '@app/_models/modules/compania';
import { Router } from '@angular/router';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';

@Component({ templateUrl: 'HTML_ListRolePage.html' })
export class ListRoleComponent extends OnSeguridad implements OnInit {
  userObservable: User;
  businessObservable: Compania;

  listRoles: Role[] = [];

  isActivating: boolean = false;
  isInActivating: boolean = false;
  isWriting: boolean = false;
  isReading: boolean = false;

  adminBoss: boolean;
  adminBusiness: boolean;

  URLAddModuleRolPage: string = httpAccessAdminPage.urlPageAddModuleRol;
  URLAdministratorPage: string = httpAccessAdminPage.urlPageAdministrator;

  idBusiness: string;

  private Home: string = httpLandingIndexPage.homeHTTP;
  private Index: string = httpLandingIndexPage.indexHTTP;

  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private router: Router
  ) {
    super(alertService, accountService, router);
    this.userObservable = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;
  }

  ngOnInit() {
    if (!this.businessObservable) {
      this.router.navigate([this.Home]);
      return;
    }
    if (!super.validarUsuarioAdmin()) {
      this.router.navigate([this.Index]);
      return;
    }
    this.obtenerRoles();
  }

  private obtenerRoles() {
    this.accountService
      .getAllRoles()
      .pipe(first())
      .subscribe((responseRoles) => {
        if (this.userObservable.idRol == amdinBusiness.adminSociedad)
          this.listRoles = responseRoles.filter(
            (x) => x.id !== administrator.id
          );
        else this.listRoles = responseRoles;
        this.accountService.suscribeListRol(this.listRoles);
      });
  }

  private updateRol(
    rolUpdate: Role,
    rolList: Role,
    idRol: string,
    accion: string,
    actualizaDato: string
  ): void {
    this.accountService
      .updateRol(rolUpdate)
      .pipe(first())
      .subscribe(
        (responseUpdate) => {
          if (responseUpdate.exito) {
            this.listRoles[this.listRoles.findIndex((r) => r.id == idRol)] =
              rolList;
            this.alertService.success(responseUpdate.responseMesagge, {
              keepAfterRouteChange: false,
            });
          } else {
            this.alertService.error(responseUpdate.responseMesagge, {
              keepAfterRouteChange: false,
            });

            switch (accion) {
              case 'Estado': {
                rolList.estado = actualizaDato;
                break;
              }
              case 'Tipo': {
                rolList.tipo = actualizaDato;
                break;
              }
              default: {
                null;
                break;
              }
            }

            this.listRoles[this.listRoles.findIndex((r) => r.id == idRol)] =
              rolList;
          }
          this.isActivating = false;
          this.isInActivating = false;
          this.isWriting = false;
          this.isReading = false;
        },
        (error) => {
          this.alertService.error(error, { keepAfterRouteChange: false });
        }
      );
  }

  activateRole(idRol: string) {
    this.alertService.clear();

    if (idRol !== administrator.id) {
      let estado = 'Activo';
      this.isActivating = true;

      let rolList = this.listRoles.find((x) => x.id === idRol);
      rolList.estado = estado;

      let rolUpdate: Role = new Role();
      rolUpdate.id = idRol;
      rolUpdate.estado = estado;

      this.updateRol(rolUpdate, rolList, idRol, 'Estado', 'Inactivo');
    } else {
      let message =
        'No se puede modificar el estado de la cuenta administradora del sistema';
      this.alertService.info(message, { keepAfterRouteChange: false });
    }
  }

  inActivateRole(idRol: string) {
    this.alertService.clear();

    if (idRol !== administrator.id) {
      let estado = 'Inactivo';
      this.isInActivating = true;

      let rolList = this.listRoles.find((x) => x.id === idRol);
      rolList.estado = estado;

      let rolUpdate: Role = new Role();
      rolUpdate.id = idRol;
      rolUpdate.estado = estado;

      this.updateRol(rolUpdate, rolList, idRol, 'Estado', 'Activo');
    } else {
      let message =
        'No se puede modificar el estado de la cuenta administradora del sistema';
      this.alertService.info(message, { keepAfterRouteChange: false });
    }
  }

  escritura(idRol: string) {
    this.alertService.clear();

    if (idRol !== administrator.id) {
      let tipo = 'Escritura';
      this.isWriting = true;

      let rolList = this.listRoles.find((x) => x.id === idRol);
      rolList.tipo = tipo;

      let rolUpdate: Role = new Role();
      rolUpdate.id = idRol;
      rolUpdate.tipo = tipo;

      this.updateRol(rolUpdate, rolList, idRol, 'Tipo', 'Lectura');
    } else {
      let message =
        'No se puede cambiar el tipo de permisos de la cuenta administradora del sistema';
      this.alertService.info(message, { keepAfterRouteChange: false });
    }
  }

  lectura(idRol: string) {
    this.alertService.clear();

    if (idRol !== administrator.id) {
      let tipo = 'Lectura';
      this.isReading = true;

      let rolList = this.listRoles.find((x) => x.id === idRol);
      rolList.tipo = tipo;

      let rolUpdate: Role = new Role();
      rolUpdate.id = idRol;
      rolUpdate.tipo = tipo;

      this.updateRol(rolUpdate, rolList, idRol, 'Tipo', 'Escritura');
    } else {
      let message =
        'No se puede cambiar el tipo de permisos de la cuenta administradora del sistema';
      this.alertService.info(message, { keepAfterRouteChange: false });
    }
  }
}
