import { Component, OnInit } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';

import { amdinBusiness } from '@environments/environment';
import { httpAccessPage } from '@environments/environment';
import { AuthApp } from '@environments/environment';

import { Router, ActivatedRoute } from '@angular/router';
import { stringify } from 'querystring';

@Component({ templateUrl: 'HTML_AdminUserPage.html' })
export class AdminUserComponent implements OnInit { user: User;

    URLConfigureUserPage: string;
    URLListUserPage: string;
    URLListBusinessPage: string;
    URLListRolePage: string;

    public adminSistema: boolean;
    public adminEmpresa: boolean;

    constructor(private accountService: AccountService, private router: Router) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {

        this.URLConfigureUserPage = httpAccessPage.urlPageConfigUser;
        this.URLListUserPage = httpAccessPage.urlPageListUsers;
        this.URLListBusinessPage = httpAccessPage.urlPageListBusiness;
        this.URLListRolePage = httpAccessPage.urlPageListRole;


        if (this.user.estado === AuthApp.inactive) { this.router.navigate([httpAccessPage.urlPageInactiveUser]); return; }
        if (this.user.estado === AuthApp.pending) { this.router.navigate([httpAccessPage.urlPagePending]); return; }
        if (!this.user.idRol) { this.router.navigate([httpAccessPage.urlPageNotRol]); return; }

        this.adminSistema = false; this.adminEmpresa = false;

        if (this.user.esAdmin) { this.adminSistema = true; }
        if (this.user.idRol === amdinBusiness.adminSociedad) {this.adminEmpresa = true; }

        // -- >> en caso de que el usuario no sea administrador
        // -- >> redirecciona al usuario activo a la página de actualización del usuario
        if (AuthApp.active === this.user.estado && !this.adminEmpresa && !this.adminSistema) {
            this.router.navigate([httpAccessPage.urlPageConfigUser + this.user.identificacion]); return;
        }
    }
}
