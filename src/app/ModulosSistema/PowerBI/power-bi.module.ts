import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PowerBiRoutingModule } from './power-bi-routing.module';
import { MenuPowerBIComponent } from './menu.components';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IndexPowerBiComponent } from './index-power-bi/index-power-bi.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTreeModule } from '@angular/material/tree';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    PowerBiRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTreeModule,
    MatTooltipModule,
    PowerBIEmbedModule,
    TranslateModule.forChild()
  ],
  declarations: [
    IndexPowerBiComponent,
    MenuPowerBIComponent
  ],
})
export class PowerBiModule { }
