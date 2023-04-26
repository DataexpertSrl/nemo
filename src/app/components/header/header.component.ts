import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Category } from 'src/app/models/filter';
import { CartItem, ProductMin } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedLang: string;
  categories: Category[];
  selectCat?: string;
  catRowVisible: boolean;
  linkVisible: boolean;
  userLoggedIn: boolean;
  loadingCart: boolean;
  cart: CartItem[];
  disableChange: boolean;

  @Output() OpenSidebarEvent = new EventEmitter<void>();
  @ViewChild('langDropDown', {static: false}) langDropDown?: NgbDropdown;
  @ViewChild('toolbar', {static: false}) toolbar?: ElementRef<HTMLDivElement>;
  @Input() isToolbarInView: boolean;

  die$ = new Subject();

  constructor(
    public translate: TranslateService,
    private router: Router,
    private categoryService: CategoryService,
    public sharedService: SharedService,
    private cartService: CartService) {
    this.selectedLang = '';
    this.categories = [];
    this.catRowVisible = true;
    this.linkVisible = false;
    this.isToolbarInView = true;
    this.userLoggedIn = false;
    this.loadingCart = false;
    this.cart = [];
    this.disableChange = false;
    this.GetCart();
    this.router.events.subscribe({
      next: val => {
        if (val instanceof NavigationEnd) {
          this.GetActiveLink();
        }
      }
    })
  }


  ngOnInit(): void {
    this.selectedLang  = this.translate.currentLang;
    this.GetCategory();
    this.onResize(null);
    this.GetActiveLink();

  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
      this.die$.next(null);
      this.die$.complete();
  }

  GetActiveLink(): void {
    this.selectCat = undefined;
    this.categories.forEach(cat => {
      if (cat.route && window.location.pathname === cat.route) {
        this.selectCat = cat.name;
      }
    });
  }

  ChangeLang(lang: any): void {
    const langOnStorage = localStorage.getItem('language');
    if (langOnStorage) {
      localStorage.removeItem('language');
    }
    localStorage.setItem('language', lang);
    this.selectedLang = lang;
    this.translate.use(lang);
  }

  GetCategory(): void {
    this.categories = this.categoryService.getCategoriesHardCoded();
  }

  GoTo(cat: Category): void {
    let link = '/';
    if (cat.ecommerceCategoryId) {
      link = `/product/list/${cat.ecommerceCategoryId}`
    } else if (cat.name === 'Home') {
      link = '/home';
    } else if (cat.name === 'Products') {
      link = '/product/list/all';
    }
    this.router.navigateByUrl(link);
    this.selectCat = cat.name;
    window.scroll(0, 0);
  }

  OpenModalLang(): void {
    if(this.langDropDown) {
      this.langDropDown.open();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.catRowVisible = window.innerWidth > 1080;
    this.linkVisible = window.innerWidth > 1080;
  }

  OpenSidebar(): void {
    this.OpenSidebarEvent.emit();
  }

  GoHome(): void {
    this.router.navigate(['/home']);
    this.selectCat = 'Home';
  }

  LoginOrMyAccount(): void {
    if(this.sharedService.userLoggedIn) {
      this.router.navigate(['/user/MyAccount']);
    } else {
      this.router.navigate(['/user/Login'])
    }
  }

  GetCart(): void {
    this.sharedService.cart$.pipe(takeUntil(this.die$))
    .subscribe({
      next: res => {
        if (res) {
          this.cart = res;
        } else {
          this.cart = [];
        }
      }
    })
  }

  Goto(route: string): void {
    this.router.navigate([route]);
  }

  GetCartTotal(): number {
    let tot = 0.00;
    if (this.cart && this.cart.length > 0) {
      this.cart.forEach(item => {
        if(item && item.price && item.quantity) {
          tot = tot + (item.price * item.quantity);
        }
      });
    }
    return tot;
  }

  ChangeOrRemoveItem(item: CartItem, remove: boolean = false): void {
    if (item) {
      this.disableChange = true;
      let newCart: CartItem[] = [];
      if (remove) {
        newCart = this.sharedService.RemoveItemFromCart(item.productId)
      } else {
        const toAdd: ProductMin = {
          id: item.productId,
          name: item.name,
          quantity: item.quantity,
          weight: item.weight ? item.weight : 0
        }
        newCart = this.sharedService.AddItemToCart(toAdd, true)
      }

      if (this.sharedService.userLoggedIn) {
        this.SaveCart(newCart);
      } else {
        this.cartService.SaveCartOnStorage(newCart);
        this.sharedService._cart.next(newCart);
        this.disableChange = false;
      }
    }
  }

  SaveCart(cart: CartItem[]): void {
    this.cartService.EditCart(cart)
    .pipe(takeUntil(this.die$), finalize(() => this.disableChange = false))
    .subscribe({
      next: cart => {
        let toShare: CartItem[] = [];
        if (cart) {
          toShare = cart;
        }
        this.sharedService._cart.next(toShare);
        this.cartService.SaveCartOnStorage(toShare);
        this.sharedService.ShowToast(this.translate.instant('Cart.SuccessfullyRemoved'), { isSuccess: true, delay: 3000 });
      }
    })
  }

  GetPrice(price: number | null): number {
    let res = 0.00;
    if (price) {
      res = price;
    }
    return res;
  }

  GoProdDetail(id: number): void {
    this.router.navigate([`/product/detail/${id}`])
  }
}
