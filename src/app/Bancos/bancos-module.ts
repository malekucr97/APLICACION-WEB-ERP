import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BancosRoutingModule } from './bancos-routing.module';

import { IndexBancosComponent } from './index.component';
import { MenuBancosComponent } from './menu.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BancosRoutingModule,

        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule
    ],
    declarations: [
        IndexBancosComponent,
        MenuBancosComponent
    ]
})
export class BancosModule { }
