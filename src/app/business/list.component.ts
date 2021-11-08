import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    businesss = null;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAllBusiness()
            .pipe(first())
            .subscribe(businesss => this.businesss = businesss);
    }

    deleteBusiness(id: string) {
        const business = this.businesss.find(x => x.id === id);
        business.isDeleting = true;
        this.accountService.deleteUser(id)
            .pipe(first())
            .subscribe(() => {
                this.businesss = this.businesss.filter(x => x.id !== id) 
            });
    }
}