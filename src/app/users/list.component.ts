import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users = null;
    user = new User;

    idBusiness: string;

    public adminBoss: boolean;
    public adminBusiness: boolean;

    constructor(private accountService: AccountService,
                private route: ActivatedRoute,
                private router: Router,
                private alertService: AlertService) {}

    ngOnInit() {
        this.alertService.clear();

        this.adminBoss = false;
        this.adminBusiness = false;

        if(this.route.snapshot.params['idempresa']){

            this.adminBusiness = true;

            this.idBusiness = this.route.snapshot.params['idempresa'];

            this.accountService.getUsersBusiness(this.idBusiness)
            .pipe(first())
            .subscribe(users => this.users = users);

        }else{

            this.adminBoss = true;

            this.accountService.getAllUsers()
            .pipe(first())
            .subscribe(users => this.users = users);
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
