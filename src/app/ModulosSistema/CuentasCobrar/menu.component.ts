import { Component, ViewChild } from '@angular/core';
import { AccountService } from '@app/_services';
import { MatSidenav } from '@angular/material/sidenav';
import { Module, User } from '@app/_models';

import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import { Compania } from '../../_models/modules/compania';
import { httpLandingIndexPage } from '@environments/environment';

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
      name: 'Clientes',
      link: '/',
      icon: ''
    },
    {
      name: 'Movimientos',
      link: '',
      icon: '',
      children: [{name: 'Registro de Movimientos', link: '/', icon: ''},//monetization_on
                {name: 'Registro de Abonos', link: '/', icon: ''},//insert_chart
                {name: 'Anulación de Abonos', link: '/', icon: ''},
                {name: 'Notas de Crédito', link: '/', icon: ''},
                {name: 'Notas de Débito', link: '/', icon: ''}
      ],
    },
    {
      name: 'Cierre',
      link: '',
      icon: '',
      children: [{name: 'Asiento Contable', link: '/', icon: ''},//monetization_on
                {name: 'Asiento de Abonos', link: '/', icon: ''}
      ],
    },
    {
      name: 'Consultas',
      link: '',
      icon: '',
      children: [{name: 'Clientes', link: '/', icon: ''},//monetization_on
                {name: 'Movimientos', link: '/', icon: ''},
                {name: 'Abonos', link: '/', icon: ''}
      ],
    },
    {
      name: 'Reportes',
      link: '',
      icon: '',
      children: [{name: 'Clientes', link: '/', icon: ''},//monetization_on
                {name: 'Movimientos', link: '/', icon: ''},
                {name: 'Abonos', link: '/', icon: ''},
                {name: 'Detalle de Saldos por Plazo', link: '/', icon: ''},
                {name: 'Estado de Cuenta por Cliente', link: '/', icon: ''},
                {name: 'Cobros Vencidos al Día', link: '/', icon: ''},
                {name: 'Cuentas Cobrar Crédito Fiscal', link: '/', icon: ''}
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
    templateUrl: '../menu.html',
    styleUrls: ['../../../assets/scss/app.scss',
                '../../../assets/scss/menus.scss'],
})
export class MenuCuentasCobrarComponent {
    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    userObservable: User;
    moduleObservable: Module;
    businessObservable: Compania;

    URLRedirectIndexContent: string = httpLandingIndexPage.indexHTTP;


    menuArray = [
        { menuLink: '/',        menuIcon: 'home',    menuName: 'submenu 1'},
        { menuLink: '/',        menuIcon: 'home',    menuName: 'submenu 2'}
    ];

    constructor(private accountService: AccountService) {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.businessObservable = this.accountService.businessValue;

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