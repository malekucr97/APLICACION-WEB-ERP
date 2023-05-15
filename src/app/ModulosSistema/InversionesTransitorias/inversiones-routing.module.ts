import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexInversionesComponent } from './index.component';
import { MenuInversionesComponent } from './menu.component';

import {InvTiposMonedasComponent} from './mantenimientos/tiposmonedas-component';
import { InvTiposPersonasComponent } from './mantenimientos/tipospersonas-component';

const routes: Routes = [
    {
        path: '', component: MenuInversionesComponent,
        children: [
            { path: '', component:              IndexInversionesComponent },
            { path: 'index.html', component:    IndexInversionesComponent },
            { path: 'mantenimientos/tipos-monedas.html', component:    InvTiposMonedasComponent },
            { path: 'mantenimientos/tipos-personas.html', component:    InvTiposPersonasComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InversionesRoutingModule { }
