import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';

import { IndexContentPageComponent } from './indexContentPage.component';

import { PendingUserPageComponent } from './nouser/pendingPage.component';
import { NotRolPageComponent } from './nouser/notRolPage.component';
import { InactiveUserPageComponent } from './nouser/inactiveUserPage.component';
import { InactiveRolPageComponent } from './nouser/inactiveRolPage.component';
import { NotBusinessUserPageComponent } from './nouser/notBusinessUserPage.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: LayoutComponent },
            // -- contenido de la aplicación
            { path: 'IndexContentPage', component: IndexContentPageComponent },
            // -- landing no application
            { path: 'PendingPage/NoLogin/Index.html', component: PendingUserPageComponent },
            { path: 'NotRolPage/NoLogin/Index.html', component: NotRolPageComponent },
            { path: 'InactiveUserPage/NoLogin/Index.html', component: InactiveUserPageComponent },
            { path: 'InactiveRolPage/NoLogin/Index.html', component: InactiveRolPageComponent },
            { path: 'NotBusinessPage/NoLogin/Index.html', component: NotBusinessUserPageComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LandingRoutingModule { }
