import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const AdminModule = () => import('./LayoutAdministrator/admin-module').then(x => x.AdminModule);
const LandingModule = () => import('./Landing/landing-module').then(x => x.LandingModule);
const GeneralesModule = () => import('./Generales/generales-module').then(x => x.GeneralesModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },

    { path: '_AdminModule', loadChildren: AdminModule, canActivate: [AuthGuard] },
    { path: '_LandingModule', loadChildren: LandingModule, canActivate: [AuthGuard] },
    { path: '_GeneralesModule', loadChildren: GeneralesModule, canActivate: [AuthGuard] },

    // redirección a Home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
