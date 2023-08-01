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

    // _httpInactiveUserPage   : string = httpLandingIndexPage.indexHTTPInactiveUser;
    // _httpPendingUserPage    : string = httpLandingIndexPage.indexHTTPPendingUser;
    // _httpNotRoleUserPage    : string = httpLandingIndexPage.indexHTTPNotRolUser;

    // _httpInactiveRolePage   : string = httpLandingIndexPage.indexHTTPInactiveRolUser;

    _httpLoginPage   : string = httpAccessAdminPage.URLLoginPage;

    _httpNoBusinessUserPage   : string = httpLandingIndexPage.urlPageNotBusiness;

    constructor(private accountService: AccountService,
                private router: Router) {

        this.userObservable = this.accountService.userValue;

        // if (this.userObservable.codeNoLogin === '404') {
        //     this.router.navigate([this._httpLoginPage]);
        //     return;
        // }

        // if (AuthStatesApp.inactive === this.userObservable.estado) { this.router.navigate([this._httpInactiveUserPage]); return; }
        // if (AuthStatesApp.pending === this.userObservable.estado) { this.router.navigate([this._httpPendingUserPage]); return; }
        // if (!this.userObservable.idRol) { this.router.navigate( [this._httpNotRoleUserPage] ); return; }

        // this.userObservable.esAdmin = false;
    }

    ngOnInit() {

        if (this.userObservable.codeNoLogin === '202') {

            this.conexion   = true;
            this.message    = 'Seleccione la Compañía';

            if (this.userObservable.esAdmin) {

                this.accountService.getAllBusiness()
                    .pipe(first())
                    .subscribe(listComaniesResponse => {

                        if (listComaniesResponse && listComaniesResponse.length > 0) {
                            this.listBusiness = listComaniesResponse;

                        } else { this.router.navigate([this._httpNoBusinessUserPage]); }
                    });

            } else if (!this.userObservable.esAdmin) {

                this.accountService.getBusinessActiveUser(this.userObservable.id)
                    .pipe(first())
                    .subscribe(lstBusinessResponse => {

                        if (lstBusinessResponse && lstBusinessResponse.length > 0) {
                            this.listBusiness = lstBusinessResponse;

                        } else { this.router.navigate([this._httpNoBusinessUserPage]); }
                    });
            }
        }
        else { this.accountService.logout(); }




        // this.accountService.getRoleById(this.userObservable.idRol)
        //     .pipe(first())
        //     .subscribe( responseObjectRol => {

        //         if (responseObjectRol.estado === AuthStatesApp.inactive) { this.router.navigate([this._httpInactiveRolePage]); return; }

        //         this.conexion   = true;
        //         this.message    = 'Seleccione la Compañía';

        //         this.roleUser = responseObjectRol;

        //         // valida adminboss
        //         if (administrator.identification === this.roleUser.id) {

        //             this.userObservable.esAdmin = true;
        //             this.accountService.loadUserAsObservable(this.userObservable);

        //             this.accountService.getAllBusiness()
        //             .pipe(first())
        //             .subscribe(listComaniesResponse => {

        //                 if (listComaniesResponse && listComaniesResponse.length > 0) {
        //                     this.listBusiness = listComaniesResponse;
        //                 } else {
        //                     this.router.navigate([httpLandingIndexPage.urlPageNotBusiness]);
        //                     return;
        //                 }
        //             });

        //         } else {

        //             this.userObservable.esAdmin = false;

        //             this.accountService.getBusinessActiveUser(this.userObservable.id)
        //             .pipe(first())
        //             .subscribe(lstBusinessResponse => {

        //                 if (lstBusinessResponse) {
        //                     this.listBusiness = lstBusinessResponse;
        //                 } else {
        //                     this.router.navigate([httpLandingIndexPage.urlPageNotBusiness]);
        //                     return;
        //                 }
        //             });
        //         }
        //     });
    }

    selectBusiness(business: Compania) {

        this.userObservable.empresa = business.id;
        this.accountService.loadUserAsObservable(this.userObservable);

        this.accountService.loadBusinessAsObservable(business);

        // http index.html
        this.router.navigate([httpLandingIndexPage.indexHTTP]);
    }

    logout() { this.accountService.logout(); }
}
