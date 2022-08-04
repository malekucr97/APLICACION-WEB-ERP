import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { amdinBusiness, httpAccessAdminPage } from '@environments/environment-access-admin';
import { Router } from '@angular/router';

@Component({ templateUrl: 'HTML_AdminUserPage.html' })
export class AdminUserComponent implements OnInit {
    user: User;

    URLConfigureUserPage: string = httpAccessAdminPage.urlPageConfigUser;
    URLListUserPage: string = httpAccessAdminPage.urlPageListUsers;
    URLListBusinessPage: string = httpAccessAdminPage.urlPageListBusiness;
    URLListModulePage: string = httpAccessAdminPage.urlPageListModule;
    URLListRolePage: string = httpAccessAdminPage.urlPageListRole;

    seleccionCompania: boolean = false;

    constructor(private accountService: AccountService, 
                private router: Router) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {

        if (this.user && this.user.empresa) {

            this.seleccionCompania = true;

            // si el usuario que inicia sesión no es administrador muestra la pantalla de actualizar info de usuario
            if (!this.user.esAdmin && this.user.idRol !== amdinBusiness.adminSociedad) {

                this.router.navigate([this.URLConfigureUserPage + this.user.identificacion]); 
                return;
            }
        } else {
            this.seleccionCompania = false;
        }

        // if (this.user.estado === AuthStatesApp.inactive) { 
        //     this.router.navigate([httpAccessPage.urlPageInactiveUser]); 
        //     return; 
        // }
        // if (this.user.estado === AuthStatesApp.pending) { 
        //     this.router.navigate([httpAccessPage.urlPagePending]); 
        //     return; 
        // }
        // if (!this.user.idRol) { 
        //     this.router.navigate([httpAccessPage.urlPageNotRol]); 
        //     return; 
        // }

        // this.adminSistema = false; 
        // this.adminEmpresa = false;

        // if (this.user.esAdmin) { 
        //     this.adminSistema = true; 
        // }
        // if (this.user.idRol === amdinBusiness.adminSociedad) {
        //     this.adminEmpresa = true; 
        // }

        // -- >> en caso de que el usuario no sea administrador
        // -- >> redirecciona al usuario activo a la página de actualización del usuario
        
    }
}
