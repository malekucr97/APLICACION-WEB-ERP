import { Component, OnInit } from '@angular/core';
import { User, Module } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { Compania } from '../../_models/modules/compania';
import { ScreenAccessUser } from '@app/_models/admin/screenAccessUser';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';

@Component({templateUrl: 'index.html',
            styleUrls: ['../../../assets/scss/inventario/app.scss'],
})
export class IndexMacredComponent extends OnSeguridad implements OnInit {
    pPathIcoModule: string;

    userObservable: User;
    moduleObservable: Module;
    businessObservable: Compania;

    pnombremodulo: string;

    public adminSistema: boolean;
    public adminEmpresa: boolean;

    listAccessUser: ScreenAccessUser[] = [];

    constructor(private alertService: AlertService,
                private accountService: AccountService, 
                private route: ActivatedRoute,
                private router: Router)  {

        super(alertService, accountService, router);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN INDEX COMPONENT
        if (!super.userAuthenticateIndexComponent()) { this.accountService.logout(); return; }
        // ***************************************************************

        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.businessObservable = this.accountService.businessValue;
    }

    ngOnInit() {
    }

    logout() { this.accountService.logout(); }
}
