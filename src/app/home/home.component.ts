import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '@app/_models';
import { Compania } from '../_models/modules/compania';
import { AccountService } from '@app/_services';
import { administrator, AuthStatesApp, httpLandingIndexPage } from '@environments/environment-access-admin';

@Component({
    templateUrl: 'HTML_HomePage.html'
})
export class HomeComponent implements OnInit {

    userObservable: User;
    listBusiness: Compania[] = [];

    conexion:boolean;
    message:string;

    constructor(private accountService: AccountService,
                private router: Router) {
        this.userObservable = this.accountService.userValue;
    }

    ngOnInit() {

        this.conexion = false;
        this.message = 'Esperando respuesta del servidor';

        if (AuthStatesApp.inactive === this.userObservable.estado) {
            this.router.navigate([httpLandingIndexPage.indexHTTPInactiveUser]);
            return;
        }
        if (AuthStatesApp.pending === this.userObservable.estado) {
            this.router.navigate([httpLandingIndexPage.indexHTTPPendingUser]);
            return;
        }
        if (!this.userObservable.idRol) { 
            this.router.navigate( [httpLandingIndexPage.indexHTTPNotRolUser] );
            return; 
        }

        this.userObservable.esAdmin = false;
        this.accountService.getRoleById(this.userObservable.idRol)
        .pipe(first())
        .subscribe( responseObjectRol => {

            if (responseObjectRol.estado === AuthStatesApp.inactive) {
                this.router.navigate([httpLandingIndexPage.indexHTTPInactiveRolUser]);
                return;
            }

            this.conexion = true;
            this.message = 'Seleccione la Compañía para ingresar';

            // si el usuario que inicia sesión es administrador
            if (administrator.id === responseObjectRol.id) {
                    
                this.userObservable.esAdmin = true;
                this.accountService.updateLocalUser(this.userObservable);

                this.accountService.getAllBusiness()
                .pipe(first())
                .subscribe(listComaniesResponse => {
                    
                    if (listComaniesResponse) {
                        this.listBusiness = listComaniesResponse;
                    }
                });
            } else {
                this.accountService.getBusinessActiveUser(this.userObservable.identificacion)
                .pipe(first())
                .subscribe(lstBusinessResponse => {
    
                    if (lstBusinessResponse) {
                        this.listBusiness = lstBusinessResponse;
                    }
                });
            }
        });
    }

    selectBusiness(business: Compania) {

        this.userObservable.empresa = business.id;
        this.accountService.updateLocalUser(this.userObservable);

        this.accountService.loadBusinessAsObservable(business);

        // http index.html
        this.router.navigate([httpLandingIndexPage.indexHTTP]);
    }
}
