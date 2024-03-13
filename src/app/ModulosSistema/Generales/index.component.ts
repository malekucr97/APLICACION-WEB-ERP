import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { User, Module } from '@app/_models';
import { Compania } from '@app/_models/modules/compania';
import { AccountService, AlertService } from '@app/_services';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

@Component({templateUrl: 'index.html',
            styleUrls: ['../../../assets/scss/app.scss', '../../../assets/scss/generales/app.scss'],
})
export class IndexGeneralesComponent extends OnSeguridad implements OnInit {
    pPathIcoModule: string;

    userObservable: User;
    moduleObservable: Module;
    businessObservable: Compania;
    
    pnombremodulo: string;

    public adminSistema: boolean;
    public adminEmpresa: boolean;

    constructor(private alertService: AlertService,
                private accountService: AccountService,
                private router: Router,
                private translate: TranslateMessagesService) {  
                    
        super(alertService, accountService, router, translate);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN INDEX COMPONENT
        if (!super.userAuthenticateIndexComponent()) { this.accountService.logout(); return; }
        // ***************************************************************

        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.businessObservable = this.accountService.businessValue;
    }

    ngOnInit() { }

    logout() { this.accountService.logout(); }
}
