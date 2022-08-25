import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';
import { httpAccessAdminPage, httpLandingIndexPage } from '@environments/environment-access-admin';
import { Compania } from '../../_models/modules/compania';
import { User } from '@app/_models';
import { Router } from '@angular/router';

@Component({ templateUrl: 'HTML_ListBusinessPage.html' })
export class ListBusinessComponent implements OnInit {
    
    userObservable: User;
    businessObservable: Compania;

    private Home : string = httpLandingIndexPage.homeHTTP;
    private Index : string = httpLandingIndexPage.indexHTTP;

    URLAdministratorPage: string = httpAccessAdminPage.urlPageAdministrator;

    listBusiness: Compania[] = [];

    constructor(private accountService: AccountService, 
                private router: Router) {
        
        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;
    }

    ngOnInit() {

        if (!this.userObservable.esAdmin) {
            this.router.navigate([this.Index]);
            return;
        }
        if (!this.businessObservable) {
            this.router.navigate([this.Home]);
            return;
        }

        this.accountService.getAllBusiness()
            .pipe(first())
            .subscribe(response => {
                this.listBusiness = response;
                this.accountService.suscribeListBusiness(this.listBusiness);
            });
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
