import { Component, ViewChild } from '@angular/core';
import { AccountService } from '@app/_services';
import { MatSidenav } from '@angular/material/sidenav';
import { Module, User } from '@app/_models';
import { httpLandingIndexPage } from '../../../environments/environment-access-admin';

import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import { Compania } from '../../_models/modules/compania';

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
      link: '',
      icon: '',
      children: [{name: 'Cuentas por Pagar', link: '/', icon: ''},//settings 
                {name: 'Tipos de Pagos',link: '/', icon: ''}//store
      ],
    },
    {
      name: 'Proveedores',
      link: '',
      icon: ''
    },
    {
      name: 'Movimientos',
      link: '',
      icon: '',
      children: [{name: 'Recibo de Facturas', link: '/', icon: ''},//settings 
                {name: 'Registro de Movimientos',link: '/', icon: ''},//store
                {name: 'Reversión de Facturas',link: '/', icon: ''},
                {name: 'Registro de Pagos',link: '/', icon: ''},
                {name: 'Anulación de Pagos',link: '/', icon: ''}
      ],
    },
    {
      name: 'Consultas',
      link: '',
      icon: '',
      children: [{name: 'Cuentas por Pagar', link: '/', icon: ''},//settings 
                {name: 'Movimientos',link: '/', icon: ''},//store
                {name: 'Saldos',link: '/', icon: ''},
                {name: 'Cuentas por Fecha Vencimiento',link: '/', icon: ''},
                {name: 'Movimientos Contables',link: '/', icon: ''}
      ],
    },
    {
      name: 'Traslado Contable',
      link: '/',
      icon: ''//folder
    },
    {
      name: 'Reportes',
      link: '',
      icon: '',
      children: [{name: 'Antiguedad de Saldos',link: '/', icon: ''},
                {name: 'Cuentas por Pagar', link: '/', icon: ''},//settings 
                {name: 'Documentos Aplicados',link: '/', icon: ''}//store
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
    styleUrls: ['../../../assets/scss/menus.scss'],
})
export class MenuCuentasPagarComponent {
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