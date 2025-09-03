import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiesgoCreditoRoutingModule } from './riesgo-credito-routing.module';
import { IndexRiesgoCreditoComponent } from './index.component';
import { SharedModule } from '../../_shared/shared.module';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuRiesgoCreditoComponent } from './menu.component';
import { CargaDatosCreditoComponent } from './Mantenimientos/carga-datos-credito.component';
import { CargaZaltmanFormulasComponent } from './Mantenimientos/carga-zaltman-formulas.component';
import { EntidadesComponent } from './Mantenimientos/entidades.component';
import { CargaZaltmanDatosComponent } from './Mantenimientos/carga-zaltman-datos.component';
import { AlfaBetaComponent } from './ModelosRiesgo/alfa-beta.component';
import { IhhCrediticioComponent } from './ModelosRiesgo/ihh-crediticio.component';
import { TransicionComponent } from './ModelosRiesgo/transicion.component';
import { ZAltmanComponent } from './ModelosRiesgo/zaltman.component';
import { HistoricoIhhCrediticioComponent } from './ModelosRiesgo/historico-ihh-crediticio.component';
import { HistoricoAlfaBetaComponent } from './ModelosRiesgo/historico-alfa-beta.component';
import { TranslateModule } from '@ngx-translate/core';
import { PorcentajesEstimacionCatComponent } from './Mantenimientos/estimacionIHH/porcentajes-estimacion-cat.component';
import { PorcentajesEstimacionDiasComponent } from './Mantenimientos/estimacionIHH/porcentajes-estimacion-dias.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RiesgoCreditoRoutingModule,
    SharedModule,
    // MatToolbarModule,
    // MatSidenavModule,
    // MatSelectModule,
    // MatDatepickerModule,
    // MatButtonModule,
    // MatIconModule,
    // MatDividerModule,
    // MatTreeModule,
    // MatTooltipModule,
    // MatNativeDateModule,
    // MatCheckboxModule,
    // MatDialogModule,
    // MatFormFieldModule,
    // MatListModule
    TranslateModule.forChild()
  ],
  declarations: [
    IndexRiesgoCreditoComponent,
    MenuRiesgoCreditoComponent,
    // mantenimientos
    EntidadesComponent,
    CargaDatosCreditoComponent,
    CargaZaltmanFormulasComponent,
    PorcentajesEstimacionCatComponent,
    PorcentajesEstimacionDiasComponent,
    CargaZaltmanDatosComponent,
    // alfa-beta
    AlfaBetaComponent,
    IhhCrediticioComponent,
    TransicionComponent,
    ZAltmanComponent,
    HistoricoIhhCrediticioComponent,
    HistoricoAlfaBetaComponent
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-CR' }]
})
export class RiesgoCreditoModule {}
