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

            let ListModulesTemp: Module[] = [];

            responseListModules.forEach(module => {

                let modTemp = new Module();

                modTemp.id = module.id;
                modTemp.identificador = module.identificador;
                modTemp.nombre = module.nombre;
                modTemp.pathIco =  localVariables.dir_img_modules + module.identificador + '.png';
                modTemp.descripcion =  module.descripcion;

                modTemp = this.redireccionIndexModulosHTTP(modTemp, module.identificador);

                ListModulesTemp.push(modTemp);
            });

            this.ListModules = ListModulesTemp;
        }
    }
    redireccionIndexModulosHTTP(mod: Module, identificador : string) : Module {

        switch (identificador) {

            // redireccionamiento a GENERALES
            case ModulesSystem.Identif_Generales: 
            mod.indexHTTP = ModulesSystem.GeneralesIndexURL; 
                break;
            // redireccionamiento a ACTIVOS FIJOS
            case ModulesSystem.Identif_ActivosFijos: 
            mod.indexHTTP = ModulesSystem.ActivosFijosIndexURL; 
                break;
            // redireccionamiento a BANCOS
            case ModulesSystem.Identif_Bancos: 
            mod.indexHTTP = ModulesSystem.BancosIndexURL; 
                break;
            // redireccionamiento a CONTABILIDAD
            case ModulesSystem.Identif_Contabilidad: 
            mod.indexHTTP = ModulesSystem.ContabilidadIndexURL; 
                break;
            // redireccionamiento a CUENTAS POR COBRAR
            case ModulesSystem.Identif_CuentasCobrar: 
            mod.indexHTTP = ModulesSystem.CuentasCobrarIndexURL; 
                break;
            // redireccionamiento a CUENTAS POR PAGAR
            case ModulesSystem.Identif_CuentasPagar: 
            mod.indexHTTP = ModulesSystem.CuentasPagarIndexURL; 
                break;
            // redireccionamiento a FACTURACIÓN
            case ModulesSystem.Identif_Facturacion: 
            mod.indexHTTP = ModulesSystem.FacturacionIndexURL; 
                break;
            // redireccionamiento a INVENTARIO
            case ModulesSystem.Identif_Inventario: 
            mod.indexHTTP = ModulesSystem.InventarioIndexURL; 
                break;
            // redireccionamiento a CUMPLIMIENTO
            case ModulesSystem.Identif_Cumplimiento: 
            mod.indexHTTP = ModulesSystem.CumplimientoIndexURL; 
                break;
            // redireccionamiento a MACRED
            case ModulesSystem.Identif_Macred: 
            mod.indexHTTP = ModulesSystem.MacredIndexURL; 
                break;

            default: mod.indexHTTP = '/';
        }
        return mod;
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
