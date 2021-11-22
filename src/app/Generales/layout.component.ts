import { Component, ViewChild } from '@angular/core';
import { AccountService } from '@app/_services';

import { MatSidenav } from '@angular/material/sidenav';

import { Module } from '@app/_models';

@Component({
    templateUrl: 'layout.component.html',
    styleUrls: ['../../assets/scss/menus.scss'],
})
export class LayoutGeneralesComponent {
    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    moduleObservable: Module;

    menuArray = [
        { menuLink: '/',        menuIcon: 'home',    menuName: 'submenu 1'},
        { menuLink: '/profile', menuIcon: 'person',  menuName: 'submenu 2'},
        { menuLink: '/android', menuIcon: 'android', menuName: 'submenu 3'}
    ];

    constructor(private accountService: AccountService) {
        this.moduleObservable = this.accountService.moduleValue;
    }

    logout() { this.accountService.logout(); }
}
