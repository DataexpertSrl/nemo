import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartItem, SaveCartRequest } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private http: HttpClient
  ) { }

  GetShoppingCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${environment.baseApiUrl}GetShoppingCarts`);
  }

  EditCart(items: CartItem[]): Observable<CartItem[]> {
    const cartToSave: SaveCartRequest[] = [];
    items.forEach(item => {
      const prod: SaveCartRequest = {
        productId: item.productId,
        quantity: item.quantity,
        productVariationId: item.productVariationId
      }
      cartToSave.push(prod);
    });
    return this.http.patch<CartItem[]>(`${environment.baseApiUrl}SaveShoppingCarts`, cartToSave);
  }

  SaveCartOnStorage(cart: CartItem[]) {
    if (cart) {
      const stringify = JSON.stringify(cart);
      const alredyOnStorage = localStorage.getItem('cart');
      if (alredyOnStorage) {
        localStorage.removeItem('cart');
      }
      localStorage.setItem('cart', stringify);
    }
  }
}
