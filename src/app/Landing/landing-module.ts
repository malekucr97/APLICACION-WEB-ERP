import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './layout.component';
import { LandingRoutingModule } from './landing-routing.module';

import { BusinessPageComponent } from './businessPage.component';
import { NotRolPageComponent } from './notRolPage.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        LandingRoutingModule,
        CommonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule
    ],
    declarations: [
        LayoutComponent,
        BusinessPageComponent,
        NotRolPageComponent
    ]
})
export class LandingModule { }
