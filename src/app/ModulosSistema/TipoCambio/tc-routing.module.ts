import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexTipoCambioComponent } from './index.component';
import { MenuTipoCambioComponent } from './menu.component';
import { PosicionMonedaComponent } from './menu/posicion-moneda';
import { CargaTipoCambioComponent } from './menu/carga-tipo-cambio';
import { VolatilidadTipoCambioComponent } from './menu/volatilidad-tipo-cambio';

const routes: Routes = [
  {
    path: '',
    component: MenuTipoCambioComponent,
    children: [
      { path: '', component: IndexTipoCambioComponent },
      { path: 'index.html', component: IndexTipoCambioComponent },
      { path: 'menu/posicion-moneda.html', component: PosicionMonedaComponent },
      { path: 'menu/carga-tipo-cambio.html', component: CargaTipoCambioComponent },
      { path: 'menu/volatilidad-tipo-cambio.html', component: VolatilidadTipoCambioComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoCambioRoutingModule {}
