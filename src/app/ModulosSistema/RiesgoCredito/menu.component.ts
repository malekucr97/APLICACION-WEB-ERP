import { Component, ViewChild, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';
import { MatSidenav } from '@angular/material/sidenav';
import { Module, User } from '@app/_models';
import { Router } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Compania } from '../../_models/modules/compania';
import { ModulesSystem, httpLandingIndexPage } from '@environments/environment';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

interface FoodNode {
  name: string;
  link: string;
  icon: string;
  children?: FoodNode[];
}
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  link?: string;
  icon?: string;
  level: number;
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Mantenimientos',
    link: '',
    icon: '',
    children: [
      { name: 'Entidades', link: ModulesSystem.riesgocreditobasehref + '/mantenimientos/entidades.html', icon: '' },
      { name: 'Porcentaje Estimación IHH', link: ModulesSystem.riesgocreditobasehref + '/mantenimientos/porcentajes-estimacion.html', icon: '', 
        children: [
          { name: 'Categorías', link: ModulesSystem.riesgocreditobasehref + '/mantenimientos/estimacionihh/porcentajes-estimacion-categoria.html', icon: '' },
          { name: 'Días de Atraso', link: ModulesSystem.riesgocreditobasehref + '/mantenimientos/estimacionihh/porcentajes-estimacion-dias.html', icon: '' }
        ]
       },
      { name: 'Carga de Datos Crédito', link: ModulesSystem.riesgocreditobasehref + '/mantenimientos/carga-datos-credito.html', icon: '' },
      { name: 'Carga de Datos Z-Altman Fórmulas', link: ModulesSystem.riesgocreditobasehref + '/mantenimientos/carga-zaltman-formulas.html', icon: '' },
      { name: 'Carga de Datos Z-Altman Datos', link: ModulesSystem.riesgocreditobasehref + '/mantenimientos/carga-zaltman-datos.html', icon: '' }
    ],
  },
  {
    name: 'Modelos de Riesgo',
    link: '',
    icon: '',
    children: [
      { name: 'Alfa Beta', link: ModulesSystem.riesgocreditobasehref + '/modelosriesgo/alfa-beta.html', icon: '' },
      { name: 'Histórico Alfa-Beta', link: ModulesSystem.riesgocreditobasehref + '/modelosriesgo/historico-alfa-beta.html', icon: '' },
      { name: 'IHH Crediticio', link: ModulesSystem.riesgocreditobasehref + '/modelosriesgo/ihh-crediticio.html', icon: '' },
      { name: 'Histórico IHH Crediticio', link: ModulesSystem.riesgocreditobasehref + '/modelosriesgo/historico-ihh-crediticio.html', icon: '' },
      { name: 'Transición', link: ModulesSystem.riesgocreditobasehref + '/modelosriesgo/transicion.html', icon: '' },
      { name: 'Z-Altman', link: ModulesSystem.riesgocreditobasehref + '/modelosriesgo/zaltman.html', icon: '' }
    ]
  }
];

@Component({templateUrl: '../menu.html',
            styleUrls: ['../../../assets/scss/menus.scss'],
            standalone: false
})
export class MenuRiesgoCreditoComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  userObservable: User;
  moduleObservable: Module;
  businessObservable: Compania;

  URLRedirectIndexContent: string = httpLandingIndexPage.indexHTTP;

  constructor(private accountService: AccountService, 
              private router: Router,
              public translate: TranslateMessagesService) {

    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.businessObservable = this.accountService.businessValue;
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() { }

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      link: node.link,
      icon: node.icon,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  logout() { this.accountService.logout(); }

  redirectIndex() : void { this.router.navigate([this.URLRedirectIndexContent]); }
}
