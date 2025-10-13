import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User, Module } from '@app/_models';
import { ModulesSystem, httpAccessAdminPage, httpLandingIndexPage } from '@environments/environment';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '@app/_models/modules/compania';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { Bitacora } from '@app/_models/bitacora';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

@Component({
    selector: 'app-index-content-landing',
    templateUrl: 'IndexContentPage.html',
    styleUrls: ['../../assets/scss/app.scss', '../../assets/scss/landing/app.scss'],
    standalone: false
})
export class IndexContentPageComponent extends OnSeguridad implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  userObservable: User;
  businessObservable: Compania;

  private _valorBuscado : string = '';
  public get valorBuscado() : string { return this._valorBuscado; }
  public set valorBuscado(v : string) { this._valorBuscado = v; }

  public ListModules: Module[] = [];
  public ListModulesFilter: Module[] = [];
  private UrlHome: string = '/';

  public URLConfigureUserPage: string = httpAccessAdminPage.urlPageAddEditUser;
  public URLIndexAdminPage: string = httpAccessAdminPage.urlPageAdministrator;

  public _httpNoModulesUserPage : string = httpLandingIndexPage.indexHTTPNoModulesUser;

  public today : Date ;

  // --
  public existenModulos : boolean;

  constructor(  private accountService: AccountService,
                private router: Router,
                private route: ActivatedRoute,
                private alertService: AlertService,
                private translate: TranslateMessagesService ) {

    super(alertService, accountService, router, translate);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
    if (!super.userAuthenticateIndexHttp()) { this.accountService.logout(); return; }
    // ***************************************************************

    this.userObservable = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;

    this.accountService.clearObjectModuleObservable();

    this.today = new Date();

    // --
    this.existenModulos = true;
  }

  ngOnInit() {

    if ( super.validarUsuarioAdmin() ) {

      this.accountService.getModulesActiveBusiness( this.businessObservable.id)
        .pipe(first())
        .subscribe((responseListModules) => {

            if (responseListModules && responseListModules.length > 0) { 
              this.setListModules(responseListModules); 
            } else { this.existenModulos = false; }

          }, error => { this.logout(); });

    } else {
      // módulos activos de usuario
      this.accountService.getModulesActiveUser(this.businessObservable.id, this.userObservable.idRol)
        .pipe(first())
        .subscribe((responseListModules) => {

          if (responseListModules && responseListModules.length > 0) {

            this.setListModules(responseListModules);

          } else {

            this.existenModulos = false;
             // #region "registro en bitácora no módulos activos"
             let bit : Bitacora = new Bitacora( 'NO-LOG12', /** codigoInterno */
                                                true, /** sesion */
                                                false, /** consulta */
                                                0, /** idCompania */
                                                0, /** idModulo */
                                                this.userObservable.id, /** idUsuario */
                                                'No se han devuelto módulos activos para el rol del usuario en la compañía.', /** descripcion */
                                                0, /** contadorSesion */
                                                this.today, /** fechaSesion */
                                                '', /** lugarSesion */
                                                '', /** token */
                                                '' /** urlConsulta */ );

              // *****************************************************************
              // REGISTRA EN BITÁCORA INTENTO DE INICIO DE SESIÓN DE ROL SIN PERMISOS
              this.accountService.postBitacora(bit, this._HIdUserSessionRequest)
                .pipe(first())
                .subscribe(response => {

                  this.userObservable.codeNoLogin = '404';
                  this.userObservable.idRol = null;
                  this.userObservable.token = null;
                  this.accountService.loadUserAsObservable(this.userObservable);

                  // redirect http nologin **
                  this.router.navigate([this._httpNoModulesUserPage]);
              });
              // #endregion "registro en bitácora no módulos activos"
          }

        }, error => { this.logout(); });
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

  public redirectPageConfigUser() : void {
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
        indexHTTPModule = ModulesSystem.generalesbasehref + 'index.html'; // ## GENERALES ## //
        break;

        case ModulesSystem.Identif_Macred:
        indexHTTPModule = ModulesSystem.macredbasehref + 'index.html';    // ## MACRED ## //
        break;

      case procesoBusquedaPowerBi(ModulesSystem.Identif_PowerBI):
        indexHTTPModule = ModulesSystem.powerbibasehref + 'index.html';   // ## POWERBI ## //
        break;

      case ModulesSystem.Identif_RiesgoCredito:
        indexHTTPModule = ModulesSystem.riesgocreditobasehref + 'index.html';   // ## R.C ## //
        break;

      case ModulesSystem.Identif_TipoCambio:
        indexHTTPModule = ModulesSystem.tipocambiobasehref + 'index.html';   // ## T.C ## //
        break;

      default: indexHTTPModule = this.UrlHome;
    }
    return indexHTTPModule;
  }

  // ******************************************
  // ** Procedimiento de Selección de Módulo **
  selectModule(mod: Module) {
    let module: Module = this.ListModules.find((x) => x.id === mod.id);
    this.accountService.loadModuleAsObservable(module);

    this.router.navigate([module.indexHTTP]);
  }
  // ******************************************

  logout() { this.accountService.logout().subscribe(); }
}
