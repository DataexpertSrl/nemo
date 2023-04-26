import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { CartItem } from './models/product';
import { AuthenticationService } from './services/authentication.service';
import { CartService } from './services/cart.service';
import { ProductService } from './services/product.service';
import { SessionService } from './services/session.service';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Headless_poc';
  die$ = new Subject();
  show: boolean;

  constructor(
    public translate: TranslateService,
    private renderer: Renderer2,
    private authService: AuthenticationService,
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef,
    private cartService: CartService) {
      this.show = false;
  }

  ngOnInit(): void {
    sessionStorage.clear();
  }

  ngAfterViewInit() {
    this.CheckAuthentication();
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
      this.die$.next(null);
      this.die$.complete();
  }

  CheckAuthentication(): void {
    const authSaved = this.authService.GetAuthentication();
    this.sharedService.userLoggedIn = false;
    if (!authSaved) {
      const req = this.authService.CreateGuestAuthRequest();
      this.authService.Authenticate(req)
      .pipe(finalize(() => this.SetCart()))
      .subscribe({
        next: res => {
          this.authService.SaveAuthentication(res);
        }
      })
    } else {
      if (authSaved.grant_type && authSaved.grant_type === 'password' || authSaved.grant_type === 'refresh_token') {
        this.sharedService.userLoggedIn = true;
      }
      this.SetCart();
    }
  }

  HideLoader(): void {
    let loader = this.renderer.selectRootElement('#app-loader-cotainer');
    this.renderer.setStyle(loader, 'display', 'none');
    this.show = true;
  }

  SetCart(): void {
    if (this.sharedService.userLoggedIn) {
      this.cartService.GetShoppingCart()
      .pipe(takeUntil(this.die$), finalize(() => this.HideLoader()))
      .subscribe({
        next: res => {
          if (res) {
           this.sharedService._cart.next(res);
          } else {
            this.sharedService._cart.next([]);
          }
        }
      })
    } else {
      this.sharedService.GetShoppingCartGuest();
      this.HideLoader()
    }
  }
}
