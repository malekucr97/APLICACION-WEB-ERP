import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { PendingPageComponent } from './pendingPage.component';
import { BusinessPageComponent } from './businessPage.component';
import { NotRolPageComponent } from './notRolPage.component';
import { InactiveUserPageComponent } from './inactiveUserPage.component';
import { InactiveRolPageComponent } from './inactiveRolPage.component';
import { NotBusinessPageComponent } from './notBusinessPage.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: LayoutComponent },
            { path: 'PendingPage', component: PendingPageComponent },
            { path: 'BusinessPage', component: BusinessPageComponent },
            { path: 'NotRolPage', component: NotRolPageComponent },
            { path: 'InactiveUserPage', component: InactiveUserPageComponent },
            { path: 'InactiveRolPage', component: InactiveRolPageComponent },
            { path: 'NotBusinessPage', component: NotBusinessPageComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LandingRoutingModule { }