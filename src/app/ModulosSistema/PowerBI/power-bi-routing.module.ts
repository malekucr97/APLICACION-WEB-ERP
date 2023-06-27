import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPowerBiComponent } from './index-power-bi/index-power-bi.component';
import { MenuPowerBIComponent } from './menu.components';

const routes: Routes = [
  {
    path: '', component: MenuPowerBIComponent,
    children: [
        { path: '',             component: IndexPowerBiComponent },
        { path: 'index.html',   component: IndexPowerBiComponent },
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PowerBiRoutingModule { }


