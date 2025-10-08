import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MacredRoutingModule } from './macred-routing.module';
import { IndexMacredComponent } from './index.component';
import { MenuMacredComponent } from './menu.component';
import { AsociadosComponent } from './asociados/asociados-component';
import { EstadosCivilesComponent } from './mantenimientos/Personas/estadosciviles-component';
import { ParametrosGeneralesComponent } from './configuracion/parametrosgenerales-component';
import { TiposPersonasComponent } from './mantenimientos/Personas/tipospersonas-component';
import { CondicionesLaboralesComponent } from './mantenimientos/Personas/condicionceslaborales-component';
import { TiposGenerosComponent } from './mantenimientos/Personas/tiposgeneros-component';
import { TiposAsociadosComponent } from './mantenimientos/Personas/tiposasociados-component';
import { TiposFormasPagoAnalisisComponent } from './mantenimientos/Obligaciones/tiposformaspagoanalisis-component';
import { TipoIngresoAnalisisComponent } from './mantenimientos/AnalisisPersonas/tipoingresoanalisis-component';
import { TipoIngresoComponent } from './mantenimientos/AnalisisPersonas/tipoingreso-component';
import { TipoActividadEconomicaComponent } from './mantenimientos/Personas/tipo-actividad-economica/Tipo-actividad-economica.component';
import { FclComponent } from './asociados/fcl/fcl.component';
import { EscenariofclComponent } from './asociados/escenariofcl/escenariofcl.component';
import { DatosAnalisisComponent } from './asociados/datos-analisis/datos-analisis.component';
import { IngresosComponent } from './asociados/ingresos/ingresos.component';
import { PdComponent } from './asociados/pd/pd.component';
import { SharedModule } from '@app/_shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
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
import { NivelesRiesgoComponent } from './mantenimientos/Parametros-Scoring/niveles-riesgo/niveles-riesgo.component';
import { IndicadoresScoringComponent } from './mantenimientos/Parametros-Scoring/indicadores-relevantes/indicadores-scoring.component';
import { ModelosAnalisisComponent } from './mantenimientos/Parametros-Scoring/configuracion-modelos/modelos-analisis.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MacredRoutingModule,
        FormsModule,
        SharedModule,
        TranslateModule.forChild()
    ],
    declarations: [
        IndexMacredComponent,
        MenuMacredComponent,
        AsociadosComponent,
        EstadosCivilesComponent,
        ParametrosGeneralesComponent,
        TiposPersonasComponent,
        CondicionesLaboralesComponent,
        TiposGenerosComponent,
        TiposAsociadosComponent,
        TiposFormasPagoAnalisisComponent,
        TipoIngresoAnalisisComponent,
        TipoIngresoComponent,
        TipoActividadEconomicaComponent,
        FclComponent,
        EscenariofclComponent,
        NivelesCapacidadPagoComponent,
        DatosAnalisisComponent,
        IngresosComponent,
        PdComponent,
        EntidadesFinancierasComponent,
        PeriocidadComponent,
        TiposLineasCreditoComponent,
        CategoriaRiesgoComponent,
        TipoObligacionComponent,
        FactoresInferiblesComponent,
        RangosExtrasComponent,
        PonderacionRiesgoComponent,
        TipoMonedaComponent,
        PersonaAnalisisComponent,
        ModelosCalificacionComponent,
        ModelosParametrosComponent,
        VariablesPDComponent,
        VariablesCriticasComponent,
        IndicadoresRelevantesComponent,
        EscenariosRiesgosComponent,
        NivelesRiesgoComponent,
        IndicadoresScoringComponent,
        ModelosAnalisisComponent
    ]
})
export class MacredModule { }
