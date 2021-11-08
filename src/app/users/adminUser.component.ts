import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User } from '@app/_models';

import { amdinBusiness } from '@environments/environment';

@Component({ templateUrl: 'HTML_AdminUserPage.html' })
export class AdminUserComponent implements OnInit { 
    user: User;
    users = null;
    loading = false;

    idBusiness: string;

    public adminBoss: boolean;
    public adminBusiness: boolean;

    constructor(private accountService: AccountService,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService) {

            this.user = this.accountService.userValue;
        }

    ngOnInit() {
        this.alertService.clear();

        this.adminBoss = false;
        this.adminBusiness = false;

        if (this.user.esAdmin){

            this.adminBoss = true;

            this.accountService.getAllUsers()
            .pipe(first())
            .subscribe(users => this.users = users);

        }else if (this.user.idRol === amdinBusiness.adminSociedad){

            this.adminBusiness = true;

            this.accountService.getUsersBusiness(this.user.empresa)
            .pipe(first())
            .subscribe(users =>
                this.users = users
            );
        }else{
            this.alertService.error('Este usuario no tiene permisos para visualizar la información de los usuarios de la empresa.');
            this.loading = false;
        }
    }

    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.deleteUser(id)
            .pipe(first())
            .subscribe(() => {
                this.users = this.users.filter(x => x.id !== id);
            });
    }

    activateUser(id: string) {

        const user = this.users.find(x => x.id === id);
        user.isActivating = true;

        this.accountService.activateUser(user)
            .pipe(first())
            .subscribe(() => {
                this.users = this.users.filter(x => x.id !== id);
            });

        this.router.navigate(['admin']);
    }
}
