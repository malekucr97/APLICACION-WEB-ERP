﻿import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';

@Component({
    selector: 'layout-account',
    templateUrl: 'layout.component.html',
    standalone: false
})
export class LayoutComponent {
    constructor(private router: Router,
                private accountService: AccountService ) {
        if (this.accountService.userValue) this.router.navigate(['/']);
    }
}
