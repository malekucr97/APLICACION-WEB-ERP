import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexInventarioComponent } from './index.component';
import { MenuInventarioComponent } from './menu.component';

const routes: Routes = [
    {
        path: '', component: MenuInventarioComponent,
        children: [
            { path: '', component:              IndexInventarioComponent },
            { path: 'index.html', component:    IndexInventarioComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InventarioRoutingModule { }
