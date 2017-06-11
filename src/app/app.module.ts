import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

/*
 * Platform and Environment providers/directives/pipes
 */
import { routing } from './app.routing'
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

// Core providers
import { CoreModule } from "./core/core.module";
import { SmartadminLayoutModule } from "./shared/layout/layout.module";
import { LoginComponent } from "app/+auth/+login/login.component";
import { AuthGuard } from "app/+auth/+guards/auth.guards";
import { AuthenticationService } from "app/+auth/+services/authentication.service";
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { BackendService } from "app/+rest/backend.service";
import { Router } from "@angular/router";

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

export function provideBackendService(http: Http, authHttp: AuthHttp, router: Router) {

  let url = "http://localhost:8080";
  return new BackendService(url, http, authHttp, router);
}


// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [  //solo van componentes
    AppComponent, LoginComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,

    CoreModule,
    SmartadminLayoutModule,



    routing
  ],
  exports: [
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    // ENV_PROVIDERS,
    AuthGuard,
    AuthenticationService,
    APP_PROVIDERS,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    {
      provide: BackendService,
      useFactory: provideBackendService,
      deps: [Http, AuthHttp, Router]
    }

  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) { }


}

