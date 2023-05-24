import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';
import { httpAccessAdminPage, httpLandingIndexPage } from '@environments/environment-access-admin';
import { Compania } from '../../_models/modules/compania';
import { User } from '@app/_models';
import { Router } from '@angular/router';

@Component({    templateUrl: 'HTML_ListBusinessPage.html',
                styleUrls: ['../../../assets/scss/app.scss'] 
})
export class ListBusinessComponent implements OnInit {
    
    userObservable      : User;
    businessObservable  : Compania;

    private Home    : string = httpLandingIndexPage.homeHTTP;
    private Index   : string = httpLandingIndexPage.indexHTTP;

    public URLAdministratorPage         : string = httpAccessAdminPage.urlPageAdministrator;
    public urlPageAddEditBusiness       : string = httpAccessAdminPage.urlPageAddEditBusiness;
    public urlPageListBusinessModules   : string = httpAccessAdminPage.urlPageListBusinessModule;

    listBusiness: Compania[] = [];

    constructor(private accountService: AccountService, 
                private router: Router) {
        
        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;
    }

    ngOnInit() {

        if (!this.userObservable.esAdmin) { this.router.navigate([this.Index]); return; }
        if (!this.businessObservable) { this.router.navigate([this.Home]); return; }

        this.accountService.getAllBusiness()
            .pipe(first())
            .subscribe(response => {
                this.listBusiness = response;
                this.accountService.suscribeListBusiness(this.listBusiness);
            });
    }
}
