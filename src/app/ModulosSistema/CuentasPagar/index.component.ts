import { Component, OnInit } from '@angular/core';
import { User, Module } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';

@Component({templateUrl: 'index.html',
            styleUrls: ['../../../assets/scss/app.scss', '../../../assets/scss/cuentaspagar/app.scss'],
})
export class IndexCuentasPagarComponent extends OnSeguridad implements OnInit {
    pPathIcoModule: string;

    userObservable: User;
    moduleObservable: Module;

    pnombremodulo: string;

    public adminSistema: boolean;
    public adminEmpresa: boolean;

    constructor(private alertService: AlertService,
                private accountService: AccountService, 
                private route: ActivatedRoute,
                private router: Router) {

        super(alertService, accountService, router);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN INDEX COMPONENT
        if (!super.userAuthenticateIndexComponent()) { this.accountService.logout(); return; }
        // ***************************************************************

        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
    }

    ngOnInit() { }

    logout() { this.accountService.logout(); }
}
