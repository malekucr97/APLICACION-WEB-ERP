import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

import { User } from '../_models';

@Component({ templateUrl: 'HTML_InactiveRolPage.html' })
export class InactiveRolPageComponent{
    user = new User();

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }
}
