import { Component } from '@angular/core';
import { AccountService } from '@app/_services';

@Component({selector: 'app-inactive-rol-page',
            templateUrl: 'HTML_InactiveRolPage.html',
            styleUrls: ['../../../assets/scss/landing/app.scss'],
            standalone: false
})
export class InactiveRolPageComponent {
    constructor(private accountService: AccountService) {}
    redirect() { this.accountService.logout(); }
}
