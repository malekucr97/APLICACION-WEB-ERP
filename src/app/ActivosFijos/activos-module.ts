import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivosFijosRoutingModule } from './activos-routing.module';

import { IndexActivosFijosComponent } from './index.component';
import { MenuActivosFijosComponent } from './menu.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ActivosFijosRoutingModule,

        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule
    ],
    declarations: [
        IndexActivosFijosComponent,
        MenuActivosFijosComponent
    ]
})
export class ActivosFijosModule { }
