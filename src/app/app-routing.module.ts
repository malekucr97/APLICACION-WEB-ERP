import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const _AdminModule = () => import('./LayoutAdministrator/admin-module').then(x => x.AdminModule);






const accountModule = () => import('./account/account.module').then(x => x.AccountModule);

const _UserModule = () => import('./users/users.module').then(x => x.UsersModule);

const _BusinessModule = () => import('./business/business-module').then(x => x.BusinessModule);

const _LandingModule = () => import('./Landing/landing-module').then(x => x.LandingModule);

const _RoleModule = () => import('./role/role.module').then(x => x.RoleModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },

    { path: '_AdminModule', loadChildren: _AdminModule },
    { path: '_UserModule', loadChildren: _UserModule, canActivate: [AuthGuard] },
    { path: '_BusinessModule', loadChildren: _BusinessModule },


    // { path: 'users', loadChildren: _UserModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },

    { path: '_LandingModule', loadChildren: _LandingModule },
    { path: '_RoleModule', loadChildren: _RoleModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }