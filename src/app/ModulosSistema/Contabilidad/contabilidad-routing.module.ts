import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexContabilidadComponent } from './index.component';
import { MenuContabilidadComponent } from './menu.component';

const routes: Routes = [
    {
        path: '', component: MenuContabilidadComponent,
        children: [
            { path: '', component:              IndexContabilidadComponent },
            { path: 'index.html', component:    IndexContabilidadComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContabilidadRoutingModule { }
