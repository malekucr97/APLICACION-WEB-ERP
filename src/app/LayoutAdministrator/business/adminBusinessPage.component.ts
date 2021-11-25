import { Component, OnInit } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';

import { Router, ActivatedRoute } from '@angular/router';

@Component({ templateUrl: 'HTML_AdminBusinessPage.html' })
export class AdminBusinessComponent implements OnInit {
    user: User;

    constructor(private accountService: AccountService, private router: Router) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {
    }
}
