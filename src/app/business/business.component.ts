import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

import { administrator } from '@environments/environment';
import { User } from '@app/_models';
import { Business } from '@app/_models/business';

@Component({ templateUrl: 'businessAdmin.component.html' })
export class BusinessComponent implements OnInit {
    returnUrl: string;
    user: User;
    id: string;
    business: Business;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {  
    }

}