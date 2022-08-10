import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Module } from '@app/_models';
import { Compania } from '@app/_models/modules/compania';
import { AccountService } from '@app/_services';

@Component({
    templateUrl: 'index.html',
    styleUrls: ['../../../assets/scss/generales/app.scss'],
})
export class IndexGeneralesComponent implements OnInit {
    pPathIcoModule: string;

    userObservable: User;
    moduleObservable: Module;
    businessObservable: Compania;
    
    pnombremodulo: string;

    public adminSistema: boolean;
    public adminEmpresa: boolean;

    constructor(private accountService: AccountService) {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.businessObservable = this.accountService.businessValue;
    }

    ngOnInit() { }

    logout() { this.accountService.logout(); }
}
