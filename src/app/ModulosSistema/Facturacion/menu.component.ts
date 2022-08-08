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
      children: [{name: 'Ventas', link: '/', icon: ''},//settings 
                {name: 'Clasificación de Cuentas',link: '/', icon: ''}//store
      ],
    },
    {
      name: 'Mantenimientos',
      link: '',
      icon: '',
      children: [{name: 'Clientes', link: '/', icon: ''},//monetization_on
                {name: 'Productos', link: '/', icon: ''},//monetization_on
                {name: 'Ubicaciones', link: '/', icon: ''},//monetization_on
                {name: 'Actividades Económicas', link: '/', icon: ''},//monetization_on
                {name: 'Documentos Exoneración', link: '/', icon: ''},//monetization_on
                {name: 'Exoneraciones', link: '/', icon: ''}//insert_chart
      ],
    },
    {
      name: 'Procesos',
      link: '',
      icon: '',//folder
      children: [{name: 'Facturas', link: '/', icon: ''},
                {name: 'Anulación', link: '/', icon: ''},
                {name: 'Traslado Contable', link: '/', icon: ''}

      ],
    },
    {
      name: 'Consultas',
      link: '',
      icon: '',//folder
      children: [{name: 'Documentos', link: '/', icon: ''}
      ],
    },
    {
      name: 'Reportes',
      link: '',
      icon: '',//folder
      children: [{name: 'Documentos', link: '/', icon: ''}
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
export class MenuFacturacionComponent {
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