import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const accountModule         = () => import('./account/account.module').then(            x => x.AccountModule);
const AdminModule           = () => import('./LayoutAdministrator/admin-module').then(  x => x.AdminModule);
const LandingModule         = () => import('./Landing/landing-module').then(            x => x.LandingModule);


const ActivosFijosModule = () => import(
    './ModulosSistema/ActivosFijos/activos-module').then( x => x.ActivosFijosModule );          // ## ACTIVOS FIJOS     ## //
const BancosModule = () => import(
    './ModulosSistema/Bancos/bancos-module').then( x => x.BancosModule );                       // ## BANCOS            ## //
const ContabilidadModule = () => import(
    './ModulosSistema/Contabilidad/contabilidad-module').then( x => x.ContabilidadModule );     // ## CONTABILIDAD      ## //
const CuentasCobrarModule = () => import(
    './ModulosSistema/CuentasCobrar/cuentascobrar-module').then( x => x.CuentasCobrarModule );  // ## CUENTAS COBRAR    ## //
const CuentasPagarModule = () => import(
    './ModulosSistema/CuentasPagar/cuentaspagar-module').then( x => x.CuentasPagarModule );     // ## CUENTAS PAGAR     ## //
const FacturacionModule = () => import(
    './ModulosSistema/Facturacion/facturacion-module').then( x => x.FacturacionModule );        // ## FACTURACIÓN       ## //
const InventarioModule = () => import(
    './ModulosSistema/Inventario/inventario-module').then( x => x.InventarioModule );           // ## INVENTARIO        ## //
const GeneralesModule = () => import(
    './ModulosSistema/Generales/generales-module').then( x => x.GeneralesModule );              // ## GENERALES         ## //
const CumplimientoModule = () => import(
    './ModulosSistema/Cumplimiento/cumplimiento-module').then( x => x.CumplimientoModule );     // ## CUMPLIMIENTO      ## //
const MacredModule = () => import(
    './ModulosSistema/Macred/macred-module').then( x => x.MacredModule );                       // ## MACRED            ## //

const routes: Routes = [

    { path: '', component: HomeComponent, canActivate: [AuthGuard] },

    // -- index - landings pages
    { path: '',  loadChildren: LandingModule,  canActivate: [AuthGuard] },
    // ## **************** ## //

    // -- inicio se sesión & pantallas de administración
    { path: 'account',              loadChildren: accountModule },
    { path: '_AdminModule',         loadChildren: AdminModule,      canActivate: [AuthGuard] },

    // -- módulos del sistema
    { path: 'modulo-generales',         loadChildren: GeneralesModule,      canActivate: [AuthGuard] },
    { path: 'modulo-activos-fijos',     loadChildren: ActivosFijosModule,   canActivate: [AuthGuard] },
    { path: 'modulo-bancos',            loadChildren: BancosModule,         canActivate: [AuthGuard] },
    { path: 'modulo-contabilidad',      loadChildren: ContabilidadModule,   canActivate: [AuthGuard] },
    { path: 'modulo-cuentas-cobrar',    loadChildren: CuentasCobrarModule,  canActivate: [AuthGuard] },
    { path: 'modulo-cuentas-pagar',     loadChildren: CuentasPagarModule,   canActivate: [AuthGuard] },
    { path: 'modulo-facturacion',       loadChildren: FacturacionModule,    canActivate: [AuthGuard] },
    { path: 'modulo-inventario',        loadChildren: InventarioModule,     canActivate: [AuthGuard] },
    { path: 'modulo-cumplimiento',      loadChildren: CumplimientoModule,   canActivate: [AuthGuard] },
    { path: 'modulo-macred',            loadChildren: MacredModule,         canActivate: [AuthGuard] },
    
    // default
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
