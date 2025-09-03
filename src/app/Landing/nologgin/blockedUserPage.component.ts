import { Component } from '@angular/core';
import { AccountService } from '@app/_services';
import { User } from '@app/_models';

@Component({
    selector: 'app-block-user-page',
    templateUrl: 'HTML_BlockedUserPage.html',
    styleUrls: ['../../../assets/scss/landing/app.scss'],
    standalone: false
})
export class BlockedUserPageComponent {
    user = new User();
    constructor(private accountService: AccountService) { this.user = this.accountService.userValue; }
    redirect() { this.accountService.logout(); }
}
