import { Component, ViewChild, OnInit } from '@angular/core';
import { AccountService, GeneralesService } from '@app/_services';
import { MatSidenav } from '@angular/material/sidenav';
import { Module, User } from '@app/_models';
import { httpLandingIndexPage } from '../../../environments/environment-access-admin';
import { Router } from '@angular/router';

import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import { ModulesSystem } from '@environments/environment';

import { Compania } from '../../_models/modules/compania';

 interface FoodNode { name: string; link: string; icon: string; children?: FoodNode[]; }
 interface ExampleFlatNode { expandable: boolean; name: string; link?: string; icon?: string; level: number; }

  const TREE_DATA: FoodNode[] = [{
    name: 'Parámetros',
    link: '',
    icon: '',
    children: [
              // {name: 'Generales', link: '/', icon: ''}, 
               {name: 'Compañías', link: ModulesSystem.generalesbasehref + 'ConfiguracionCompania.html', icon: ''}],
  }
  // ,
  // {
  //   name: 'Monedas',
  //   link: '',
  //   icon: '',
  //   children: [{name: 'Tipos de Monedas', link: '/', icon: ''},
  //             {name: 'Tipos de Cambio', link: '/', icon: ''}
  //   ],
  // },
  // {
  //   name: 'Documentos',
  //   link: '/',
  //   icon: ''
  // },
  // {
  //   name: 'Periodos',
  //   link: '/',
  //   icon: ''
  // }
];
  

@Component({
    templateUrl: '../menu.html',
    styleUrls: ['../../../assets/scss/app.scss',
                '../../../assets/scss/menus.scss'],
})
export class MenuGeneralesComponent implements OnInit {
    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    userObservable: User;
    moduleObservable: Module;
    businessObservable: Compania;

    private Home:string = httpLandingIndexPage.homeHTTP;
    private Index:string = httpLandingIndexPage.indexHTTP;

    URLRedirectIndexContent: string = httpLandingIndexPage.indexHTTP;

    constructor(private accountService: AccountService, 
                private router: Router,
                private generalesService: GeneralesService,) {

        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.businessObservable = this.accountService.businessValue;

        this.dataSource.data = TREE_DATA;
    }

    ngOnInit() {

      if (!this.businessObservable) {
        this.router.navigate([this.Home]);
        return;
      }
      if (!this.moduleObservable) {
        this.router.navigate([this.Index]);
        return;
      }
    }

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      link: node.link,
      icon: node.icon
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  // -- >> Redireccionamiento a página dentro de menú de Generales
  redireccionamientoMenu(linkRedireccionMenu: string) { 
    this.router.navigate([linkRedireccionMenu]); 
  }

  logout() { this.accountService.logout(); }
}
