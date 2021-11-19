import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeneralesRoutingModule } from './generales-routing.module';

import { LayoutGeneralesComponent } from './layout.component';

import { IndexGeneralesComponent } from './indexGeneralesPage.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        GeneralesRoutingModule,

        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule
    ],
    declarations: [
        LayoutGeneralesComponent,
        IndexGeneralesComponent
    ]
})
export class GeneralesModule { }
