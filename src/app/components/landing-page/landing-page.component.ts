import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { ChangePasswordRequest } from 'src/app/models/authentication';
import { PaymentStatus } from 'src/app/models/payment';
import { CartItem } from 'src/app/models/product';
import { MappedEnum } from 'src/app/models/utils';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  die$ = new Subject();
  changePassword: FormGroup = new FormGroup({});
  passwordsMatching = false;
  isConfirmPasswordDirty = false;
  loading: boolean = false;
  token: string | null;
  paymentResult: string | null;
  changeSuccess: boolean;
  isUserActionLandingPage: boolean;
  paymentSuccessStatus: boolean;
  paymentSuccessMapped: MappedEnum[];
  statusHandled?: MappedEnum;

  get newPwd() { return this.changePassword.get('NewPwd'); }
  get confirmPwd() { return this.changePassword.get('ConfirmPwd'); }

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private translate: TranslateService,
    private cartService: CartService
  ) {
    this.token = null;
    this.changeSuccess = false;
    this.isUserActionLandingPage = true;
    this.paymentResult = null;
    this.paymentSuccessStatus = false;
    this.paymentSuccessMapped = [];
    this.statusHandled = undefined;
  }

  ngOnInit(): void {
    this.ConvertEnumToArray();
    this.HandleRoute();
  }

  ngOnDestroy(): void {
    this.die$.next(null);
    this.die$.complete();
  }

  HandleRoute(): void {
    const path = window.location.pathname;
    if (path) {
      if (path.includes('payment')) {
        this.isUserActionLandingPage = false;
        this.HandlePaymentResultPage();
      } else if (path.includes('landingpage')) {
        this.isUserActionLandingPage = true;
        this.HandleUserLandingPage();
      } else {
        this.router.navigate(['/home']);
      }
    }
  }

  HandleUserLandingPage(): void {
    this.route.paramMap.pipe(takeUntil(this.die$)).subscribe(paramMap => {
      const token = paramMap.get('token');
      if (token && token !== 'null') {
        this.token = token;
      }
    });
    this.CreateForm();
  }

  HandlePaymentResultPage(): void {
    this.route.queryParams
    .subscribe(params => {
      this.paymentResult = params['status'];
      if (this.paymentResult) {
        this.statusHandled = this.paymentSuccessMapped.find(x => x.value === this.paymentResult);
        if (this.statusHandled) {
            this.paymentSuccessStatus = this.statusHandled.id !== 1;
            if (this.paymentSuccessStatus && (this.statusHandled.id === 0 || this.statusHandled.id === 2)) {
              this.EmptyCart();
            }
        } else {
          this.sharedService.ShowToast(this.translate.instant('Payment.Result.NotHandled'), { isSuccess: false, delay: 3000 });
        }
      } else {
        this.sharedService.ShowToast(this.translate.instant('Payment.Result.NotFound'), { isSuccess: false, delay: 3000 });
      }
    });
  }

  ConvertEnumToArray(): void {
    this.paymentSuccessMapped = [];
    for (var enumMember in PaymentStatus) {
      const isValueProperty = parseInt(enumMember, 10) >= 0;
      if (isValueProperty) {
        const el: any = {
          id: parseInt(enumMember),
          value: PaymentStatus[enumMember]
        };
        this.paymentSuccessMapped.push(el);
      }
    }
  }

  CreateForm(): void {
    this.changePassword = this.fb.group({
      NewPwd: [null, [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]],
      ConfirmPwd: [null, [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]],
    },
      {
        validator: this.ConfirmedValidator('NewPwd', 'ConfirmPwd'),
      });
  }

  ConfirmedValidator(controlName: string, matchingControlName: string): (formGroup: FormGroup) => void {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmit(): void {
    this.loading = true;
    const req: ChangePasswordRequest = {
      confirmNewPassword: this.confirmPwd && this.confirmPwd.value ? this.confirmPwd.value : null,
      newPassword: this.newPwd && this.newPwd.value ? this.newPwd.value : null,
      oldPassword: null
    }
    if (this.token) {
      this.authService.ChangePassowrd(req, this.token)
        .pipe(takeUntil(this.die$), finalize(() => this.loading = false))
        .subscribe({
          next: res => {
            this.changeSuccess = true;
          }
        })
    }
  }

  GoToLogin(): void {
    this, this.router.navigateByUrl('/user/Login');
  }

  Navigate(route: string): void {
    this.router.navigate([route]);
  }

  EmptyCart(): void {
    this.cartService.EditCart([])
    .pipe(takeUntil(this.die$))
    .subscribe({
      next: cart => {
        let toShare: CartItem[] = [];
        if (cart) {
          toShare = cart;
        }
        this.sharedService._cart.next(toShare);
        this.cartService.SaveCartOnStorage(toShare);
      }
    })
  }
}
