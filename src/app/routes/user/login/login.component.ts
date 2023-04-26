import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthenticationRequest, SignInRequest } from 'src/app/models/authentication';
import { CartItem } from 'src/app/models/product';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('FatherTabAnimation', [
    ]),
    trigger('TabFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1})),
      ])
    ]),
  ]
})
export class LoginComponent implements OnInit, OnDestroy{
  tabActive: number = 1;
  loginForm: FormGroup = new FormGroup({});
  die$ = new Subject();
  loading: boolean = false;
  loginError: string = '';
  signInError: string ='';
  sendLinkDisable: boolean = false;

  get email() { return this.loginForm.get('Email'); }

  get pwd() { return this.loginForm.get('Password'); }

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private sharedService: SharedService,
    private translate: TranslateService,
    private cartService: CartService
    ) {
  }

  ngOnInit(): void {
    this.OpenTab(1);
  }

  ngOnDestroy(): void {
      this.die$.next(null);
      this.die$.complete();
  }

  OpenTab(id: number): void {
    this.tabActive = id;

    if (this.loginForm) {
      this.loginForm.reset();
    }
    this.loginError = '';
    this.signInError = '';

    if (this.tabActive === 1) {
      //login
      this.CreateLoginForm();
    } else if (this.tabActive === 2) {
      // register
      this.CreateRegisterForm()
    }

  }

  CreateRegisterForm(): void {
    this.loginForm = this.fb.group({
      Email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      Password: [null, [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]],
    });
  }

  CreateLoginForm(): void {
    this.loginForm = this.fb.group({
      Email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      Password: [null, Validators.required],
    });
  }

  LoginOrRegister(): void {
    const user = {
      email: this.loginForm.controls['Email'].value,
      pwd: this.loginForm.controls['Password'].value,
    }
    if (this.tabActive === 1 ) {
      this.Login(user)

    } else if (this.tabActive === 2 ) {
      this.Register(user);
    }
  }

  Login(user: any): void {
    this.sharedService.userLoggedIn = false;
    const authReq: AuthenticationRequest = {
      client_id: '123456789',
      client_secret: '987654',
      email: user.email,
      grant_type: 'password',
      password: user.pwd,
      refresh_token: ''
    }
    this.loading = true;
    this.loginError = '';
    this.authService.Authenticate(authReq)
    .pipe(takeUntil(this.die$), finalize(() => this.loading = false))
    .subscribe({
      next: res => {
        if (res) {
          this.authService.SaveAuthentication(res);
          this.sharedService.userLoggedIn = true;
          this.SetCart();
        } else {
          this.signInError = this.translate.instant('Error.GEN');
        }
      }, error: e => {
        if (e && e.error === this.sharedService.ErrorWrongUserNameOrPassword)
        this.loginError = this.translate.instant('Error.AUTH008');
      }
    })
  }

  Register(user: any): void {
    const req: SignInRequest = {
      email: user.email,
      password: user.pwd,
      preferredLanguage: this.translate.currentLang
    }
    this.loading = true;
    this.signInError = '';
    this.authService.CheckEmail(req.email).pipe(takeUntil(this.die$))
      .subscribe({
        next: res => {
          this.authService.SignIn(req)
          .pipe(takeUntil(this.die$), finalize(() => this.loading = false))
          .subscribe({
            next: res => {
              this.router.navigate(['landingpage'])
            }, error: e => {
              this.signInError = this.translate.instant('Error.GEN');
            }
          })
        },
        error: e => {
          if (e && e.error === this.sharedService.ErrorEmailAlreadyExist) {
            this.signInError = this.translate.instant('Error.AUTH015');
          }
          this.loading = false;
        }
      })

  }

  SetCart(): void {
    if (this.sharedService.userLoggedIn) {
      this.cartService.GetShoppingCart()
      .pipe(takeUntil(this.die$), finalize(() => this.router.navigate(['/home'])))
      .subscribe({
        next: res => {
          let toShare: CartItem[] = [];
          if (res) {
            toShare = res;
            this.sharedService._cart.next(toShare);
            this.cartService.SaveCartOnStorage(toShare)
          } else {
            this.sharedService.GetShoppingCartGuest();
          }
        },
        error: err => {
          this.sharedService.GetShoppingCartGuest();
        }
      })
    } else {
      this.sharedService.GetShoppingCartGuest();
    }
  }

  ForgotPassowrd(): void {
    if (this.email && this.email.value && this.email.valid && !this.sendLinkDisable) {
      this.sendLinkDisable = true;
      this.authService.ForgottenPassword(this.email.value)
      .pipe(takeUntil(this.die$), finalize(() => this.sendLinkDisable = false))
      .subscribe({
        next: res => {
          this.sharedService.ShowToast(this.translate.instant('User.EmailForgottenLinkSend'), { isSuccess: true, delay: 3000 })
        } ,
        error: e => {
          if (e.error === this.sharedService.ErrorWrongUserNameOrPassword) {
            this.sharedService.ShowToast(this.translate.instant('User.EmailNotExist'), { isSuccess: false, delay: 3000 })
          }
        }
      })
    }
  }
}
