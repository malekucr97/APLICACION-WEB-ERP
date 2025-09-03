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
import { ListBusinessComponent } from './business/listBusinessPage.component';
import { AddEditBusinessComponent } from './business/addEditBusinessPage.component';
import { AddBusinessUserComponent } from './business/addBusinessUserPage.component';
// -- roles
import { ListRoleComponent } from './role/listRolePage.component';
import { AddRoleUserComponent } from './role/addRoleUserPage.component';

// -- modulos
import { ListModuleComponent } from './module/listModulePage.component';
import { AddModuleRoleComponent } from './module/addModuleRolePage.component';
import { ListModuleBusinessComponent } from './module/listModuleBusinessPage.component';
import { AddAccessUserModuleComponent } from './module/addAccessUserModulePage.component';
import { AdminmoduleComponent } from './module/adminmodule/adminmodule.component';
import { AddEditRolComponent } from './role/addEditRolPage.component';
import { TranslateModule } from '@ngx-translate/core';
import { ListPlanComponent } from './plan/listPlanPage.component';
import { AddEditPlanComponent } from './plan/addEditPlanPage.component';
import { SharedModule } from '@app/_shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AdminRoutingModule,
        SharedModule,
        TranslateModule.forChild()
    ],
    declarations: [
        LayoutAdministratorComponent,
        AdminUserComponent,
        AddEditUserComponent,
        ListUserComponent,
        ListBusinessComponent,
        AddEditPlanComponent,
        ListPlanComponent,
        AddBusinessUserComponent,
        AddRoleUserComponent,
        AddEditBusinessComponent,
        ListRoleComponent,
        ListModuleComponent,
        ListModuleBusinessComponent,
        AddModuleRoleComponent,
        AddAccessUserModuleComponent,
        AdminmoduleComponent,
        AddEditRolComponent
    ]
})
export class AdminModule { }
