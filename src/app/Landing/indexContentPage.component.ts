import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User, Module } from '@app/_models';
import { ModulesSystem, environment, httpAccessAdminPage } from '@environments/environment';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '@app/_models/modules/compania';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';

@Component({
  templateUrl: 'IndexContentPage.html',
  styleUrls: [  '../../assets/scss/app.scss', '../../assets/scss/landing/app.scss' ]
})
export class IndexContentPageComponent extends OnSeguridad implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  userObservable: User;
  businessObservable: Compania;

  private _valorBuscado : string = '';
  public get valorBuscado() : string {
    return this._valorBuscado;
  }
  public set valorBuscado(v : string) {
    this._valorBuscado = v;
  }


  public ListModules: Module[] = [];
  public ListModulesFilter: Module[] = [];
  private UrlHome: string = '/';

  public URLConfigureUserPage: string = httpAccessAdminPage.urlPageAddEditUser;
  public URLIndexAdminPage: string = httpAccessAdminPage.urlPageAdministrator;

  private KeySessionStorageModule : string = environment.sessionStorageModuleIdentification;

  constructor(  private accountService: AccountService,
                private router: Router,
                private route: ActivatedRoute,
                private alertService: AlertService ) {

    super(alertService, accountService, router);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
    if (!super.userAuthenticateIndexHttp()) { this.accountService.logout(); return; }
    // ***************************************************************

    this.userObservable = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;

    this.accountService.clearObjectModuleObservable();
  }

  ngOnInit() {

    if (  super.validarUsuarioAdmin() ) {
      // módulos activos de compañía
      this.accountService.getModulesActiveBusiness(this.businessObservable.id)
        .pipe(first())
        .subscribe((responseListModules) => {

            if (responseListModules && responseListModules.length > 0) this.setListModules(responseListModules);

          }, error => { console.log(error); this.logout(); });

    } else {
      // módulos activos de usuario
      this.accountService.getModulesActiveUser( this.businessObservable.id, this.userObservable.idRol )
        .pipe(first())
        .subscribe((responseListModules) => {

            if (responseListModules && responseListModules.length > 0) this.setListModules(responseListModules);

          }, error => { console.log(error); this.logout(); });
    }
  }

  //#region BUSQUEDA DE LOS MÓDULOS.

  filtrarModulos(){
    if (!this.valorBuscado) {
      this.ListModulesFilter = this.ListModules;
    } else {
      this.ListModulesFilter = this.ListModules.filter(elemento => {
        return elemento.nombre.toLowerCase().includes(this.valorBuscado.toLowerCase());
      });
    }
  }

  //#endregion

  public redirectPageConfigUser() : void{
    if (  super.validarUsuarioAdmin() ) {
      this.router.navigate([this.URLIndexAdminPage]);
    } else { this.router.navigate([this.URLConfigureUserPage + this.userObservable.identificacion]); }
  }

  private setListModules(responseListModules: Module[]): void {
    responseListModules.forEach((module) => {
      this.ListModules.push( new Module(module.id,
                                        module.identificador,
                                        module.nombre,
                                        module.descripcion,
                                        module.estado,
                                        module.pathLogo,
                                        '',
                                        this.redireccionIndexModulosHTTP(module.identificador)
        ));
      });
      this.ListModulesFilter = [...this.ListModules];
  }

  redireccionIndexModulosHTTP(identificador: string): string {

    const procesoBusquedaPowerBi = (terminoBuscado) => { if (identificador.includes(terminoBuscado)) return identificador; };

    let indexHTTPModule: string = '';

    switch (identificador) {
      case ModulesSystem.Identif_Generales:
        indexHTTPModule = ModulesSystem.generalesbasehref + 'index.html'; // ## generales ## //
        break;
      case ModulesSystem.Identif_ActivosFijos:
        indexHTTPModule = ModulesSystem.activosfijosbasehref + 'index.html'; // ## activos fijos ## //
        break;
      case ModulesSystem.Identif_Bancos:
        indexHTTPModule = ModulesSystem.bancosbasehref + 'index.html'; // ## bancos ## //
        break;
      case ModulesSystem.Identif_Contabilidad:
        indexHTTPModule = ModulesSystem.contabilidadbasehref + 'index.html'; // ## contabilidad ## //
        break;
      case ModulesSystem.Identif_CuentasCobrar:
        indexHTTPModule = ModulesSystem.cuentascobrarbasehref + 'index.html'; // ## cuentas cobrar ## //
        break;
      case ModulesSystem.Identif_CuentasPagar:
        indexHTTPModule = ModulesSystem.cuentaspagarbasehref + 'index.html'; // ## cuentas pagar ## //
        break;
      case ModulesSystem.Identif_Facturacion:
        indexHTTPModule = ModulesSystem.facturacionbasehref + 'index.html'; // ## facturación ## //
        break;
      case ModulesSystem.Identif_Inventario:
        indexHTTPModule = ModulesSystem.inventariobasehref + 'index.html'; // ## inventario ## //
        break;
      case ModulesSystem.Identif_Cumplimiento:
        indexHTTPModule = ModulesSystem.cumplimientobasehref + 'index.html'; // ## cumplimiento ## //
        break;
      case ModulesSystem.Identif_Macred:
        indexHTTPModule = ModulesSystem.macredbasehref + 'index.html'; // ## macred ## //
        break;
      case ModulesSystem.Identif_RiesgoCredito:
        indexHTTPModule = ModulesSystem.riesgocreditobasehref + 'index.html'; // ## riesgo crédito ## //
        break;
      case ModulesSystem.Identif_Inversiones:
        indexHTTPModule = ModulesSystem.inversionesbasehref + 'index.html'; // ## inversiones transitorias ## //
        break;
      case procesoBusquedaPowerBi(ModulesSystem.Identif_PowerBI):
        indexHTTPModule = ModulesSystem.powerbibasehref + 'index.html'; // ## Power BI ## //
        break;
      default:
        indexHTTPModule = this.UrlHome;
    }
    return indexHTTPModule;
  }

  // ******************************************
  // ** Procedimiento de Selección de Módulo **
  selectModule(mod: Module) {
    let module: Module = this.ListModules.find((x) => x.id === mod.id);
    this.accountService.loadModuleAsObservable(module);

    // sessionStorage.setItem(this.KeySessionStorageModule, module.identificador);
    // sessionStorage.removeItem(this.KeySessionStorageModule);

    this.router.navigate([module.indexHTTP]);
  }
  // ******************************************

  logout() { this.accountService.logout(); }
}
