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

import { ActivateUserPageComponent } from './nologgin/activateUserPage.component';
import { TranslateModule } from '@ngx-translate/core';
import { NotModulePageComponent } from './nologgin/notModulePage.component';
import { SharedModule } from '@app/_shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LandingRoutingModule,
        CommonModule,
        SharedModule,
        TranslateModule.forChild()
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
