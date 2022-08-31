import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexCumplimientoComponent } from './index.component';
import { ActividadEconomicaComponent } from './mantenimiento/calificacion-riesgo/ActividadEconomica-component';
import { GrupoComponent } from './mantenimiento/calificacion-riesgo/Grupo-component';
import { NivelRiesgoComponent } from './mantenimiento/calificacion-riesgo/NivelRiesgo-component';
import { ProfesionComponent } from './mantenimiento/calificacion-riesgo/Profesion-component';
import { MenuCumplimientoComponent } from './menu.component';

const routes: Routes = [
    {
        path: '', component: MenuCumplimientoComponent,
        children: [
            { path: '', component: MenuCumplimientoComponent },
            { path: 'Index.html', component: IndexCumplimientoComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/Grupos', component: GrupoComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/NivelesRiesgos', component: NivelRiesgoComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/ActividadesEconomicas', component: ActividadEconomicaComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/Profesiones', component: ProfesionComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CumplimientoRoutingModule { }
