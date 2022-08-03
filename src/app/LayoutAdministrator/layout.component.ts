import { Component } from '@angular/core';
import { AccountService } from '@app/_services';
import { httpAccessAdminPage } from '@environments/environment-access-admin';

@Component({ templateUrl: 'layout.component.html',
            styleUrls: ['../../assets/scss/administrator/app.scss']
})
export class LayoutAdministratorComponent {

    public adminpageurl : string = httpAccessAdminPage.urlPageAdministrator;

    constructor(private accountService: AccountService) { }

    logout() { this.accountService.logout(); }
}
