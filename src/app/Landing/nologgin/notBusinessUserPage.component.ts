import { Component } from '@angular/core';
import { AccountService } from '@app/_services';

@Component({selector: 'app-not-business-user-page',
            templateUrl: 'HTML_NotBusinessUserPage.html',
            styleUrls: ['../../../assets/scss/landing/app.scss'],
            standalone: false
})
export class NotBusinessUserPageComponent {
    constructor(private accountService: AccountService) {}
    redirect() { this.accountService.logotWithoutApiCall(); }
}
