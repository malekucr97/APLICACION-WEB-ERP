import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ErrorInterceptor, JwtInterceptor, TranslateMessageInterceptor } from '@app/_helpers';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateHttpLoader,
        deps: [HttpClient]  // No se pasan parámetros aquí
      },
      defaultLanguage: 'es',
      extend: true
    })
  ],
  exports: [
    TranslateModule
  ],
  providers: [
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,  // Nuevo token de configuración
      useValue: {
        prefix: './assets/i18n/',
        suffix: '.json'
      }
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-CR' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TranslateMessageInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class CoreModule {
  // Evita que se importe dos veces
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) throw new Error('CoreModule debe importarse en AppModule.');
  }
}


// import { NgModule, Optional, SkipSelf } from '@angular/core';
// import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { MAT_DATE_LOCALE } from '@angular/material/core';
// import { ErrorInterceptor, JwtInterceptor, TranslateMessageInterceptor } from '@app/_helpers';
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';

// export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

// @NgModule({
//   imports: [
//     TranslateModule.forRoot({
//       loader: {
//         provide: TranslateLoader,
//         useFactory: HttpLoaderFactory,
//         deps: [HttpClient]
//       },
//       defaultLanguage: 'es',
//       extend: true,
//     })
//   ],
//   exports: [
//     TranslateModule
//   ],
//   providers: [
//     { provide: MAT_DATE_LOCALE, useValue: 'es-CR' },
//     { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
//     { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
//     { provide: HTTP_INTERCEPTORS, useClass: TranslateMessageInterceptor, multi: true },
//     // ## rewrrite /# ## //
//     { provide: LocationStrategy, useClass: HashLocationStrategy },
//     provideHttpClient(withInterceptorsFromDi())
//   ]
// })
// export class CoreModule {
//   // Evita que se importe dos veces
//   constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
//     if (parentModule)  throw new Error('CoreModule debe importarse en AppModule.');
//   }
// }
