import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InversionesRoutingModule } from './inversiones-routing.module';

import { IndexInversionesComponent } from './index.component';
import { MenuInversionesComponent } from './menu.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import {MatTreeModule} from '@angular/material/tree';
import {MatTooltipModule} from '@angular/material/tooltip';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule}  from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';

import {InvTiposMonedasComponent} from './mantenimientos/tiposmonedas-component';
import { InvTiposPersonasComponent } from './mantenimientos/tipospersonas-component';
import { InvPersonasComponent } from './mantenimientos/personas-component';
import { InvPeriocidadesComponent } from './mantenimientos/periocidades-component';
import { InvTiposAniosComponent } from './mantenimientos/tiposanios-component';
import { InvTMercadosTSectoresComponent } from './mantenimientos/tmercadostsectores-component';
import { InvEmisoresComponent } from './mantenimientos/emisores-component';
import { InvTitulosComponent } from './mantenimientos/titulos-component';
import { InvTasasComponent } from './mantenimientos/tasas-component';
import { InvClasesPlazosInversionesComponent } from './mantenimientos/clasesplazosinversiones-component';
import { InvInclusionInversionOperacionesComponent } from './transacciones/operacionesPlazo/inclusionOperacionInversiones-component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InversionesRoutingModule,

        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,

        MatTreeModule,
        MatTooltipModule,

        FormsModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatCheckboxModule,

        MatDialogModule,
        MatFormFieldModule,
        MatListModule,
        TranslateModule.forChild()
    ],
    declarations: [
        IndexInversionesComponent,
        MenuInversionesComponent,

        // ** manteniminto
        // / ** tipo de moneda
        InvTiposMonedasComponent,
        // / ** tipo de persona
        InvTiposPersonasComponent,
        // / ** tipo de persona
        InvPersonasComponent,
        // / ** periocidades
        InvPeriocidadesComponent,
        // / ** tipos de años
        InvTiposAniosComponent,
        // / ** tipos de mercados & sectores
        InvTMercadosTSectoresComponent,
        // / ** emisores
        InvEmisoresComponent,
        // / ** títulos cdps
        InvTitulosComponent,
        // / ** tasas
        InvTasasComponent,
        // / ** clases plazos inversiones
        InvClasesPlazosInversionesComponent,
        // ** transacciones
        // / ** operaciones a plazo
        InvInclusionInversionOperacionesComponent

    ],
    entryComponents: [
        InvTiposMonedasComponent
    ]
})
export class InversionesModule { }
