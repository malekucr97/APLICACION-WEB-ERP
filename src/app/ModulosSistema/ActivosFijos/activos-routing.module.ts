import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexActivosFijosComponent } from './index.component';
import { MenuActivosFijosComponent } from './menu.component';

const routes: Routes = [
    {
        path: '', component: MenuActivosFijosComponent,
        children: [
            { path: '', component:              IndexActivosFijosComponent },
            { path: 'index.html', component:    IndexActivosFijosComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivosFijosRoutingModule { }
