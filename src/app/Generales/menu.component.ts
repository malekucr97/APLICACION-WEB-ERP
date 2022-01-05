import { Component, ViewChild } from '@angular/core';
import { AccountService } from '@app/_services';
import { MatSidenav } from '@angular/material/sidenav';
import { Business, Module, User } from '@app/_models';
import { httpAccessPage } from '../../environments/environment';
import { Router } from '@angular/router';

import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

 interface FoodNode { name: string; link: string; icon: string; children?: FoodNode[]; }
 interface ExampleFlatNode { expandable: boolean; name: string; link?: string; icon?: string; level: number; }
  
  // Datos del Arbol
  const TREE_DATA: FoodNode[] = [{
      name: 'Parámetros',
      link: '',
      icon: '',
      children: [{name: 'Generales', link: '/', icon: ''},//settings 
                {name: 'Compañías',link: '/_GeneralesModule/ConfiguracionCompania.html', icon: ''}//store
      ],
    },
    {
      name: 'Monedas',
      link: '',
      icon: '',
      children: [{name: 'Tipos de Monedas', link: '/', icon: ''},//monetization_on
                {name: 'Tipos de Cambio', link: '/', icon: ''}//insert_chart
      ],
    },
    {
      name: 'Documentos',
      link: '/',
      icon: ''//folder
    },
    {
      name: 'Periodos',
      link: '/',
      icon: ''//date_range
    },
  ];
  



@Component({
    templateUrl: 'menu.html',
    styleUrls: ['../../assets/scss/menus.scss'],
})
export class MenuGeneralesComponent {
    @ViewChild(MatSidenav)
    sidenav !: MatSidenav;

    userObservable: User;
    moduleObservable: Module;
    businessObservable: Business;

    URLRedirectIndexContent: string;

    constructor(private accountService: AccountService,
      private router: Router) {

        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.businessObservable = this.accountService.businessValue;

        this.URLRedirectIndexContent = httpAccessPage.urlContentIndex;

        this.dataSource.data = TREE_DATA;
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


  ngOnInit() {

    // this.sidenav.toggle();
  }




  redireccionamientoMenu(linkRedireccionMenu: string) {

    // this.ngOnInit();
    this.router.navigate([linkRedireccionMenu]);

    
  }

  logout() { this.accountService.logout(); }
}
