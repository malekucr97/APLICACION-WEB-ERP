﻿import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpBackend, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor, TranslateMessageInterceptor } from './_helpers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';

// -- >> ** componentes iniciales sistema ** << --
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';

import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { TranslateComponent } from './_components/translate/translate.component';
import { MatSelectModule } from '@angular/material/select';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';;
import { FooterComponent } from './_components/footer/footer.component'
import { TranslateMessagesService } from './_services/translate-messages.service';

export function HttpLoaderFactory(httpHandler: HttpBackend) {
    return new TranslateHttpLoader(new HttpClient(httpHandler));
}

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
    ], imports: [BrowserModule,
        AppRoutingModule,
        MatIconModule,
        BrowserAnimationsModule,
        MatTreeModule,
        MatTooltipModule,
        MatToolbarModule,
        MatSelectModule,
        TranslateModule.forRoot({
            defaultLanguage: 'es',
            extend: true,
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpBackend]
            },
        })], providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: TranslateMessageInterceptor, multi: true },
        // ## rewrrite /# ## //
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
