import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { Business } from '@app/_models/business';

import { httpAccessPage } from '@environments/environment';

@Component({ templateUrl: 'HTML_ListBusinessPage.html' })
export class ListBusinessComponent implements OnInit {
    businesss = null;

    URLAdministratorPage: string;

    public listBusiness: Business[] = [];

    constructor(private accountService: AccountService) {}

    ngOnInit() {

        this.URLAdministratorPage = httpAccessPage.urlPageAdministrator;

        this.accountService.getAllBusiness()
            .pipe(first())
            .subscribe(response =>
                this.listBusiness = response
            );
    }

    deleteBusiness(id: string) {
        const business = this.businesss.find(x => x.id === id);
        business.isDeleting = true;
        this.accountService.deleteUser(id)
            .pipe(first())
            .subscribe(() => {
                this.businesss = this.businesss.filter(x => x.id !== id);
            });
    }
}
