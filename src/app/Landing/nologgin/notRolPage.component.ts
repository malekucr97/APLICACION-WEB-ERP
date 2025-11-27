import { Component } from '@angular/core';
import { AccountService } from '@app/_services';

@Component({selector: 'app-not-rol-page',
            templateUrl: 'HTML_NotRolPage.html',
            styleUrls: ['../../../assets/scss/landing/app.scss'],
            standalone: false
})
export class NotRolPageComponent{
    constructor(private accountService: AccountService) { }
    redirect() { this.accountService.logotWithoutApiCall(); }
}
