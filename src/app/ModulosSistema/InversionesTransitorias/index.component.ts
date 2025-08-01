import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { User, Module } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

@Component({
  templateUrl: 'index.html',
  styleUrls: ['../../../assets/scss/inversiones/app.scss'],
})
export class IndexInversionesComponent extends OnSeguridad implements OnInit {
  private nombrePantalla: string = 'IndexInversiones';
  pPathIcoModule: string;

  userObservable: User;
  moduleObservable: Module;

  pnombremodulo: string;

  public adminSistema: boolean;
  public adminEmpresa: boolean;

  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private router: Router,
    private translate: TranslateMessagesService
  ) {

    //#region VALIDACIÓN DE ACCESO Y AUTENTICACIÓN A LAS PANTALLAS
    super(alertService, accountService, router, translate);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN INDEX COMPONENT
    if (!super.userAuthenticateIndexComponent()) {
      this.accountService.logout();
      return;
    }
    // ***************************************************************

    super._nombrePantalla = this.nombrePantalla;
    super._redireccionURL = '/maleku-ti'; // [OPCIONAL] SI NO SE INDICA SE REDIRECCIONA AL LA PÁGINA DEL MODULO.INDEXHTML
    super.validarAccesoPantalla();
    //#endregion

    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
  }

  ngOnInit() {}

  logout() {
    this.accountService.logout();
  }
}
