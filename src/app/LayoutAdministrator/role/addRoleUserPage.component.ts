import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role } from '@app/_models';
import {
  httpAccessAdminPage
} from '@environments/environment-access-admin';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { administrator, httpLandingIndexPage } from '@environments/environment';

@Component({ templateUrl: 'HTML_AddRoleUserPage.html' })
export class AddRoleUserComponent extends OnSeguridad implements OnInit {
  userObservable: User;

  userToAssign: User = new User();
  role: Role = new Role();

  listAllRoles: Role[] = [];

  isRolAssign: boolean = false;
  isDesAsignRoles: boolean;
  isAsignRole: boolean;

  _userIdParam : string = null;

  private Index: string = httpLandingIndexPage.indexHTTP;
  public HTTPListUserPage: string = httpAccessAdminPage.urlPageListUsers;

  listUserSubject: User[];

  constructor(  private route: ActivatedRoute,
                private accountService: AccountService,
                private alertService: AlertService,
                private router: Router ) {

    super(alertService, accountService, router);

    this.userObservable = this.accountService.userValue;
    this.listUserSubject = this.accountService.userListValue;

    if (!this.userObservable) { this.router.navigate([this.HTTPListUserPage]); return; }
    if (!this.listUserSubject) { this.router.navigate([this.HTTPListUserPage]); return; }

    if (!this.route.snapshot.params.id) { this.router.navigate([this.HTTPListUserPage]); return; }
    this._userIdParam = this.route.snapshot.params.id;

    if (!super.validarUsuarioAdmin()) { this.router.navigate([this.Index]); return; }

    if (this._userIdParam === administrator.identification) { 
      this.alertService.info('No es posible actualizar el rol del administrador.', { keepAfterRouteChange: true });
      this.router.navigate([this.HTTPListUserPage]);
      return;
    }

    this.userToAssign = this.listUserSubject.find(x => x.identificacion === this._userIdParam);
  }

  ngOnInit() {
    // this.alertService.clear();

    // if (!this.accountService.userListValue) {
    //   this.router.navigate([this.HTTPListUserPage]);
    //   return;
    // }
    // if (!super.validarUsuarioAdmin()) { this.router.navigate([this.Index]); return; }

    // if (!this.route.snapshot.params.id) {
    //   this.router.navigate([this.HTTPListUserPage]);
    //   return;
    // }

    // let pUserId: string = this.route.snapshot.params.id;

    // if (this._userIdParam !== administrator.identification) {

      // this.userToAssign = this.listUserSubject.find( (x) => x.identificacion === this._userIdParam );
      // this.accountService.loadListUsers(this.listUserSubject);

      this.accountService
        .getAllRoles()
        .pipe(first())
        .subscribe(
          (responseListRole) => {

            if (responseListRole && responseListRole.length > 0) {
              
              this.listAllRoles = responseListRole;
              this.listAllRoles.splice( this.listAllRoles.findIndex((r) => r.id == administrator.identification), 1 );

              if (this.userToAssign.idRol) {

                this.isRolAssign = true;
                this.role = this.listAllRoles.find( (x) => x.id === this.userToAssign.idRol );
              
              } else { this.role = null }
            }

            // this.listAllRoles = responseListRole;

            // // elimina el rol administrador del listado que se muestra en pantalla
            // this.listAllRoles.splice( this.listAllRoles.findIndex((r) => r.id == administrator.identification), 1 );
          },
          (error) => { this.alertService.error(error); }
        );
    // } else {
    //   this.alertService.info('No es posible actualizar el rol del administrador.');
    //   this.router.navigate([httpAccessAdminPage.urlPageListUsers]);
    // }
  }

  assignRoleUser(idRole: string): void {
    this.alertService.clear();
    this.isAsignRole = true;

    this.accountService
      .assignRoleUser(idRole, this.userToAssign.identificacion)
      .pipe(first())
      .subscribe(
        (response) => {

          if (response.exito) {

            this.role = this.listAllRoles.find((x) => x.id === idRole);
            this.isRolAssign = true;

            this.userToAssign.idRol = idRole;
            this.listUserSubject[ this.listUserSubject.findIndex( (u) => u.id == this.userToAssign.id ) ] = this.userToAssign;
            this.accountService.loadListUsers(this.listUserSubject);

            this.alertService.success(response.responseMesagge);

          } else { this.alertService.error(response.responseMesagge); }

          this.isAsignRole = false;
        },
        (error) => { this.isAsignRole = false; this.alertService.error(error); }
      );
  }

  desAsignAllRolesUser() {
    this.alertService.clear();  
    this.isDesAsignRoles = true;

    this.accountService
      .removeRoleUser(this.userToAssign)
      .pipe(first())
      .subscribe(
        (response) => {

          if (response.exito) {
            this.role = null;
            this.isRolAssign = false;

            this.userToAssign.idRol = null;
            this.listUserSubject[ this.listUserSubject.findIndex( (u) => u.id == this.userToAssign.id ) ] = this.userToAssign;
            this.accountService.loadListUsers(this.listUserSubject);

            this.alertService.success(response.responseMesagge);
          
          } else { this.alertService.error(response.responseMesagge); }

          this.isDesAsignRoles = false;
        },
        (error) => { this.isDesAsignRoles = false; this.alertService.error(error); }
      );
  }
}