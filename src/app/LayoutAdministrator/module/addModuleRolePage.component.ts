import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role, Module } from '@app/_models';
import { httpAccessAdminPage } from '@environments/environment-access-admin';
import { Compania } from '../../_models/modules/compania';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { administrator, httpLandingIndexPage } from '@environments/environment';

@Component({ templateUrl: 'HTML_AddModuleRolePage.html' })
export class AddModuleRoleComponent extends OnSeguridad implements OnInit {
  userObservable: User;
  businessObservable: Compania;

  grantAccess: boolean = false;
  removeAccess: boolean = false;
  poseeModulos: boolean = false;

  administrador: boolean;

  role: Role;

  listModulesRol: Module[] = [];
  listModulesBusiness: Module[] = [];

  private Home: string = httpLandingIndexPage.homeHTTP;
  private Index: string = httpLandingIndexPage.indexHTTP;

  public urladminListRole: string = httpAccessAdminPage.urlPageListRole;

  listRolesSubject: Role[];

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private alertService: AlertService,
    private router: Router
  ) {
    super(alertService, accountService, router);

    this.userObservable = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;
    this.listRolesSubject = this.accountService.rolListValue;
  }

  ngOnInit() {
    this.alertService.clear();

    if (!this.accountService.rolListValue) {
      this.router.navigate([this.urladminListRole]);
      return;
    }
    if (!super.validarUsuarioAdmin()) {
      this.router.navigate([this.Index]);
      return;
    }
    if (!this.businessObservable) {
      this.router.navigate([this.Home]);
      return;
    }
    if (!this.route.snapshot.params.pidRole) {
      this.router.navigate([this.urladminListRole]);
      return;
    }

    let roleId = this.route.snapshot.params.pidRole;
    this.role = this.listRolesSubject.find((x) => x.id === roleId);

    if (this.role.esAdministrador !== administrator.rolAdministrator) {
      this.accountService
        .getModulesBusiness(this.businessObservable.id)
        .pipe(first())
        .subscribe(
          (responseModulesSystem) => {
            if (responseModulesSystem && responseModulesSystem.length > 0) {
              this.poseeModulos = true;

              this.listModulesBusiness = responseModulesSystem;

              this.accountService
                .getModulesByRolAndBusiness(roleId, this.businessObservable.id)
                .pipe(first())
                .subscribe(
                  (responseModulesRol) => {
                    if (responseModulesRol && responseModulesRol.length > 0) {
                      this.listModulesRol = responseModulesRol;

                      // valida si se han asignado todos los módulos a un rol
                      if (
                        this.listModulesBusiness.length !==
                        this.listModulesRol.length
                      ) {
                        this.listModulesRol.forEach((modRol) => {
                          // elimina los módulos que han sido asignados , en la lista de asignación
                          this.listModulesBusiness.splice(
                            this.listModulesBusiness.findIndex(
                              (m) => m.id == modRol.id
                            ),
                            1
                          );
                        });
                      } else {
                        this.listModulesBusiness = null;
                        this.poseeModulos = true;
                      }
                    } else {
                      this.listModulesRol = null;
                    }

                    // this.listModulesRol = responseModulesRol;

                    // if (this.listModulesRol && this.listModulesRol.length > 0 ) {

                    //     // valida si se han asignado todos los módulos a un rol
                    //     if (this.listModulesBusiness.length !== this.listModulesRol.length) {

                    //         this.listModulesRol.forEach((modRol) => {

                    //             // elimina los módulos que han sido asignados a la lista de asignación
                    //             this.listModulesBusiness.splice(this.listModulesBusiness.findIndex( m => m.identificador == modRol.identificador ), 1);
                    //         });

                    //     } else {  this.listModulesBusiness = null; this.poseeModulos = true; }

                    // } else { this.listModulesRol = null; }
                  },
                  (error) => {
                    this.alertService.error(
                      'Problemas al consultar la lista de módulos del rol seleccionado.' +
                        error
                    );
                  }
                );
            } else {
              this.listModulesBusiness = null;
              this.listModulesRol = null;
            }

            // if (this.listModulesBusiness && this.listModulesBusiness.length > 0) {

            //     // this.poseeModulos = true;

            //     // this.accountService.getModulesByRolAndBusiness(roleId, this.businessObservable.id)
            //     // .pipe(first())
            //     // .subscribe(responseModulesRol => {

            //     //     this.listModulesRol = responseModulesRol;

            //     //     if (this.listModulesRol && this.listModulesRol.length > 0 ) {

            //     //         // valida si se han asignado todos los módulos a un rol
            //     //         if (this.listModulesBusiness.length !== this.listModulesRol.length) {

            //     //             this.listModulesRol.forEach((modRol) => {

            //     //                 // elimina los módulos que han sido asignados a la lista de asignación
            //     //                 this.listModulesBusiness.splice(this.listModulesBusiness.findIndex( m => m.identificador == modRol.identificador ), 1);
            //     //             });

            //     //         } else {
            //     //             this.listModulesBusiness = null;
            //     //             this.poseeModulos = true;
            //     //         }
            //     //     } else { this.listModulesRol = null; }
            //     // },
            //     // error => { this.alertService.error('Problemas al consultar la lista de módulos del rol seleccionado.' + error); });
            // } else {
            //     this.listModulesBusiness = null;
            //     this.listModulesRol = null;
            // }
          },
          (error) => {
            this.listModulesBusiness = null;
            this.listModulesRol = null;
            this.alertService.error(
              'Problemas al consultar los módulos del sistema.' + error
            );
          }
        );
    } else {
      this.administrador = true;
      this.poseeModulos = true;
    }
  }

  otorgarAcceso(idModule: number) {
    this.alertService.clear();
    this.grantAccess = true;

    let module: Module = this.listModulesBusiness.find((m) => m.id == idModule);

    this.accountService
      .grantAccessModuleToRol(
        this.role.id,
        module.id,
        this.businessObservable.id
      )
      .pipe(first())
      .subscribe(
        (response) => {
          if (response.exito) {
            this.alertService.success(response.responseMesagge);
            // Actualiza las listas acceso
            this.listModulesBusiness.splice(
              this.listModulesBusiness.findIndex((m) => m.id == idModule),
              1
            );

            if (this.listModulesBusiness.length == 0)
              this.listModulesBusiness = null;

            if (!this.listModulesRol) this.listModulesRol = [];

            this.listModulesRol.push(module);
          } else {
            this.alertService.error(response.responseMesagge);
          }

          this.grantAccess = false;
        },
        (error) => {
          this.alertService.error(error);
          this.grantAccess = false;
        }
      );
  }

  eliminarAcceso(idModule: number) {
    this.alertService.clear();
    this.removeAccess = true;

    let module: Module = this.listModulesRol.find((m) => m.id == idModule);

    this.accountService
      .deleteAccessModuleToRol(
        this.role.id,
        module.id,
        this.businessObservable.id
      )
      .pipe(first())
      .subscribe(
        (responseDeleteAccess) => {
          if (responseDeleteAccess.exito) {
            this.alertService.success(responseDeleteAccess.responseMesagge);

            this.listModulesRol.splice(
              this.listModulesRol.findIndex((m) => m.id == idModule),
              1
            );

            if (this.listModulesRol.length == 0) this.listModulesRol = null;

            if (!this.listModulesBusiness) this.listModulesBusiness = [];

            this.listModulesBusiness.push(module);
          } else {
            this.alertService.error(responseDeleteAccess.responseMesagge);
          }

          this.removeAccess = false;
        },
        (error) => {
          this.alertService.error(error);
          this.removeAccess = false;
        }
      );
  }
}
