import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeneralesRoutingModule } from './generales-routing.module';
import { IndexGeneralesComponent } from './index.component';
import { MenuGeneralesComponent } from './menu.component';
import { ConfigurationCompaniaComponent } from './parametros/ConfigurationCompania-component';
import { TipoCambioComponent } from './parametros/TipoCambio-component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/_shared/shared.module';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        GeneralesRoutingModule,
        FormsModule,
        SharedModule,
        TranslateModule.forChild()
    ],
    declarations: [
        IndexGeneralesComponent,
        MenuGeneralesComponent,
        ConfigurationCompaniaComponent,
        TipoCambioComponent,
    ]
})
export class GeneralesModule { }
