import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutAdministratorComponent } from './layout.component';

import { AdminUserComponent } from './adminUserPage.component';
import { AdminBusinessComponent } from './adminBusinessPage.component';
import { ListUserComponent } from './listUserPage.component';
import { ListBusinessComponent } from './listBusinessPage.component';
import { AddEditUserComponent } from './addEditUserPage.component';
import { AddBusinessUserComponent } from './addBusinessUserPage.component';
import { AddRoleUserComponent } from './addRoleUserPage.component';
import { ConfigureBusinessComponent } from './configureBusinessPage.component';

import { AddEditBusinessComponent } from './addEditBusinessPage.component';
import { ListRoleComponent } from './listRolePage.component';

import { ListModuleComponent } from './listModulePage.component';
import { AddModuleRoleComponent } from './addModuleRolePage.component';

const routes: Routes = [
    {
        path: '', component: LayoutAdministratorComponent,
        children: [
            { path: '', component: LayoutAdministratorComponent },
            { path: 'AdminUserPage', component: AdminUserComponent },
            { path: 'AdminBusinessPage', component: AdminBusinessComponent },
            { path: 'AdminListUserPage', component: ListUserComponent },
            { path: 'AdminListBusinessPage', component: ListBusinessComponent },
            { path: 'AddEditUserPage', component: AddEditUserComponent },
            { path: 'AddEditUserPage/:id', component: AddEditUserComponent },
            { path: 'AddBusinessUserPage/:id', component: AddBusinessUserComponent },
            { path: 'AddRoleUserPage/:id', component: AddRoleUserComponent },
            { path: 'AddEditBusinessPage', component: AddEditBusinessComponent },
            { path: 'AddEditBusinessPage/:pidBusiness', component: AddEditBusinessComponent },
            { path: 'ConfigureBusinessPage/:pidBusiness', component: ConfigureBusinessComponent },
            { path: 'AdminListRolePage', component: ListRoleComponent },
            { path: 'AdminListModulePage/:pidBusiness', component: ListModuleComponent },
            { path: 'AdminListModulePage', component: ListModuleComponent },

            { path: 'AddModuleRolePage/:pidRole/:pnom/:pdesc/:pesadmin', component: AddModuleRoleComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }