import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User } from '@app/_models';

import { amdinBusiness } from '@environments/environment';

@Component({ templateUrl: 'HTML_AdminRolePage.html' })
export class AdminRoleComponent implements OnInit {
    users = null;
    user: User;

    roles = null;

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

        if(this.user.esAdmin || this.user.idRol === amdinBusiness.adminSociedad){
        
            this.adminBusiness = true;

            this.accountService.getRolesBusiness(this.user.empresa)
                .pipe(first())
                .subscribe(roles =>
                    this.roles = roles
                );
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
}