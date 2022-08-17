import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User, Module } from '@app/_models';
import { Compania } from '../../_models/modules/compania';
import { httpLandingIndexPage } from '@environments/environment-access-admin';

@Component({ templateUrl: 'HTML_ListModulePage.html' })
export class ListModuleComponent implements OnInit {
    
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

    listBusinessSubject : Compania[];

    constructor(private accountService: AccountService,
                private alertService: AlertService,
                private router: Router) { 
            
            this.userObservable = this.accountService.userValue;
            this.businessObservable = this.accountService.businessValue;
            this.listBusinessSubject = this.accountService.businessListValue;
        }

    ngOnInit() {

        this.alertService.clear();

        if (!this.userObservable.esAdmin) {
            this.router.navigate([this.Index]);
            return;
        }
        if (!this.businessObservable) {
            this.router.navigate([this.Home]);
            return;
        }
        this.accountService.getModulesSystem()
        .pipe(first())
        .subscribe(responseModulesActive => { 
            this.listModulesSystem = responseModulesActive;
        });
    }

    activateModuleSystem(idModule: number) {

        this.alertService.clear();
        this.isActivating = true;

        let moduleList = this.listModulesBusiness.find(x => x.id === idModule);
        
        this.accountService.activateModule(idModule, this.business.id)
            .pipe(first())
            .subscribe( responseActivate => {

                if ( responseActivate.exito ) {

                    this.alertService.success(responseActivate.responseMesagge);
                    
                    moduleList.estado = 'Activo';
                    this.listModulesBusiness.splice(this.listModulesBusiness.findIndex( m => m.id == moduleList.id ), 1);
                    this.listModulesBusiness.push(moduleList);

                } else { 
                    this.alertService.error(responseActivate.responseMesagge);
                }
                this.isActivating = false;
            },
            (error) => {
                this.isActivating = false;
                let message : string = 'Problemas al activar el estado del módulo seleccionado.' + error;
                this.alertService.error(message);
            });
    }

    inActivateModuleSystem(idModule: number) {

        this.alertService.clear();
        this.isInActivating = true;

        let moduleList = this.listModulesBusiness.find(x => x.id === idModule);
        
        this.accountService.inActivateModule(idModule, this.business.id)
            .pipe(first())
            .subscribe( responseInActivate => {

                if ( responseInActivate.exito ) {

                    this.alertService.success(responseInActivate.responseMesagge);

                    moduleList.estado = 'Inactivo';
                    this.listModulesBusiness.splice(this.listModulesBusiness.findIndex( m => m.id == moduleList.id ), 1);
                    this.listModulesBusiness.push(moduleList);

                } else { 
                    this.alertService.error(responseInActivate.responseMesagge); 
                }
                this.isInActivating = false;
            },
            (error) => {
                this.isInActivating = false;
                let message : string = 'Problemas al inactivar el estado del módulo seleccionado.' + error;
                this.alertService.error(message);
            });
    }
  
}
