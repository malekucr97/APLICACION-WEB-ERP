import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './layout.component';
import { LandingRoutingModule } from './landing-routing.module';

import { BusinessPageComponent } from './businessPage.component';
import { NotRolPageComponent } from './notRolPage.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        LandingRoutingModule
    ],
    declarations: [
        LayoutComponent,
        BusinessPageComponent,
        NotRolPageComponent
    ]
})
export class LandingModule { }
