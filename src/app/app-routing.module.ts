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

// const ActivosFijosModule = () => import(
//     './ModulosSistema/ActivosFijos/activos-module').then( x => x.ActivosFijosModule );                  // ## ACTIVOS FIJOS             ## //
// const BancosModule = () => import(
//     './ModulosSistema/Bancos/bancos-module').then( x => x.BancosModule );                               // ## BANCOS                    ## //
// const ContabilidadModule = () => import(
//     './ModulosSistema/Contabilidad/contabilidad-module').then( x => x.ContabilidadModule );             // ## CONTABILIDAD              ## //
// const CuentasCobrarModule = () => import(
//     './ModulosSistema/CuentasCobrar/cuentascobrar-module').then( x => x.CuentasCobrarModule );          // ## CUENTAS COBRAR            ## //
// const CuentasPagarModule = () => import(
//     './ModulosSistema/CuentasPagar/cuentaspagar-module').then( x => x.CuentasPagarModule );             // ## CUENTAS PAGAR             ## //
// const FacturacionModule = () => import(
//     './ModulosSistema/Facturacion/facturacion-module').then( x => x.FacturacionModule );                // ## FACTURACIÓN               ## //
// const InventarioModule = () => import(
//     './ModulosSistema/Inventario/inventario-module').then( x => x.InventarioModule );                   // ## INVENTARIO                ## //
// const CumplimientoModule = () => import(
//     './ModulosSistema/Cumplimiento/cumplimiento-module').then( x => x.CumplimientoModule );             // ## CUMPLIMIENTO              ## //
// const MacredModule = () => import(
//     './ModulosSistema/Macred/macred-module').then( x => x.MacredModule );                               // ## MACRED                    ## //
// const RiesgoCreditoModule = () => import(
//     './ModulosSistema/RiesgoCredito/riesgo-credito-module').then( x => x.RiesgoCreditoModule );         // ## RIESGO CREDITO            ## //
// const InversionesModule = () => import(
//     './ModulosSistema/InversionesTransitorias/inversiones-module').then( x => x.InversionesModule );    // ## INVERSIONES TRANSITORIAS  ## //

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

    // -- módulos del sistema
    // { path: 'inra-sa/modulo-generales',                 loadChildren: GeneralesModule,      canActivate: [AuthGuard] },
    // { path: 'inra-sa/modulo-activos-fijos',             loadChildren: ActivosFijosModule,   canActivate: [AuthGuard] },
    // { path: 'inra-sa/modulo-bancos',                    loadChildren: BancosModule,         canActivate: [AuthGuard] },
    // { path: 'inra-sa/modulo-contabilidad',              loadChildren: ContabilidadModule,   canActivate: [AuthGuard] },
    // { path: 'inra-sa/modulo-cuentas-cobrar',            loadChildren: CuentasCobrarModule,  canActivate: [AuthGuard] },
    // { path: 'inra-sa/modulo-cuentas-pagar',             loadChildren: CuentasPagarModule,   canActivate: [AuthGuard] },
    // { path: 'inra-sa/modulo-facturacion',               loadChildren: FacturacionModule,    canActivate: [AuthGuard] },
    // { path: 'inra-sa/modulo-inventario',                loadChildren: InventarioModule,     canActivate: [AuthGuard] },
    // { path: 'inra-sa/modulo-cumplimiento',              loadChildren: CumplimientoModule,   canActivate: [AuthGuard] },
    // { path: 'inra-sa/modulo-macred',                    loadChildren: MacredModule,         canActivate: [AuthGuard] },
    // { path: 'inra-sa/modulo-riesgo-credito',            loadChildren: RiesgoCreditoModule,  canActivate: [AuthGuard] },
    // { path: 'inra-sa/modulo-inversiones',               loadChildren: InversionesModule,    canActivate: [AuthGuard] },
    // { path: 'inra-sa/modulo-powerbi',                   loadChildren: PowerBiModule,        canActivate: [AuthGuard] },  
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
