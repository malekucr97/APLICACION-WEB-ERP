import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InversionesRoutingModule } from './inversiones-routing.module';

import { IndexInversionesComponent } from './index.component';
import { MenuInversionesComponent } from './menu.component';

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
        InversionesRoutingModule,

        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,

        MatTreeModule,
        MatTooltipModule
    ],
    declarations: [
        IndexInversionesComponent,
        MenuInversionesComponent
    ]
})
export class InversionesModule { }
