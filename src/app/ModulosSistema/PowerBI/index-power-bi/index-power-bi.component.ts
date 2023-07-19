import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { Compania, Module, User } from '@app/_models';
import { ScreenModule } from '@app/_models/admin/screenModule';
import { AccountService, AlertService, PowerBIService } from '@app/_services';
import { environment } from '@environments/environment';
import { IReportEmbedConfiguration, models } from 'powerbi-client';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-index-power-bi',
  templateUrl: './index-power-bi.component.html',
  styleUrls: [
    '../../../../assets/scss/app.scss',
    '../../../../assets/scss/powerbi/app.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class IndexPowerBiComponent extends OnSeguridad implements OnInit {
  //#region VARIABLES
  private nombrePantalla: string = 'Index';

  userObservable: User;
  moduleObservable: Module;
  businessObservable: Compania;

  mostrarReporte: boolean = false;

  //CONFIGURACION DEL REPORTE
  phasedEmbeddingFlag = false;
  reportClass = 'reporteCSS';
  reportConfig: IReportEmbedConfiguration = {
    type: 'report',
    id: 'reporte',
    embedUrl: undefined,
    tokenType: models.TokenType.Embed,
    accessToken: undefined,
    permissions: models.Permissions.Read,
    viewMode: models.ViewMode.View,
    settings: {
      background: models.BackgroundType.Transparent,
      navContentPaneEnabled: false,
      hideErrors: true
    },
  };

  //#endregion

  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private powerBIService: PowerBIService,
    private router: Router,
    private sanitaizer: DomSanitizer
  ) {
    //#region VALIDACIÓN DE ACCESO A LAS PANTALLAS
    super(alertService, accountService, router);
    super._nombrePantalla = this.nombrePantalla;
    super._redireccionURL = '/inra-sa'; // [OPCIONAL] SI NO SE INDICA SE REDIRECCIONA AL LA PÁGINA DEL MODULO.INDEXHTML
    super.validarAccesoPantalla();
    //#endregion

    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.businessObservable = this.accountService.businessValue;

    this.ObtenerReportePowerBI();
  }

  ngOnInit(): void {}

  //#region METODOS-FUNCIONES

  private ObtenerReportePowerBI() {
    let oScreenModule = {
      idCompania: this.businessObservable.id,
      idModulo: this.moduleObservable.id,
      nombre: this.nombrePantalla,
    } as ScreenModule;

    this.powerBIService
      .getURLExterna(oScreenModule)
      .pipe(first())
      .subscribe((response) => {
        if (response.exito) {
          this.SetURLPowerBI(oScreenModule);
        } else {
          this.alertService.error(
            'No se ha indicado correctamente el URL del reporte'
          );
          this.mostrarReporte = false;
        }
      });
  }

  private SetURLPowerBI(datosUrlPantalla: ScreenModule) {
    this.reportConfig = {
      ...this.reportConfig,
      embedUrl: `${environment.apiUrl}/PowerBI/reporte?tk=${this.userObservable.token}&cp=${datosUrlPantalla.idCompania}&md=${datosUrlPantalla.idModulo}&sc=${datosUrlPantalla.nombre}`,
    };
    this.mostrarReporte = true;
  }

  //#endregion

  //#region EVENTOS

  //#endregion
}
