import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User, Module } from '@app/_models';
import { Compania } from '../../_models/modules/compania';
import { httpAccessAdminPage, httpLandingIndexPage } from '@environments/environment-access-admin';

@Component({ templateUrl: 'HTML_ListModuleBusinessPage.html' })
export class ListModuleBusinessComponent implements OnInit {
    
    userObservable: User;
    businessObservable: Compania;

    business: Compania;

    listModulesBusiness: Module[] = [];
    listModulesSystem: Module[] = [];
    
    listBusiness: Compania[] = [];
    
    isActivating: boolean = false;
    isInActivating: boolean = false;
    isAssigning: boolean = false;
    isDesAssigning: boolean = false;
    

    adminBoss: boolean;
    adminBusiness: boolean;

    URLAddEditUsertPage: string;
    URLAddBusinessUsertPage: string;
    URLAddRoleUsertPage: string;
    idBusiness: string;

    seleccionEmpresa: boolean = false;

    private Home : string = httpLandingIndexPage.homeHTTP;
    private Index : string = httpLandingIndexPage.indexHTTP;

    public HTTPListBusinessPage : string = httpAccessAdminPage.urlPageListBusiness;

    listBusinessSubject : Compania[];

    constructor(private accountService: AccountService,
                private route: ActivatedRoute,
                private alertService: AlertService,
                private router: Router) { 
            
            this.userObservable         = this.accountService.userValue;
            this.businessObservable     = this.accountService.businessValue;
            this.listBusinessSubject    = this.accountService.businessListValue;
        }

    ngOnInit() {

        this.alertService.clear();

        // let pidBusiness = this.route.snapshot.params.pidBusiness;

        if (this.route.snapshot.params.pidBusiness) {
        // if (pidBusiness) {

            this.business = new Compania;

            let pidBusiness = this.route.snapshot.params.pidBusiness;

            if (!this.accountService.businessListValue) { this.router.navigate([this.HTTPListBusinessPage]);    return; }
            if (!this.userObservable.esAdmin) { this.router.navigate([this.Index]);                             return; }
            if (!this.businessObservable) { this.router.navigate([this.Home]);                                  return; }
    
            this.seleccionEmpresa = true;
            this.business = this.listBusinessSubject.find(x => x.id === +pidBusiness);
    
            this.accountService.getModulesSystem()
                .pipe(first())
                .subscribe(listModulesSystemResponse => {
    
                    this.listModulesSystem = listModulesSystemResponse;
    
                    this.accountService.getModulesBusiness(this.business.id)
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
                            // if (this.listModulesBusiness && this.listModulesBusiness.length > 0) {
                            //     if (this.listModulesSystem.length !== this.listModulesBusiness.length) {
                            //         this.listModulesBusiness.forEach((modBusiness) => {
                            //             this.listModulesSystem.splice(this.listModulesSystem.findIndex( m => m.identificador == modBusiness.identificador ), 1);
                            //         });
                            //     } else { this.listModulesSystem = null; }
                            // } else { this.listModulesBusiness = null; }
                        },
                        (error) => { console.log(error); });
                });
        }
    }

    assignModuleBusiness(identificadorModulo: string) : void {

        this.alertService.clear();
        this.isAssigning = true;

        let module : Module = this.listModulesSystem.find(x => x.identificador === identificadorModulo);

        this.accountService.assignModuleToBusiness(module.id, this.business.id)
            .pipe(first())
            .subscribe( response => {

                if (response.exito) {

                    this.alertService.success(response.responseMesagge);

                    this.listModulesSystem.splice(this.listModulesSystem.findIndex( m => m.id == module.id ), 1);
                    
                    if (this.listModulesSystem.length == 0) this.listModulesSystem = null;

                    if (!this.listModulesBusiness) this.listModulesBusiness = [];

                    this.listModulesBusiness.push(module);

                } else { this.alertService.error(response.responseMesagge); }

                this.isAssigning = false;
            },
            error => {
                this.isAssigning = false;
                this.alertService.error(error);
            });
    }
    desAssignModuleBusiness(identificadorModulo: string) : void {

        this.alertService.clear();
        this.isDesAssigning = true;

        let module : Module = this.listModulesBusiness.find(x => x.identificador === identificadorModulo);

        this.accountService.desAssignModuleToBusiness(module.id, this.business.id)
            .pipe(first())
            .subscribe( response => {

                if (response.exito) {

                    this.alertService.success(response.responseMesagge);

                    this.listModulesBusiness.splice(this.listModulesBusiness.findIndex( m => m.identificador == identificadorModulo ), 1);
                    
                    if (!this.listModulesSystem) this.listModulesSystem = [];
                    
                    this.listModulesSystem.push(module);

                    if (this.listModulesBusiness.length==0) this.listModulesBusiness = null;
                    
                } else { this.alertService.warn(response.responseMesagge, { keepAfterRouteChange: true }); }

                this.isDesAssigning = false;
            },
            error => {
                this.isDesAssigning = false;
                this.alertService.error(error);
            });
    }
}
