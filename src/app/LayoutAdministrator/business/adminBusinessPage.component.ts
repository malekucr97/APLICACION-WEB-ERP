import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'HTML_AdminBusinessPage.html' })
export class AdminBusinessComponent implements OnInit {
    user: User;
    constructor(private accountService: AccountService) { this.user = this.accountService.userValue; }
    ngOnInit() { }
}
