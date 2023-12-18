import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { Compania } from '../../_models/modules/compania';
import { User } from '@app/_models';
import { Router } from '@angular/router';
import { httpAccessAdminPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';

@Component({templateUrl: 'HTML_ListBusinessPage.html',
            styleUrls: ['../../../assets/scss/app.scss'] 
})
export class ListBusinessComponent extends OnSeguridad implements OnInit {
    
    userObservable      : User;
    businessObservable  : Compania;

    public URLAdministratorPage         : string = httpAccessAdminPage.urlPageAdministrator;
    public urlPageAddEditBusiness       : string = httpAccessAdminPage.urlPageAddEditBusiness;
    public urlPageListBusinessModules   : string = httpAccessAdminPage.urlPageListBusinessModule;

    listBusiness: Compania[] = [];

    // public IdUserSessionRequest : string ;
    // public UserSessionRequest : string ;
    // public BusinessSessionRequest : string ;
    // public ModuleSessionRequest : string ;

    constructor(private accountService: AccountService, 
                private router: Router,
                private alertService: AlertService) {

        super(alertService, accountService, router);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
        if (!super.userAuthenticateAdmin()) { this.accountService.logout(); return; }
        // ***************************************************************
        
        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;

        // this.inicializaHeaders();
    }

    // inicializaHeaders() : void {
    //     this.IdUserSessionRequest = this.userObservable ? this.userObservable.id.toString() : 'noIdUserValue';
    //     this.UserSessionRequest = this.userObservable ? this.userObservable.nombreCompleto.toString() : 'noUserNameValue';
    //     this.BusinessSessionRequest = this.businessObservable ? this.businessObservable.id.toString() : 'noBusinessValue';
    //     this.ModuleSessionRequest = 'admin';

    //     // this.IdUserSessionRequest = this.userObservable.id.toString();
    //     // this.UserSessionRequest = this.userObservable.nombreCompleto.toString();
    //     // this.BusinessSessionRequest = this.businessObservable.id.toString();
    //     // this.ModuleSessionRequest = 'admin';
    // }

    ngOnInit() {

        this.accountService.getAllBusiness( this._HIdUserSessionRequest,
                                            // this.UserSessionRequest,
                                            this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe(response => {
                if (response && response.length > 0) {
                    this.listBusiness = response;
                    this.accountService.suscribeListBusiness(this.listBusiness);
                }
            });
    }
}
