import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role, Compania } from '@app/_models';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { administrator, httpAccessAdminPage } from '@environments/environment';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';
import { AdminPlan } from '@app/_models/admin/planes/plan';

@Component({templateUrl: 'HTML_AddRoleUserPage.html',
            styleUrls: ['../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss']
})
export class AddRoleUserComponent extends OnSeguridad implements OnInit {
  
  public userObservable: User; public businessObservable: Compania;
  public HTTPListUserPage: string;
  public technicalUserId: string; public adminBusinessUserId: string;

  public planBusiness: AdminPlan;

  public listRolesBusiness: Role[]; public listUsers: User[];

  public cantAdministradores : number; public cantFuncionales : number;
  
  // --
  public identificationUserSelected : string;
  public isListRolesBusiness : boolean;  public isRolAssign: boolean; public isUserinBusiness : boolean; public enableRoleUser:boolean;

  public roleUser: Role; public userToAssign: User;

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private accountService: AccountService,
              private alertService: AlertService,
              private translate: TranslateMessagesService ) {

    super(alertService, accountService, router, translate);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
    if (!super.userAuthenticateIndexHttp()) { this.accountService.logout(); return; }
    if (!super.validarUsuarioAdmin()) { this.accountService.logout(); return; }
    // ***************************************************************

    this.userObservable = this.accountService.userValue; this.businessObservable = this.accountService.businessValue;
    
    this.isListRolesBusiness = true; this.isRolAssign = true; this.isUserinBusiness = true;
    
    // --
    this.HTTPListUserPage = httpAccessAdminPage.urlPageListUsers;

    this.userToAssign = new User(); this.roleUser = new Role();

    this.technicalUserId = administrator.identification; 
    this.adminBusinessUserId = administrator.adminSociedad;

    this.enableRoleUser = false;

    this.obtenerPlanCompania();
    this.obtenerRolesCompania();
    this.obtenerUsuariosCompania();
  }

  public redirectListUsersPage() : void { this.router.navigate([this.HTTPListUserPage]); }

  ngOnInit() {

    if (this.route.snapshot.params.pidentificationUser) {

      this.identificationUserSelected = this.route.snapshot.params.pidentificationUser;

      this.accountService.getUserByIdentification(this.identificationUserSelected)
        .pipe(first())
        .subscribe((responseUser) => {

          this.userToAssign = responseUser;

          if (this.userToAssign && this.userToAssign.idRol) {

            this.accountService.getUserBusiness(this.userToAssign.id, this.businessObservable.id)
              .pipe(first())
              .subscribe((responseUserBusiness) => { 

                if (responseUserBusiness) {

                  this.accountService.getRolUserBusiness( this.userToAssign.idRol,
                                                          this.businessObservable.id,
                                                          this._HIdUserSessionRequest,
                                                          this._HBusinessSessionRequest )
                    .pipe(first())
                    .subscribe((responseRole) => { if (responseRole) { this.roleUser = responseRole; } else { this.isRolAssign = false; } });
                
                  } else { this.isUserinBusiness = false; }

                  this.enableRoleUser = true;
              });
          // **
          // ** NO SE HA ASIGNADO ROL A USUARIO
          } else { this.isRolAssign = false; this.enableRoleUser = true; }
          // **
        });
    }
  }

  assignRoleUser(idRole: string): void {

    let asignarRol : boolean = false;

    this.alertService.clear();

    this.validarCantTiposUsuarios();

    if ( idRole === this.adminBusinessUserId ) {

      if ( this.cantAdministradores < this.planBusiness.maximoAdministradores ) asignarRol = true;
      
    } else {

      if ( this.cantFuncionales <= this.planBusiness.maximoFuncionales ) asignarRol = true;
      
    }

    if (asignarRol) {

      this.accountService.assignRoleUser( idRole,
                                          this.userToAssign.identificacion,
                                          this._HIdUserSessionRequest,
                                          this._HBusinessSessionRequest )
        .pipe(first())
        .subscribe((response) => {

          if (response.exito) {

            this.isRolAssign = true;
            this.roleUser = this.listRolesBusiness.find((x) => x.id === idRole);
            
            this.userToAssign.idRol = idRole;
            this.listUsers[ this.listUsers.findIndex( (u) => u.id == this.userToAssign.id ) ] = this.userToAssign;

            this.alertService.success(response.responseMesagge);

          } else { this.alertService.error(response.responseMesagge); }

        }, (error) => {  this.alertService.error(error); });
      
    } else { this.alertService.info(this.translate.translateKey('ALERTS.NO_ASIGN_ROL_USER')); }
  }

  desAsignAllRolesUser() {

    this.alertService.clear();

    this.accountService.removeRoleUser(this.userToAssign)
      .pipe(first())
      .subscribe((response) => {

        if (response.exito) {
          this.roleUser = null;
          this.isRolAssign = false;

          this.userToAssign.idRol = null;
          this.listUsers[ this.listUsers.findIndex( (u) => u.id == this.userToAssign.id ) ] = this.userToAssign;

          this.alertService.success(response.responseMesagge);
        
        } else { this.alertService.error(response.responseMesagge); }
        
        }, (error) => { this.alertService.error(error); });
  }

  private obtenerPlanCompania() : void {
    
    this.accountService.getPlanBusiness(Number( this._HBusinessSessionRequest),
                                                this._HIdUserSessionRequest,
                                                this._HBusinessSessionRequest)
      .pipe(first())
      .subscribe(response => { this.planBusiness = response; });
  }
  private validarCantTiposUsuarios() : void {

    this.cantFuncionales = this.listUsers.length;
    this.cantAdministradores = this.cantidadAdministradores();
    this.cantFuncionales = this.cantFuncionales - this.cantAdministradores;
  }
  private cantidadAdministradores() : number {

    let cant : number = 0;

    for (let i = 0; i < this.listUsers.length; i++) { 
      if (this.listUsers[i].idRol && this.listUsers[i].idRol.match(this.adminBusinessUserId)) cant++ ;
    }
    return cant;
  }
  private obtenerRolesCompania() : void {

    this.accountService.getRolesBusiness( this.userObservable.empresa,
                                          this._HIdUserSessionRequest,
                                          this._HBusinessSessionRequest )
      .pipe(first())
      .subscribe((responseListRole) => {

        if (responseListRole && responseListRole.length > 0) {

          this.listRolesBusiness = responseListRole;
          this.listRolesBusiness.splice( this.listRolesBusiness.findIndex((r) => r.id == this.technicalUserId), 1 );

        } else { this.isListRolesBusiness = false; }

      }, (error) => { this.alertService.error(error); });
  }
  private obtenerUsuariosCompania() : void {

    this.accountService.getUsersBusiness(this.userObservable.empresa)
      .pipe(first())
      .subscribe((users) => {
        if (users && users.length > 0) { 
          this.listUsers = users;
          this.listUsers.splice( this.listUsers.findIndex((m) => m.identificacion == this.technicalUserId), 1 );
        }
      });
  }

}