import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { Compania } from '@app/_models/modules/compania';
import { httpAccessAdminPage } from '@environments/environment';
import { Router } from '@angular/router';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

@Component({
    templateUrl: 'HTML_AdminUserPage.html',
    styleUrls: ['../../../assets/scss/administrator/app.scss'],
    standalone: false
})
export class AdminUserComponent extends OnSeguridad implements OnInit {

    public userObservable: User; public businessObservable: Compania;

    public URLConfigureUserPage: string;
    public URLListUserPage: string;
    public URLListBusinessPage: string;
    public URLListPlanPage: string;
    public URLListModulePage: string;
    public URLListRolePage: string;

    public nombreUsuario : string;

    constructor(private accountService: AccountService,
                private alertService: AlertService,
                private router: Router,
                private translate: TranslateMessagesService) {

        super(alertService, accountService, router, translate);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
        if (!super.userAuthenticateAdmin()) { this.accountService.logout(); return; }
        // ***************************************************************

        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;

        // --
        this.URLConfigureUserPage = httpAccessAdminPage.urlPageAddEditUser;
        this.URLListUserPage = httpAccessAdminPage.urlPageListUsers;
        this.URLListBusinessPage = httpAccessAdminPage.urlPageListBusiness;
        this.URLListPlanPage = httpAccessAdminPage.urlPageListPlan;
        this.URLListModulePage = httpAccessAdminPage.urlPageListModule;
        this.URLListRolePage = httpAccessAdminPage.urlPageListRole;
    }

    ngOnInit() { }

    public redirectListUsersPage() : void { this.router.navigate([this.URLListUserPage]); }
    public redirectListComapniesPage() : void { this.router.navigate([this.URLListBusinessPage]); }
    public redirectListPlanesPage() : void { this.router.navigate([this.URLListPlanPage]); }
    public redirectListModulesPage() : void { this.router.navigate([this.URLListModulePage]); }
    public redirectListRolesPage() : void { this.router.navigate([this.URLListRolePage]); }
}
