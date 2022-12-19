import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsociadosComponent } from './asociados/asociados-component';
import { IndexMacredComponent } from './index.component';
import { PersonasComponent } from './mantenimientos/Personas/personas-component';
import { MenuMacredComponent } from './menu.component';


const routes: Routes = [
    {
        path: '', component: MenuMacredComponent,
        children: [
            { path: '',             component: IndexMacredComponent },
            { path: 'index.html',   component: IndexMacredComponent },
            // datos de análisis
            { path: 'asociados/calificacion-asociados.html',        component: AsociadosComponent },
            // mantenimientos
            { path: 'mantenimientos/personas/datos-personas.html',  component: PersonasComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MacredRoutingModule { }
