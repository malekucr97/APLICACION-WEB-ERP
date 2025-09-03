import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/_shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule,
        SharedModule,
        TranslateModule.forChild()
    ],
    declarations: [
        LayoutComponent,
        LoginComponent
    ]
})
export class AccountModule { }
