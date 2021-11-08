import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add-edit.component';


import { RegisterUserComponent } from './register.component';
import { AdminUserComponent } from './adminUser.component';
// import {AddBusinessComponent} from './addbusiness.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: LayoutComponent },
            { path: 'AdministracionUsuarios', component: AdminUserComponent },
            { path: 'AdministracionUsuarios/RegistrarUsuarios', component: RegisterUserComponent },
            { path: 'edit/:id', component: AddEditComponent },
            { path: 'indexAdmin', component: AdminUserComponent },
            // { path: 'addBusiness/:id/:nombre', component: AddBusinessComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }