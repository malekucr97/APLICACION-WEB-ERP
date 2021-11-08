import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';

import { AdminUserComponent } from './adminUser.component';
import { AddEditComponent } from './add-edit.component';


import { RegisterUserComponent } from './register.component';
// import { AddBusinessComponent } from './addbusiness.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsersRoutingModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent,
        // AddBusinessComponent,
        RegisterUserComponent,
        AdminUserComponent
    ]
})
export class UsersModule { }
