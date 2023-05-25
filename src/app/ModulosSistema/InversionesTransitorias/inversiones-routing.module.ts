import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexInversionesComponent } from './index.component';
import { MenuInversionesComponent } from './menu.component';

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

const routes: Routes = [
    {
        path: '', component: MenuInversionesComponent,
        children: [
            { path: '', component:              IndexInversionesComponent },
            { path: 'index.html', component:    IndexInversionesComponent },
            { path: 'mantenimientos/tipos-monedas.html',        component:  InvTiposMonedasComponent },
            { path: 'mantenimientos/tipos-personas.html',       component:  InvTiposPersonasComponent },
            { path: 'mantenimientos/personas.html',             component:  InvPersonasComponent },
            { path: 'mantenimientos/periocidades.html',         component:  InvPeriocidadesComponent },
            { path: 'mantenimientos/tipos-anios.html',          component:  InvTiposAniosComponent },
            { path: 'mantenimientos/tmercados-tsectores.html',  component:  InvTMercadosTSectoresComponent },
            { path: 'mantenimientos/emisores.html',             component:  InvEmisoresComponent },
            { path: 'mantenimientos/clasesplazos-inversiones.html',   component:  InvClasesPlazosInversionesComponent },
            { path: 'mantenimientos/titulos.html',              component:  InvTitulosComponent },
            { path: 'mantenimientos/tasas.html',               component:   InvTasasComponent }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InversionesRoutingModule { }
