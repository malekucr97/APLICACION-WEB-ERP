import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User, ResponseMessage } from '@app/_models';
import { Compania } from '@app/_models/modules/compania';
import { administrator, httpAccessAdminPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';

@Component({ templateUrl: 'HTML_ListUserPage.html',
styleUrls: [
    '../../../assets/scss/app.scss',
    '../../../assets/scss/administrator/app.scss']
})
export class ListUserComponent extends OnSeguridad implements OnInit {

  userObservable: User;
  businessObservable: Compania;

  response: ResponseMessage;

  listUsers: User[] = [];

  isActivatePanelAdmin: boolean = false;

  isUserSuperAdmin: boolean = false;
  isUserAdminBusiness: boolean = false;

  public URLAddEditUsertPage: string = httpAccessAdminPage.urlPageAddEditUser;
  public URLAddBusinessUsertPage: string = httpAccessAdminPage.urlPageAddBUser;
  public URLAddRoleUsertPage: string = httpAccessAdminPage.urlPageAddRUser;
  public URLAdministratorPage: string = httpAccessAdminPage.urlPageAdministrator;

  constructor(  private accountService: AccountService,
                private alertService: AlertService,
                private router: Router,
                private dialogo: MatDialog ) {

    super(alertService, accountService, router);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
    if (!super.userAuthenticateAdmin()) this.accountService.logout();
    // ***************************************************************

    this.userObservable = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;
  }

  ngOnInit() {

    if (this.userObservable.esAdmin) {

      this.isUserSuperAdmin = true;
      
      this.accountService.getAllUsers()
          .pipe(first())
          .subscribe((users) => {
            if (users) {
              this.listUsers = users;
              this.accountService.suscribeListUser(this.listUsers);
            }  
          });

    } else if ( this.userObservable.idRol === administrator.adminSociedad ) {

      this.isUserAdminBusiness = true;

      this.accountService.getUsersBusiness(this.userObservable.empresa)
        .pipe(first())
        .subscribe((users) => {
          if (users && users.length > 0) {
            this.listUsers = users;
            this.accountService.suscribeListUser(this.listUsers);
          }
        });

    } else { this.accountService.logout(); }
  }

  selectObjetoUsuario(puserSelected : User) : void {
    this.router.navigate([this.URLAddEditUsertPage + puserSelected.identificacion]);
  }

  deleteUser(identificacionUsuario : string, idUser : number) {

    this.alertService.clear();

    if (identificacionUsuario !== administrator.identification) {

      this.dialogo.open(DialogoConfirmacionComponent, { data: `Segur@ que desea eliminar el registro ${identificacionUsuario} para siempre ?
                                                              Asegurese de que el usuario no esté asignado a una Compañía` })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {

                if (confirmado) {

                  this.accountService.deleteUser(idUser)
                  .pipe(first())
                  .subscribe((responseDelete) => {
          
                      if (responseDelete.exito) {
                        this.alertService.success(responseDelete.responseMesagge);
                        this.listUsers.splice( this.listUsers.findIndex((u) => u.id == idUser), 1 );
          
                        this.accountService.loadListUsers(this.listUsers);
          
                      } else { this.alertService.error(responseDelete.responseMesagge); }
                    },
                    (error) => { this.alertService.error(error); }
                  );

                } else { return; }
            });

    } else { this.alertService.info('No se puede eliminar la cuenta administradora del sistema'); }
  }

  updateStateUser(userStateUpdate : User) : void {
    this.accountService.activateInactivateUser(userStateUpdate)
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
      userUpdate.estado = 'Activo';

      this.updateStateUser(userUpdate);
      
    } else { this.alertService.info('No se puede modificar el estado de la cuenta administradora del sistema'); }
  }

  inActivateUser(identificacion : string, idUser : number) {

    this.alertService.clear();

    if (identificacion !== administrator.identification) {

      let userUpdate: User = this.listUsers.find((x) => x.id === idUser);
      userUpdate.estado = 'Inactivo';

      this.updateStateUser(userUpdate);
      
    } else { this.alertService.info('No se puede modificar el estado de la cuenta administradora del sistema'); }
  }
}
