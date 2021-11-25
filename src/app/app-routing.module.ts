import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const accountModule         = () => import('./account/account.module').then(            x => x.AccountModule);
const AdminModule           = () => import('./LayoutAdministrator/admin-module').then(  x => x.AdminModule);
const LandingModule         = () => import('./Landing/landing-module').then(            x => x.LandingModule);
// -- módulos del sistema
const GeneralesModule       = () => import('./Generales/generales-module').then(        x => x.GeneralesModule);
const ActivosFijosModule    = () => import('./ActivosFijos/activos-module').then(       x => x.ActivosFijosModule);
const BancosModule          = () => import('./Bancos/bancos-module').then(              x => x.BancosModule);
const ContabilidadModule    = () => import('./Contabilidad/contabilidad-module').then(  x => x.ContabilidadModule);
const CuentasCobrarModule   = () => import('./CuentasCobrar/cuentascobrar-module').then(x => x.CuentasCobrarModule);
const CuentasPagarModule    = () => import('./CuentasPagar/cuentaspagar-module').then(  x => x.CuentasPagarModule);
const FacturacionModule     = () => import('./Facturacion/facturacion-module').then(    x => x.FacturacionModule);
const InventarioModule      = () => import('./Inventario/inventario-module').then(      x => x.InventarioModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'account',              loadChildren: accountModule },
    // -- módulos del sistema
    { path: '_AdminModule',         loadChildren: AdminModule,          canActivate: [AuthGuard] },
    { path: '_LandingModule',       loadChildren: LandingModule,        canActivate: [AuthGuard] },
    { path: '_GeneralesModule',     loadChildren: GeneralesModule,      canActivate: [AuthGuard] },
    { path: '_ActivosFijosModule',  loadChildren: ActivosFijosModule,   canActivate: [AuthGuard] },
    { path: '_BancosModule',        loadChildren: BancosModule,         canActivate: [AuthGuard] },
    { path: '_ContabilidadModule',  loadChildren: ContabilidadModule,   canActivate: [AuthGuard] },
    { path: '_CuentasCobrarModule', loadChildren: CuentasCobrarModule,  canActivate: [AuthGuard] },
    { path: '_CuentasPagarModule',  loadChildren: CuentasPagarModule,   canActivate: [AuthGuard] },
    { path: '_FacturacionModule',   loadChildren: FacturacionModule,    canActivate: [AuthGuard] },
    { path: '_InventarioModule',    loadChildren: InventarioModule,     canActivate: [AuthGuard] },
    // -- redirección a Home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
