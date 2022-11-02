import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexMacredComponent } from './index.component';
import { MenuMacredComponent } from './menu.component';

const routes: Routes = [
    {
        path: '', component: MenuMacredComponent,
        children: [
            { path: '', component: MenuMacredComponent },
            { path: 'Index.html', component: IndexMacredComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MacredRoutingModule { }
