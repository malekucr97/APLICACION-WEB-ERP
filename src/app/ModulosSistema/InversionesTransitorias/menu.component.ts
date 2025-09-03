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

 interface FoodNode { name: string; link: string; icon: string; children?: FoodNode[]; }
 interface ExampleFlatNode { expandable: boolean; name: string; link?: string; icon?: string; level: number; }



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

    TREE_DATA: FoodNode[] = [{
      name: this.translate.translateKey('MODULES.INVERSIONES_TRANSITORIAS.menu_maintenances'),
      link: '',
      icon: '',
      children: [ {name: this.translate.translateKey('MODULES.INVERSIONES_TRANSITORIAS.menu_currencyTypes'), link: /*ModulesSystem.inversionesbasehref*/ '' + 'mantenimientos/tipos-monedas.html', icon: ''},
                  {name: this.translate.translateKey('MODULES.INVERSIONES_TRANSITORIAS.menu_personTypes'), link: /*ModulesSystem.inversionesbasehref*/ '' + 'mantenimientos/tipos-personas.html', icon: ''},
                  {name: this.translate.translateKey('MODULES.INVERSIONES_TRANSITORIAS.menu_yearTypes'), link: /*ModulesSystem.inversionesbasehref*/ '' + 'mantenimientos/tipos-anios.html', icon: ''},
                  {name: this.translate.translateKey('MODULES.INVERSIONES_TRANSITORIAS.menu_rates'), link: /*ModulesSystem.inversionesbasehref*/ '' + 'mantenimientos/tasas.html', icon: ''},
                  {name: this.translate.translateKey('MODULES.INVERSIONES_TRANSITORIAS.menu_cdpsTitles'), link: /*ModulesSystem.inversionesbasehref*/ '' + 'mantenimientos/titulos.html', icon: ''},
                  {name: this.translate.translateKey('MODULES.INVERSIONES_TRANSITORIAS.menu_periodicities'), link: /*ModulesSystem.inversionesbasehref*/ '' + 'mantenimientos/periocidades.html', icon: ''},
                  {name: this.translate.translateKey('MODULES.INVERSIONES_TRANSITORIAS.menu_marketsAndSectors'), link: /*ModulesSystem.inversionesbasehref*/ '' + 'mantenimientos/tmercados-tsectores.html', icon: ''},
                  {name: this.translate.translateKey('MODULES.INVERSIONES_TRANSITORIAS.menu_investmentClassesAndTerms'), link: /*ModulesSystem.inversionesbasehref*/ '' + 'mantenimientos/clasesplazos-inversiones.html', icon: ''},
                  {name: this.translate.translateKey('MODULES.INVERSIONES_TRANSITORIAS.menu_issuers'), link: /*ModulesSystem.inversionesbasehref*/ '' + 'mantenimientos/emisores.html', icon: ''},
                  {name: this.translate.translateKey('MODULES.INVERSIONES_TRANSITORIAS.menu_persons'), link: /*ModulesSystem.inversionesbasehref*/ '' + 'mantenimientos/personas.html', icon: ''}]
    },
    {
      name: this.translate.translateKey('MODULES.INVERSIONES_TRANSITORIAS.menu_transactions'),
      link: '',
      icon: '',
      children: [{name: this.translate.translateKey('MODULES.INVERSIONES_TRANSITORIAS.menu_termOperations'), 
                  link: '',
                  icon: '', 
                  children: [ {name: this.translate.translateKey('MODULES.INVERSIONES_TRANSITORIAS.menu_inclusionOfOperations'), link: /*ModulesSystem.inversionesbasehref*/ '' + 'transacciones/operaciones-plazo/inclusionoperaciones-inversiones.html', icon: ''}]
                }],
    }
    //,
    // {
    //   name: 'Reportes',
    //   link: '',
    //   icon: '',
    //   children: [{name: 'Calificación Riesgo',
    //               link: '', 
    //               icon: '',
    //               children: [{name: 'Calificación Horizontal', link: '/', icon: ''}, 
    //                         {name: 'Calificación General por Cliente',link: '/', icon: ''},
    //                         {name: 'Cambios de Categoría',link: '/', icon: ''}
    //                         ]
    //             },
    //             {name: 'Certificados Cancelados Anticipadamente', link: '/', icon: ''},
    //             {name: 'Mayores Inversionistas', link: '/', icon: ''},
    //             {name: 'Mantenimiento ROES', link: '/', icon: ''},
    //             {name: 'Riesgo Fiscalizado', link: '/', icon: ''},
    //             {name: 'Revisión XML',
    //               link: '', 
    //               icon: '',
    //               children: [{name: 'Alertas', link: '/', icon: ''}, 
    //                         {name: 'Canales Distribución',link: '/', icon: ''}
    //                         ]
    //             },
    //   ],
    // }
  ];
    

    constructor(
      private accountService: AccountService, 
      private router: Router,
      public translate: TranslateMessagesService
      ) {

        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.businessObservable = this.accountService.businessValue;

        this.dataSource.data = this.TREE_DATA;
    }

    ngOnInit() { }

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

  logout() { this.accountService.logout(); }
}
