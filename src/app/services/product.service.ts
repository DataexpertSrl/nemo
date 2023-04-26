import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Filter } from '../models/filter';
import { CartItem, ProductDetail, ProductResponse, Review } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  cart: CartItem[] = [];

  constructor(
    private http: HttpClient
  ) { }

  GetProduct(filter: Filter | null = null): Observable<ProductResponse> {
    // Params
    // - search - take - skip - category_ids - min_price - max_price - sort_by
    let queryParams: HttpParams = new HttpParams();
    if (filter) {
      if (filter.Categories && filter.Categories.length > 0) {
        let catList = filter.Categories.join();
        // catList = encodeURIComponent(catList);
        queryParams = (queryParams || new HttpParams()).append('category_ids', catList);
      }
      if (filter.Sort !== undefined && filter.Sort !== null) {
        let sort = filter.Sort;
        queryParams = (queryParams || new HttpParams()).append('sort_by', sort);
      }
      if (filter.PriceMin !== undefined && filter.PriceMin !== null) {
        let pMin ='';
        pMin = encodeURIComponent(filter.PriceMin);
        queryParams = (queryParams || new HttpParams()).append('min_price', pMin);
      }
      if (filter.PriceMax !== undefined && filter.PriceMax !== null) {
        let pMax = filter.PriceMax;
        queryParams = (queryParams || new HttpParams()).append('max_price', pMax);
      }
      if (filter.Skip !== undefined && filter.Skip !== null) {
        let skip = filter.Skip;
        queryParams = (queryParams || new HttpParams()).append('skip', skip);
      }
      if (filter.Take) {
        let take = filter.Take;
        queryParams = (queryParams || new HttpParams()).append('take', take);
      }
      if (filter.Search) {
        let search = '';
        search = encodeURIComponent(filter.Search);
        queryParams = (queryParams || new HttpParams()).append('search', search);
      }
    }

    return this.http.get<ProductResponse>(`${environment.baseApiUrl}GetProducts`, { params: queryParams });
  }

  GetProductById(id: string | null): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${environment.baseApiUrl}GetProductDetails/${id}`);
  }

  GetReview(prodId: string): Review[] {
    const reviews: Review[] = [
      {
        Id: 0,
        Author: 'Smanata J.',
        Days: 6,
        Desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus cum dolores assumenda asperiores facilis porro reprehenderit animi culpa atque blanditiis commodi perspiciatis doloremque, possimus, explicabo, autem fugit beatae quae voluptas!',
        Helpful: 2,
        Unhelpful: 0,
        Rating: 4,
        Title: 'Good, perfect size'
      },
      {
        Id: 1,
        Author: 'John Doe',
        Days: 5,
        Desc: 'Sed, molestias, tempore? Ex dolor esse iure hic veniam laborum blanditiis laudantium iste amet. Cum non voluptate eos enim, ab cumque nam, modi, quas iure illum repellendus, blanditiis perspiciatis beatae!',
        Helpful: 0,
        Unhelpful: 0,
        Rating: 5,
        Title: 'Very good'
      }
    ];
    return reviews;
  }
}
