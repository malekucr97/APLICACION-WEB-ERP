import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { LandingRoutingModule } from './landing-routing.module';
// import { BusinessPageComponent } from './businessPage.component';
import { IndexContentPageComponent } from './indexContentPage.component';
// -- landing no application
import { InactiveUserPageComponent } from './nouser/inactiveUserPage.component';
import { PendingUserPageComponent } from './nouser/pendingPage.component';
import { NotRolPageComponent } from './nouser/notRolPage.component';
import { NotBusinessUserPageComponent } from './nouser/notBusinessUserPage.component';
import { InactiveRolPageComponent } from './nouser/inactiveRolPage.component';
// -- importaciones menú
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
        // -- Menú importation
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule
    ],
    declarations: [
        LayoutComponent,
        IndexContentPageComponent,
        // -- landing no application
        InactiveUserPageComponent,
        PendingUserPageComponent,
        NotRolPageComponent,
        NotBusinessUserPageComponent,
        InactiveRolPageComponent
    ]
})
export class LandingModule { }
