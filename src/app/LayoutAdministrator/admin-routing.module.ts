import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// -- core principal
import { LayoutAdministratorComponent } from './layout.component';
// -- usuarios
import { AdminUserComponent } from './user/adminUserPage.component';
import { ListUserComponent } from './user/listUserPage.component';
import { AddEditUserComponent } from './user/addEditUserPage.component';
// -- empresa
// import { AdminBusinessComponent } from './business/adminBusinessPage.component';
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
// -- planes
import { ListPlanComponent } from './plan/listPlanPage.component';
import { AddEditPlanComponent } from './plan/addEditPlanPage.component';

// **********************************************
// ## ********** RUTAS MÓDULOS SISTEMA **********
// **********************************************

// ## ********* GENERALES -> PARÁMETROS********* ## //
import { ConfigurationCompaniaComponent } from '../ModulosSistema/Generales/parametros/ConfigurationCompania-component';
import { AddAccessUserModuleComponent } from './module/addAccessUserModulePage.component';
import { AdminmoduleComponent } from './module/adminmodule/adminmodule.component';
import { AddEditRolComponent } from './role/addEditRolPage.component';

const routes: Routes = [
    {
        path: '', component: LayoutAdministratorComponent,
        children: [
            // -- layout principal
            { path: '', component: LayoutAdministratorComponent },
            // -- usuarios
            { path: 'adminpage-indexadmin.html', component: AdminUserComponent },
            { path: 'adminpage-listusers.html', component: ListUserComponent },
            { path: 'adminpage-addedituser.html', component: AddEditUserComponent },
            { path: 'adminpage-addedituser.html/:pidentificationUser', component: AddEditUserComponent },
            { path: 'adminpage-addbusinessuser.html/:pidentificationUser', component: AddBusinessUserComponent },
            // -- empresa
            // { path: 'AdminBusinessPage', component: AdminBusinessComponent },
            { path: 'adminpage-addeditbusiness.html', component: AddEditBusinessComponent },
            { path: 'adminpage-addeditbusiness.html/:pidBusiness', component: AddEditBusinessComponent },
            { path: 'adminpage-listbusiness.html', component: ListBusinessComponent },
            { path: 'adminpage-addeditrol.html', component: AddEditRolComponent },
            // -- plan
            { path: 'adminpage-listplan.html/:pidBusiness', component: ListPlanComponent },
            { path: 'adminpage-listplan.html', component: ListPlanComponent },
            { path: 'adminpage-addeditplan.html', component: AddEditPlanComponent },
            { path: 'adminpage-addeditplan.html/:pidPlan', component: AddEditPlanComponent },
            // -- roles
            { path: 'adminpage-addroleuser.html/:pidentificationUser', component: AddRoleUserComponent },
            { path: 'adminpage-listroles.html', component: ListRoleComponent },
            { path: 'adminpage-addroleuser.html/:pidentificationUser', component: AddRoleUserComponent },
            // -- modulos
            { path: 'adminpage-listmodulebusiness.html/:pidBusiness', component: ListModuleBusinessComponent },
            { path: 'adminpage-listmodules.html', component: ListModuleComponent },
            { path: 'adminpage-addmodulerol.html/:pidRole', component: AddModuleRoleComponent },
            { path: 'adminpage-addaccessuserpagemodule.html/:pidModule', component: AddAccessUserModuleComponent },
            { path: 'adminpage-adminmodule.html/:tipoMantenimiento', component: AdminmoduleComponent },

            // ## ********* GENERALES -> PARÁMETROS********* ## //
            { path: 'CompanySettings.html', component: ConfigurationCompaniaComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
