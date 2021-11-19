import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '@app/_services';

import { User } from '../_models';

@Component({ templateUrl: 'HTML_PendingPage.html' })
export class PendingPageComponent{
    user = new User();

    constructor(private accountService: AccountService, private router: Router) {
        this.user = this.accountService.userValue;
    }

    redirect() { this.accountService.logout(); }
}
