import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { ActivateUserPageComponent } from './Landing/nologgin/activateUserPage.component';
import { AuthGuard } from './_helpers';

const accountModule         = () => import('./account/account.module').then(            x => x.AccountModule);
const AdminModule           = () => import('./LayoutAdministrator/admin-module').then(  x => x.AdminModule);
const LandingModule         = () => import('./Landing/landing-module').then(            x => x.LandingModule);

const GeneralesModule = () => import(
    './ModulosSistema/Generales/generales-module').then( x => x.GeneralesModule ); // ## GENERALES ## //
    const PowerBiModule = () => import(
    './ModulosSistema/PowerBI/power-bi.module').then( x => x.PowerBiModule ); // ## POWER BI ## //

const routes: Routes = [

    { path: '', component: HomeComponent, canActivate: [AuthGuard] },

    // -- index - landings pages
    { path: 'inra-sa',  loadChildren: LandingModule,  canActivate: [AuthGuard] },
    // ## **************** ## //

    // -- Acicacion de usuario
    { path: 'activate', component: ActivateUserPageComponent },

    // -- inicio se sesión & pantallas de administración
    { path: 'account', loadChildren: accountModule },
    { path: 'admin-module', loadChildren: AdminModule, canActivate: [AuthGuard] },
    { path: 'inra-sa/general-module', loadChildren: GeneralesModule, canActivate: [AuthGuard] },
    { path: 'inra-sa/powerbi-module', loadChildren: PowerBiModule, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' } // default
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
