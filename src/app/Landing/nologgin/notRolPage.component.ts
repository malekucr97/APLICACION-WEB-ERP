import { Component } from '@angular/core';
import { AccountService } from '@app/_services';
import { User } from '@app/_models';

@Component({ templateUrl: 'HTML_NotRolPage.html', 
             styleUrls: ['../../../assets/scss/landing/app.scss'] 
})
export class NotRolPageComponent{
    user = new User();
    constructor(private accountService: AccountService) { this.user = this.accountService.userValue; }
    redirect() { this.accountService.logout(); }
}
