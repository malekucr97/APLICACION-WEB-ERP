import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

import { User } from '../_models';
import { Business } from '@app/_models/business';

@Component({ templateUrl: 'HTML_NotRolPage.html' })
export class NotRolPageComponent{
    user = new User();

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }
    redirect() { this.accountService.logout(); }
}
