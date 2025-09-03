import { Component, ViewChild, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';
import { MatSidenav } from '@angular/material/sidenav';
import { Module, User } from '@app/_models';
import { Router } from '@angular/router';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { Compania } from '../../_models/modules/compania';
import { ModulesSystem, httpLandingIndexPage } from '@environments/environment';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

interface FoodNode { name: string; link: string; icon: string; children?: FoodNode[]; }
interface ExampleFlatNode { expandable: boolean; name: string; link?: string; icon?: string; level: number; }

const TREE_DATA: FoodNode[] = [
  {
    name: 'Posición en Moneda',
    link: ModulesSystem.tipocambiobasehref + '/menu/posicion-moneda.html',
    icon: ''
  },
  {
    name: 'Carga Tipo de Cambio BCCR',
    link: ModulesSystem.tipocambiobasehref + '/menu/carga-tipo-cambio.html',
    icon: ''
  },
  {
    name: 'Volatilidad de Tipo de Cambio',
    link: ModulesSystem.tipocambiobasehref + '/menu/volatilidad-tipo-cambio.html',
    icon: ''
  }
];

@Component({templateUrl: '../menu.html',
            styleUrls: ['../../../assets/scss/app.scss', '../../../assets/scss/menus.scss'],
            standalone: false
})
export class MenuTipoCambioComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  userObservable: User;
  moduleObservable: Module;
  businessObservable: Compania;

  URLRedirectIndexContent: string = httpLandingIndexPage.indexHTTP;

  constructor(  private accountService: AccountService, 
                private router: Router,
                public translate: TranslateMessagesService ) {
    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.businessObservable = this.accountService.businessValue;
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() { }

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      link: node.link,
      icon: node.icon,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  logout() { this.accountService.logout(); }

  redirectIndex() : void { this.router.navigate([this.URLRedirectIndexContent]); }
}
