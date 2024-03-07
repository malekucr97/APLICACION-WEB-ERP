import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { LandingRoutingModule } from './landing-routing.module';
import { IndexContentPageComponent } from './indexContentPage.component';

// -- Páginas de No Inicio de Sesión
import { InactiveUserPageComponent }    from './nologgin/inactiveUserPage.component';
import { PendingUserPageComponent }     from './nologgin/pendingPage.component';
import { NotRolPageComponent }          from './nologgin/notRolPage.component';
import { NotBusinessUserPageComponent } from './nologgin/notBusinessUserPage.component';
import { InactiveRolPageComponent }     from './nologgin/inactiveRolPage.component';
import { BlockedUserPageComponent }     from './nologgin/blockedUserPage.component';

// -- importaciones menú
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ActivateUserPageComponent } from './nologgin/activateUserPage.component';
import { TranslateModule } from '@ngx-translate/core';
import { NotModulePageComponent } from './nologgin/notModulePage.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LandingRoutingModule,
        CommonModule,
        TranslateModule.forChild(),
        // ******************
        // -- Utilidades menú
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule
        // -- Utilidades menú
        // ******************
    ],
    declarations: [
        LayoutComponent,

        // *********************************
        // Componente de Inicio de Sesión **
        // *********************************
        IndexContentPageComponent,
        // *********************************

        // -- no loggin application
        InactiveUserPageComponent,
        PendingUserPageComponent,
        NotRolPageComponent,
        NotBusinessUserPageComponent,
        InactiveRolPageComponent,
        BlockedUserPageComponent,
        ActivateUserPageComponent,
        NotModulePageComponent
    ]
})
export class LandingModule { }
