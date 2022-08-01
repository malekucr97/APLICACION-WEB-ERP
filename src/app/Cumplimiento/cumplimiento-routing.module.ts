import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexCumplimientoComponent } from './index.component';
import { MenuCumplimientoComponent } from './menu.component';

const routes: Routes = [
    {
        path: '', component: MenuCumplimientoComponent,
        children: [
            { path: '', component: MenuCumplimientoComponent },
            { path: 'Index.html', component: IndexCumplimientoComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CumplimientoRoutingModule { }
