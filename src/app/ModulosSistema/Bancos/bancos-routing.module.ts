import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexBancosComponent } from './index.component';
import { MenuBancosComponent } from './menu.component';

const routes: Routes = [
    {
        path: '', component: MenuBancosComponent,
        children: [
            { path: '', component:              IndexBancosComponent },
            { path: 'index.html', component:    IndexBancosComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BancosRoutingModule { }
