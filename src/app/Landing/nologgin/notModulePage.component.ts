import { Component } from '@angular/core';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'HTML_NotModulePage.html', 
             styleUrls: ['../../../assets/scss/landing/app.scss'] 
})
export class NotModulePageComponent {
    constructor(private accountService: AccountService) { }
    redirect() { this.accountService.logout(); }
}
