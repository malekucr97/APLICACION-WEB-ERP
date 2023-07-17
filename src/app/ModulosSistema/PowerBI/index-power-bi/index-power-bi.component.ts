import { Component, OnInit, SecurityContext, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { Compania, Module, User } from '@app/_models';
import { ScreenModule } from '@app/_models/admin/screenModule';
import { AccountService, AlertService, PowerBIService } from '@app/_services';
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

  private _pantallaModulo: ScreenModule = undefined;
  mostrarReporte: boolean = false;

  //CONFIGURACION DEL REPORTE
  phasedEmbeddingFlag = false;
  reportClass = 'reporteCSS';
  reportConfig: IReportEmbedConfiguration = {
    type: 'report',
    tokenType: models.TokenType.Embed,
    accessToken: undefined,
    settings: {
      background: models.BackgroundType.Transparent,
    },
    id: undefined,
    embedUrl: undefined,
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
          this._pantallaModulo = response.objetoDb;
          this.SetURLPowerBI(this._pantallaModulo.urlExterna);
        } else {
          this.alertService.error(
            'No se ha cargado correstamente el URL del reporte'
          );
        }
      });
  }

  private SetURLPowerBI(urlExterna: string) {
    this.mostrarReporte = false;
    if (urlExterna) {
      this.reportConfig = {
        ...this.reportConfig,
        embedUrl: urlExterna,
      };
      this.mostrarReporte = true;
    }
  }

  //#endregion

  //#region EVENTOS

  //#endregion
}
