import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role.routing.module';

import { LayoutRoleComponent } from './layoutrole.component';
import { AdminRoleComponent } from './adminRole.component';
import { RegisterRoleComponent } from './register.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RoleRoutingModule
    ],
    declarations: [
        LayoutRoleComponent,
        AdminRoleComponent,
        RegisterRoleComponent
    ]
})
export class RoleModule { }