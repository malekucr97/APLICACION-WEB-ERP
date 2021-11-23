import { Component, ViewChild } from '@angular/core';
import { AccountService } from '@app/_services';

import { MatSidenav } from '@angular/material/sidenav';

import { Business, Module, User } from '@app/_models';

@Component({
    templateUrl: 'menu.html',
    styleUrls: ['../../assets/scss/menus.scss'],
})
export class MenuBancosComponent {
    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    userObservable: User;
    moduleObservable: Module;
    businessObservable: Business;

    menuArray = [
        { menuLink: '/',        menuIcon: 'home',    menuName: 'submenu 1'},
        { menuLink: '/',        menuIcon: 'home',    menuName: 'submenu 2'}
    ];

    constructor(private accountService: AccountService) {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.businessObservable = this.accountService.businessValue;
    }

    logout() { this.accountService.logout(); }
}
