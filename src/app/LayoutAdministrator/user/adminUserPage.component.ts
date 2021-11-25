import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { amdinBusiness, httpAccessAdminPage, AuthStatesApp } from '@environments/environment-access-admin';
import { httpAccessPage } from '@environments/environment';
import { Router } from '@angular/router';

@Component({ templateUrl: 'HTML_AdminUserPage.html' })
export class AdminUserComponent implements OnInit {
    user: User;

    URLConfigureUserPage: string;
    URLListUserPage: string;
    URLListBusinessPage: string;
    URLListRolePage: string;

    adminSistema: boolean;
    adminEmpresa: boolean;

    constructor(private accountService: AccountService, private router: Router) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {

        this.URLConfigureUserPage = httpAccessAdminPage.urlPageConfigUser;
        this.URLListUserPage = httpAccessAdminPage.urlPageListUsers;
        this.URLListBusinessPage = httpAccessAdminPage.urlPageListBusiness;
        this.URLListRolePage = httpAccessAdminPage.urlPageListRole;

        if (this.user.estado === AuthStatesApp.inactive) { this.router.navigate([httpAccessPage.urlPageInactiveUser]); return; }
        if (this.user.estado === AuthStatesApp.pending) { this.router.navigate([httpAccessPage.urlPagePending]); return; }
        if (!this.user.idRol) { this.router.navigate([httpAccessPage.urlPageNotRol]); return; }

        this.adminSistema = false; this.adminEmpresa = false;

        if (this.user.esAdmin) { this.adminSistema = true; }
        if (this.user.idRol === amdinBusiness.adminSociedad) {this.adminEmpresa = true; }

        // -- >> en caso de que el usuario no sea administrador
        // -- >> redirecciona al usuario activo a la página de actualización del usuario
        if (AuthStatesApp.active === this.user.estado && !this.adminEmpresa && !this.adminSistema) {
            this.router.navigate([this.URLConfigureUserPage + this.user.identificacion]); return;
        }
    }
}
