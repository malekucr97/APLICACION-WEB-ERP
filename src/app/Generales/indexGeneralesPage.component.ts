import { Component, OnInit, ViewChild } from '@angular/core';

import { User } from '@app/_models';
import { Module } from '@app/_models';

import { AccountService } from '@app/_services';

import { MatSidenav } from '@angular/material/sidenav';

import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'HTML_IndexGeneralesPage.html',
    styleUrls: ['../../assets/scss/menus.scss']
})
export class IndexGeneralesComponent implements OnInit {
    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    menuArray = [
        { menuLink: '/',        menuIcon: 'home',    menuName: 'submenu 1'},
        { menuLink: '/profile', menuIcon: 'person',  menuName: 'submenu 2'},
        { menuLink: '/android', menuIcon: 'android', menuName: 'submenu 3'}
    ];

    pPathIcoModule: string;

    userObservable: User;
    moduleObservable: Module;

    pnombremodulo: string;

    public adminSistema: boolean;
    public adminEmpresa: boolean;

    constructor(private accountService: AccountService, private route: ActivatedRoute) {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
    }

    ngOnInit() {

        // this.pPathIcoModule = this.route.snapshot.params.icomodule;
    }

    logout() { this.accountService.logout(); }
}
