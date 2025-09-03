import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PowerBiRoutingModule } from './power-bi-routing.module';
import { MenuPowerBIComponent } from './menu.components';
import { IndexPowerBiComponent } from './index-power-bi/index-power-bi.component';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/_shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    PowerBiRoutingModule,
    PowerBIEmbedModule,
    SharedModule,
    TranslateModule.forChild()
  ],
  declarations: [
    IndexPowerBiComponent,
    MenuPowerBIComponent
  ],
})
export class PowerBiModule { }
