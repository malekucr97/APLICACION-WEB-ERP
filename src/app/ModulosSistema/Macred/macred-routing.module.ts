import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsociadosComponent } from './asociados/asociados-component';
import { ParametrosGeneralesComponent } from './configuracion/parametrosgenerales-component';
import { IndexMacredComponent } from './index.component';
import { TipoIngresoComponent } from './mantenimientos/AnalisisPersonas/tipoingreso-component';
import { TipoIngresoAnalisisComponent } from './mantenimientos/AnalisisPersonas/tipoingresoanalisis-component';
import { TiposFormasPagoAnalisisComponent } from './mantenimientos/Obligaciones/tiposformaspagoanalisis-component';
import { ConfiguracionModelosComponent } from './mantenimientos/Parametros/configuracion-modelos/configuracion-modelos.component';
import { ConfiguracionParametrosPdComponent } from './mantenimientos/Parametros/configuracion-parametros-pd/configuracion-parametros-pd.component';
import { CondicionesLaboralesComponent } from './mantenimientos/Personas/condicionceslaborales-component';
import { EstadosCivilesComponent } from './mantenimientos/Personas/estadosciviles-component';
import { PersonasComponent } from './mantenimientos/Personas/personas-component';
import { TiposAsociadosComponent } from './mantenimientos/Personas/tiposasociados-component';
import { TiposGenerosComponent } from './mantenimientos/Personas/tiposgeneros-component';
import { TiposPersonasComponent } from './mantenimientos/Personas/tipospersonas-component';
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
            { path: 'mantenimientos/personas/datos-personas.html',  component: PersonasComponent },
            { path: 'mantenimientos/personas/estados-civiles.html', component: EstadosCivilesComponent},
            { path: 'mantenimientos/personas/tipos-personas.html',  component: TiposPersonasComponent },
            { path: 'mantenimientos/personas/condiciones-laborales.html',  component: CondicionesLaboralesComponent },
            { path: 'mantenimientos/personas/tipos-generos.html',  component: TiposGenerosComponent },
            { path: 'mantenimientos/personas/tipos-asociados.html',  component: TiposAsociadosComponent },
            { path: 'mantenimientos/obligaciones/tipos-forma-pago-analisis.html',  component: TiposFormasPagoAnalisisComponent },
            { path: 'mantenimientos/analisispersonas/tipos-ingresos.html',  component: TipoIngresoComponent },
            { path: 'mantenimientos/analisispersonas/tipos-ingresos-analisis.html',  component: TipoIngresoAnalisisComponent },
            { path: 'mantenimientos/parametros/configuracion-modelos.html',  component: ConfiguracionModelosComponent },
            { path: 'mantenimientos/parametros/configuracion-parametros-pd.html',  component: ConfiguracionParametrosPdComponent },
            // configuracion
            { path: 'configuracion/parametros-generales.html', component: ParametrosGeneralesComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MacredRoutingModule { }
