import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CuentasPagarRoutingModule } from './cuentaspagar-routing.module';

import { IndexCuentasPagarComponent } from './index.component';
import { MenuCuentasPagarComponent } from './menu.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CuentasPagarRoutingModule,

        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule
    ],
    declarations: [
        IndexCuentasPagarComponent,
        MenuCuentasPagarComponent
    ]
})
export class CuentasPagarModule { }
