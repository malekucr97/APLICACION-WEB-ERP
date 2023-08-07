import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role } from '@app/_models';
import { Compania } from '@app/_models/modules/compania';
import { Router } from '@angular/router';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { administrator, httpAccessAdminPage } from '@environments/environment';

@Component({templateUrl: 'HTML_ListRolePage.html',
            styleUrls: [  '../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss']
})
export class ListRoleComponent extends OnSeguridad implements OnInit {
  userObservable: User;
  businessObservable: Compania;

  listRoles: Role[] = [];

  adminBoss: boolean;
  adminBusiness: boolean;

  URLAddModuleRolPage: string = httpAccessAdminPage.urlPageAddModuleRol;
  URLAdministratorPage: string = httpAccessAdminPage.urlPageAdministrator;
  public URLAddEditRolPage: string = httpAccessAdminPage.urlPageAddEditRol;

  idBusiness: string;

  constructor(  private accountService: AccountService,
                private alertService: AlertService,
                private router: Router ) {

    super(alertService, accountService, router);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
    if (!super.userAuthenticateAdmin()) { this.accountService.logout(); return; }
    // ***************************************************************

    this.userObservable = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;
  }

  ngOnInit() { this.obtenerRoles(); }

  private obtenerRoles() {
    this.accountService.getRolesBusiness(this.businessObservable.id)
      .pipe(first())
      .subscribe((responseRoles) => {

        if (responseRoles && responseRoles.length > 0) {
          
          if (this.userObservable.idRol == administrator.adminSociedad) {
            // elimina el rol admin general de la lista si quien inicia sesión es un admin de empresa
            this.listRoles = responseRoles.filter( (x) => x.id !== administrator.identification );
          }
          else { this.listRoles = responseRoles; } 
  
          this.accountService.suscribeListRol(this.listRoles);

        } else { this.alertService.info('La compañía ' + this.businessObservable.nombre + ' no posee roles asignados.'); }
      });
  }

  private updateRol( rolUpdate: Role): void {
    
    this.accountService.updateRol(rolUpdate, this.businessObservable.id)
      .pipe(first())
      .subscribe((responseUpdate) => {

          if (responseUpdate.exito) {

            this.listRoles[this.listRoles.findIndex((r) => r.id == rolUpdate.id)] = rolUpdate;
            this.alertService.success(responseUpdate.responseMesagge);

          } else { this.alertService.error(responseUpdate.responseMesagge); }
        },
        (error) => { this.alertService.error(error); }
      );
  }

  activateRole(idRol: string) {

    this.alertService.clear();

    if (idRol !== administrator.identification) {
      
      let rolUpdate : Role = this.listRoles.find((x) => x.id === idRol);
      rolUpdate.estado = 'Activo';

      this.updateRol(rolUpdate);

    } else { this.alertService.info('No se puede modificar el estado de la cuenta administradora del sistema'); }
  }

  inActivateRole(idRol: string) {

    this.alertService.clear();

    if (idRol !== administrator.identification) {

      let rolUpdate = this.listRoles.find((x) => x.id === idRol);
      rolUpdate.estado = 'Inactivo';

      this.updateRol(rolUpdate);

    } else { this.alertService.info('No se puede modificar el estado de la cuenta administradora del sistema'); }
  }

  escritura(idRol: string) {
    this.alertService.clear();

    if (idRol !== administrator.identification) {

      let rolUpdate = this.listRoles.find((x) => x.id === idRol);
      rolUpdate.tipo = 'Escritura';

      this.updateRol(rolUpdate);

    } else { this.alertService.info('No se puede cambiar el tipo de permisos de la cuenta administradora del sistema'); }
  }

  lectura(idRol: string) {
    this.alertService.clear();

    if (idRol !== administrator.identification) {

      let rolUpdate = this.listRoles.find((x) => x.id === idRol);
      rolUpdate.tipo = 'Lectura';

      this.updateRol(rolUpdate);

    } else { this.alertService.info('No se puede cambiar el tipo de permisos de la cuenta administradora del sistema'); }
  }
}