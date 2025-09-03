import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexRiesgoCreditoComponent } from './index.component';
import { CargaDatosCreditoComponent } from './Mantenimientos/carga-datos-credito.component';
import { MenuRiesgoCreditoComponent } from './menu.component';
import { CargaZaltmanFormulasComponent } from './Mantenimientos/carga-zaltman-formulas.component';
import { EntidadesComponent } from './Mantenimientos/entidades.component';
import { PorcentajesEstimacionCatComponent } from './Mantenimientos/estimacionIHH/porcentajes-estimacion-cat.component';
import { PorcentajesEstimacionDiasComponent } from './Mantenimientos/estimacionIHH/porcentajes-estimacion-dias.component';
import { CargaZaltmanDatosComponent } from './Mantenimientos/carga-zaltman-datos.component';
import { AlfaBetaComponent } from './ModelosRiesgo/alfa-beta.component';
import { IhhCrediticioComponent } from './ModelosRiesgo/ihh-crediticio.component';
import { TransicionComponent } from './ModelosRiesgo/transicion.component';
import { ZAltmanComponent } from './ModelosRiesgo/zaltman.component';
import { HistoricoIhhCrediticioComponent } from './ModelosRiesgo/historico-ihh-crediticio.component';
import { HistoricoAlfaBetaComponent } from './ModelosRiesgo/historico-alfa-beta.component';

const routes: Routes = [
  {
    path: '',
    component: MenuRiesgoCreditoComponent,
    children: [
      { path: '', component: IndexRiesgoCreditoComponent },
      { path: 'index.html', component: IndexRiesgoCreditoComponent },
      // ## -- Mantenimientos -- ## //
      { path: 'mantenimientos/entidades.html', component: EntidadesComponent },

      { path: 'mantenimientos/estimacionihh/porcentajes-estimacion-categoria.html', component: PorcentajesEstimacionCatComponent },
      { path: 'mantenimientos/estimacionihh/porcentajes-estimacion-dias.html', component: PorcentajesEstimacionDiasComponent },

      { path: 'mantenimientos/carga-datos-credito.html', component: CargaDatosCreditoComponent },
      { path: 'mantenimientos/carga-zaltman-formulas.html', component: CargaZaltmanFormulasComponent },
      { path: 'mantenimientos/carga-zaltman-datos.html', component: CargaZaltmanDatosComponent },
      // ## -- Modelos de Riesgo -- ## //
      { path: 'modelosriesgo/alfa-beta.html', component: AlfaBetaComponent },
      { path: 'modelosriesgo/ihh-crediticio.html', component: IhhCrediticioComponent },
      { path: 'modelosriesgo/transicion.html', component: TransicionComponent },
      { path: 'modelosriesgo/zaltman.html', component: ZAltmanComponent },
      { path: 'modelosriesgo/historico-ihh-crediticio.html', component: HistoricoIhhCrediticioComponent },
      { path: 'modelosriesgo/historico-alfa-beta.html', component: HistoricoAlfaBetaComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiesgoCreditoRoutingModule {}
