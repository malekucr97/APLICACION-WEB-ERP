import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexCuentasPagarComponent } from './index.component';
import { MenuCuentasPagarComponent } from './menu.component';

const routes: Routes = [
    {
        path: '', component: MenuCuentasPagarComponent,
        children: [
            { path: '', component: MenuCuentasPagarComponent },
            { path: 'Index.html', component: IndexCuentasPagarComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CuentasPagarRoutingModule { }
