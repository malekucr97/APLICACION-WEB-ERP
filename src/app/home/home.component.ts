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

    conexion:boolean;
    message:string;

    constructor(private accountService: AccountService,
                private router: Router) {
        this.userObservable = this.accountService.userValue;
    }

    ngOnInit() {

        this.conexion = false;
        this.message = 'Esperando respuesta del servidor';

        // si es administrador lista todas las compañías del sistema
        if (this.userObservable.esAdmin) {

            this.accountService.getAllBusiness()
            .pipe(first())
            .subscribe(listComaniesResponse => {

                this.conexion = true;
                this.message = 'Seleccione la Compañía para ingresar';
                
                if (listComaniesResponse) {
                    this.listBusiness = listComaniesResponse;
                }
            });

        // si no es administrador lista las compañías activas con acceso del usuario 
        } else {
            this.accountService.getBusinessActiveUser(this.userObservable.identificacion)
            .pipe(first())
            .subscribe(lstBusinessResponse => {

                this.conexion = true;
                this.message = 'Seleccione la Compañía para ingresar';

                if (lstBusinessResponse) {
                    this.listBusiness = lstBusinessResponse;
                }
            });
        }
    }

    selectBusiness(business: Compania) {

        this.userObservable.empresa = business.id;
        this.accountService.updateLocalUser(this.userObservable);

        this.accountService.loadBusinessAsObservable(business);

        // http index.html
        this.router.navigate([httpAccessPage.urlContentIndex]);
    }
}
