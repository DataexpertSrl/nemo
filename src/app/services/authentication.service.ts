import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationRequest, AuthenticationResponse, ChangePasswordRequest, SignInRequest } from '../models/authentication';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
    ) { }

  GetAuthentication(): AuthenticationResponse | null {
    let res: AuthenticationResponse | null = null;
    const authOnStorage = localStorage.getItem('auth');
    if (authOnStorage) {
      res = JSON.parse(authOnStorage);
    }
    return res;
  }

  SaveAuthentication( auth: AuthenticationResponse): void {
    let expDate = new Date();
    expDate.setSeconds(expDate.getSeconds() + auth.access_token_expires_in);
    auth.expirationDate = expDate;
    localStorage.setItem('auth', JSON.stringify(auth));
  }

  GetToken(): string | null {
    const auth = this.GetAuthentication();
    if (auth && auth.expirationDate) {
      const now = new Date();
      if (now < new Date(auth.expirationDate)) {
        return auth.access_token;
      } else {

      }
    }
    return null;
  }

  CreateGuestAuthRequest(): AuthenticationRequest {
    const req: AuthenticationRequest = {
      client_id: '123456789',
      grant_type: 'client_credentials',
      client_secret: null,
      email: null,
      password: null,
      refresh_token: null
    }
    return req;
  }

  Authenticate(auth: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${environment.baseApiUrl}GetAuthorizationToken`, auth);
  }

  AuthenticateGuest(): Observable<AuthenticationResponse> {
    const req: AuthenticationRequest = {
      client_id: '123456789',
      client_secret: '987654',
      email: null,
      grant_type: 'client_credentials',
      password: null,
      refresh_token: ''
    }
    return this.http.post<AuthenticationResponse>(`${environment.baseApiUrl}GetAuthorizationToken`, req);
  }

  RemoveAuth(): void {
    localStorage.removeItem('auth');
    this.sharedService.userLoggedIn = false;
  }

  CheckEmail(email: string): Observable<any> {
    return this.http.get<any>(`${environment.baseApiUrl}CheckIfEmailAlreadyExist/${email}`);
  }

  SignIn(req: SignInRequest): Observable<any> {
    return this.http.post<any>(`${environment.baseApiUrl}UserRegistration`, req);
  }

  SignOut(): Observable<void> {
    return this.http.get<any>(`${environment.baseApiUrl}LogoutUser`);
  }

  ChangePassowrd(req: ChangePasswordRequest, token: string | null): Observable<void> {
    let url = `ResetPassword`;
    if (token) {
      url = url + `/${token}`;
    }
    return this.http.post<void>(`${environment.baseApiUrl}${url}`, req);
  }

  ForgottenPassword(email: string): Observable<void> {
    return this.http.get<any>(`${environment.baseApiUrl}GenerateResetPasswordLink/${email}`);
  }
}
