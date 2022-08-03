import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '@app/_models';
import { Compania } from '../_models/modules/compania';
import { AccountService } from '@app/_services';
import { httpAccessPage } from '@environments/environment';

@Component({
    templateUrl: 'HTML_HomePage.html'
})
export class HomeComponent implements OnInit {

    userObservable: User;
    listBusiness: Compania[] = [];

    constructor(private accountService: AccountService, 
                private router: Router) {
        this.userObservable = this.accountService.userValue;
    }

    ngOnInit() {

        // si es administrador lista todas las compañías del sistema
        if (this.userObservable.esAdmin) {
            this.accountService.getAllBusiness()
            .pipe(first())
            .subscribe(lstBusinessResponse => {
                this.listBusiness = lstBusinessResponse;
            });

        // si no es administrador lista las compañías activas con acceso del usuario 
        } else {
            this.accountService.getBusinessActiveUser(this.userObservable.identificacion)
            .pipe(first())
            .subscribe(lstBusinessResponse => {

                if (lstBusinessResponse) {
                    this.listBusiness = lstBusinessResponse;

                } else { this.router.navigate([httpAccessPage.urlPageNotBusiness]); }
            });
        }
    }

    selectBusiness(business: Compania) {

        this.userObservable.empresa = business.id;
        this.accountService.updateLocalUser(this.userObservable);

        this.accountService.loadBusinessAsObservable(business);
        this.router.navigate([httpAccessPage.urlContentIndex]);
    }
}
