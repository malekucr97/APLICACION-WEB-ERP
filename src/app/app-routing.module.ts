import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const accountModule         = () => import('./account/account.module').then(            x => x.AccountModule);
const AdminModule           = () => import('./LayoutAdministrator/admin-module').then(  x => x.AdminModule);
const LandingModule         = () => import('./Landing/landing-module').then(            x => x.LandingModule);

// ## ********* ACTIVOS FIJOS ********* ## //
const ActivosFijosModule    = () => import('./ModulosSistema/ActivosFijos/activos-module').then( x => x.ActivosFijosModule );
// ## ********* BANCOS ********* ## //
const BancosModule          = () => import('./ModulosSistema/Bancos/bancos-module').then( x => x.BancosModule );
// ## ********* CONTABILIDAD ********* ## //
const ContabilidadModule    = () => import('./ModulosSistema/Contabilidad/contabilidad-module').then( x => x.ContabilidadModule );
// ## ********* CUENTAS COBRAR ********* ## //
const CuentasCobrarModule   = () => import('./ModulosSistema/CuentasCobrar/cuentascobrar-module').then( x => x.CuentasCobrarModule );
// ## ********* CUENTAS PAGAR ********* ## //
const CuentasPagarModule    = () => import('./ModulosSistema/CuentasPagar/cuentaspagar-module').then( x => x.CuentasPagarModule );
// ## ********* FACTURACIÓN ********* ## //
const FacturacionModule     = () => import('./ModulosSistema/Facturacion/facturacion-module').then( x => x.FacturacionModule );
// ## ********* INVENTARIO ********* ## //
const InventarioModule      = () => import('./ModulosSistema/Inventario/inventario-module').then( x => x.InventarioModule );
// ## ********* GENERALES ********* ## //
const GeneralesModule       = () => import('./ModulosSistema/Generales/generales-module').then( x => x.GeneralesModule );
// ## ********* CUMPLIMIENTO ********* ## //
const CumplimientoModule    = () => import('./ModulosSistema/Cumplimiento/cumplimiento-module').then( x => x.CumplimientoModule );

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    // -- index & landings pages
    { path: '_',                    loadChildren: LandingModule,        canActivate: [AuthGuard] },
    // -- inicio se sesión & pantallas de administración
    { path: 'account',              loadChildren: accountModule },
    { path: '_AdminModule',         loadChildren: AdminModule,          canActivate: [AuthGuard] },
    // -- módulos del sistema
    { path: '_GeneralesModule',     loadChildren: GeneralesModule,      canActivate: [AuthGuard] },
    { path: '_ActivosFijosModule',  loadChildren: ActivosFijosModule,   canActivate: [AuthGuard] },
    { path: '_BancosModule',        loadChildren: BancosModule,         canActivate: [AuthGuard] },
    { path: '_ContabilidadModule',  loadChildren: ContabilidadModule,   canActivate: [AuthGuard] },
    { path: '_CuentasCobrarModule', loadChildren: CuentasCobrarModule,  canActivate: [AuthGuard] },
    { path: '_CuentasPagarModule',  loadChildren: CuentasPagarModule,   canActivate: [AuthGuard] },
    { path: '_FacturacionModule',   loadChildren: FacturacionModule,    canActivate: [AuthGuard] },
    { path: '_InventarioModule',    loadChildren: InventarioModule,     canActivate: [AuthGuard] },
    { path: '_CumplimientoModule',  loadChildren: CumplimientoModule,   canActivate: [AuthGuard] },
    
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
