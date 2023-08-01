import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { User, Module } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';

@Component({templateUrl: 'index.html',
            styleUrls: ['../../../assets/scss/inventario/app.scss'],
})
export class IndexRiesgoCreditoComponent extends OnSeguridad  implements OnInit {

  pPathIcoModule: string;

  userObservable: User;
  moduleObservable: Module;

  pnombremodulo: string;

  public adminSistema: boolean;
  public adminEmpresa: boolean;

  constructor(private alertService: AlertService,
              private accountService: AccountService,
              private router: Router) {

        super(alertService, accountService, router);

        // ***************************************************************
        // VALIDA ACCESO PANTALLA LOGIN INDEX COMPONENT
        if (!super.userAuthenticateIndexComponent()) { this.accountService.logout(); return; }
        // ***************************************************************

      this.userObservable = this.accountService.userValue;
      this.moduleObservable = this.accountService.moduleValue;
  }

  ngOnInit() { }

  logout() { this.accountService.logout(); }

}
