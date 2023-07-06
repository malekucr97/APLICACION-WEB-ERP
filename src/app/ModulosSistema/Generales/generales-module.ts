import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeneralesRoutingModule } from './generales-routing.module';

import { IndexGeneralesComponent } from './index.component';
import { MenuGeneralesComponent } from './menu.component';
import { ConfigurationCompaniaComponent } from './parametros/ConfigurationCompania-component';


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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        GeneralesRoutingModule,

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
        MatListModule
    ],
    declarations: [
        IndexGeneralesComponent,
        MenuGeneralesComponent,
        ConfigurationCompaniaComponent
    ]
})
export class GeneralesModule { }
