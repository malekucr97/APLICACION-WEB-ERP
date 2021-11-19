import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { User, Module, Business, ModulesProperties } from '../_models';
import { amdinBusiness, localVariables, httpAccessPage } from '@environments/environment';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    templateUrl: 'HTML_BusinessPage.html',
    styleUrls: ['../../assets/scss/landing/app.scss']
})
export class BusinessPageComponent implements OnInit {

    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    userObservable: User;
    businessObservable: Business;

    propertiesMod: ModulesProperties;

    public listActModules: Module[] = [];
    public listModulesInfo: ModulesProperties[] = [];

    constructor(private accountService: AccountService,
                private router: Router) {

        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;
    }

    ngOnInit() {

        // lista los módulos activos de cada empresa
        if (this.userObservable.esAdmin || this.userObservable.idRol === amdinBusiness.adminSociedad) {

            this.accountService.getModulesActiveBusiness(this.businessObservable.id)
            .pipe(first())
            .subscribe(responseList => {

                if (responseList) {

                    this.listActModules = responseList;

                    this.listActModules.forEach(mod => {

                        this.propertiesMod = new ModulesProperties();

                        this.propertiesMod.id = mod.identificador;
                        this.propertiesMod.nombre = mod.nombre;
                        this.propertiesMod.path =  localVariables.dir_img_modules + mod.identificador + '.png';
                        this.propertiesMod.descripcion =  mod.descripcion;

                        this.listModulesInfo.push(this.propertiesMod);
                    });
                }
            });
        // lista los módulos de un usuario
        } else {

            this.accountService.getModulesActiveUser(this.userObservable.empresa, this.userObservable.idRol)
            .pipe(first())
            .subscribe(responseList => {

                if (responseList){

                    this.listActModules = responseList;

                    this.listActModules.forEach(mod => {

                        this.propertiesMod = new ModulesProperties();

                        this.propertiesMod.id = mod.identificador;
                        this.propertiesMod.nombre = mod.nombre;
                        this.propertiesMod.path =  localVariables.dir_img_modules + mod.identificador + '.png';
                        this.propertiesMod.descripcion =  mod.descripcion;

                        this.listModulesInfo.push(this.propertiesMod);
                    });
                }
            });
        }
    }

    selectedModule(module: ModulesProperties) {

        this.accountService.getModulesIdIdBusiness(module.id, this.businessObservable.id)
            .pipe(first())
            .subscribe(responseModule => {

                responseModule.pathIco = module.path;

                this.accountService.loadModuleAsObservable(responseModule);
                this.router.navigate([httpAccessPage.urlIndexGenerales]);
            });
    }

    logout() { this.accountService.logout(); }
}
