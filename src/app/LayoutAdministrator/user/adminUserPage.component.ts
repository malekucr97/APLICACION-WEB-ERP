import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { Compania } from '@app/_models/modules/compania';
import { httpAccessAdminPage } from '@environments/environment';
import { Router } from '@angular/router';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';

@Component({ templateUrl: 'HTML_AdminUserPage.html' })
export class AdminUserComponent extends OnSeguridad implements OnInit {

    userObservable: User;
    businessObservable: Compania;

    URLConfigureUserPage: string = httpAccessAdminPage.urlPageAddEditUser;
    URLListUserPage: string = httpAccessAdminPage.urlPageListUsers;
    URLListBusinessPage: string = httpAccessAdminPage.urlPageListBusiness;
    URLListModulePage: string = httpAccessAdminPage.urlPageListModule;
    URLListRolePage: string = httpAccessAdminPage.urlPageListRole;

    constructor(private accountService: AccountService,
                private alertService: AlertService,
                private router: Router) {

        super(alertService, accountService, router);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
        if (!super.userAuthenticateAdmin()) this.accountService.logout();
        // ***************************************************************

        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;
    }

    ngOnInit() { }
}
