import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role, Module } from '@app/_models';
import { Compania } from '../../_models/modules/compania';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { administrator, httpAccessAdminPage } from '@environments/environment';

@Component({templateUrl: 'HTML_AddModuleRolePage.html',
            styleUrls: [ '../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss']
})
export class AddModuleRoleComponent extends OnSeguridad implements OnInit {
  userObservable: User;
  businessObservable: Compania;

  role: Role;

  listModulesRol: Module[] = [];
  listModulesBusiness: Module[] = [];

  public urladminListRole: string = httpAccessAdminPage.urlPageListRole;

  listRolesSubject: Role[];

  _pRolIdParam : string ; 

  constructor(  private route: ActivatedRoute,
                private accountService: AccountService,
                private alertService: AlertService,
                private router: Router ) {

    super(alertService, accountService, router);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
    if (!super.userAuthenticateAdmin()      ||
        !this.route.snapshot.params.pidRole ||
        !this.accountService.rolListValue) this.accountService.logout();
    // ***************************************************************

    this.userObservable = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;
    this.listRolesSubject = this.accountService.rolListValue;

    this._pRolIdParam = this.route.snapshot.params.pidRole;
    this.role = this.listRolesSubject.find((x) => x.id === this._pRolIdParam);
  }

  ngOnInit() {

    if (this.role.id !== administrator.identification && this.role.id !== administrator.adminSociedad) {

      this.accountService.getModulesBusiness(this.businessObservable.id)
        .pipe(first())
        .subscribe((responseModulesSystem) => {

            if (responseModulesSystem && responseModulesSystem.length > 0) {

              this.listModulesBusiness = responseModulesSystem;

              this.accountService.getModulesByRolAndBusiness(this._pRolIdParam, this.businessObservable.id)
                .pipe(first())
                .subscribe((responseModulesRol) => {

                    if (responseModulesRol && responseModulesRol.length > 0) {

                      this.listModulesRol = responseModulesRol;

                      // valida si se han asignado todos los módulos a un rol
                      if ( this.listModulesBusiness.length !== this.listModulesRol.length ) {

                        this.listModulesRol.forEach((modRol) => {
                          // elimina los módulos que han sido asignados , en la lista de asignación
                          this.listModulesBusiness.splice( this.listModulesBusiness.findIndex( (m) => m.id == modRol.id ), 1);
                        });

                      } else { this.listModulesBusiness = null; }
                    } else { this.listModulesRol = null; }
                  });
            } else {
              this.alertService.info(
                'Aún no hay Módulos asignados a la compañía: ' + this.businessObservable.nombre, 
                { keepAfterRouteChange: true }
              );
              this.router.navigate([this.urladminListRole]); 
            }
          },
          (error) => {
            this.alertService.error('Problemas al consultar los módulos del sistema.' + error, { keepAfterRouteChange: true });
            this.router.navigate([this.urladminListRole]); 
          }
        );
    } else {
      this.alertService.success(
        'El Usuario Administrador tiene acceso a todos los módulos activos en la compañía: ' + this.businessObservable.nombre, 
        { keepAfterRouteChange: true }
      );
      this.router.navigate([this.urladminListRole]);
    }
  }

  otorgarAcceso(idModule: number) {

    this.alertService.clear();

    let module: Module = this.listModulesBusiness.find((m) => m.id == idModule);

    this.accountService.grantAccessModuleToRol(this.role.id, module.id, this.businessObservable.id)
      .pipe(first())
      .subscribe((response) => {

          if (response.exito) {

            this.alertService.success(response.responseMesagge);

            // Actualiza las listas acceso
            this.listModulesBusiness.splice( this.listModulesBusiness.findIndex((m) => m.id == idModule), 1 );

            if (this.listModulesBusiness.length == 0) this.listModulesBusiness = null;

            if (!this.listModulesRol) this.listModulesRol = [];

            this.listModulesRol.push(module);

          } else {
            this.alertService.error(response.responseMesagge, { keepAfterRouteChange: true });
            this.router.navigate([this.urladminListRole]);
          }
        },
        (error) => {
          this.alertService.error(
            'Problemas al otorgar acceso de rol al módulo de la compañía.' + error, 
            { keepAfterRouteChange: true }
          );
          this.router.navigate([this.urladminListRole]);
        }
      );
  }

  eliminarAcceso(idModule: number) {

    this.alertService.clear();

    let module: Module = this.listModulesRol.find((m) => m.id == idModule);

    this.accountService.deleteAccessModuleToRol( this.role.id, module.id, this.businessObservable.id )
      .pipe(first())
      .subscribe((response) => {

          if (response.exito) {

            this.alertService.success(response.responseMesagge);

            // Actualiza las listas acceso
            this.listModulesRol.splice( this.listModulesRol.findIndex((m) => m.id == idModule), 1 );

            if (this.listModulesRol.length == 0) this.listModulesRol = null;

            if (!this.listModulesBusiness) this.listModulesBusiness = [];

            this.listModulesBusiness.push(module);

          } else {
            this.alertService.error(response.responseMesagge, { keepAfterRouteChange: true });
            this.router.navigate([this.urladminListRole]);
          }
        },
        (error) => {
          this.alertService.error(
            'Problemas al eliminar acceso de rol al módulo de la compañía.' + error, 
            { keepAfterRouteChange: true }
          );
          this.router.navigate([this.urladminListRole]);
        }
      );
  }
}
