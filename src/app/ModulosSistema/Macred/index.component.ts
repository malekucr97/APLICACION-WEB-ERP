import { Component, OnInit } from '@angular/core';
import { User, Module } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { Compania } from '../../_models/modules/compania';
import { ScreenAccessUser } from '@app/_models/admin/screenAccessUser';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

@Component({templateUrl: 'index.html',
            styleUrls: ['../../../assets/scss/app.scss'],
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
                private router: Router,
                private translate: TranslateMessagesService)  {

        super(alertService, accountService, router, translate);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN INDEX COMPONENT
        if (!super.userAuthenticateIndexComponent()) { this.accountService.logout(); return; }
        // ***************************************************************

        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.businessObservable = this.accountService.businessValue;
    }

    ngOnInit() {

        console.log('entra');
    }

    logout() { this.accountService.logout(); }
}
