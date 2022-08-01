import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';
import { httpAccessAdminPage } from '@environments/environment-access-admin';
import { Compania } from '../../_models/modules/compania';

@Component({ templateUrl: 'HTML_ListBusinessPage.html' })
export class ListBusinessComponent implements OnInit {
    businesss = null;

    URLAdministratorPage: string;

    listBusiness: Compania[] = [];

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.URLAdministratorPage = httpAccessAdminPage.urlPageAdministrator;


        this.accountService.getAllBusiness()
            .pipe(first())
            .subscribe(response => this.listBusiness = response );
    }

    // ajustar eliminacion de emprsa
    deleteBusiness(id: number) {
        let business = this.listBusiness.find(x => x.id === id);
        // business.isDeleting = true;
        // this.accountService.deleteUser(id)
        //     .pipe(first())
        //     .subscribe(() => { this.businesss = this.businesss.filter(x => x.id !== id); });
    }
}
