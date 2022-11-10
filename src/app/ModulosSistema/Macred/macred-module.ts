import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
        MatTooltipModule
    ],
    declarations: [
        IndexMacredComponent,
        MenuMacredComponent,
        AsociadosComponent
    ]
})
export class MacredModule { }
