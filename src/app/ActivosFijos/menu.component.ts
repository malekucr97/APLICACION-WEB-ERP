import { Component, ViewChild } from '@angular/core';
import { AccountService } from '@app/_services';
import { MatSidenav } from '@angular/material/sidenav';
import { Module, User } from '@app/_models';
import { httpAccessPage } from '../../environments/environment';

import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import { Compania } from '../_models/modules/compania';

/** menu - tree
 * Interfaz o estructura del arbol 
 */
 interface FoodNode {
    name: string;
    link: string;
    icon: string;
    children?: FoodNode[];
  }
  
  // Datos del Arbol
  const TREE_DATA: FoodNode[] = [
    {
      name: 'Parámetros',
      link: '/',
      icon: ''
    },
    {
      name: 'Mantenimientos',
      link: '',
      icon: '',
      children: [{name: 'Departamentos', link: '/', icon: ''},//monetization_on
                {name: 'Ubicaciones', link: '/', icon: ''},
                {name: 'Estados de Activos', link: '/', icon: ''},
                {name: 'Encargados', link: '/', icon: ''},
                {name: 'Tipos de Activos', link: '/', icon: ''},
                {name: 'Ingreso de Activos Fijos', link: '/', icon: ''}
      ],
    },
    {
      name: 'Asientos Contables',
      link: '/',
      icon: ''
    },
    {
      name: 'Consultas',
      link: '',
      icon: '',
      children: [{name: 'General de Activos', link: '/', icon: ''},//monetization_on
                {name: 'Depreciaciones por Activo', link: '/', icon: ''}
      ],
    },
    {
      name: 'Reportes',
      link: '',
      icon: '',
      children: [{name: 'Catálogo General de Activos', link: '/', icon: ''},//monetization_on
                {name: 'Depreciación Mensual de Activo', link: '/', icon: ''}
      ],
    },
  ];
  
  /** Flat node with expandable and level information */
  interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    link?: string;
    icon?: string;
    level: number;
  }

@Component({
    templateUrl: 'menu.html',
    styleUrls: ['../../assets/scss/menus.scss'],
})
export class MenuActivosFijosComponent {
    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    userObservable: User;
    moduleObservable: Module;
    businessObservable: Compania;

    URLRedirectIndexContent: string;

    menuArray = [
        { menuLink: '/',        menuIcon: 'home',    menuName: 'submenu 1'},
        { menuLink: '/',        menuIcon: 'home',    menuName: 'submenu 2'}
    ];

    constructor(private accountService: AccountService) {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.businessObservable = this.accountService.businessValue;

        this.URLRedirectIndexContent = httpAccessPage.urlContentIndex;

        this.dataSource.data = TREE_DATA;
    }

    logout() { this.accountService.logout(); }

    /* Menu-Tree */
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
}
