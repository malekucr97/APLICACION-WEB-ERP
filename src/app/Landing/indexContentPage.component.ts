import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '@app/_services';
import { User, Module } from '@app/_models';
import { localVariables, ModulesSystem } from '@environments/environment';
import { amdinBusiness } from '@environments/environment-access-admin';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '@app/_models/modules/compania';

@Component({
    templateUrl: 'IndexContentPage.html',
    styleUrls: ['../../assets/scss/landing/app.scss']
})
export class IndexContentPageComponent implements OnInit {

    constructor(private accountService: AccountService,
                private router: Router,
                private route: ActivatedRoute,) {

        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;
    }

    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    conexion:boolean;

    userObservable: User;
    businessObservable: Compania;

    public ListModules: Module[] = [];
    private UrlHome:string = '/';

    ngOnInit() {

        this.conexion = false;

        // valida que se haya seleccionado una empresa
        if (this.businessObservable) {

                // valida si el usuario que inició sesión es administrador
            if (this.userObservable.esAdmin
                || this.userObservable.idRol === amdinBusiness.adminSociedad) {

                // lista los módulos activos de una compañía
                this.accountService.getModulesActiveBusiness(this.businessObservable.id)
                .pipe(first())
                .subscribe(responseListModules => {
                    this.conexion = true;
                    this.setListModules(responseListModules);
                },
                error => {
                    // si hay algun problema redirecciona a home
                    this.router.navigate([this.UrlHome], { relativeTo: this.route });
                });

            // lista los módulos activos de un usuario
            } else {

                this.accountService.getModulesActiveUser(this.businessObservable.id, this.userObservable.idRol)
                .pipe(first())
                .subscribe(responseListModules => {
                    this.conexion = true;
                    this.setListModules(responseListModules);
                },
                error => {
                    // si hay algun problema redirecciona a home
                    this.router.navigate([this.UrlHome], { relativeTo: this.route });
                });
            }
        } else {
            this.router.navigate([this.UrlHome], { relativeTo: this.route });
        }
    }

    private setListModules(responseListModules:Module[]=null) : void {
        if ( responseListModules ) {

            responseListModules.forEach(module => {
                
                this.ListModules.push(new Module(   module.id, 
                                                    module.identificador, 
                                                    module.nombre,
                                                    module.descripcion,
                                                    module.estado,
                                                    module.pathLogo,
                                                    localVariables.dir_img_modules + module.identificador + '.png',
                                                    this.redireccionIndexModulosHTTP(module.identificador)));
            });
        }
    }
    redireccionIndexModulosHTTP(/*mod: Module, */identificador : string) : string {

        let indexHTTPModule : string = '';

        switch (identificador) {

            // redireccionamiento a GENERALES
            case ModulesSystem.Identif_Generales:
                indexHTTPModule = ModulesSystem.GeneralesIndexURL;
            // mod.indexHTTP = ModulesSystem.GeneralesIndexURL;
                break;
            // redireccionamiento a ACTIVOS FIJOS
            case ModulesSystem.Identif_ActivosFijos:
                indexHTTPModule = ModulesSystem.ActivosFijosIndexURL;
            // mod.indexHTTP = ModulesSystem.ActivosFijosIndexURL;
                break;
            // redireccionamiento a BANCOS
            case ModulesSystem.Identif_Bancos:
                indexHTTPModule = ModulesSystem.BancosIndexURL;
            // mod.indexHTTP = ModulesSystem.BancosIndexURL;
                break;
            // redireccionamiento a CONTABILIDAD
            case ModulesSystem.Identif_Contabilidad:
                indexHTTPModule = ModulesSystem.ContabilidadIndexURL;
            // mod.indexHTTP = ModulesSystem.ContabilidadIndexURL;
                break;
            // redireccionamiento a CUENTAS POR COBRAR
            case ModulesSystem.Identif_CuentasCobrar:
                indexHTTPModule = ModulesSystem.CuentasCobrarIndexURL;
            // mod.indexHTTP = ModulesSystem.CuentasCobrarIndexURL;
                break;
            // redireccionamiento a CUENTAS POR PAGAR
            case ModulesSystem.Identif_CuentasPagar:
                indexHTTPModule = ModulesSystem.CuentasPagarIndexURL;
            // mod.indexHTTP = ModulesSystem.CuentasPagarIndexURL;
                break;
            // redireccionamiento a FACTURACIÓN
            case ModulesSystem.Identif_Facturacion:
                indexHTTPModule = ModulesSystem.FacturacionIndexURL;
            // mod.indexHTTP = ModulesSystem.FacturacionIndexURL;
                break;
            // redireccionamiento a INVENTARIO
            case ModulesSystem.Identif_Inventario:
                indexHTTPModule = ModulesSystem.InventarioIndexURL;
            // mod.indexHTTP = ModulesSystem.InventarioIndexURL;
                break;
            // redireccionamiento a CUMPLIMIENTO
            case ModulesSystem.Identif_Cumplimiento:
                indexHTTPModule = ModulesSystem.CumplimientoIndexURL;
            // mod.indexHTTP = ModulesSystem.CumplimientoIndexURL;
                break;
            // redireccionamiento a MACRED
            case ModulesSystem.Identif_Macred:
                indexHTTPModule = ModulesSystem.MacredIndexURL;
            // mod.indexHTTP = ModulesSystem.MacredIndexURL;
                break;

            default: indexHTTPModule = '/';
        }
        return indexHTTPModule;
    }

    // ******************************************
    // ** Procedimiento de Selección de Módulo **
    selectModule(mod: Module) {

        let module : Module = this.ListModules.find(x => x.id === mod.id);
        this.accountService.loadModuleAsObservable(module);

        this.router.navigate([module.indexHTTP]);
    }

    logout() { this.accountService.logout(); }
}
