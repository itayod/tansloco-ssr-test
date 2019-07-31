// angular
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// libs
import { CookieService, CookieModule } from '@gorniv/ngx-universal';
import { TransferHttpCacheModule } from '@nguniversal/common';
// shared
import { SharedModule } from '@shared/shared.module';
import { TranslatesService } from '@shared/translates';
import { AuthService } from '@shared/services/auth.service';
// components
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { UniversalStorage } from '@shared/storage/universal.storage';
// interceptors
import { TokenInterceptor } from '@shared/interceptors/token.interceptor';
import { ErrorInterceptor } from '@shared/interceptors/error.interceptor';
import { AuthGuard } from '@shared/guards/auth.guard';
import { UnAuthGuard } from '@shared/guards/un-auth.guard';
import { environment } from '../environments/environment';
import { TranslocoModule, TRANSLOCO_CONFIG, TRANSLOCO_LOADER, TranslocoConfig, TranslocoService } from '@ngneat/transloco';

export function initLanguage(translateService: TranslatesService): Function {
  return (): Promise<any> => translateService.initLanguage();
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    TransferHttpCacheModule,
    HttpClientModule,
    RouterModule,
    AppRoutes,
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    SharedModule.forRoot(),
    TranslocoModule,
  ],
  declarations: [AppComponent],
  providers: [
    CookieService,
    UniversalStorage,
    AuthService,
    // Guards
    AuthGuard,
    UnAuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // { provide: APP_INITIALIZER, useFactory: initLanguage, multi: true, deps: [TranslatesService] },
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        runtime: false,
        defaultLang: 'en',
        prodMode: environment.production
      } as TranslocoConfig
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: getUser,
      deps: [TranslocoService]
    },
    { provide: TRANSLOCO_LOADER, useFactory: HttpLoader, deps: [TranslatesService] },
  ],
})
export class AppModule {
}


export function getUser(transloco: TranslocoService) {
  return function() {
    return transloco.setLangAndLoad('en').toPromise();
  };
}


export function HttpLoader(translate: TranslatesService) {
  return function(lang: string) {
    console.log('loading...', lang);
    return translate.initLanguage();
  };
}
