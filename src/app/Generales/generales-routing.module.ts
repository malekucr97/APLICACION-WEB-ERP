import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutGeneralesComponent } from './layout.component';
import { IndexGeneralesComponent } from './indexGeneralesPage.component';

const routes: Routes = [
    {
        path: '', component: LayoutGeneralesComponent,
        children: [
            { path: '', component: LayoutGeneralesComponent },
            { path: 'IndexGeneralesPage', component: IndexGeneralesComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GeneralesRoutingModule { }
