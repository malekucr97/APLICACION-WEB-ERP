import { Component, ViewChild } from '@angular/core';
import { AccountService }       from '@app/_services';
import { MatSidenav }           from '@angular/material/sidenav';

import { FlatTreeControl}       from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { Module, User }   from '@app/_models';
import { Compania }       from '../../_models/modules/compania';
import { httpLandingIndexPage }  from '@environments/environment';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';
import { Router } from '@angular/router';

/** menu - tree Interfaz o estructura del arbol  */
interface FoodNode {  name: string; 
                      link: string; 
                      icon: string; 
                      children?: FoodNode[]; }
/** Flat node with expandable and level information */
interface ExampleFlatNode { expandable: boolean; 
                            name: string; 
                            link?: string; 
                            icon?: string; 
                            level: number; }

// Datos del Arbol
const TREE_DATA: FoodNode[] = [
  {
    name: 'Análisis de Personas',
    link: '',
    icon: '',
    children: [{ name: 'Asociados', link: 'asociados/analisis-asociados.html', icon: '' },
              { name: 'No Asociados', link: '/', icon: '' }],
  },
  {
    name: 'Procesos',
    link: '',
    icon: '',
    children: [{name: 'Carga de Datos',
                link: '',
                icon: '',
                children: [{name: 'Cargar Personas', link: '/', icon: ''},
                          {name: 'Cargar Obligaciones', link: '/', icon: ''}],
                },
                {name: 'Reportes',
                link: '',
                icon: '',
                children: [{name: 'Análisis de Capacidad de Pago', link: '/', icon: ''}]}],
  },
  {
    name: 'Mantenimientos',
    link: '',
    icon: '',
    children: [{name: 'Personas',
                link: '',
                icon: '',
                children: [{name: 'Personas Analisis', link: 'mantenimientos/personas/personas-analisis.html', icon: ''},
                          {name: 'Estado Civil', link: 'mantenimientos/personas/estados-civiles.html', icon: ''},
                          {name: 'Condición Laboral', link: 'mantenimientos/personas/condiciones-laborales.html', icon: ''},
                          {name: 'Tipos de Género', link: 'mantenimientos/personas/tipos-generos.html', icon: ''},
                          {name: 'Tipos de Persona', link: 'mantenimientos/personas/tipos-personas.html', icon: ''},
                          {name: 'Tipos de Asociado', link: 'mantenimientos/personas/tipos-asociados.html', icon: ''},
                          {name: 'Tipos de Actividad Económica', link: 'mantenimientos/personas/tipo-actividad-economica.html', icon: ''}],
                },
                {name: 'Entidades',
                  link: 'mantenimientos/entidades-financieras.html',
                  icon: ''
                },
                {name: 'Obligaciones',
                link: '',
                icon: '',
                children: [{name: 'Formas de Pago', link: 'mantenimientos/obligaciones/tipos-forma-pago-analisis.html', icon: ''},
                          {name: 'Periodicidades', link: 'mantenimientos/obligaciones/periocidades.html', icon: ''},
                          {name: 'Tipos de Línea de Crédito', link: 'mantenimientos/obligaciones/tipos-lineas-credito.html', icon: ''},
                          {name: 'Tipos de Categoría de Riesgo', link: 'mantenimientos/obligaciones/categoria-riesgo.html', icon: ''}
                          ]},
                {name: 'Análisis de Personas',
                link: '',
                icon: '',
                children: [
                          {name: 'Tipo de Ingreso', link: 'mantenimientos/analisispersonas/tipos-ingresos.html', icon: ''},
                          {name: 'Tipo de Ingreso de Análisis', link: 'mantenimientos/analisispersonas/tipos-ingresos-analisis.html', icon: ''},
                          {name: 'Tipo de Deducciones', link: 'mantenimientos/analisispersonas/tipos-deducciones.html', icon: ''},
                          {name: 'Factores de Gastos Inferibles', link: 'mantenimientos/analisispersonas/factores-inferibles.html', icon: ''},
                          {name: 'Rangos Extras por Ingreso', link: 'mantenimientos/analisispersonas/rangos-extras-aceptacion.html', icon: ''},
                          {name: 'Niveles Ponderación Riesgo', link: 'mantenimientos/analisispersonas/ponderacion-riesgos-ltv.html', icon: ''}]},
                {name: 'Monedas y Tipo de Cambio',
                  link: 'mantenimientos/tipo-moneda.html',
                  icon: ''
                },
                {name: 'Modelos de Calificación',
                link: '',
                icon: '',
                children: [{name: 'Indicadores Relevantes', link: 'mantenimientos/modeloscalificacion/indicadores-relevantes.html', icon: ''},
                          {name: 'Configuración de Modelos', link: 'mantenimientos/modeloscalificacion/configuracion-modelos.html', icon: ''},
                          {name: 'Variables Críticas', link: 'mantenimientos/modeloscalificacion/variables-criticas.html', icon: ''},
                          {name: 'Escenarios de Riesgos', link: 'mantenimientos/modeloscalificacion/escenarios-riesgos.html', icon: ''},
                          {name: 'Niveles Capacidad Pago (Global)', link: 'mantenimientos/modeloscalificacion/niveles-capacidad-pago.html', icon: ''}]},
                {name: 'Parámetros',
                link: '',
                icon: '',
                children: [{name: 'Configuración de Modelos', link: 'mantenimientos/parametros/configuracion-modelos.html', icon: ''},
                          {name: 'Variables de Análisis PD', link: 'mantenimientos/parametros/variables-pd.html', icon: ''}]},
                {name: 'Parámetros Scoring',
                link: '',
                icon: '',
                children: [{name: 'Configuración de Modelos', link: 'mantenimientos/parametrosscoring/modelos-analisis.html', icon: ''},
                          {name: 'Indicadores Relevantes', link: 'mantenimientos/parametrosscoring/indicadores-scoring.html', icon: ''},
                          {name: 'Niveles de Riesgo', link: 'mantenimientos/parametrosscoring/niveles-riesgo.html', icon: ''},
                          {name: 'Rangos de Puntaje', link: '/', icon: ''}]}],
  },
  {
    name: 'Configuración',
    link: '',
    icon: '',
    children: [{name: 'Parámetros', link: 'configuracion/parametros/parametros-generales.html', icon: ''}
    ],
  },
];

@Component({selector: 'app-menu-macred',
            templateUrl: '../menu.html',
            styleUrls: ['../../../assets/scss/app.scss', '../../../assets/scss/menus.scss'],
            standalone: false
})
export class MenuMacredComponent {
    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    userObservable: User;
    moduleObservable: Module;
    businessObservable: Compania;

    URLRedirectIndexContent: string = httpLandingIndexPage.indexHTTP;

    constructor(private accountService: AccountService,
                public translate: TranslateMessagesService,
                private router: Router) {
                  
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.businessObservable = this.accountService.businessValue;

        this.dataSource.data = TREE_DATA;
    }

    ngOnInit() {
      console.log('MenuComponent iniciado');
    }

    redirectIndex() : void { this.router.navigate([this.URLRedirectIndexContent]); }

    logout() { this.accountService.logout().subscribe(); }

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

