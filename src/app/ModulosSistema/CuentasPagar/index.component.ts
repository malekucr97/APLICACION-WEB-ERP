import { Component, OnInit } from '@angular/core';
import { User, Module } from '@app/_models';
import { AccountService } from '@app/_services';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'index.html',
    styleUrls: ['../../../assets/scss/cuentaspagar/app.scss'],
})
export class IndexCuentasPagarComponent implements OnInit {
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

    ngOnInit() { }

    logout() { this.accountService.logout(); }
}
