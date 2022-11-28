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

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatDialogModule } from '@angular/material/dialog';
import { PersonasComponent } from './mantenimientos/Personas/personas-component';

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

        MatDialogModule

    ],
    declarations: [
        IndexMacredComponent,
        MenuMacredComponent,
        AsociadosComponent,
        PersonasComponent
    ]
    ,
    entryComponents: [
        AsociadosComponent
    ]
})
export class MacredModule { }
