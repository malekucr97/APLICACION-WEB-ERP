import { Component, OnInit } from '@angular/core';

import { User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';

import { Router, ActivatedRoute } from '@angular/router';
import { stringify } from 'querystring';

@Component({ templateUrl: 'HTML_ConfigureBusinessPage.html' })
export class ConfigureBusinessComponent implements OnInit { user: User;

    idBusinessConfigure: string;

    constructor(private accountService: AccountService, private router: Router, private route: ActivatedRoute,
        private alertService: AlertService) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {

        if (this.route.snapshot.params.pidBusiness){

            this.idBusinessConfigure = this.route.snapshot.params.pidBusiness;

        }
    }
}
