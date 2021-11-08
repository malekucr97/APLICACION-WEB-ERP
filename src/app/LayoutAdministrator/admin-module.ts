import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';

import { LayoutAdministratorComponent } from './layout.component';
import { AdminUserComponent } from './adminUserPage.component';
import { AdminBusinessComponent } from './adminBusinessPage.component';
import { AddEditUserComponent } from './addEditUserPage.component';
import { ListUserComponent } from './listUserPage.component';
import { ListBusinessComponent } from './listBusinessPage.component';
import { AddBusinessUserComponent } from './addBusinessUserPage.component';
import { AddRoleUserComponent } from './addRoleUserPage.component';
import { ConfigureBusinessComponent } from './configureBusinessPage.component';
import { AddEditBusinessComponent } from './addEditBusinessPage.component';
import { ListRoleComponent } from './listRolePage.component';
import { ListModuleComponent } from './listModulePage.component';
import { AddModuleRoleComponent } from './addModuleRolePage.component';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AdminRoutingModule
    ],
    declarations: [
        LayoutAdministratorComponent,
        AdminUserComponent,
        AdminBusinessComponent,
        AddEditUserComponent,
        ListUserComponent,
        ListBusinessComponent,
        AddBusinessUserComponent,
        AddRoleUserComponent,
        ConfigureBusinessComponent,
        AddEditBusinessComponent,
        ListRoleComponent,
        ListModuleComponent,
        AddModuleRoleComponent
    ]
})
export class AdminModule { }
