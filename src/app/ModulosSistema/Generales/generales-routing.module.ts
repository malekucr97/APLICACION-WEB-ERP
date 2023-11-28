import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexGeneralesComponent } from './index.component';
import { MenuGeneralesComponent } from './menu.component';
import { ConfigurationCompaniaComponent } from './parametros/ConfigurationCompania-component';
import { TipoCambioComponent } from './parametros/TipoCambio-component';

const routes: Routes = [
    {
        path: '', component: MenuGeneralesComponent,
        children: [
            { path: '', component:              IndexGeneralesComponent },
            { path: 'index.html', component:    IndexGeneralesComponent },
            { path: 'ConfiguracionCompania.html', component: ConfigurationCompaniaComponent },
            { path: 'TipoCambio.html', component: TipoCambioComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GeneralesRoutingModule { }
