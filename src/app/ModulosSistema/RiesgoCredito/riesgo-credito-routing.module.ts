import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexRiesgoCreditoComponent } from './index.component';
import { CargaDatosCreditoComponent } from './Mantenimientos/carga-datos-credito/carga-datos-credito.component';
import { MenuRiesgoCreditoComponent } from './menu.component';

const routes: Routes = [
  {
    path: '',
    component: MenuRiesgoCreditoComponent,
    children: [
      { path: '', component: IndexRiesgoCreditoComponent },
      { path: 'index.html', component: IndexRiesgoCreditoComponent },
      { path: 'Mantenimientos/CargaCredito', component: CargaDatosCreditoComponent },
      // { path: 'Mantenimientos/CalificacionRiesgo/NivelesRiesgos',         component: NivelRiesgoComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiesgoCreditoRoutingModule {}
