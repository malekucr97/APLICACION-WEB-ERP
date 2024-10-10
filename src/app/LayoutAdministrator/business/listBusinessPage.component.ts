import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { Compania } from '../../_models/modules/compania';
import { User } from '@app/_models';
import { Router } from '@angular/router';
import { httpAccessAdminPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

@Component({templateUrl: 'HTML_ListBusinessPage.html',
            styleUrls: ['../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss'] 
})
export class ListBusinessComponent extends OnSeguridad implements OnInit {
    
    userObservable : User;
    businessObservable : Compania;

    public URLAdministratorPage : string;
    public urlPageAddEditBusiness : string;
    public urlPageListBusinessModules : string;
    public urlPageListBusinessPlanes : string;

    public listBusiness: Compania[];

    constructor(private accountService: AccountService, 
                private router: Router,
                private alertService: AlertService,
                private translate: TranslateMessagesService) {

        super(alertService, accountService, router, translate);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
        if (!super.userAuthenticateAdmin()) { this.accountService.logout(); return; }
        // ***************************************************************

        this.URLAdministratorPage = httpAccessAdminPage.urlPageAdministrator;
        this.urlPageAddEditBusiness = httpAccessAdminPage.urlPageAddEditBusiness;
        this.urlPageListBusinessModules = httpAccessAdminPage.urlPageListBusinessModule;
        this.urlPageListBusinessPlanes = httpAccessAdminPage.urlPageListPlan;
        
        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;

        this.listBusiness = null;
    }

    public redirectAdminUsersPage() : void { this.router.navigate([this.URLAdministratorPage]); }

    ngOnInit() {
        
        this.accountService.getAllBusiness()
            .pipe(first())
            .subscribe(response => {
                this.listBusiness = response;
                this.accountService.suscribeListBusiness(this.listBusiness);
                this.accountService.loadListBusiness(this.listBusiness);
            });
    }
}
