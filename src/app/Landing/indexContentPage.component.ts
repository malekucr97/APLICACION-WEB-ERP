import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '@app/_services';
import { User, Module } from '@app/_models';
import { ModulesSystem } from '@environments/environment';
import { amdinBusiness, httpAccessAdminPage } from '@environments/environment-access-admin';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '@app/_models/modules/compania';

@Component({
    templateUrl: 'IndexContentPage.html',
    styleUrls: ['../../assets/scss/app.scss',
                '../../assets/scss/landing/app.scss']
})
export class IndexContentPageComponent implements OnInit {

    public URLIndexAdminPage: string = httpAccessAdminPage.urlPageAdministrator;

    constructor(private accountService: AccountService,
                private router: Router,
                private route: ActivatedRoute,) {

        this.userObservable = this.accountService.userValue;
        this.businessObservable = this.accountService.businessValue;
    }

    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    // conexion:boolean;

    userObservable: User;
    businessObservable: Compania;

    public ListModules: Module[] = [];
    private UrlHome:string = '/';

    ngOnInit() {

        // this.conexion = false;

        // valida que se haya seleccionado una empresa
        if (this.businessObservable) {

                // valida si el usuario que inició sesión es administrador
            if (this.userObservable.esAdmin
                || this.userObservable.idRol === amdinBusiness.adminSociedad) {

                // lista los módulos activos de una compañía
                this.accountService.getModulesActiveBusiness(this.businessObservable.id)
                    .pipe(first())
                    .subscribe(responseListModules => {

                        if (responseListModules && responseListModules.length > 0) this.setListModules(responseListModules);

                        // this.conexion = true;
                        // this.setListModules(responseListModules);
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

                    if (responseListModules && responseListModules.length > 0) this.setListModules(responseListModules);

                    // this.conexion = true;
                    // this.setListModules(responseListModules);
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

            var resp = responseListModules[0].pathLogo;

            responseListModules.forEach(module => {

                this.ListModules.push(new Module(   module.id,
                                                    module.identificador,
                                                    module.nombre,
                                                    module.descripcion,
                                                    module.estado,
                                                    module.pathLogo,
                                                    '',
                                                    this.redireccionIndexModulosHTTP(module.identificador)));
            });
        }
    }
    redireccionIndexModulosHTTP(identificador : string) : string {

      const procesoBusquedaPowerBi = (terminoBuscado) => {
        if (identificador.includes(terminoBuscado)){
          return identificador;
        }
      };

        let indexHTTPModule : string = '';

        switch (identificador) {
            case ModulesSystem.Identif_Generales:
                indexHTTPModule = ModulesSystem.generalesbasehref       + 'index.html'; // ## generales ## //
                break;
            case ModulesSystem.Identif_ActivosFijos:
                indexHTTPModule = ModulesSystem.activosfijosbasehref    + 'index.html'; // ## activos fijos ## //
                break;
            case ModulesSystem.Identif_Bancos:
                indexHTTPModule = ModulesSystem.bancosbasehref          + 'index.html'; // ## bancos ## //
                break;
            case ModulesSystem.Identif_Contabilidad:
                indexHTTPModule = ModulesSystem.contabilidadbasehref    + 'index.html'; // ## contabilidad ## //
                break;
            case ModulesSystem.Identif_CuentasCobrar:
                indexHTTPModule = ModulesSystem.cuentascobrarbasehref   + 'index.html'; // ## cuentas cobrar ## //
                break;
            case ModulesSystem.Identif_CuentasPagar:
                indexHTTPModule = ModulesSystem.cuentaspagarbasehref    + 'index.html'; // ## cuentas pagar ## //
                break;
            case ModulesSystem.Identif_Facturacion:
                indexHTTPModule = ModulesSystem.facturacionbasehref     + 'index.html'; // ## facturación ## //
                break;
            case ModulesSystem.Identif_Inventario:
                indexHTTPModule = ModulesSystem.inventariobasehref      + 'index.html'; // ## inventario ## //
                break;
            case ModulesSystem.Identif_Cumplimiento:
                indexHTTPModule = ModulesSystem.cumplimientobasehref    + 'index.html'; // ## cumplimiento ## //
                break;
            case ModulesSystem.Identif_Macred:
                indexHTTPModule = ModulesSystem.macredbasehref          + 'index.html'; // ## macred ## //
                break;
            case ModulesSystem.Identif_RiesgoCredito:
                indexHTTPModule = ModulesSystem.riesgocreditobasehref   + 'index.html'; // ## riesgo crédito ## //
                break;
            case ModulesSystem.Identif_Inversiones:
                indexHTTPModule = ModulesSystem.inversionesbasehref     + 'index.html'; // ## inversiones transitorias ## //
                break;
            case procesoBusquedaPowerBi(ModulesSystem.Identif_PowerBI):
                indexHTTPModule = ModulesSystem.powerbibasehref     + 'index.html'; // ## Power BI ## //
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
