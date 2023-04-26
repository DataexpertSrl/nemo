import { trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ChangePasswordRequest } from 'src/app/models/authentication';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss'],
  animations: [
    trigger('SlideIn', [
      // transition(':enter', [
      //   style({ opacity: 1, 'width': '0px'  }),
      //   animate('800ms', style({ opacity: 1, 'width': '20px' })),
      // ]),
    ]),
  ]
})
export class MyAccountComponent implements OnInit, OnDestroy {
  die$ = new Subject();
  activeView: number;
  orders: any[];
  changePassword: FormGroup = new FormGroup({});
  passwordsMatching = false;
  isConfirmPasswordDirty = false;
  loading: boolean = false
  showPassword: string[];

  get oldPwd() { return this.changePassword.get('OldPwd'); }
  get newPwd() { return this.changePassword.get('NewPwd'); }
  get confirmPwd() { return this.changePassword.get('ConfirmPwd'); }

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private translate: TranslateService
  ) {
    this.activeView = 0;
    this.orders = [];
    this.showPassword = [];
  }

  ngOnInit(): void {
    this.CreateForm();
  }

  ngOnDestroy(): void {
    this.die$.next(null);
    this.die$.complete();
  }

  SwitchView(viewindex: number): void {
    this.activeView = viewindex;
    this.changePassword.reset();
  }

  SignOut(): void {
    this.authService.SignOut()
    .pipe(takeUntil(this.die$))
    .subscribe({
      next: res => {
        localStorage.clear();
        sessionStorage.clear();
        this.sharedService.userLoggedIn = false;
        this.sharedService._cart.next([]);
        this.authService.AuthenticateGuest().pipe(takeUntil(this.die$))
        .subscribe({
          next: res => {
            this.authService.SaveAuthentication(res);
            this.router.navigate(['/home']);
          },
          error: e => {
            window.location.reload();
          }
        })

      }
    })
  }

  CreateForm(): void {
    this.changePassword = this.fb.group({
      OldPwd: [null, Validators.required],
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
        oldPassword: this.oldPwd && this.oldPwd.value ? this.oldPwd.value : null,
    }
    this.authService.ChangePassowrd(req, null)
    .pipe(takeUntil(this.die$), finalize(() => this.loading = false))
    .subscribe({
      next: res => {
        this.changePassword.reset();
        this.sharedService.ShowToast(this.translate.instant('MyAccount.PwdChangeOk'), { isSuccess: true, delay: 3000 });
      }
    })
  }
}
