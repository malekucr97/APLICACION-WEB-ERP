import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User, Module } from '@app/_models';
import { Compania } from '../../_models/modules/compania';
import { httpAccessAdminPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

@Component({templateUrl: 'HTML_ListModuleBusinessPage.html',
            styleUrls: [    '../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss']
})
export class ListModuleBusinessComponent extends OnSeguridad implements OnInit {

    userObservable: User;
    businessObservable: Compania;

    business: Compania;

    listModulesBusiness: Module[] = [];
    listModulesSystem: Module[] = [];
    
    listBusiness: Compania[] = [];
    
    isActivating: boolean = false;
    isInActivating: boolean = false;
    
    adminBoss: boolean;
    adminBusiness: boolean;

    URLAddBusinessUsertPage: string;
    URLAddRoleUsertPage: string;
    idBusiness: string;

    seleccionEmpresa: boolean = false;

    public HTTPListBusinessPage : string = httpAccessAdminPage.urlPageListBusiness;

    listBusinessSubject : Compania[];

    public pbusinessId : number;

    constructor(private accountService: AccountService,
                private route: ActivatedRoute,
                private alertService: AlertService,
                private router: Router,
                private translate: TranslateMessagesService) {

        super(alertService, accountService, router, translate);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
        if (!super.userAuthenticateAdmin()          ||
            !this.route.snapshot.params.pidBusiness ||
            !this.accountService.businessListValue) { this.accountService.logout(); return; }
        // ***************************************************************

        this.userObservable         = this.accountService.userValue;
        this.businessObservable     = this.accountService.businessValue;
        this.listBusinessSubject    = this.accountService.businessListValue;

        this.pbusinessId = this.route.snapshot.params.pidBusiness;
    }

    ngOnInit() {

        this.business = new Compania;

        this.seleccionEmpresa = true;
        this.business = this.listBusinessSubject.find(x => x.id === +this.pbusinessId);

        this.accountService.getModulesSystem(this._HIdUserSessionRequest, this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe(listModulesSystemResponse => {

                this.listModulesSystem = listModulesSystemResponse;

                this.accountService.getModulesBusiness(this.business.id, this._HIdUserSessionRequest, this._HBusinessSessionRequest)
                    .pipe(first())
                    .subscribe(listModulesResponse => {

                        if (listModulesResponse && listModulesResponse.length > 0) {
                            
                            this.listModulesBusiness = listModulesResponse;

                            if (this.listModulesSystem.length !== this.listModulesBusiness.length) {
                                
                                this.listModulesBusiness.forEach((modBusiness) => {

                                    this.listModulesSystem.splice(this.listModulesSystem.findIndex( m => m.identificador == modBusiness.identificador ), 1);
                                });

                            } else { this.listModulesSystem = null; }
                            
                        } else { this.listModulesBusiness = null; }
                    },
                    (error) => { console.log(error); });
        });
    }

    assignModuleBusiness(identificadorModulo: string) : void {

        this.alertService.clear();

        let module : Module = this.listModulesSystem.find(x => x.identificador === identificadorModulo);

        this.accountService.assignModuleToBusiness(module.id, this.business.id, this._HIdUserSessionRequest, this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe( response => {

                if (response.exito) {

                    this.alertService.success(response.responseMesagge);

                    this.listModulesSystem.splice(this.listModulesSystem.findIndex( m => m.id == module.id ), 1);
                    
                    if (this.listModulesSystem.length == 0) this.listModulesSystem = null;

                    if (!this.listModulesBusiness) this.listModulesBusiness = [];

                    this.listModulesBusiness.push(module);

                } else { this.alertService.error(response.responseMesagge); }
            },
            error => { this.alertService.error(error); });
    }
    desAssignModuleBusiness(identificadorModulo: string) : void {

        this.alertService.clear();

        let module : Module = this.listModulesBusiness.find(x => x.identificador === identificadorModulo);

        this.accountService.desAssignModuleToBusiness(module.id, this.business.id, this._HIdUserSessionRequest, this._HBusinessSessionRequest)
            .pipe(first())
            .subscribe( response => {

                if (response.exito) {

                    this.alertService.success(response.responseMesagge);

                    this.listModulesBusiness.splice(this.listModulesBusiness.findIndex( m => m.identificador == identificadorModulo ), 1);
                    
                    if (!this.listModulesSystem) this.listModulesSystem = [];
                    
                    this.listModulesSystem.push(module);

                    if (this.listModulesBusiness.length==0) this.listModulesBusiness = null;
                    
                } else { this.alertService.warn(response.responseMesagge, { keepAfterRouteChange: true }); }
            },
            error => { this.alertService.error(error); });
    }
}
