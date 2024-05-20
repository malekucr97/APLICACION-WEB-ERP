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
            styleUrls: ['../../../assets/scss/app.scss'] 
})
export class ListBusinessComponent extends OnSeguridad implements OnInit {
    
    userObservable      : User;
    businessObservable  : Compania;

    public URLAdministratorPage         : string = httpAccessAdminPage.urlPageAdministrator;
    public urlPageAddEditBusiness       : string = httpAccessAdminPage.urlPageAddEditBusiness;
    public urlPageListBusinessModules   : string = httpAccessAdminPage.urlPageListBusinessModule;
    public urlPageListBusinessPlanes   : string = httpAccessAdminPage.urlPageListPlan;

    listBusiness: Compania[] = [];

    constructor(private accountService: AccountService, 
                private router: Router,
                private alertService: AlertService,
                private translate: TranslateMessagesService) {

        super(alertService, accountService, router, translate);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
        if (!super.userAuthenticateAdmin()) { this.accountService.logout(); return; }
        // ***************************************************************
        
        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;
    }

    ngOnInit() {

        this.accountService.getAllBusiness( this._HIdUserSessionRequest, this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0) {
                    this.listBusiness = response;
                    this.accountService.suscribeListBusiness(this.listBusiness);
                }
            });
    }
}
