import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FootherComponent } from './components/foother/foother.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FilterComponent } from './components/filter/filter.component';
import { FullWidthCarouselComponent } from './components/full-width-carousel/full-width-carousel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { AuthenticationService } from './services/authentication.service';
import { SharedService } from './shared/shared.service';
import { SessionService } from './services/session.service';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { UserLoggedInGuard } from './guards/user-loggedin.guard';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FootherComponent,
    SidebarComponent,
    FilterComponent,
    FullWidthCarouselComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthenticationService,
    SharedService,
    SessionService,
    UserLoggedInGuard
],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    translate: TranslateService,
  ) {
    translate.addLangs(['en', 'it']);
    const browserLang = localStorage.getItem('language') || translate.getBrowserLang() || navigator.language.substring(0, 2) || "en";
    const langOnStorage = localStorage.getItem('language');
    if (langOnStorage) {
      localStorage.removeItem('language');
    }
    localStorage.setItem('language', browserLang.match(/en|it/) ? browserLang : 'en');
    translate.use(browserLang.match(/en|it/) ? browserLang : 'en');
  }
}

export function translateLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
