import { Component, ViewChild } from '@angular/core';
import { AccountService } from '@app/_services';
import { MatSidenav } from '@angular/material/sidenav';
import { Business, Module, User } from '@app/_models';
import { httpAccessPage } from '../../environments/environment';

import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';


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
      children: [{name: 'Unidades de Medida', link: '/', icon: ''},
                {name: 'Familias', link: '/', icon: ''},
                {name: 'Articulos', link: '/', icon: ''},
                {name: 'Bodegas', link: '/', icon: ''}
      ],
    },
    {
      name: 'Movimientos',
      link: '',
      icon: '',
      children: [{name: 'Inventario E/S', link: '/', icon: ''},
                {name: 'Aplicación de Movimientos', link: '/', icon: ''}
      ],
    },
    {
      name: 'Importaciones',
      link: '',
      icon: '',
      children: [{name: 'Conceptos', link: '/', icon: ''},//monetization_on
                {name: 'Registro', link: '/', icon: ''},//insert_chart
                {name: 'Consulta', link: '/', icon: ''},
                {name: 'Aprobación de Inventario', link: '/', icon: ''},
                {name: 'Aprobación de Importación', link: '/', icon: ''}
      ],
    },
    {
      name: 'Cierres',
      link: '',
      icon: '',
      children: [{name: 'Asientos de Movimientos', link: '/', icon: ''}
      ],
    },
    {
      name: 'Consultas',
      link: '',
      icon: '',
      children: [{name: 'Existencias', link: '/', icon: ''},//monetization_on
                {name: 'Catálogo de Artículo', link: '/', icon: ''},//insert_chart
                {name: 'Movimientos', link: '/', icon: ''},
                {name: 'Saldos y Costos', link: '/', icon: ''}
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
export class MenuInventarioComponent {
    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    userObservable: User;
    moduleObservable: Module;
    businessObservable: Business;

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

