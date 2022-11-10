import { Component, OnInit } from '@angular/core';
import { User, Module } from '@app/_models';
import { AccountService } from '@app/_services';
import { ActivatedRoute } from '@angular/router';
import { Compania } from '../../_models/modules/compania';
import { ScreenAccessUser } from '@app/_models/admin/screenAccessUser';

@Component({
    templateUrl: 'index.html',
    styleUrls: ['../../../assets/scss/inventario/app.scss'],
})
export class IndexMacredComponent implements OnInit {
    pPathIcoModule: string;

    userObservable: User;
    moduleObservable: Module;
    businessObservable: Compania;

    pnombremodulo: string;

    public adminSistema: boolean;
    public adminEmpresa: boolean;

    listAccessUser: ScreenAccessUser[] = [];

    constructor(private accountService: AccountService, private route: ActivatedRoute) 
    {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.businessObservable = this.accountService.businessValue;
    }

    ngOnInit() {
    }

    logout() { this.accountService.logout(); }
}
