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
const MacredModule = () => import(
    './ModulosSistema/Macred/macred-module').then( x => x.MacredModule ); // ## MACRED ## //
const RiesgoCreditoModule = () => import(
    './ModulosSistema/RiesgoCredito/riesgo-credito-module').then( x => x.RiesgoCreditoModule ); // ## R.C ## //

const routes: Routes = [

    { path: '', component: HomeComponent, canActivate: [AuthGuard] },

    // -- index - landings pages
    { path: 'maleku-ti',  loadChildren: LandingModule,  canActivate: [AuthGuard] },
    // ## **************** ## //

    // -- Acicacion de usuario
    { path: 'activate', component: ActivateUserPageComponent },

    // -- inicio se sesión & pantallas de administración
    { path: 'account', loadChildren: accountModule },
    { path: 'admin-module', loadChildren: AdminModule, canActivate: [AuthGuard] },
    { path: 'maleku-ti/general-module', loadChildren: GeneralesModule, canActivate: [AuthGuard] },
    { path: 'maleku-ti/powerbi-module', loadChildren: PowerBiModule, canActivate: [AuthGuard] },
    { path: 'maleku-ti/macred-module', loadChildren: MacredModule, canActivate: [AuthGuard] },
    { path: 'maleku-ti/riesgo-credito-module', loadChildren: RiesgoCreditoModule, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' } // default
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
