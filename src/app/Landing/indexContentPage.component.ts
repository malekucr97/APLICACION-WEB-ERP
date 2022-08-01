import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AccountService, GeneralesService } from '@app/_services';
import { User, Module, ModulesProperties } from '@app/_models';
import { localVariables, ModulesSistem } from '@environments/environment';
import { amdinBusiness } from '@environments/environment-access-admin';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '@app/_models/modules/compania';

@Component({
    templateUrl: 'IndexContentPage.html',
    styleUrls: ['../../assets/scss/landing/app.scss']
})
export class IndexContentPageComponent implements OnInit {

    constructor(private accountService: AccountService,
                private generalesService: GeneralesService,
                private router: Router) {

        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;
    }

    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    userObservable: User;
    businessObservable: Compania;

    compania: Compania;

    propertiesMod: ModulesProperties;

    public listActModules: Module[] = [];
    public listModulesInfo: ModulesProperties[] = [];

    ngOnInit() {

        // lista los módulos activos de cada empresa
        if (this.userObservable.esAdmin ||
            this.userObservable.idRol   === amdinBusiness.adminSociedad) {

            this.accountService.getModulesActiveBusiness(this.businessObservable.id)
            .pipe(first())
            .subscribe(responseList => {

                if (responseList) {

                    this.listActModules = responseList;

                    this.listActModules.forEach(mod => {

                        this.propertiesMod = new ModulesProperties();

                        this.propertiesMod.id = mod.identificador;
                        this.propertiesMod.nombre = mod.nombre;
                        this.propertiesMod.pathIco =  localVariables.dir_img_modules + mod.identificador + '.png';
                        this.propertiesMod.descripcion =  mod.descripcion;

                        this.listModulesInfo.push(this.propertiesMod);
                    });
                }
            });
        // lista los módulos de un usuario
        } else {

            this.accountService.getModulesActiveUser(this.businessObservable.id, this.userObservable.idRol)
            .pipe(first())
            .subscribe(responseList => {

                if (responseList){

                    this.listActModules = responseList;

                    this.listActModules.forEach(mod => {

                        this.propertiesMod = new ModulesProperties();

                        this.propertiesMod.id = mod.identificador;
                        this.propertiesMod.nombre = mod.nombre;
                        this.propertiesMod.pathIco =  localVariables.dir_img_modules + mod.identificador + '.png';
                        this.propertiesMod.descripcion =  mod.descripcion;

                        this.listModulesInfo.push(this.propertiesMod);
                    });
                }
            });
        }
    }

    asignarRedireccionamientoHttp(propertiesMod: ModulesProperties, modIdentificador: string){

        switch (modIdentificador) {

            // GeneralesURL: '/_GeneralesModule/Index.html',
            case ModulesSistem.Generales: propertiesMod.urlRedirect = ModulesSistem.GeneralesURL; break;

            case ModulesSistem.ActivosFijos: propertiesMod.urlRedirect = ModulesSistem.ActivosFijosURL; break;
            case ModulesSistem.Bancos: propertiesMod.urlRedirect = ModulesSistem.BancosURL; break;
            case ModulesSistem.Contabilidad: propertiesMod.urlRedirect = ModulesSistem.ContabilidadURL; break;
            case ModulesSistem.CuentasCobrar: propertiesMod.urlRedirect = ModulesSistem.CuentasCobrarURL; break;
            case ModulesSistem.CuentasPagar: propertiesMod.urlRedirect = ModulesSistem.CuentasPagarURL; break;
            case ModulesSistem.Facturacion: propertiesMod.urlRedirect = ModulesSistem.FacturacionURL; break;
            case ModulesSistem.Inventario: propertiesMod.urlRedirect = ModulesSistem.InventarioURL; break;
            case ModulesSistem.Cumplimiento: propertiesMod.urlRedirect = ModulesSistem.CumplimientoURL; break;

            default: propertiesMod.urlRedirect = '/';
        }
        return propertiesMod;
    }

    selectModule(pmodule: ModulesProperties) {

        this.accountService.getModulesIdIdBusiness(pmodule.id, this.businessObservable.id)
            .pipe(first())
            .subscribe(responseModule => {
                pmodule = this.asignarRedireccionamientoHttp(pmodule, responseModule.identificador);

                responseModule.pathIco = pmodule.pathIco;
                this.accountService.loadModuleAsObservable(responseModule);

                this.router.navigate([pmodule.urlRedirect]);
            });
    }

    logout() { this.accountService.logout(); }
}
