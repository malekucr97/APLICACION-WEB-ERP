import { Component } from '@angular/core';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'HTML_NotBusinessUserPage.html', 
             styleUrls: ['../../../assets/scss/landing/app.scss'] 
})
export class NotBusinessUserPageComponent {
    constructor(private accountService: AccountService) {}
    redirect() { this.accountService.logout(); }
}
