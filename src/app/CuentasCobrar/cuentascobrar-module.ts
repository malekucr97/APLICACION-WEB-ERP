import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CuentasCobrarRoutingModule } from './cuentascobrar-routing.module';

import { IndexCuentasCobrarComponent } from './index.component';
import { MenuCuentasCobrarComponent } from './menu.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import {MatTreeModule} from '@angular/material/tree';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CuentasCobrarRoutingModule,

        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,

        MatTreeModule
    ],
    declarations: [
        IndexCuentasCobrarComponent,
        MenuCuentasCobrarComponent
    ]
})
export class CuentasCobrarModule { }
