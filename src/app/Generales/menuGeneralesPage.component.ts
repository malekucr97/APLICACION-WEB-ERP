import { Component, OnInit } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';

import { httpAccessPage } from '@environments/environment';

import { Router, ActivatedRoute } from '@angular/router';
import { stringify } from 'querystring';


@Component({ templateUrl: 'HTML_MenuGeneralesPage.html' })
export class MenuGeneralesComponent implements OnInit { user: User;


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
    }
}