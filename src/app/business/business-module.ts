import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { BusinessComponent} from './business.component';

// import { RegisterComponent} from './register.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BusinessRoutingModule
    ],
    declarations: [
        LayoutComponent,
        BusinessComponent,
        // RegisterComponent,
        ListComponent
    ]
})
export class BusinessModule { }