import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { CartItem, Product, ProductMin } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-grid-card',
  templateUrl: './grid-card.component.html',
  styleUrls: ['./grid-card.component.scss'],
  animations: [
    trigger('SlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50%)' }),
        animate('250ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0%)' }),
        animate('250ms', style({ opacity: 0, transform: 'translateY(50%)' })),
      ]),
    ]),
  ]
})
export class GridCardComponent implements OnInit, OnDestroy {
  @Input() product: Product | null = null;
  @Input() minview: boolean = false;
  overProduct?: number;
  die$ = new Subject();
  disableAdd: boolean;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private translate: TranslateService,
    private cartService: CartService) {
      this.disableAdd = false;
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.die$.next(null);
    this.die$.complete();
  }

  OverProd(id?: number) {
    this.overProduct = id;
  }

  GoToDetail(id: number): void {
    this.router.navigate(['product/detail/' + id]);
  }

  AddToCart(): void {
    if (!this.disableAdd) {
      if (this.product) {
        this.disableAdd = true;
        const toAdd: ProductMin = {
          id: this.product!.id,
          name: this.product!.name,
          quantity: 1,
          weight: this.product.weight
        }
        const newCart = this.sharedService.AddItemToCart(toAdd)
        if (this.sharedService.userLoggedIn) {
          this.SaveCart(newCart);
        } else {
          this.sharedService._cart.next(newCart);
          this.disableAdd = false;
          this.sharedService.ShowToast(this.translate.instant('Cart.SuccessfullyAdded'), { isSuccess: true, delay: 3000 });

        }
      }
    }
  }

  SaveCart(cart: CartItem[]) {
    this.cartService.EditCart(cart)
    .pipe(takeUntil(this.die$), finalize(() => this.disableAdd = false))
    .subscribe({
      next: cart => {
        let toShare: CartItem[] = [];
        if (cart) {
          toShare = cart;
        }
        this.sharedService._cart.next(cart);
        this.cartService.SaveCartOnStorage(cart);
        this.sharedService.ShowToast(this.translate.instant('Cart.SuccessfullyAdded'), { isSuccess: true, delay: 3000 });
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

}
