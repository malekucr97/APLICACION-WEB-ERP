import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role, Compania } from '@app/_models';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { administrator, httpAccessAdminPage } from '@environments/environment';

@Component({templateUrl: 'HTML_AddRoleUserPage.html',
            styleUrls: ['../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss']
})
export class AddRoleUserComponent extends OnSeguridad implements OnInit {
  userObservable: User;
  businessObservable: Compania;

  userToAssign: User = new User();
  role: Role = new Role();

  listAllRoles: Role[] = [];

  isRolAssign: boolean = false;
  isDesAsignRoles: boolean;
  isAsignRole: boolean;

  _userIdentificationParam : string = null;

  public HTTPListUserPage: string = httpAccessAdminPage.urlPageListUsers;

  listUserSubject: User[];

  constructor(  private route: ActivatedRoute,
                private accountService: AccountService,
                private alertService: AlertService,
                private router: Router ) {

    super(alertService, accountService, router);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
    if (!super.userAuthenticateAdmin()                  ||
        !this.route.snapshot.params.pidentificationUser ||
        !this.accountService.userListValue) { this.accountService.logout(); return; }
    // ***************************************************************

    this.userObservable = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;
    this.listUserSubject = this.accountService.userListValue;

    this._userIdentificationParam = this.route.snapshot.params.pidentificationUser;

    this.userToAssign = this.listUserSubject.find(x => x.identificacion === this._userIdentificationParam);
  }

  ngOnInit() {

      this.accountService.getRolesBusiness(this.businessObservable.id,this._HIdUserSessionRequest, this._HBusinessSessionRequest)
        .pipe(first())
        .subscribe((responseListRole) => {

            if (responseListRole && responseListRole.length > 0) {
              
              this.listAllRoles = responseListRole;
              this.listAllRoles.splice( this.listAllRoles.findIndex((r) => r.id == administrator.identification), 1 );

              if (this.userToAssign.idRol) {

                this.isRolAssign = true;
                this.role = this.listAllRoles.find( (x) => x.id === this.userToAssign.idRol );
              
              } else { this.role = null }
            }
          },
          (error) => { this.alertService.error(error); }
        );
  }

  assignRoleUser(idRole: string): void {
    this.alertService.clear();
    this.isAsignRole = true;

    this.accountService.assignRoleUser(idRole, this.userToAssign.identificacion,this._HIdUserSessionRequest, this._HBusinessSessionRequest)
      .pipe(first())
      .subscribe((response) => {

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

    this.accountService.removeRoleUser(this.userToAssign, this._HIdUserSessionRequest, this._HBusinessSessionRequest)
      .pipe(first())
      .subscribe((response) => {

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