import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MacredRoutingModule } from './macred-routing.module';

import { IndexMacredComponent } from './index.component';
import { MenuMacredComponent } from './menu.component';
import { AsociadosComponent } from './asociados/asociados-component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import {MatTreeModule} from '@angular/material/tree';
import {MatTooltipModule} from '@angular/material/tooltip';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule}  from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';

import { PersonasComponent } from './mantenimientos/Personas/personas-component';

import { EstadosCivilesComponent } from './mantenimientos/Personas/estadosciviles-component';
import { ParametrosGeneralesComponent } from './configuracion/parametrosgenerales-component';
import { TiposPersonasComponent } from './mantenimientos/Personas/tipospersonas-component';
import { CondicionesLaboralesComponent } from './mantenimientos/Personas/condicionceslaborales-component';
import { TiposGenerosComponent } from './mantenimientos/Personas/tiposgeneros-component';
import { TiposAsociadosComponent } from './mantenimientos/Personas/tiposasociados-component';
import { TiposFormasPagoAnalisisComponent } from './mantenimientos/Obligaciones/tiposformaspagoanalisis-component';
import { TipoIngresoAnalisisComponent } from './mantenimientos/AnalisisPersonas/tipoingresoanalisis-component';
import { TipoIngresoComponent } from './mantenimientos/AnalisisPersonas/tipoingreso-component';
import { ConfiguracionModelosComponent } from './mantenimientos/Parametros/configuracion-modelos/configuracion-modelos.component';
import { ConfiguracionParametrosPdComponent } from './mantenimientos/Parametros/configuracion-parametros-pd/configuracion-parametros-pd.component';
import { MatSelectModule } from '@angular/material/select';
import { TipoActividadEconomicaComponent } from './mantenimientos/Personas/tipo-actividad-economica/Tipo-actividad-economica.component';
import { FclComponent } from './asociados/fcl/fcl.component';
import { EscenariofclComponent } from './asociados/escenariofcl/escenariofcl.component';
import { NivelesCapacidadPagoComponent } from './mantenimientos/ModelosCalificacion/niveles-capacidad-pago/niveles-capacidad-pago.component';
import { IndicadoresRelevantesComponent } from './mantenimientos/ModelosCalificacion/indicadores-relevantes/indicadores-relevantes.component';
import { DatosAnalisisComponent } from './asociados/datos-analisis/datos-analisis.component';
import { IngresosComponent } from './asociados/ingresos/ingresos.component';
import { PdComponent } from './asociados/pd/pd.component';
import { VariablesCriticasComponent } from './mantenimientos/ModelosCalificacion/variables-criticas/variables-criticas.component';
import { EscenariosRiesgosComponent } from './mantenimientos/ModelosCalificacion/escenarios-riesgos/escenarios-riesgos.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MacredRoutingModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatTreeModule,
        MatTooltipModule,
        FormsModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatListModule,
        MatSelectModule

    ],
    declarations: [
        IndexMacredComponent,
        MenuMacredComponent,
        AsociadosComponent,
        PersonasComponent,
        EstadosCivilesComponent,
        ParametrosGeneralesComponent,
        TiposPersonasComponent,
        CondicionesLaboralesComponent,
        TiposGenerosComponent,
        TiposAsociadosComponent,
        TiposFormasPagoAnalisisComponent,
        TipoIngresoAnalisisComponent,
        TipoIngresoComponent,
        ConfiguracionModelosComponent,
        ConfiguracionParametrosPdComponent,
        TipoActividadEconomicaComponent,
        FclComponent,
        EscenariofclComponent,
        NivelesCapacidadPagoComponent,
        IndicadoresRelevantesComponent,
        DatosAnalisisComponent,
        IngresosComponent,
        PdComponent,
        VariablesCriticasComponent,
        EscenariosRiesgosComponent
    ],
    entryComponents: [
        AsociadosComponent
    ]
})
export class MacredModule { }
