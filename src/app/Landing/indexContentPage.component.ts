import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { User, ModulesProperties } from '@app/_models';
import { localVariables, ModulesSystem } from '@environments/environment';
import { amdinBusiness } from '@environments/environment-access-admin';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '@app/_models/modules/compania';

@Component({
    templateUrl: 'IndexContentPage.html',
    styleUrls: ['../../assets/scss/landing/app.scss']
})
export class IndexContentPageComponent implements OnInit {

    constructor(private accountService: AccountService, private router: Router) {

        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;
    }
 
    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    userObservable: User;
    businessObservable: Compania;

    public ListModulesActive: ModulesProperties[] = [];

    ngOnInit() {

        // valida si el usuario que inició sesión es administrador
        if (this.userObservable.esAdmin || this.userObservable.idRol === amdinBusiness.adminSociedad) {

            // lista los módulos activos de una compañía
            this.accountService.getModulesActiveBusiness(this.businessObservable.id)
            .pipe(first())
            .subscribe(responseListModules => {

                if ( responseListModules ) {

                    responseListModules.forEach(module => {

                        let propertiesMod = new ModulesProperties();

                        propertiesMod.id = module.identificador;
                        propertiesMod.nombre = module.nombre;
                        propertiesMod.pathIco =  localVariables.dir_img_modules + module.identificador + '.png';
                        propertiesMod.descripcion =  module.descripcion;

                        this.ListModulesActive.push(propertiesMod);
                    });
                }
            });

        // lista los módulos activos de un usuario
        } else {

            this.accountService.getModulesActiveUser(this.businessObservable.id, this.userObservable.idRol)
            .pipe(first())
            .subscribe(responseListModules => {

                if ( responseListModules ) {

                    responseListModules.forEach(module => {

                        let propertiesMod = new ModulesProperties();

                        propertiesMod.id = module.identificador;
                        propertiesMod.nombre = module.nombre;
                        propertiesMod.pathIco =  localVariables.dir_img_modules + module.identificador + '.png';
                        propertiesMod.descripcion =  module.descripcion;

                        this.ListModulesActive.push(propertiesMod);
                    });
                }
            });
        }
    }

    asignarRedireccionamientoHttp(propertiesMod: ModulesProperties, IdentificadorModulo : string) : ModulesProperties {

        switch (IdentificadorModulo) {

            // redireccionamiento a GENERALES
            case ModulesSystem.Identif_Generales: 
                propertiesMod.urlRedirect = ModulesSystem.GeneralesIndexURL; 
                break;
            // redireccionamiento a ACTIVOS FIJOS
            case ModulesSystem.Identif_ActivosFijos: 
                propertiesMod.urlRedirect = ModulesSystem.ActivosFijosIndexURL; 
                break;
            // redireccionamiento a BANCOS
            case ModulesSystem.Identif_Bancos: 
                propertiesMod.urlRedirect = ModulesSystem.BancosIndexURL; 
                break;
            // redireccionamiento a CONTABILIDAD
            case ModulesSystem.Identif_Contabilidad: 
                propertiesMod.urlRedirect = ModulesSystem.ContabilidadIndexURL; 
                break;
            // redireccionamiento a CUENTAS POR COBRAR
            case ModulesSystem.Identif_CuentasCobrar: 
                propertiesMod.urlRedirect = ModulesSystem.CuentasCobrarIndexURL; 
                break;
            // redireccionamiento a CUENTAS POR PAGAR
            case ModulesSystem.Identif_CuentasPagar: 
                propertiesMod.urlRedirect = ModulesSystem.CuentasPagarIndexURL; 
                break;
            // redireccionamiento a FACTURACIÓN
            case ModulesSystem.Identif_Facturacion: 
                propertiesMod.urlRedirect = ModulesSystem.FacturacionIndexURL; 
                break;
            // redireccionamiento a INVENTARIO
            case ModulesSystem.Identif_Inventario: 
                propertiesMod.urlRedirect = ModulesSystem.InventarioIndexURL; 
                break;
            // redireccionamiento a CUMPLIMIENTO
            case ModulesSystem.Identif_Cumplimiento: 
                propertiesMod.urlRedirect = ModulesSystem.CumplimientoIndexURL; 
                break;

            default: propertiesMod.urlRedirect = '/';
        }
        return propertiesMod;
    }

    // ******************************************
    // ** Procedimiento de Selección de Módulo **
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
