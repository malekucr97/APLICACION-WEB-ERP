import { Component, ViewChild } from '@angular/core';
import { AccountService }       from '@app/_services';
import { MatSidenav }           from '@angular/material/sidenav';
import { httpLandingIndexPage } from '../../../environments/environment-access-admin';

import { FlatTreeControl}       from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { Module, User }   from '@app/_models';
import { Compania }       from '../../_models/modules/compania';
import { ModulesSystem }  from '@environments/environment';

/** menu - tree Interfaz o estructura del arbol  */
interface FoodNode        { name: string; link: string; icon: string; children?: FoodNode[]; }
/** Flat node with expandable and level information */
interface ExampleFlatNode { expandable: boolean; name: string; link?: string; icon?: string; level: number; }

// Datos del Arbol
const TREE_DATA: FoodNode[] = [
  // ANÁLISIS DE PERSONAS
  {
    name: 'Análisis de Personas',
    link: '',
    icon: '',
    children: [
        {
          name: 'Asociados',    link: ModulesSystem.macredbasehref + 'asociados/calificacion-asociados.html',   icon: ''
        },
        {
          name: 'No Asociados', link: '/',                                                                      icon: ''
        }
    ],
  },
  // PROCESOS
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
                children: [{name: 'Datos Personas', link: ModulesSystem.macredbasehref + 'mantenimientos/personas/datos-personas.html', icon: ''},//monetization_on
                          {name: 'Estado Civil', link: ModulesSystem.macredbasehref + 'mantenimientos/personas/estados-civiles.html', icon: ''},//monetization_on
                          {name: 'Condición Laboral', link: ModulesSystem.macredbasehref + 'mantenimientos/personas/condiciones-laborales.html', icon: ''},//monetization_on
                          {name: 'Tipos de Género', link: ModulesSystem.macredbasehref + 'mantenimientos/personas/tipos-generos.html', icon: ''},//monetization_on
                          {name: 'Tipos de Persona', link: ModulesSystem.macredbasehref + 'mantenimientos/personas/tipos-personas.html', icon: ''},//monetization_on
                          {name: 'Tipos de Asociado', link: ModulesSystem.macredbasehref + 'mantenimientos/personas/tipos-asociados.html', icon: ''}
                          ],
                },
                {name: 'Entidades',
                  link: '/',
                  icon: ''
                },
                {name: 'Obligaciones',
                link: '',
                icon: '',
                children: [{name: 'Formas de Pago', link: ModulesSystem.macredbasehref + 'mantenimientos/obligaciones/tipos-forma-pago-analisis.html', icon: ''},
                          {name: 'Periodicidades', link: '/', icon: ''},
                          {name: 'Tipos de Línea de Crédito', link: '/', icon: ''},
                          {name: 'Tipos de Categoría de Riesgo', link: '/', icon: ''}
                          ],},
                {name: 'Análisis de Personas',
                link: '',
                icon: '',
                children: [{name: 'Tipo de Ingreso', link: ModulesSystem.macredbasehref + 'mantenimientos/analisispersonas/tipos-ingresos.html', icon: ''},
                          {name: 'Tipo de Ingreso de Análisis', link: ModulesSystem.macredbasehref + 'mantenimientos/analisispersonas/tipos-ingresos-analisis.html', icon: ''},
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
                children: [{name: 'Configuración de Modelos', link: ModulesSystem.macredbasehref + 'mantenimientos/parametros/configuracion-modelos.html', icon: ''},
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
              {name: 'Parámetros', link: ModulesSystem.macredbasehref + 'configuracion/parametros-generales.html', icon: ''},//monetization_on
              {name: 'Menú Principal', link: '/', icon: ''}
    ],
  },
];

@Component({
    templateUrl: '../menu.html',
    styleUrls: ['../../../assets/scss/app.scss',
                '../../../assets/scss/menus.scss'],
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

