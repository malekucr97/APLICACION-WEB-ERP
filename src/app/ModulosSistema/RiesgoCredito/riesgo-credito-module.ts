import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiesgoCreditoRoutingModule } from './riesgo-credito-routing.module';
import { IndexRiesgoCreditoComponent } from './index.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuRiesgoCreditoComponent } from './menu.component';
import { CargaDatosCreditoComponent } from './Mantenimientos/carga-datos-credito/carga-datos-credito.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RiesgoCreditoRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTreeModule,
    MatTooltipModule,
  ],
  declarations: [
    IndexRiesgoCreditoComponent,
    MenuRiesgoCreditoComponent,
    CargaDatosCreditoComponent,
  ],
})
export class RiesgoCreditoModule {}
