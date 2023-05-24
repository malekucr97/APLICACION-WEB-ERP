import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User, Module } from '@app/_models';
import { Compania } from '../../_models/modules/compania';
import { amdinBusiness, httpAccessAdminPage, httpLandingIndexPage } from '@environments/environment-access-admin';

@Component({    templateUrl: 'HTML_ListModulePage.html',
                styleUrls: ['../../../assets/scss/app.scss'] 
})
export class ListModuleComponent implements OnInit {
    
    userObservable: User;
    businessObservable: Compania;

    listModules : Module[] = [];
    listModulesSystem : Module[] = [];

    private Home    : string = httpLandingIndexPage.homeHTTP;

    public URLIndexAdminPage: string = httpAccessAdminPage.urlPageAdministrator;

    constructor(private accountService: AccountService,
                private alertService: AlertService,
                private router: Router) { 
            
            this.userObservable     = this.accountService.userValue;
            this.businessObservable = this.accountService.businessValue;
    }

    ngOnInit() {

        if (!this.businessObservable) { this.router.navigate([this.Home]); return; }

        this.accountService.getModulesSystem()
            .pipe(first())
            .subscribe(response => { this.listModulesSystem = response; });
                    
        this.accountService.getModulesBusiness(this.businessObservable.id)
            .pipe(first())
            .subscribe(response => { this.listModules = response; });
    }

    activate(identificadorModulo: string) {

        this.alertService.clear();

        let moduleList = this.listModulesSystem.find(x => x.identificador === identificadorModulo);
        
        this.accountService.activateModule(moduleList.id, this.businessObservable.id)
            .pipe(first())
            .subscribe( responseActivate => {

                if ( responseActivate.exito ) {

                    this.alertService.success(responseActivate.responseMesagge);
                    
                    moduleList.estado = 'Activo';
                    this.listModules.splice(this.listModules.findIndex( m => m.identificador == identificadorModulo ), 1);
                    this.listModules.push(moduleList);

                } else { 
                    this.alertService.error(responseActivate.responseMesagge);
                }
            },
            (error) => {
                let message : string = 'Problemas al activar el estado del módulo seleccionado.' + error;
                this.alertService.error(message);
            });
    }

    inActivate(identificadorModulo: string) {

        this.alertService.clear();

        let moduleList = this.listModules.find(x => x.identificador === identificadorModulo);
        
        this.accountService.inActivateModule(moduleList.id)
            .pipe(first())
            .subscribe( responseInActivate => {

                if ( responseInActivate.exito ) {

                    this.alertService.success(responseInActivate.responseMesagge);

                    moduleList.estado = 'Inactivo';
                    this.listModules.splice(this.listModules.findIndex( m => m.id == moduleList.id ), 1);
                    this.listModules.push(moduleList);

                } else { 
                    this.alertService.error(responseInActivate.responseMesagge); 
                }
            },
            (error) => {
                let message : string = 'Problemas al inactivar el estado del módulo seleccionado.' + error;
                this.alertService.error(message);
            });
    }
  
}
