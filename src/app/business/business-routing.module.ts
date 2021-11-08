import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { BusinessIndex } from './businessIndex';
import { ListComponent } from './list.component';
import { BusinessComponent } from './business.component';

// import { RegisterComponent } from './register.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: ListComponent },
            { path: 'businessAdmin', component: BusinessComponent },
            { path: 'businessIndex', component: BusinessIndex },
            // { path: 'registrar', component: RegisterComponent },
            { path: 'listaEmpresas', component: ListComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BusinessRoutingModule { }