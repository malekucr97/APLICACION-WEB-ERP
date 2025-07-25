import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role } from '@app/_models';
import { Compania } from '@app/_models/modules/compania';
import { Router } from '@angular/router';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { administrator, httpAccessAdminPage } from '@environments/environment';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

@Component({
    templateUrl: 'HTML_ListRolePage.html',
    styleUrls: ['../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss'],
    standalone: false
})
export class ListRoleComponent extends OnSeguridad implements OnInit {
  userObservable: User;
  businessObservable: Compania;

  public listRoles: Role[];
  public existenRoles: boolean;

  adminBoss: boolean;
  adminBusiness: boolean;

  URLAddModuleRolPage: string = httpAccessAdminPage.urlPageAddModuleRol;
  URLAdministratorPage: string = httpAccessAdminPage.urlPageAdministrator;
  public URLAddEditRolPage: string = httpAccessAdminPage.urlPageAddEditRol;

  idBusiness: string;

  constructor(  private accountService: AccountService,
                private alertService: AlertService,
                private router: Router,
                private translate: TranslateMessagesService ) {

    super(alertService, accountService, router, translate);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
    if (!super.userAuthenticateAdmin()) { this.accountService.logout(); return; }
    // ***************************************************************

    this.userObservable = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;

    // -- #
    this.listRoles = null;
    this.existenRoles = false;
  }

  ngOnInit() { this.obtenerRoles(); }

  public redirectListModulesPage() : void { this.router.navigate([this.URLAdministratorPage]); }

  private obtenerRoles() {
    this.accountService.getRolesBusiness( this.businessObservable.id)
      .pipe(first())
      .subscribe((responseRoles) => {

        if (responseRoles && responseRoles.length > 0) {
          
          if (this.userObservable.idRol == administrator.adminSociedad) {
            // elimina el rol admin general de la lista si quien inicia sesión es un admin de empresa
            this.listRoles = responseRoles.filter( (x) => x.id !== administrator.identification );

            this.existenRoles = true;
          }
          else { this.listRoles = responseRoles; } 
  
          this.accountService.suscribeListRol(this.listRoles);

        } else { this.alertService.info(this.translate.translateKey('ALERTS.companyNotRoleAssignment')); }
      });
  }

  private updateRol( rolUpdate: Role): void {
    
    this.accountService.updateRol(rolUpdate,this.businessObservable.id)
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
      rolUpdate.estado = 'Active';

      this.updateRol(rolUpdate);

    } else { this.alertService.info(this.translate.translateKey('ALERTS.adminAccountModificationAlert')); }
  }

  inActivateRole(idRol: string) {

    this.alertService.clear();

    if (idRol !== administrator.identification) {

      let rolUpdate = this.listRoles.find((x) => x.id === idRol);
      rolUpdate.estado = 'In-Active';

      this.updateRol(rolUpdate);

    } else { this.alertService.info(this.translate.translateKey('ALERTS.adminAccountModificationAlert')); }
  }

  escritura(idRol: string) {
    this.alertService.clear();

    if (idRol !== administrator.identification) {

      let rolUpdate = this.listRoles.find((x) => x.id === idRol);
      rolUpdate.tipo = 'Writing';

      this.updateRol(rolUpdate);

    } else { this.alertService.info(this.translate.translateKey('ALERTS.adminPermissionChangeAlert')); }
  }

  lectura(idRol: string) {
    this.alertService.clear();

    if (idRol !== administrator.identification) {

      let rolUpdate = this.listRoles.find((x) => x.id === idRol);
      rolUpdate.tipo = 'Reading';

      this.updateRol(rolUpdate);

    } else { this.alertService.info(this.translate.translateKey('ALERTS.adminPermissionChangeAlert')); }
  }
}