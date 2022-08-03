import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexCuentasCobrarComponent } from './index.component';
import { MenuCuentasCobrarComponent } from './menu.component';

const routes: Routes = [
    {
        path: '', component: MenuCuentasCobrarComponent,
        children: [
            { path: '', component: MenuCuentasCobrarComponent },
            { path: 'Index.html', component: IndexCuentasCobrarComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CuentasCobrarRoutingModule { }
