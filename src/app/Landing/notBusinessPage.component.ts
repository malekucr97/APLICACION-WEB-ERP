import { Component } from '@angular/core';

import { AccountService } from '@app/_services';

import { User } from '../_models';

@Component({ templateUrl: 'HTML_NotBusinessPage.html' })
export class NotBusinessPageComponent {
    user = new User();

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }
    redirect() { this.accountService.logout(); }
}
