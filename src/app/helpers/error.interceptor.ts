import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationRequest, AuthenticationResponse } from '../models/authentication';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private sharedService: SharedService,
    private translate: TranslateService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // error 401 are intercepted by jwt interceptor, some of them are handled directy in the component
        // ErrorEmailAlreadyExist are handled directly in the submit of the form
        if (error.status !== 401) {
          if (error.error) {
            let errorCode: string | null = null;
            let errorMsg: string | null = null;
            if (error.error.includes('|')) {
              const errorSplitted = error.error.toString().split('|');
              if (errorSplitted && errorSplitted.length === 2) {
                errorCode = errorSplitted.length[0];
                errorMsg = errorSplitted[1];
              }
            }
            else {
              this.sharedService.ShowToast(this.translate.instant('Error.GEN'), { isSuccess: false, delay: 3000 });
            }
            if (errorCode !== 'PAY002') {
              if (error.error !== this.sharedService.ErrorEmailAlreadyExist) {
                if (error.error === this.sharedService.ErrorEmailMissing) {
                  this.sharedService.ShowToast(this.translate.instant('Error.AUTH006'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorPasswordMissing) {
                  this.sharedService.ShowToast(this.translate.instant('Error.AUTH007'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorUnauthorized) {
                  this.sharedService.ShowToast(this.translate.instant('Error.AUTH011'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorProductNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.PROD001'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorProductIdIsMissing) {
                  this.sharedService.ShowToast(this.translate.instant('Error.PROD002'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorQuantity) {
                  this.sharedService.ShowToast(this.translate.instant('Error.PROD003'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorProdQueryMax) {
                  this.sharedService.ShowToast(this.translate.instant('Error.PROD005'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorWrongPassword) {
                  this.sharedService.ShowToast(this.translate.instant('Error.AUTH016'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorWrongWeight) {
                  this.sharedService.ShowToast(this.translate.instant('Error.SHIP001'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorWrongPrice) {
                  this.sharedService.ShowToast(this.translate.instant('Error.SHIP002'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorMissingCountryCode) {
                  this.sharedService.ShowToast(this.translate.instant('Error.SHIP003'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorMissingZipCode) {
                  this.sharedService.ShowToast(this.translate.instant('Error.SHIP004'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorWrongDate) {
                  this.sharedService.ShowToast(this.translate.instant('Error.DATE001'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorWrongDateFormat) {
                  this.sharedService.ShowToast(this.translate.instant('Error.DATE002'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorOrderNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.ORDR001'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorOrderNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.ADDR001'), { isSuccess: false, delay: 3000 });
                }  else if (error.error === this.sharedService.ErrorOrderNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.ADDR002'), { isSuccess: false, delay: 3000 });
                }  else if (error.error === this.sharedService.ErrorOrderNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.ADDR003'), { isSuccess: false, delay: 3000 });
                }  else if (error.error === this.sharedService.ErrorOrderNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.ADDR004'), { isSuccess: false, delay: 3000 });
                }  else if (error.error === this.sharedService.ErrorOrderNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.ADDR005'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorOrderNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.ADDR006'), { isSuccess: false, delay: 3000 });
                }  else if (error.error === this.sharedService.ErrorOrderNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.ADDR007'), { isSuccess: false, delay: 3000 });
                }  else if (error.error === this.sharedService.ErrorOrderNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.ADDR008'), { isSuccess: false, delay: 3000 });
                }  else if (error.error === this.sharedService.ErrorOrderNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.ADDR009'), { isSuccess: false, delay: 3000 });
                }  else if (error.error === this.sharedService.ErrorOrderNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.ADDR010'), { isSuccess: false, delay: 3000 });
                } else if (error.error === this.sharedService.ErrorOrderNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.ADDR011'), { isSuccess: false, delay: 3000 });
                }  else if (error.error === this.sharedService.ErrorOrderNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.ADDR012'), { isSuccess: false, delay: 3000 });
                }  else if (error.error === this.sharedService.ErrorOrderNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.ADDR013'), { isSuccess: false, delay: 3000 });
                }  else if (error.error === this.sharedService.ErrorOrderNotFound) {
                  this.sharedService.ShowToast(this.translate.instant('Error.ADDR014'), { isSuccess: false, delay: 3000 });
                }  else {
                  this.sharedService.ShowToast(this.translate.instant('Error.GEN'), { isSuccess: false, delay: 3000 });
                }
              }
            } else {
              if (errorMsg) {
                this.sharedService.ShowToast(errorMsg, { isSuccess: false, delay: 3000 });
              } else {
                this.sharedService.ShowToast(this.translate.instant('Error.GEN'), { isSuccess: false, delay: 3000 });
              }
            }
          } else {
            this.sharedService.ShowToast(this.translate.instant('Error.GEN'), { isSuccess: false, delay: 3000 });
          }
        }
        return throwError(() => error);
      })
    );
  }
}
