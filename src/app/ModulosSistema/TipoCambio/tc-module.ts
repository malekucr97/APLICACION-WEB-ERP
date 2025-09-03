import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoCambioRoutingModule } from './tc-routing.module';
import { IndexTipoCambioComponent } from './index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuTipoCambioComponent } from './menu.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PosicionMonedaComponent } from './menu/posicion-moneda';
import { CargaTipoCambioComponent } from './menu/carga-tipo-cambio';
import { VolatilidadTipoCambioComponent } from './menu/volatilidad-tipo-cambio';
import { SharedModule } from '@app/_shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TipoCambioRoutingModule,
    SharedModule,
    TranslateModule.forChild()
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
