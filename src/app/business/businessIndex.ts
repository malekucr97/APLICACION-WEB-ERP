import { AccountService, AlertService } from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';

import { User } from '@app/_models';

@Component({ templateUrl: 'businessIndex.html' })
export class BusinessIndex { user: User;

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }
}