import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

@Component({selector: 'app-index-macred',
            templateUrl: 'index.html',
            styleUrls: ['../../../assets/scss/app.scss'],
            standalone: false
})
export class IndexMacredComponent extends OnSeguridad implements OnInit {

    public nombremodulo: string;

    constructor(private alertService: AlertService,
                private accountService: AccountService,
                private route: ActivatedRoute,
                private router: Router,
                private translate: TranslateMessagesService)  {

        super(alertService, accountService, router, translate);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN INDEX COMPONENT
        if (!super.userAuthenticateIndexComponent()) this.accountService.logout();
        // ***************************************************************

        this.nombremodulo = this.accountService.moduleValue.nombre;
    }

    ngOnInit() { }

    logout() { this.accountService.logout(); }
}
