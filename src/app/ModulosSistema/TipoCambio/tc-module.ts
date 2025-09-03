import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoCambioRoutingModule } from './tc-routing.module';
import { IndexTipoCambioComponent } from './index.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuTipoCambioComponent } from './menu.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { PosicionMonedaComponent } from './menu/posicion-moneda';
import { CargaTipoCambioComponent } from './menu/carga-tipo-cambio';
import { VolatilidadTipoCambioComponent } from './menu/volatilidad-tipo-cambio';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TipoCambioRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTreeModule,
    MatTooltipModule,
    MatNativeDateModule
  ],
  declarations: [
    IndexTipoCambioComponent,
    MenuTipoCambioComponent,
    PosicionMonedaComponent,
    CargaTipoCambioComponent,
    VolatilidadTipoCambioComponent
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-CR' }]
})
export class TipoCambioModule {}
