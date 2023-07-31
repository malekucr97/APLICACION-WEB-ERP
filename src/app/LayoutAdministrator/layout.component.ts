import { Component } from '@angular/core';
import { AccountService } from '@app/_services';

@Component({ 
    templateUrl: 'layout.component.html',
    styleUrls: ['../../assets/scss/app.scss', '../../assets/scss/administrator/app.scss']
})
export class LayoutAdministratorComponent  {

    constructor(private accountService: AccountService) { }

    logout() { this.accountService.logout(); }
}
