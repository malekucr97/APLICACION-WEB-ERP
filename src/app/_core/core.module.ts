import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpBackend, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ErrorInterceptor, JwtInterceptor, TranslateMessageInterceptor } from '@app/_helpers';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export function HttpLoaderFactory(httpHandler: HttpBackend) {
    return new TranslateHttpLoader(new HttpClient(httpHandler));
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend]
      },
      defaultLanguage: 'es',
      extend: true,
    })
  ],
  exports: [
    TranslateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CR' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TranslateMessageInterceptor, multi: true },
    // ## rewrrite /# ## //
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class CoreModule {
  // Evita que se importe dos veces
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule)  throw new Error('CoreModule debe importarse en AppModule.');
  }
}
