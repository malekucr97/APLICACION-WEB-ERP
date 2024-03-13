import { Component, OnInit } from '@angular/core';
import { User, Module } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

@Component({templateUrl: 'index.html',
            styleUrls: ['../../../assets/scss/app.scss' , '../../../assets/scss/activosfijos/app.scss'],
})
export class IndexActivosFijosComponent extends OnSeguridad implements OnInit {
    pPathIcoModule: string;

    userObservable: User;
    moduleObservable: Module;

    pnombremodulo: string;

    public adminSistema: boolean;
    public adminEmpresa: boolean;

    constructor(private alertService: AlertService,
                private accountService: AccountService, 
                private route: ActivatedRoute,
                private router: Router,
                private translate: TranslateMessagesService) {

        super(alertService, accountService, router, translate);

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
