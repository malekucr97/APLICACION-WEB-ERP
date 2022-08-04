import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';

import { IndexContentPageComponent } from './indexContentPage.component';

import { PendingUserPageComponent } from './nologgin/pendingPage.component';
import { NotRolPageComponent } from './nologgin/notRolPage.component';
import { InactiveUserPageComponent } from './nologgin/inactiveUserPage.component';
import { InactiveRolPageComponent } from './nologgin/inactiveRolPage.component';
import { NotBusinessUserPageComponent } from './nologgin/notBusinessUserPage.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: IndexContentPageComponent },
            
            // *********************************
            // Index.html **
            // *********************************
            { path: 'index.html', component: IndexContentPageComponent },
            // *********************************
            
            // Usuario pendiente de activación
            { path: 'PendingPage/index.html', component: PendingUserPageComponent },
            // Usuario sin rol
            { path: 'NotRolPage/index.html', component: NotRolPageComponent },
            // Usuario inactivo
            { path: 'InactiveUserPage/index.html', component: InactiveUserPageComponent },
            // Rol de usuario inactivo 
            { path: 'InactiveRolPage/index.html', component: InactiveRolPageComponent },
            // Usuario sin compañía
            { path: 'NotBusinessPage/index.html', component: NotBusinessUserPageComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LandingRoutingModule { }
