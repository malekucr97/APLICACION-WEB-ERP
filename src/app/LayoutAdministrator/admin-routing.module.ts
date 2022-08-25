import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// -- core principal
import { LayoutAdministratorComponent } from './layout.component';
// -- usuarios
import { AdminUserComponent } from './user/adminUserPage.component';
import { ListUserComponent } from './user/listUserPage.component';
import { AddEditUserComponent } from './user/addEditUserPage.component';
// -- empresa
import { AdminBusinessComponent } from './business/adminBusinessPage.component';
import { AddEditBusinessComponent } from './business/addEditBusinessPage.component';
import { ListBusinessComponent } from './business/listBusinessPage.component';
import { AddBusinessUserComponent } from './business/addBusinessUserPage.component';
// -- roles
import { AddRoleUserComponent } from './role/addRoleUserPage.component';
import { ListRoleComponent } from './role/listRolePage.component';
// -- modulos
import { ListModuleComponent } from './module/listModulePage.component';
import { AddModuleRoleComponent } from './module/addModuleRolePage.component';
import { ListModuleBusinessComponent } from './module/listModuleBusinessPage.component';

// **********************************************
// ## ********** RUTAS MÓDULOS SISTEMA **********
// ********************************************** 

// ## ********* GENERALES -> PARÁMETROS********* ## //
import { ConfigurationCompaniaComponent } from '../ModulosSistema/Generales/parametros/ConfigurationCompania-component';

const routes: Routes = [
    {
        path: '', component: LayoutAdministratorComponent,
        children: [
            // -- layout principal
            { path: '', component: LayoutAdministratorComponent },
            // -- usuarios
            { path: 'AdminUserPage', component: AdminUserComponent },
            { path: 'AdminListUserPage', component: ListUserComponent },
            { path: 'AddEditUserPage', component: AddEditUserComponent },
            { path: 'AddEditUserPage/:id', component: AddEditUserComponent },
            // -- empresa
            { path: 'AdminBusinessPage', component: AdminBusinessComponent },
            { path: 'AddEditBusinessPage', component: AddEditBusinessComponent },
            { path: 'AddEditBusinessPage/:pidBusiness', component: AddEditBusinessComponent },
            { path: 'AdminListBusinessPage', component: ListBusinessComponent },
            { path: 'AddBusinessUserPage/:id', component: AddBusinessUserComponent },
            
            // -- roles
            { path: 'AddRoleUserPage/:id', component: AddRoleUserComponent },
            { path: 'AdminListRolePage', component: ListRoleComponent },
            // -- modulos
            { path: 'AdminListModuleBusinessPage/:pidBusiness', component: ListModuleBusinessComponent },
            { path: 'AdminListModulePage', component: ListModuleComponent },
            { path: 'AddModuleRolePage/:pidRole', component: AddModuleRoleComponent },

            // ## ********* GENERALES -> PARÁMETROS********* ## //
            { path: 'ConfiguracionCompania/:pidBusiness', component: ConfigurationCompaniaComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
