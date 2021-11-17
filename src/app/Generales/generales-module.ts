import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeneralesRoutingModule } from './generales-routing.module';

import { LayoutGeneralesComponent } from './layout.component';


@NgModule({
imports: [
CommonModule,
ReactiveFormsModule,
GeneralesRoutingModule
],
declarations: [
LayoutGeneralesComponent
]
})
export class GeneralesModule { }