import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { CartItem, ProductMin } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, AfterViewInit, OnDestroy{

  die$ = new Subject();
  cart: CartItem[];
  disableChange: boolean;
  smallWidth: boolean;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private cartService: CartService
  ) {
    this.cart = [];
    this.disableChange = false;
    this.smallWidth = false;
  }

  ngOnInit(): void {
    this.Resize(null);
    this.GetCart();
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.die$.next(null);
    this.die$.complete();
  }

  GetCart(): void {
    this.sharedService.cart$.pipe(takeUntil(this.die$))
    .subscribe({
      next: res => {
        if (res) {
          this.cart = res.map(i => {i.price = i.price ? i.price : 0.00; return i});
        } else {
          this.cart = [];
        }
      }
    })
  }

  QuantityChage($event: any, item: CartItem): void {
    item.quantity = $event;
    this.ChangeOrRemoveItem(item, false);
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
      }
    })
  }

  GetTotal(): number {
    let tot = 0.00;
    if (this.cart) {
      this.cart.forEach(item => {
          tot = tot + (item.price * item.quantity);
      });
    }
    return tot;
  }

  @HostListener('window:resize', ['$event'])
  Resize(event: any) {
    if (window.innerWidth < 992) {
      this.smallWidth = true;
    } else {
      this.smallWidth = false;
    }
  }

  GetPrice(price: number | null): number {
    let res = 0.00;
    if (price) {
      res = price;
    }
    return res;
  }

  GoToCheckOut(): void {
    if (!this.disableChange) {
      this.router.navigate(['shopping/checkout']);
    }
  }

  GoToDetail(id: number): void {
    this.router.navigate([`product/detail/${id}`])
  }
}
