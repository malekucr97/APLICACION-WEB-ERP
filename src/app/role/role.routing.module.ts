import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutRoleComponent } from './layoutrole.component';
import {AdminRoleComponent} from './adminRole.component';
import {RegisterRoleComponent} from './register.component';


const routes: Routes = [
    {
        path: '', component: LayoutRoleComponent,
        children: [
            { path: '', component: LayoutRoleComponent },
            { path: 'AdministracionRoles', component: AdminRoleComponent },
            { path: 'AdministracionRoles/RegistrarRoles/:idempresa', component: RegisterRoleComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoleRoutingModule { }