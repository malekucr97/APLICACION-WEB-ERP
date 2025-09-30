import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsociadosComponent } from './asociados/asociados-component';
import { ParametrosGeneralesComponent } from './configuracion/parametrosgenerales-component';
import { IndexMacredComponent } from './index.component';
import { TipoIngresoComponent } from './mantenimientos/AnalisisPersonas/tipoingreso-component';
import { TipoIngresoAnalisisComponent } from './mantenimientos/AnalisisPersonas/tipoingresoanalisis-component';
// import { IndicadoresRelevantesComponent } from './mantenimientos/ModelosCalificacion/indicadores-relevantes/indicadores-relevantes.component1';
// import { NivelesCapacidadPagoComponent } from './mantenimientos/ModelosCalificacion/niveles-capacidad-pago/niveles-capacidad-pago.component1';
// import { VariablesCriticasComponent } from './mantenimientos/ModelosCalificacion/variables-criticas/variables-criticas.component1';
import { TiposFormasPagoAnalisisComponent } from './mantenimientos/Obligaciones/tiposformaspagoanalisis-component';
// import { ConfiguracionModelosComponent } from './mantenimientos/Parametros/configuracion-modelos/configuracion-modelos.component';
// import { ConfiguracionParametrosPdComponent } from './mantenimientos/Parametros/configuracion-parametros-pd/configuracion-parametros-pd.component';
import { CondicionesLaboralesComponent } from './mantenimientos/Personas/condicionceslaborales-component';
import { EstadosCivilesComponent } from './mantenimientos/Personas/estadosciviles-component';
import { TipoActividadEconomicaComponent } from './mantenimientos/Personas/tipo-actividad-economica/Tipo-actividad-economica.component';
// import { PersonasComponent } from './mantenimientos/Personas/personas-component';
import { TiposAsociadosComponent } from './mantenimientos/Personas/tiposasociados-component';
import { TiposGenerosComponent } from './mantenimientos/Personas/tiposgeneros-component';
import { TiposPersonasComponent } from './mantenimientos/Personas/tipospersonas-component';
import { MenuMacredComponent } from './menu.component';
// import { EscenariosRiesgosComponent } from './mantenimientos/ModelosCalificacion/escenarios-riesgos/escenarios-riesgos.component1';
import { EntidadesFinancierasComponent } from './mantenimientos/entidades-financieras.component';
import { PeriocidadComponent } from './mantenimientos/Obligaciones/periocidad.component';
import { TiposLineasCreditoComponent } from './mantenimientos/Obligaciones/tipos-lineas-credito.component';
import { CategoriaRiesgoComponent } from './mantenimientos/Obligaciones/categorias-riesgo.component';
import { TipoObligacionComponent } from './mantenimientos/AnalisisPersonas/tipo-deduccion.component';
import { FactoresInferiblesComponent } from './mantenimientos/AnalisisPersonas/factores-inferibles.component';
import { RangosExtrasComponent } from './mantenimientos/AnalisisPersonas/rangos-extras.component';
import { PonderacionRiesgoComponent } from './mantenimientos/AnalisisPersonas/ponderacion-riesgo.component';
import { TipoMonedaComponent } from './mantenimientos/AnalisisPersonas/tipo-moneda.component';
import { PersonaAnalisisComponent } from './mantenimientos/Personas/personas-analisis.component';
import { ModelosCalificacionComponent } from './mantenimientos/ModelosCalificacion/configuracion-modelos/modelos-calificacion.component';
import { ModelosParametrosComponent } from './mantenimientos/Parametros/modelos-parametros.component';
import { VariablesPDComponent } from './mantenimientos/Parametros/variables-pd.component';
import { NivelesCapacidadPagoComponent } from './mantenimientos/ModelosCalificacion/niveles-capacidad-pago/niveles-capacidad-pago.component';
import { VariablesCriticasComponent } from './mantenimientos/ModelosCalificacion/variables-criticas/variables-criticas.component';
import { IndicadoresRelevantesComponent } from './mantenimientos/ModelosCalificacion/indicadores-relevantes/indicadores-relevantes.component';
import { EscenariosRiesgosComponent } from './mantenimientos/ModelosCalificacion/escenarios-riesgos/escenarios-riesgos.component';



const routes: Routes = [
    {
        path: '', component: MenuMacredComponent,
        children: [
            { path: '',             component: IndexMacredComponent },
            { path: 'index.html',   component: IndexMacredComponent },
            // datos de análisis
            { path: 'asociados/calificacion-asociados.html', component: AsociadosComponent },
            // mantenimientos
            // { path: 'mantenimientos/personas/datos-personas.html', component: PersonasComponent },
            // **
            { path: 'mantenimientos/personas/personas-analisis.html', component: PersonaAnalisisComponent },
            // **
            { path: 'mantenimientos/personas/estados-civiles.html', component: EstadosCivilesComponent},
            { path: 'mantenimientos/personas/tipos-personas.html', component: TiposPersonasComponent },
            { path: 'mantenimientos/personas/condiciones-laborales.html',  component: CondicionesLaboralesComponent },
            { path: 'mantenimientos/personas/tipos-generos.html', component: TiposGenerosComponent },
            { path: 'mantenimientos/personas/tipos-asociados.html', component: TiposAsociadosComponent },
            { path: 'mantenimientos/entidades-financieras.html', component: EntidadesFinancierasComponent },
            { path: 'mantenimientos/obligaciones/tipos-forma-pago-analisis.html',  component: TiposFormasPagoAnalisisComponent },
            { path: 'mantenimientos/obligaciones/periocidades.html',  component: PeriocidadComponent },
            { path: 'mantenimientos/obligaciones/tipos-lineas-credito.html',  component: TiposLineasCreditoComponent },
            { path: 'mantenimientos/obligaciones/categoria-riesgo.html',  component: CategoriaRiesgoComponent },
            { path: 'mantenimientos/analisispersonas/tipos-ingresos.html',  component: TipoIngresoComponent },
            { path: 'mantenimientos/analisispersonas/tipos-ingresos-analisis.html',  component: TipoIngresoAnalisisComponent },
            { path: 'mantenimientos/analisispersonas/tipos-deducciones.html',  component: TipoObligacionComponent },
            { path: 'mantenimientos/analisispersonas/factores-inferibles.html',  component: FactoresInferiblesComponent },
            { path: 'mantenimientos/analisispersonas/rangos-extras-aceptacion.html',  component: RangosExtrasComponent },
            { path: 'mantenimientos/analisispersonas/ponderacion-riesgos-ltv.html',  component: PonderacionRiesgoComponent },

            { path: 'mantenimientos/tipo-moneda.html',  component: TipoMonedaComponent },

            // { path: 'mantenimientos/parametros/configuracion-modelos.html',  component: ConfiguracionModelosComponent },
            { path: 'mantenimientos/parametros/configuracion-modelos.html',  component: ModelosParametrosComponent },
            // { path: 'mantenimientos/parametros/configuracion-parametros-pd.html',  component: ConfiguracionParametrosPdComponent },
            { path: 'mantenimientos/parametros/variables-pd.html',  component: VariablesPDComponent },
            { path: 'mantenimientos/personas/tipo-actividad-economica.html',  component: TipoActividadEconomicaComponent },

            { path: 'mantenimientos/modeloscalificacion/indicadores-relevantes.html',  component: IndicadoresRelevantesComponent },
            // { path: 'mantenimientos/modeloscalificacion/indicadores-relevantes.html',  component: IndicadoresRelevantesComponent },
            { path: 'mantenimientos/modeloscalificacion/configuracion-modelos.html',  component: ModelosCalificacionComponent },
            { path: 'mantenimientos/modeloscalificacion/niveles-capacidad-pago.html',  component: NivelesCapacidadPagoComponent },
            // { path: 'mantenimientos/modeloscalificacion/niveles-capacidad-pago.html',  component: NivelesCapacidadPagoComponent },
            { path: 'mantenimientos/modeloscalificacion/variables-criticas.html',  component: VariablesCriticasComponent },
            // { path: 'mantenimientos/modeloscalificacion/variables-criticas.html',  component: VariablesCriticasComponent },
            // { path: 'mantenimientos/modeloscalificacion/escenarios-riesgos.html',  component: EscenariosRiesgosComponent },
            { path: 'mantenimientos/modeloscalificacion/escenarios-riesgos.html',  component: EscenariosRiesgosComponent },
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
