import { Component, OnInit } from '@angular/core';
import { User, Module } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({
  templateUrl: 'index.html',
  styleUrls: ['../../../assets/scss/inventario/app.scss'],
})
export class IndexRiesgoCreditoComponent implements OnInit {

  pPathIcoModule: string;

  userObservable: User;
  moduleObservable: Module;

  pnombremodulo: string;

  public adminSistema: boolean;
  public adminEmpresa: boolean;

  constructor(private accountService: AccountService) {
      this.userObservable = this.accountService.userValue;
      this.moduleObservable = this.accountService.moduleValue;
  }

  ngOnInit() { }

  logout() { this.accountService.logout(); }

}
