import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CumplimientoRoutingModule } from './cumplimiento-routing.module';

import { IndexCumplimientoComponent } from './index.component';
import { MenuCumplimientoComponent } from './menu.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import {MatTreeModule} from '@angular/material/tree';
import {MatTooltipModule} from '@angular/material/tooltip';

import { GrupoComponent } from './mantenimiento/calificacion-riesgo/Grupo-component';
import { NivelRiesgoComponent } from './mantenimiento/calificacion-riesgo/NivelRiesgo-component';
import { ActividadEconomicaComponent } from './mantenimiento/calificacion-riesgo/ActividadEconomica-component';
import { ProfesionComponent } from './mantenimiento/calificacion-riesgo/Profesion-component';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CumplimientoRoutingModule,

        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,

        MatTreeModule,
        MatTooltipModule
    ],
    declarations: [
        IndexCumplimientoComponent,
        MenuCumplimientoComponent,
        GrupoComponent,
        NivelRiesgoComponent,
        ActividadEconomicaComponent,
        ProfesionComponent
    ]
})
export class CumplimientoModule { }
