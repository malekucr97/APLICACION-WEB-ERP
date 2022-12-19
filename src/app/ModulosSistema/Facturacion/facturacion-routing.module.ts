import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexFacturacionComponent } from './index.component';
import { MenuFacturacionComponent } from './menu.component';

const routes: Routes = [
    {
        path: '', component: MenuFacturacionComponent,
        children: [
            { path: '', component:              IndexFacturacionComponent },
            { path: 'index.html', component:    IndexFacturacionComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FacturacionRoutingModule { }
