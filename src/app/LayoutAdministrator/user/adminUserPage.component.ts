import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { amdinBusiness, httpAccessAdminPage } from '@environments/environment-access-admin';
import { Router } from '@angular/router';
import { Compania } from '@app/_models/modules/compania';
import { httpLandingIndexPage } from '@environments/environment';

@Component({ templateUrl: 'HTML_AdminUserPage.html' })
export class AdminUserComponent implements OnInit {

    userObservable: User;
    businessObservable: Compania;

    URLConfigureUserPage: string = httpAccessAdminPage.urlPageAddEditUser;
    URLListUserPage: string = httpAccessAdminPage.urlPageListUsers;
    URLListBusinessPage: string = httpAccessAdminPage.urlPageListBusiness;
    URLListModulePage: string = httpAccessAdminPage.urlPageListModule;
    URLListRolePage: string = httpAccessAdminPage.urlPageListRole;

    private Home:string = httpLandingIndexPage.homeHTTP;

    constructor(private accountService: AccountService, 
                private router: Router) {
        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;
    }

    ngOnInit() {

        if (!this.businessObservable) {
            this.router.navigate([this.Home]);
            return;
        }

        if (!this.userObservable.esAdmin && this.userObservable.idRol !== amdinBusiness.adminSociedad) {
            this.router.navigate([this.URLConfigureUserPage + this.userObservable.identificacion]); 
            return;
        }
    }
}
