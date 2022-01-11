import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexGeneralesComponent } from './index.component';
import { MenuGeneralesComponent } from './menu.component';
import { AddEditCompaniaComponent } from './parametros/addEditCompania-component';

const routes: Routes = [
    {
        path: '', component: MenuGeneralesComponent,
        children: [
            { path: '', component: MenuGeneralesComponent },
            { path: 'Index.html', component: IndexGeneralesComponent },
            { path: 'ConfiguracionCompania.html', component: AddEditCompaniaComponent },
            { path: 'ConfiguracionCompania/:exito/:message', component: AddEditCompaniaComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GeneralesRoutingModule { }
