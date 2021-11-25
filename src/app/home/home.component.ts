import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User, Business } from '@app/_models';
import { AccountService } from '@app/_services';

import { httpAccessPage, AuthApp } from '@environments/environment';

@Component({
    templateUrl: 'HTML_HomePage.html'
})
export class HomeComponent implements OnInit {

    user: User;
    businesss = Business;

    listBusiness: Business[] = [];

    constructor(private accountService: AccountService, private router: Router) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {

        if (this.user) {

            if (this.user.estado === AuthApp.inactive) { this.router.navigate([httpAccessPage.urlPageInactiveUser]); return; }
            if (this.user.estado === AuthApp.pending) { this.router.navigate([httpAccessPage.urlPagePending]); return; }
            if (!this.user.idRol) { this.router.navigate([httpAccessPage.urlPageNotRol]); return; }

            // consulta las empresas activas para el usuario que esté iniciando sesión
            if (this.user.esAdmin) {
                this.accountService.getAllBusiness()
                .pipe(first())
                .subscribe(lstBusinessResponse => {
                    this.listBusiness = lstBusinessResponse;
                });
            } else {
                this.accountService.getBusinessActiveUser(this.user.identificacion)
                .pipe(first())
                .subscribe(lstBusinessResponse => {

                    if (lstBusinessResponse) {
                        this.listBusiness = lstBusinessResponse;

                    } else { this.router.navigate([httpAccessPage.urlPageNotBusiness]); }
                });
            }
        }
    }

    selectBusiness(business: Business) {

        this.user.empresa = business.id;
        this.accountService.updateLocalUser(this.user);

        this.accountService.loadBusinessAsObservable(business);
        this.router.navigate([httpAccessPage.urlContentIndex]);
    }
}
