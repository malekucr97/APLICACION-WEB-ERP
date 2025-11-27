import { Component } from '@angular/core';
import { AccountService } from '@app/_services';

@Component({
    selector: 'app-not-module-page',
    templateUrl: 'HTML_NotModulePage.html',
    styleUrls: ['../../../assets/scss/landing/app.scss'],
    standalone: false
})
export class NotModulePageComponent {
    constructor(private accountService: AccountService) { }
    redirect() { this.accountService.logotWithoutApiCall(); }
}
