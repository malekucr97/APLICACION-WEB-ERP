import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Role, User } from '@app/_models';
import { Compania } from '../_models/modules/compania';
import { AccountService } from '@app/_services';
import { httpAccessAdminPage, httpLandingIndexPage } from '@environments/environment';

@Component({
    templateUrl: 'HTML_HomePage.html',
    styleUrls: ['../../assets/scss/app.scss']
})
export class HomeComponent implements OnInit {

    userObservable: User;
    listBusiness: Compania[] = [];
    roleUser: Role;

    conexion : boolean = false;
    message  : string = 'Esperando respuesta del servidor';

    _httpLoginPage : string = httpAccessAdminPage.URLLoginPage;

    _httpNoBusinessUserPage : string = httpLandingIndexPage.indexHTTPNoBussinesUser;

    constructor(private accountService: AccountService,
                private router: Router) {

        this.userObservable = this.accountService.userValue;

        // **************************************************************************
        // VALIDA ACCESO PANTALLA LOGIN
        if (this.userObservable.codeNoLogin !== '202') this.accountService.logout();
        // **************************************************************************
    }

    ngOnInit() {

        this.conexion   = true;
        this.message    = 'Seleccione la Compañía';
        
        if (this.userObservable.esAdmin) {

            this.accountService.getAllBusiness()
                .pipe(first())
                .subscribe(listBusinessResponse => {
                    
                    if (listBusinessResponse && listBusinessResponse.length > 0) {
                        this.listBusiness = listBusinessResponse;

                        if (this.listBusiness.length === 1) this.selectBusiness(this.listBusiness[0]);

                    } else {
                        this.userObservable.codeNoLogin = '404';
                        this.accountService.loadUserAsObservable(this.userObservable);
                        this.router.navigate([this._httpNoBusinessUserPage]);
                    }
                });

        } else if (!this.userObservable.esAdmin) {

            this.accountService.getBusinessActiveUser(this.userObservable.id)
                .pipe(first())
                .subscribe(listBusinessResponse => {

                    if (listBusinessResponse && listBusinessResponse.length > 0) {
                        this.listBusiness = listBusinessResponse;

                        if (this.listBusiness.length === 1) this.selectBusiness(this.listBusiness[0]);

                    } else {
                        this.userObservable.codeNoLogin = '404';
                        this.accountService.loadUserAsObservable(this.userObservable);
                        this.router.navigate([this._httpNoBusinessUserPage]); 
                    }
                });
        }
    }

    selectBusiness(business: Compania) {

        this.userObservable.empresa = business.id;
        this.accountService.loadUserAsObservable(this.userObservable);

        this.accountService.loadBusinessAsObservable(business);

        // *************************************
        // redirect http index module .html
        this.router.navigate([httpLandingIndexPage.indexHTTP]);
        // *************************************
    }

    logout() { this.accountService.logout(); }
}