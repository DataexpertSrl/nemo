import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { CartItem, FullWidthProduct, Product, ProductDetail, ProductMin, Review } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  animations: [
    trigger('FatherTabAnimation', [
    ]),
    trigger('TabFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms', style({ opacity: 1})),
      ])
    ]),
  ]
})
export class ProductDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  die$ = new Subject();
  loading: boolean;
  thumbImage: string;
  fullImage: string | null;
  id: string | null
  basePath: string
  selectedImage: string | null;
  imageList: string[];
  product: ProductDetail | null;
  selectedImageIndex?: number;
  quantity: number;
  tabActive: number;
  hideImageZoom: boolean;
  reviews: Review[];
  recommended: Product[];
  disableAdd: boolean;
  productNotFound: boolean;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private sharedService: SharedService,
    private translate: TranslateService,
    private cartService: CartService
  ) {
    this.loading = false
    this.thumbImage = '';
    this.fullImage = '';
    this.id = null;
    this.selectedImage = null;
    this.imageList = [];
    this.product = null;
    this.basePath = this.sharedService.basePath;
    this.selectedImageIndex = undefined;
    this.quantity = 1;
    this.tabActive = 1;
    this.hideImageZoom = false;
    this.reviews = [];
    this.recommended = [];
    this.disableAdd = false;
    this.productNotFound = false;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      if (this.id) {
        // this.selectedImage = '1-big.jpg';
        // this.thumbImage = `assets/images/products/extended/${this.id}-big.jpg`;
        // this.fullImage = `assets/images/products/extended/${this.id}-big.jpg`;
        // this.thumbImage = `assets/images/products/extended/1-big.jpg`
        // this.fullImage = `assets/images/products/extended/1-big.jpg`;

        this.GetProductDetail();
      }
    })
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {

  }

  GetProductDetail(): void {
    this.productNotFound = false;
    this.loading = true;
    this.productService.GetProductById(this.id)
    .pipe(takeUntil(this.die$), finalize(() => this.loading = false))
    .subscribe({
      next: res => {
        this.product = res;
        this.GetAllReview();
        this.SelectImage(this.product && this.product.imagesUrl ? this.product.imagesUrl[0] : null)
      },
      error: e => {
        if (e.error === this.sharedService.ErrorProductNotFound) {
          this.productNotFound  = true;
        }
      }
    })
    if (this.product) {

    }
  }

  SelectImage(path: string | null): void {
    this.fullImage = path;
    if (path) {
      this.selectedImageIndex = this.product?.imagesUrl?.indexOf(path);
    }
  }

  OpenFullWidth(): void {
    if (this.product && this.selectedImageIndex !== undefined && this.selectedImageIndex != null) {
      const fwp: FullWidthProduct = {
        Product: this.product as ProductDetail,
        SelectedImage: this.selectedImageIndex as number
      }
      this.sharedService._fullWitdhProduct.next(fwp);
    }
  }

  ChangeQuantity(event: any): void {
    this.quantity = event;
  }

  OpenTab(id: number): void {
    this.tabActive = id;
  }

  ScrollTo(el: HTMLElement): void {
    this.tabActive = 3;
    el.scrollIntoView();
  }

  GetAllReview(): void {
    this.reviews = this.productService.GetReview(this.id!);
  }

  ReviewChange(event: any): void {
  }

  ProductRecommended(): void {
    this.productService.GetProduct()
    .pipe(takeUntil(this.die$))
    .subscribe({
      next: res => {
        if (res && res.productsNumber > 0) {
          this.recommended = res.products;
        }
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  Resize(event: any): void {
    this.hideImageZoom = true;
    setTimeout(() => {
      this.hideImageZoom = false;
    }, 800);
  }

  AddToCart(): void {
    if (this.product) {
      this.disableAdd = true;
      const toAdd: ProductMin = {
        id: this.product!.id,
        name: this.product!.name,
        quantity: this.quantity,
        weight: this.product.weight ? this.product.weight : 0
      }
      const newCart = this.sharedService.AddItemToCart(toAdd, true)
      if (this.sharedService.userLoggedIn) {
        this.SaveCart(newCart);
      } else {
        this.cartService.SaveCartOnStorage(newCart);
        this.sharedService._cart.next(newCart);
        this.disableAdd = false;
        this.sharedService.ShowToast(this.translate.instant('Cart.SuccessfullyAdded'), { isSuccess: true, delay: 3000 });
      }
    }
  }

  SaveCart(cart: CartItem[]): void {
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
