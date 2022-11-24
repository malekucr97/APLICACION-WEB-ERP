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
      name: 'Análisis de Personas',
      link: '',
      icon: '',
      children: [{name: 'Asociados', link: '/_ModuloMacred/Asociados/CalificacionAsociados.html', icon: ''},
                {name: 'No Asociados', link: '/', icon: ''}
      ],
    },
    {
      name: 'Procesos',
      link: '',
      icon: '',
      children: [{name: 'Carga de Datos', 
                  link: '', 
                  icon: '',
                  children: [{name: 'Cargar Personas', link: '/', icon: ''},//monetization_on
                            {name: 'Cargar Obligaciones', link: '/', icon: ''}
                            ],
                  },
                  {name: 'Reportes', 
                  link: '', 
                  icon: '',
                  children: [{name: 'Análisis de Capacidad de Pago', link: '/', icon: ''}
                            ],}
                ],
    },
    {
      name: 'Mantenimientos',
      link: '',
      icon: '',
      children: [{name: 'Personas', 
                  link: '', 
                  icon: '',
                  children: [{name: 'Datos Personas', link: '/_ModuloMacred/Mantenimientos/Personas/DatosPersonas.html', icon: ''},//monetization_on
                            {name: 'Estado Civil', link: '/', icon: ''},//monetization_on
                            {name: 'Condición Laboral', link: '/', icon: ''},//monetization_on
                            {name: 'Tipos de Género', link: '/', icon: ''},//monetization_on
                            {name: 'Tipos de Persona', link: '/', icon: ''},//monetization_on
                            {name: 'Tipos de Asociado', link: '/', icon: ''}
                            ],
                  },
                  {name: 'Entidades', 
                    link: '/', 
                    icon: ''
                  },
                  {name: 'Obligaciones', 
                  link: '', 
                  icon: '',
                  children: [{name: 'Formas de Pago', link: '/', icon: ''},
                            {name: 'Periodicidades', link: '/', icon: ''},
                            {name: 'Tipos de Línea de Crédito', link: '/', icon: ''},
                            {name: 'Tipos de Categoría de Riesgo', link: '/', icon: ''}
                            ],},
                  {name: 'Análisis de Personas', 
                  link: '', 
                  icon: '',
                  children: [{name: 'Tipo de Ingreso', link: '/', icon: ''},
                            {name: 'Tipo de Deducciones', link: '/', icon: ''},
                            {name: 'Factores de Gastos Inferibles', link: '/', icon: ''},
                            {name: 'Rangos para las Extras por Ingreso', link: '/', icon: ''},
                            {name: 'Niveles Ponderación Riesgo', link: '/', icon: ''}
                            ],},
                  {name: 'Monedas y Tipo de Cambio', 
                    link: '/', 
                    icon: ''
                  },
                  {name: 'Modelos de Calificación', 
                  link: '', 
                  icon: '',
                  children: [{name: 'Indicadores Relevantes', link: '/', icon: ''},
                            {name: 'Configuración de Modelos', link: '/', icon: ''},
                            {name: 'Variables Críticas', link: '/', icon: ''},
                            {name: 'Escenarios de Riesgos', link: '/', icon: ''},
                            {name: 'Niveles Capacidad Pago (Global)', link: '/', icon: ''}
                            ],},
                  {name: 'Parámetros', 
                  link: '', 
                  icon: '',
                  children: [{name: 'Configuración de Modelos', link: '/', icon: ''},
                            {name: 'Variables de Análisis PD', link: '/', icon: ''}
                            ],},
                  {name: 'Parámetros Scoring', 
                  link: '', 
                  icon: '',
                  children: [{name: 'Configuración de Modelos', link: '/', icon: ''},
                            {name: 'Indicadores Relevantes', link: '/', icon: ''},
                            {name: 'Niveles de Riesgo', link: '/', icon: ''},
                            {name: 'Rangos de Puntaje', link: '/', icon: ''}
                            ],}
                ],
    },
    {
      name: 'Configuración',
      link: '',
      icon: '',
      children: [{name: 'Seguridad', 
                  link: '', 
                  icon: '',
                  children: [{name: 'Usuarios', link: '/', icon: ''},
                            {name: 'Roles y Programas', link: '/', icon: ''},
                            {name: 'Cambio Contraseña', link: '/', icon: ''}
                            ],
                },
                {name: 'Parámetros', link: '/', icon: ''},//monetization_on
                {name: 'Menú Principal', link: '/', icon: ''}
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
export class MenuMacredComponent {
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

