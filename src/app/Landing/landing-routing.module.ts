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
            { path: '', component: LayoutComponent },
            
            // *********************************
            // Index.html **
            // *********************************
            { path: 'IndexContentPage.html', component: IndexContentPageComponent },
            // *********************************
            
            // Usuario pendiente de activación
            { path: 'PendingPage/Index.html', component: PendingUserPageComponent },
            // Usuario sin rol
            { path: 'NotRolPage/Index.html', component: NotRolPageComponent },
            // Usuario inactivo
            { path: 'InactiveUserPage/Index.html', component: InactiveUserPageComponent },
            // Rol de usuario inactivo 
            { path: 'InactiveRolPage/Index.html', component: InactiveRolPageComponent },
            // Usuario sin compañía
            { path: 'NotBusinessPage/Index.html', component: NotBusinessUserPageComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LandingRoutingModule { }
