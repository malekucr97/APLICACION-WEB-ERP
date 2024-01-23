import { Component } from '@angular/core';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'HTML_InactiveUserPage.html', 
             styleUrls: ['../../../assets/scss/landing/app.scss'] 
})
export class InactiveUserPageComponent {
    constructor(private accountService: AccountService) {}
    redirect() { this.accountService.logout(); }
}
