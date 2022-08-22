import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexCumplimientoComponent } from './index.component';
import { GrupoComponent } from './mantenimiento/calificacion-riesgo/Grupo-component';
import { MenuCumplimientoComponent } from './menu.component';

const routes: Routes = [
    {
        path: '', component: MenuCumplimientoComponent,
        children: [
            { path: '', component: MenuCumplimientoComponent },
            { path: 'Index.html', component: IndexCumplimientoComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/Grupos', component: GrupoComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/Grupos/add', component: GrupoComponent },
            { path: 'Mantenimientos/CalificacionRiesgo/Grupos/update/:pidGrupo', component: GrupoComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CumplimientoRoutingModule { }
