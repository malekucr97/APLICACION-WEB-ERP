import { Component, ViewChild, OnInit } from '@angular/core';
import { AccountService, GeneralesService } from '@app/_services';
import { MatSidenav } from '@angular/material/sidenav';
import { Module, User } from '@app/_models';
import { Router } from '@angular/router';

import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import { Compania } from '../../_models/modules/compania';

import { ModulesSystem, httpLandingIndexPage } from '@environments/environment';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

 interface FoodNode { name: string; link: string; icon: string; children?: FoodNode[]; }
 interface ExampleFlatNode { expandable: boolean; name: string; link?: string; icon?: string; level: number; }

  const TREE_DATA: FoodNode[] = [{
    name: 'Mantenimientos',
    link: '',
    icon: '',
    children: [{name: 'Parámetros', link: '/', icon: ''}, 
               {name: 'Calificación Riesgo',
               link: '', 
               icon: '',
               children: [{name: 'Grupos',      link: /*ModulesSystem.cumplimientobasehref*/ '' + 'Mantenimientos/CalificacionRiesgo/Grupos/', icon: ''}, 
                          {name: 'Criterios',   link: '/', icon: ''},
                          {name: 'Paises',      link: /*ModulesSystem.cumplimientobasehref*/ '' + 'Mantenimientos/CalificacionRiesgo/Paises/', icon: ''},
                          {name: 'Profesiones', link: /*ModulesSystem.cumplimientobasehref*/ '' + 'Mantenimientos/CalificacionRiesgo/Profesiones/', icon: ''},
                          {name: 'Actividades Económicas',link: /*ModulesSystem.cumplimientobasehref*/ '' + 'Mantenimientos/CalificacionRiesgo/ActividadesEconomicas/', icon: ''},
                          {name: 'Rango Montos al Debe',  link: /*ModulesSystem.cumplimientobasehref*/ '' + 'Mantenimientos/CalificacionRiesgo/MovimientosDebe/', icon: ''},
                          {name: 'Rango Montos al Haber', link: /*ModulesSystem.cumplimientobasehref*/ '' + 'Mantenimientos/CalificacionRiesgo/MovimientosHaber/', icon: ''},
                          {name: 'Artículo 15',           link: /*ModulesSystem.cumplimientobasehref*/ '' + 'Mantenimientos/CalificacionRiesgo/Articulo15/', icon: ''},
                          {name: 'Productos Financieros', link: /*ModulesSystem.cumplimientobasehref*/ '' + 'Mantenimientos/CalificacionRiesgo/ProductosFinancieros/', icon: ''},
                          {name: 'Nivel Transaccional',   link: '/', icon: ''},
                          {name: 'Fondos de Origen',      link: '/', icon: ''},
                          {name: 'Ubicación Geográfica',  link: '/', icon: ''},
                          {name: 'Canales de Distribucción',link: /*ModulesSystem.cumplimientobasehref*/ '' + 'Mantenimientos/CalificacionRiesgo/CanalesDistribucion/', icon: ''},
                          {name: 'Medios de Pago',            link: '/', icon: ''},
                          {name: 'Tipos de Personas',         link: '/', icon: ''},
                          {name: 'Rango Cantidades al Debe',  link: /*ModulesSystem.cumplimientobasehref*/ '' + 'Mantenimientos/CalificacionRiesgo/CantidadesDebe/', icon: ''},
                          {name: 'Rango Cantidades al Haber', link: /*ModulesSystem.cumplimientobasehref*/ '' + 'Mantenimientos/CalificacionRiesgo/CantidadesHaber/', icon: ''},
                          {name: 'Especialidades',            link: /*ModulesSystem.cumplimientobasehref*/ '' + 'Mantenimientos/CalificacionRiesgo/Especialidades/', icon: ''},
                          {name: 'Matrices',                  link: '/', icon: ''},
                          {name: 'Criterios por Matrices',    link: '/', icon: ''},
                          {name: 'Niveles de Riesgo',         link: /*ModulesSystem.cumplimientobasehref*/ '' + 'Mantenimientos/CalificacionRiesgo/NivelesRiesgos/', icon: ''},
                          {name: 'Calificación SUGEF',        link: '/', icon: ''}
                        ]}],
  },
  {
    name: 'Procesos',
    link: '',
    icon: '',
    children: [{name: 'Consulta Clientes', link: '/', icon: ''},
              {name: 'Calificación Clientes', link: '/', icon: ''},
              {name: 'Cargar Información', link: '/', icon: ''},
              {name: 'Monitoreo', link: '/', icon: ''},
              {name: 'Generación XML', link: '/', icon: ''},
              {name: 'FATCA', link: '/', icon: ''},
              {name: 'CRS', link: '/', icon: ''}
    ],
  },
  {
    name: 'Reportes',
    link: '',
    icon: '',
    children: [{name: 'Calificación Riesgo',
                link: '', 
                icon: '',
                children: [{name: 'Calificación Horizontal', link: '/', icon: ''}, 
                          {name: 'Calificación General por Cliente',link: '/', icon: ''},
                          {name: 'Cambios de Categoría',link: '/', icon: ''}
                          ]
              },
              {name: 'Certificados Cancelados Anticipadamente', link: '/', icon: ''},
              {name: 'Mayores Inversionistas', link: '/', icon: ''},
              {name: 'Mantenimiento ROES', link: '/', icon: ''},
              {name: 'Créditos por Analista', link: '/', icon: ''},
              {name: 'Nuevos Certificados', link: '/', icon: ''},
              {name: 'Consultas Transacciones', link: '/', icon: ''},
              {name: 'Histórico Transacciones', link: '/', icon: ''},
              {name: 'Alertas', link: '/', icon: ''},
              {name: 'Información Riesgo', link: '/', icon: ''},
              {name: 'Bitácoras de Listas de Personas', link: '/', icon: ''},
              {name: 'Bitácoras de Consultas de Listas', link: '/', icon: ''},
              {name: 'Estadísticas Ingreso Listas', link: '/', icon: ''},
              {name: 'Clientes CRS', link: '/', icon: ''},
              {name: 'Reporte PEPs', link: '/', icon: ''},
              {name: 'Riesgo Fiscalizado', link: '/', icon: ''},
              {name: 'Revisión XML',
                link: '', 
                icon: '',
                children: [{name: 'Alertas', link: '/', icon: ''}, 
                          {name: 'Riesgos Clientes',link: '/', icon: ''},
                          {name: 'Productos y Servicios',link: '/', icon: ''},
                          {name: 'Zona Geográfica',link: '/', icon: ''},
                          {name: 'Canales Distribución',link: '/', icon: ''}
                          ]
              },
    ],
  }
];
  

@Component({
    templateUrl: '../menu.html',
    styleUrls: ['../../../assets/scss/app.scss',
                '../../../assets/scss/menus.scss'],
})
export class MenuCumplimientoComponent implements OnInit {
    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    userObservable: User;
    moduleObservable: Module;
    businessObservable: Compania;

    URLRedirectIndexContent: string = httpLandingIndexPage.indexHTTP;

    constructor(private accountService: AccountService, private router: Router,
      public translate: TranslateMessagesService) {

        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.businessObservable = this.accountService.businessValue;

        this.dataSource.data = TREE_DATA;
    }

    ngOnInit() {

      let treeMenu:string;
      
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
