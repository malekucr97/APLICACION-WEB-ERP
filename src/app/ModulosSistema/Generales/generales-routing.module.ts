import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexGeneralesComponent } from './index.component';
import { MenuGeneralesComponent } from './menu.component';
import { ConfigurationCompaniaComponent } from './parametros/ConfigurationCompania-component';

const routes: Routes = [
    {
        path: '', component: MenuGeneralesComponent,
        children: [
            { path: '', component: MenuGeneralesComponent },
            { path: 'Index.html', component: IndexGeneralesComponent },
            { path: 'ConfiguracionCompania.html', component: ConfigurationCompaniaComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GeneralesRoutingModule { }
