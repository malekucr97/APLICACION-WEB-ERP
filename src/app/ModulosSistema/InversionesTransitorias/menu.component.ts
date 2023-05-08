import { Component, ViewChild, OnInit } from '@angular/core';
import { AccountService, GeneralesService } from '@app/_services';
import { MatSidenav } from '@angular/material/sidenav';
import { Module, User } from '@app/_models';
import { httpLandingIndexPage } from '../../../environments/environment-access-admin';
import { Router } from '@angular/router';

import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import { Compania } from '../../_models/modules/compania';

import { ModulesSystem } from '@environments/environment';

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
               children: [{name: 'Grupos',      link: ModulesSystem.cumplimientobasehref + '', icon: ''}, 
                          {name: 'Criterios',   link: '/', icon: ''},
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
              {name: 'Riesgo Fiscalizado', link: '/', icon: ''},
              {name: 'Revisión XML',
                link: '', 
                icon: '',
                children: [{name: 'Alertas', link: '/', icon: ''}, 
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
export class MenuInversionesComponent implements OnInit {
    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    userObservable: User;
    moduleObservable: Module;
    businessObservable: Compania;

    URLRedirectIndexContent: string = httpLandingIndexPage.indexHTTP;

    constructor(private accountService: AccountService, private router: Router) {

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
