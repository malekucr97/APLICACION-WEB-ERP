import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



import { LayoutGeneralesComponent } from './layout.component';
import { MenuGeneralesComponent } from './menuGeneralesPage.component';


const routes: Routes = [
    {
        path: '', component: LayoutGeneralesComponent,
        children: [
            { path: '', component: LayoutGeneralesComponent },
            { path: 'MenuGenerales', component: MenuGeneralesComponent },
        ]
    }
];



@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class GeneralesRoutingModule { }