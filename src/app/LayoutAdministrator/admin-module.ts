import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// -- core principal
import { AdminRoutingModule } from './admin-routing.module';
import { LayoutAdministratorComponent } from './layout.component';

// -- usuarios
import { AdminUserComponent } from './user/adminUserPage.component';
import { AddEditUserComponent } from './user/addEditUserPage.component';
import { ListUserComponent } from './user/listUserPage.component';

// -- empresa
import { AdminBusinessComponent } from './business/adminBusinessPage.component';
import { ListBusinessComponent } from './business/listBusinessPage.component';
import { AddEditBusinessComponent } from './business/addEditBusinessPage.component';
import { AddBusinessUserComponent } from './business/addBusinessUserPage.component';

// -- roles
import { ListRoleComponent } from './role/listRolePage.component';
import { AddRoleUserComponent } from './role/addRoleUserPage.component';

// -- modulos
import { ListModuleComponent } from './module/listModulePage.component';
import { AddModuleRoleComponent } from './module/addModuleRolePage.component';

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
        AddEditBusinessComponent,
        ListRoleComponent,
        ListModuleComponent,
        AddModuleRoleComponent
    ]
})
export class AdminModule { }
