import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Filter } from '../models/filter';
import { CartItem, FullWidthProduct, ProductMin } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  baseApiUrl = 'https://resharkheadlessfunctions-staging.azurewebsites.net/';
  basePath = 'assets/images/products/extended/'
  filtersSaved: Filter | null;
  userLoggedIn: boolean = false;
  apiTake = 8;
  filterEmpty: Filter = {
    Categories: [],
    PriceMax: null,
    PriceMin: null,
    Sort: null,
    Search: null,
    Skip: 0,
    Take: this.apiTake
  }
  toasts: any[] = [];

  public _filterOpen = new Subject<boolean>();
  public filterOpen$: Observable<boolean>;

  public _filterApplied = new Subject<Filter | null>();
  public filterApplied$: Observable<Filter | null>;

  public _loadingProducts = new Subject<boolean>();
  public loadingProducts$: Observable<boolean>;

  public _fullWitdhProduct = new Subject<FullWidthProduct | null>();
  public fullWitdhProduct$: Observable<FullWidthProduct | null>;

  public _cart = new BehaviorSubject<CartItem[]>([]);
  public cart$: Observable<CartItem[]>;

  public _generalLoading = new Subject<boolean>();
  public generalLoading$: Observable<boolean>;

  public ErrorClientIdIsMissing: string = `AUTH001|The client_id is missing`;
  public ErrorGrantType: string = `AUTH002|The grant_type must be 'password' or 'client_credentials' or 'refresh:token or is missing`;
  public ErrorSecretMissing: string = `AUTH003|The client_secret is missin`;
  public ErrorRefreshTokenMissing: string = `AUTH004|The refresh_token is missing`;
  public ErrorIncorrectToken: string = `AUTH005|The type of token passed is not correct for the requested operation`;
  public ErrorEmailMissing: string = `AUTH006|The email is missin`;
  public ErrorPasswordMissing: string = `AUTH007|The password is missing`;
  public ErrorWrongUserNameOrPassword: string = `AUTH008|Wrong username or password`;
  public ErrorRefreshTokenRequire: string = `AUTH009|Refresh tokenexpires`;
  public ErrorUsernNameAlreadyExist: string = `AUTH010|Username already exists`;
  public ErrorUnauthorized: string = `AUTH011|Unauthorized`;
  public ErrorNewPasswordRequire: string = `AUTH012|Missing field new password`;
  public ErrorConfirmPasswordRequire: string = `AUTH013|Missing field confirm new password`;
  public ErrorPasswordTokenExpired: string = `AUTH014|Password token expires`;
  public ErrorEmailAlreadyExist: string = `AUTH015|Email already exist`;
  public ErrorWrongPassword: string = `AUTH016|Wrong user password`;
  public ErrorProductNotFound: string = `PROD001|Product not found`;
  public ErrorProductIdIsMissing: string = `PROD002|Product id is missing`;
  public ErrorQuantity: string = `PROD003|Quantity must be greather then zero`;
  public ErrorFilter: string = `PROD004|Wrong min_price or max_price or sort_by`;
  public ErrorProdQueryMax: string = `PROD005|A maximum of 100 products can be requested per quer`;
  public ErrorApplicationNotFound: string = `APP001|Application is not found, wrong client_id`;
  public GenericError: string = `GEN|Generic error`;
  public ErrorWrongWeight: string = `SHIP001|Wrong weight`;
  public ErrorWrongPrice: string = `SHIP002|Wrong price`;
  public ErrorMissingCountryCode: string = `SHIP003|Missing country_code`;
  public ErrorMissingZipCode: string = `SHIP004|Missing zip_code`;
  public ErrorWrongDate: string = `DATE001|Wrong from_date format`;
  public ErrorWrongDateFormat: string = `DATE002|Wrong to_date format`;
  public ErrorOrderNotFound: string = `ORDR001|Order not found`;
  public ErrorMissingBillingAddress: string = `ADDR001|Missing billing address"`;
  public ErrorMissingTaxClass: string = `ADDR002|Missing tax class"`;
  public ErrorMissingFiscalCode: string = `ADDR003|Missing fiscal code"`;
  public ErrorMissingVAT: string = `ADDR004|Missing VAT number"`;
  public ErrorMissingName: string = `ADDR005|Missing name"`;
  public ErrorMissingSurname: string = `ADDR006|Missing surname"`;
  public ErrorMissingSDIorPEC: string = `ADDR007|Missing sdi code or pec email"`;
  public ErrorMissingEmail: string = `ADDR008|Missing email"`;
  public ErrorMissingBusinessName: string = `ADDR009|Missing business name"`;
  public ErrorMissingAddress: string = `ADDR010|Missing address"`;
  public ErrorMissingCity: string = `ADDR011|Missing city"`;
  public ErrorMissingZIP: string = `ADDR012|Missing zip code"`;
  public ErrorMissingCountry: string = `ADDR013|Missing country code"`;
  public ErrorMissingProvince: string = `ADDR014|Missing province"`;

  constructor() {
    this.filtersSaved = null;
    this.filterOpen$ = this._filterOpen.asObservable();
    this.filterApplied$ = this._filterApplied.asObservable();
    this.loadingProducts$ = this._loadingProducts.asObservable();
    this.fullWitdhProduct$ = this._fullWitdhProduct.asObservable();
    this.cart$ = this._cart.asObservable();
    this.generalLoading$ = this._generalLoading.asObservable();

    this._filterOpen.next(false);
    this._filterApplied.next(null);
    this._loadingProducts.next(false);
    this._fullWitdhProduct.next(null);
    this._generalLoading.next(false);
    this._cart.next([]);
  }

  GetCartFromStorage(): CartItem[] {
    const onStorage = localStorage.getItem('cart');
    if (onStorage) {
      const cart = JSON.parse(onStorage);
      return cart;
    }
    return [];
  }

  GetShoppingCartGuest(): void {
    const onStorage = localStorage.getItem('cart');
    if (onStorage) {
      const cart = JSON.parse(onStorage);
      this._cart.next(cart);
    }
    else {
      this._cart.next([]);
    }
  }

  AddItemToCart(prod: ProductMin, fromDetail: boolean = false): CartItem[] {
    if (prod) {
      const cart = this.GetCartFromStorage();
      if (cart) {
        const newCart: CartItem[] = JSON.parse(JSON.stringify(cart));
        const itemOnCart = newCart.find(x => x.productId === prod.id);
        if (itemOnCart) {
          itemOnCart.quantity = fromDetail ? prod.quantity : itemOnCart.quantity + 1;
        } else {
          const item: CartItem = {
            taxClassId: null,
            imageUrl: '',
            name: prod.name,
            price: 0,
            productId: prod.id,
            productVariationId: null,
            quantity: fromDetail ? prod.quantity : 1,
            weight: prod.weight
          }
          newCart.push(item);
        }
        return newCart;
      }
    }
    return [];
  }

  RemoveItemFromCart(id: number): CartItem[] {
    let cart = this.GetCartFromStorage();
    if (cart) {
      cart = cart.filter(x => x.productId !== id);
    }
    return cart;
  }

	ShowToast(textOrTpl: string | TemplateRef<any>, options: any = {}): void {
    this.toasts = [];
		this.toasts.push({ textOrTpl, ...options });
	}

	RemoveToast(toast: any): void {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	ClearToast(): void {
		this.toasts.splice(0, this.toasts.length);
	}
}
