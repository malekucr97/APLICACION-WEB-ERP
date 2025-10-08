import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// -- >> ** componentes iniciales sistema ** << --
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';

import { TranslateComponent } from './_components/translate/translate.component';

import { FooterComponent } from './_components/footer/footer.component'
import { SharedModule } from './_shared/shared.module';
import { CoreModule } from './_core/core.module';

@NgModule({ declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        TranslateComponent,
        FooterComponent
    ],
    bootstrap: [
        AppComponent,
        TranslateComponent,
        FooterComponent
    ], 
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SharedModule,
        CoreModule
    ] })
export class AppModule { }