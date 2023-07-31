import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// -- core principal
import { AdminRoutingModule } from './admin-routing.module';
import { LayoutAdministratorComponent } from './layout.component';
// -- usuarios
import { AdminUserComponent } from './user/adminUserPage.component';
import { AddEditUserComponent } from './user/addEditUserPage.component';
import { ListUserComponent } from './user/listUserPage.component';
// -- empresa
// import { AdminBusinessComponent } from './business/adminBusinessPage.component';
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
import { MatButtonModule } from '@angular/material/button';
import { AddAccessUserModuleComponent } from './module/addAccessUserModulePage.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { AdminmoduleComponent } from './module/adminmodule/adminmodule.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AdminRoutingModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,

        MatTreeModule,
        MatTooltipModule,

        FormsModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatCheckboxModule,

        MatDialogModule,
        MatFormFieldModule,
        MatListModule
    ],
    declarations: [
        LayoutAdministratorComponent,
        AdminUserComponent,
        AddEditUserComponent,
        ListUserComponent,
        ListBusinessComponent,
        AddBusinessUserComponent,
        AddRoleUserComponent,
        AddEditBusinessComponent,
        ListRoleComponent,
        ListModuleComponent,
        ListModuleBusinessComponent,
        AddModuleRoleComponent,
        AddAccessUserModuleComponent,
        AdminmoduleComponent
    ]
})
export class AdminModule { }
