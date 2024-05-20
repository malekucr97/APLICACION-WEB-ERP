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

  listAllRoles: Role[] = [];

  isDesAsignRoles: boolean;
  isAsignRole: boolean;

  public HTTPListUserPage: string;
  // --
  public technicalUserId: string; public adminBusinessUserId: string;

  public isRolAssign: boolean;

  public identificationUserSelected : string;
  
  public addPlanBusiness: boolean;

  public cantAdministradores : number;
  public cantFuncionales : number;

  public planBusiness: AdminPlan;

  public roleUser: Role;
  public userToAssign: User;
  public listUsers: User[];

  constructor(private accountService: AccountService,  
              private alertService: AlertService,
              private router: Router,
              private route: ActivatedRoute,
              private translate: TranslateMessagesService ) {

    super(alertService, accountService, router, translate);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
    if (!super.userAuthenticateAdmin()) { this.accountService.logout(); return; }
    // ***************************************************************

    this.userObservable = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;

    this.userToAssign = new User();

    this.addPlanBusiness = false; this.isRolAssign = false;
    
    // --
    this.HTTPListUserPage = httpAccessAdminPage.urlPageListUsers;

    this.listUsers = [];
    this.roleUser = null;

    this.technicalUserId = administrator.identification; 
    this.adminBusinessUserId = administrator.adminSociedad;

    this.obtenerPlanCompania();
    // this.validarCantTiposUsuarios();
  }

  ngOnInit() {

    if (this.route.snapshot.params.pidentificationUser) {
      
      this.identificationUserSelected = this.route.snapshot.params.pidentificationUser;

      this.addPlanBusiness = true;

      this.accountService.getRolesBusiness( this.businessObservable.id,
                                            this._HIdUserSessionRequest,
                                            this._HBusinessSessionRequest )
        .pipe(first())
        .subscribe((responseListRole) => {

          if (responseListRole && responseListRole.length > 0) {

            this.listAllRoles = responseListRole;
            this.listAllRoles.splice( this.listAllRoles.findIndex((r) => r.id == this.technicalUserId), 1 );

            this.accountService.getUsersBusiness( this.businessObservable.id, 
                                                  this._HIdUserSessionRequest, 
                                                  this._HBusinessSessionRequest )
              .pipe(first())
              .subscribe((response) => {

                if (response && response.length > 0) {

                  this.listUsers = response;
                  this.listUsers.splice( this.listUsers.findIndex((m) => m.identificacion == this.technicalUserId), 1 );

                  this.userToAssign = this.listUsers.find(x => x.identificacion === this.identificationUserSelected);

                  if (this.userToAssign.idRol) {

                    this.isRolAssign = true;
                    this.roleUser = this.listAllRoles.find( (x) => x.id === this.userToAssign.idRol );
      
                  } else { this.roleUser = null; }
                }
              });
          }}, (error) => { this.alertService.error(error); });

    } else { this.accountService.logout(); }
  }

  assignRoleUser(idRole: string): void {

    let asignarRol : boolean = false;

    this.alertService.clear();
    this.isAsignRole = true;

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

            this.roleUser = this.listAllRoles.find((x) => x.id === idRole);
            this.isRolAssign = true;

            this.userToAssign.idRol = idRole;
            this.listUsers[ this.listUsers.findIndex( (u) => u.id == this.userToAssign.id ) ] = this.userToAssign;

            this.alertService.success(response.responseMesagge);

          } else { this.alertService.error(response.responseMesagge); }

        }, (error) => { this.isAsignRole = false; this.alertService.error(error); });
      
    } else { this.alertService.info(this.translate.translateKey('ALERTS.NO_ASIGN_ROL_USER')); }
  }

  desAsignAllRolesUser() {

    this.alertService.clear();  
    this.isDesAsignRoles = true;

    this.accountService.removeRoleUser(this.userToAssign, this._HIdUserSessionRequest, this._HBusinessSessionRequest)
      .pipe(first())
      .subscribe((response) => {

        if (response.exito) {
          this.roleUser = null;
          this.isRolAssign = false;

          this.userToAssign.idRol = null;
          this.listUsers[ this.listUsers.findIndex( (u) => u.id == this.userToAssign.id ) ] = this.userToAssign;

          this.alertService.success(response.responseMesagge);
        
        } else { this.alertService.error(response.responseMesagge); }
        
        }, (error) => { this.isDesAsignRoles = false; this.alertService.error(error); }
      );
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
}