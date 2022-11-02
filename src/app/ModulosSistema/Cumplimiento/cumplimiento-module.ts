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
import { PaisComponent } from './mantenimiento/calificacion-riesgo/pais-component';
import { MovimientoDebeComponent } from './mantenimiento/calificacion-riesgo/MovimientoDebe-component';
import { MovimientoHaberComponent } from './mantenimiento/calificacion-riesgo/MovimientoHaber-component';
import { CantidadDebeComponent } from './mantenimiento/calificacion-riesgo/CantidadDebe-component';
import { CantidadHaberComponent } from './mantenimiento/calificacion-riesgo/CantidadHaber-component';
import { Articulo15Component } from './mantenimiento/calificacion-riesgo/Articulo15-component';
import { CanalDistribucionComponent } from './mantenimiento/calificacion-riesgo/CanalDistribucion-component';
import { EspecialidadComponent } from './mantenimiento/calificacion-riesgo/Especialidad-component';
import { ProductoFinancieroComponent } from './mantenimiento/calificacion-riesgo/ProductoFinanciero-component';




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
        ProfesionComponent,
        PaisComponent,
        MovimientoDebeComponent,
        MovimientoHaberComponent,
        CantidadDebeComponent,
        CantidadHaberComponent,
        Articulo15Component,
        CanalDistribucionComponent,
        EspecialidadComponent,
        ProductoFinancieroComponent
    ]
})
export class CumplimientoModule { }
