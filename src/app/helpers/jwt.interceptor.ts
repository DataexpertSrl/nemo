import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { AuthenticationRequest, AuthenticationResponse } from '../models/authentication';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private pin?: string;
  private username?: string;

  constructor(
    private authService: AuthenticationService,
    private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authObj = this.authService.GetAuthentication();
    if(authObj) {
      request = request.clone({
        setHeaders: {
            Authorization: `Bearer ${authObj.access_token}`
        }
      });
      return next.handle(request)
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !request.url.endsWith('GetAuthorizationToken')) {
             return this.handle401Error(request, next, authObj);
        } else if (error instanceof HttpErrorResponse && error.status === 401 && request.url.endsWith('GetAuthorizationToken')) {
          // this occurs when trying to use an expired refresh token
            //the user will be returned to the login page
            this.authService.RemoveAuth();
            this.router.navigate(['user/Login'])
        }
        return throwError(() => error);
      }));
    } else {
      return next.handle(request);
    }

  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler, authSaved: AuthenticationResponse): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const req: AuthenticationRequest = {
        client_id: '123456789',
        grant_type: 'client_credentials',
        client_secret: null,
        email: null,
        password: null,
        refresh_token: null
      }
      if (authSaved && authSaved.grant_type) {
        if ((authSaved.grant_type === 'password' || authSaved.grant_type === 'refresh_token') && authSaved.refresh_token) {
          req.grant_type = 'refresh_token',
          req.refresh_token = authSaved.refresh_token;
        }
      }

      return this.authService.Authenticate(req)
      .pipe(
        switchMap((res: AuthenticationResponse) => {
          if (res) {
            this.authService.SaveAuthentication(res);
            this.refreshTokenSubject.next(res.access_token);
          }
          return next.handle(this.addTokenHeader(request, res.access_token));

        }),
        catchError((error) => {
           return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    }
      return this.refreshTokenSubject.pipe(
        filter((token) => !!token),
        take(1),
         switchMap((token) => next.handle(this.addTokenHeader(request, token)))
      );
  }
  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<void> {
    request = request.clone({
      setHeaders: {
          Authorization: `Bearer ${token}`
      }
    });
    return request;
  }
}
