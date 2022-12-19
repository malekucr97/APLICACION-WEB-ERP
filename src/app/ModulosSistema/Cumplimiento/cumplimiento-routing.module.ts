import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexCumplimientoComponent } from './index.component';
import { ActividadEconomicaComponent } from './mantenimiento/calificacion-riesgo/ActividadEconomica-component';
import { Articulo15Component } from './mantenimiento/calificacion-riesgo/Articulo15-component';
import { CanalDistribucionComponent } from './mantenimiento/calificacion-riesgo/CanalDistribucion-component';
import { CantidadDebeComponent } from './mantenimiento/calificacion-riesgo/CantidadDebe-component';
import { CantidadHaberComponent } from './mantenimiento/calificacion-riesgo/CantidadHaber-component';
import { EspecialidadComponent } from './mantenimiento/calificacion-riesgo/Especialidad-component';
import { GrupoComponent } from './mantenimiento/calificacion-riesgo/Grupo-component';
import { MovimientoDebeComponent } from './mantenimiento/calificacion-riesgo/MovimientoDebe-component';
import { MovimientoHaberComponent } from './mantenimiento/calificacion-riesgo/MovimientoHaber-component';
import { NivelRiesgoComponent } from './mantenimiento/calificacion-riesgo/NivelRiesgo-component';
import { PaisComponent } from './mantenimiento/calificacion-riesgo/pais-component';
import { ProductoFinancieroComponent } from './mantenimiento/calificacion-riesgo/ProductoFinanciero-component';
import { ProfesionComponent } from './mantenimiento/calificacion-riesgo/Profesion-component';
import { MenuCumplimientoComponent } from './menu.component';

const routes: Routes = [
    {
        path: '', component: MenuCumplimientoComponent,
        children: [
            { path: '', component:              IndexCumplimientoComponent },
            { path: 'index.html', component:    IndexCumplimientoComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/Grupos',                 component: GrupoComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/NivelesRiesgos',         component: NivelRiesgoComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/ActividadesEconomicas',  component: ActividadEconomicaComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/Profesiones',            component: ProfesionComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/Paises',                 component: PaisComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/MovimientosDebe',        component: MovimientoDebeComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/MovimientosHaber',       component: MovimientoHaberComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/CantidadesDebe',         component: CantidadDebeComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/CantidadesHaber',        component: CantidadHaberComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/Articulo15',             component: Articulo15Component },
            { path: 'Mantenimientos/CalificacionRiesgo/CanalesDistribucion',    component: CanalDistribucionComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/Especialidades',         component: EspecialidadComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/ProductosFinancieros',   component: ProductoFinancieroComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CumplimientoRoutingModule { }
