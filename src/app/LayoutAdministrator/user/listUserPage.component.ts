import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User } from '@app/_models';
import { Compania } from '@app/_models/modules/compania';
import { administrator, httpAccessAdminPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';
import { AdminPlan } from '@app/_models/admin/planes/plan';

@Component({templateUrl: 'HTML_ListUserPage.html',
            styleUrls: [ '../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss']
})
export class ListUserComponent extends OnSeguridad implements OnInit {

  public userObservable: User;  public businessObservable: Compania;
  public isUserSuperAdmin: boolean; public isUserAdminBusiness: boolean;
  public technicalUserId: string; public adminBusinessUserId: string;

  // --
  public URLAddEditUsertPage: string;
  public URLAddBusinessUsertPage: string;
  public URLAddRoleUsertPage: string;
  public URLAdministratorPage: string;

  public planBusiness: AdminPlan;

  public listUsers: User[];

  constructor(  private accountService: AccountService,
                private alertService: AlertService,
                private router: Router,
                private dialogo: MatDialog,
                private translateMessagesService: TranslateMessagesService ) {

    super(alertService, accountService, router, translateMessagesService);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
    if (!super.userAuthenticateAdmin()) { this.accountService.logout(); return; }
    // ***************************************************************

    this.URLAddEditUsertPage = httpAccessAdminPage.urlPageAddEditUser;
    this.URLAddBusinessUsertPage = httpAccessAdminPage.urlPageAddBUser;
    this.URLAddRoleUsertPage = httpAccessAdminPage.urlPageAddRUser;
    this.URLAdministratorPage = httpAccessAdminPage.urlPageAdministrator;

    this.isUserSuperAdmin = false; this.isUserAdminBusiness = false;

    this.userObservable = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;

    this.listUsers = [];

    // --

    this.technicalUserId = administrator.identification; 
    this.adminBusinessUserId = administrator.adminSociedad;

    this.obtenerPlanCompania();
  }

  ngOnInit() {

    if (this.userObservable.esAdmin) { 
      
      this.isUserSuperAdmin = true;
      
      this.accountService.getAllUsers(this._HIdUserSessionRequest, this._HBusinessSessionRequest)
          .pipe(first())
          .subscribe((users) => {
            if (users) {
              this.listUsers = users;
              this.accountService.suscribeListUser(this.listUsers);
            }
          });

    } else if ( this.userObservable.idRol === administrator.adminSociedad ) { 
      
      this.isUserAdminBusiness = true;

      this.accountService.getUsersBusiness( this.userObservable.empresa, 
                                            this._HIdUserSessionRequest, 
                                            this._HBusinessSessionRequest )
        .pipe(first())
        .subscribe((users) => {
          if (users && users.length > 0) {
            this.listUsers = users;
            this.accountService.suscribeListUser(this.listUsers);
          }
        });

    } else { this.accountService.logout(); }
  }

  selectObjetoUsuario(userSelected : User = null) : void {

    let listUsers: User[] = [];

    if (!userSelected) {

      if (this.planBusiness) {

        if (this.userObservable.idRol === administrator.adminSociedad) {

          listUsers = this.listUsers;

          this.validateRedirectPage(listUsers);
          
        } else {

          this.accountService.getUsersBusiness( this.userObservable.empresa,
                                                this._HIdUserSessionRequest,
                                                this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe((response) => {

              if (response && response.length > 0) {

                listUsers = response;
                listUsers.splice( listUsers.findIndex((m) => m.identificacion == this.technicalUserId), 1 );

                this.validateRedirectPage(listUsers);
              }
            });
        }
      } else { this.alertService.info(this.translateMessagesService.translateKey('ALERTS.BUSINESS_NO_PLAN')); }

      // -- ## editar información de usuarios
    } else { this.router.navigate([this.URLAddEditUsertPage + userSelected.identificacion]); }
  }

  optionBusiness(puserSelected : User = null) : void {

    this.router.navigate([this.URLAddBusinessUsertPage + puserSelected.identificacion]);
  }
  optionRole(puserSelected : User = null) : void {

    this.alertService.clear();

    if (puserSelected && this.planBusiness) {
     
      this.router.navigate([this.URLAddRoleUsertPage + puserSelected.identificacion]);

    } else { this.alertService.info(this.translateMessagesService.translateKey('ALERTS.BUSINESS_NO_PLAN')); }
  }

  deleteUser(idUser : number) {

    this.alertService.clear();

    this.dialogo.open(DialogoConfirmacionComponent, { data: this.translateMessagesService.translateKey('ALERTS.dialogConfirmDelete') })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {

          if (confirmado) {

            this.accountService.deleteUser( idUser, 
                                            this.businessObservable.id,
                                            this._HIdUserSessionRequest,
                                            this._HBusinessSessionRequest )
              .pipe(first())
              .subscribe((responseDelete) => {
      
                if (responseDelete.exito) {
                  
                  this.alertService.success(responseDelete.responseMesagge);
                  this.listUsers.splice( this.listUsers.findIndex((u) => u.id == idUser), 1 );

                  this.accountService.loadListUsers(this.listUsers);
    
                } else { this.alertService.error(responseDelete.responseMesagge); }
                
              }, (error) => { this.alertService.error(error); });

          } else { return; }
      });
  }

  updateStateUser(userStateUpdate : User) : void {
    this.accountService.activateInactivateUser(userStateUpdate, this._HIdUserSessionRequest, this._HBusinessSessionRequest)
    .pipe(first())
    .subscribe((responseActivate) => {

        if (responseActivate.exito) {
          
          this.listUsers[this.listUsers.findIndex((u) => u.id == userStateUpdate.id)] = userStateUpdate;
          this.alertService.success(responseActivate.responseMesagge);

        } else { this.alertService.warn(responseActivate.responseMesagge); }
      },
      (error) => {  this.alertService.error(error); }
    );
  }

  activateUser(identificacion : string, idUser : number) {

    this.alertService.clear();

    if (identificacion !== administrator.identification) {

      let userUpdate: User = this.listUsers.find((x) => x.id === idUser);
      userUpdate.estado = 'Active';

      this.updateStateUser(userUpdate);
      
    } else { this.alertService.info(this.translateMessagesService.translateKey('ALERTS.superAdminNotModification')); }
  }

  inActivateUser(identificacion : string, idUser : number) {

    this.alertService.clear();

    if (identificacion !== administrator.identification) {

      let userUpdate: User = this.listUsers.find((x) => x.id === idUser);
      userUpdate.estado = 'In-Active';

      this.updateStateUser(userUpdate);
      
    } else { this.alertService.info(this.translateMessagesService.translateKey('ALERTS.superAdminNotModification')); }
  }

  private cantidadAdministradores(listUsers : User[]) : number {

    let cant : number = 0;

    for (let i = 0; i < listUsers.length; i++) { 
      if (this.listUsers[i].idRol && listUsers[i].idRol.match(this.adminBusinessUserId)) cant++ ; 
    }

    return cant;
  }
  private obtenerPlanCompania() : void {
    
    this.accountService.getPlanBusiness(Number( this._HBusinessSessionRequest),
                                                this._HIdUserSessionRequest,
                                                this._HBusinessSessionRequest)
      .pipe(first())
      .subscribe(response => { this.planBusiness = response; });
  }
  private validateRedirectPage(listUsersBusiness : User[]) : void {

    let cantAdministradores : number = 0;
    let cantFuncionales : number = 0;

    let cantMaxAdministradores : number = this.planBusiness.maximoAdministradores;
    let cantMaxFuncionales : number = this.planBusiness.maximoFuncionales;

    cantFuncionales = listUsersBusiness.length;
    cantAdministradores = this.cantidadAdministradores(listUsersBusiness);
    cantFuncionales = cantFuncionales - cantAdministradores;

    if (cantFuncionales < cantMaxFuncionales || cantAdministradores < cantMaxAdministradores) {

      this.router.navigate([this.URLAddEditUsertPage]);

    } else { this.alertService.info(this.translateMessagesService.translateKey('ALERTS.USER_COUNT_NOT_ALLOWED')); }
  }
}
