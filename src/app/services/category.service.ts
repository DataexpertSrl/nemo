import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../models/filter';
import { SessionService } from './session.service';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
  ) {
  }

  getCategoriesHardCoded(): Category[] {
    const categories: Category[] = [];

    const catHome: Category = {
      name: 'Home',
      checked: false,
      description: '',
      ecommerceCategoryId: '',
      parentId: null,
      productsAssociated: 0,
      route: '/home'
    }
    const catProds: Category = {
      name: 'Products',
      checked: false,
      description: '',
      ecommerceCategoryId: '',
      parentId: null,
      productsAssociated: 0,
      route: '/product/list'
    }
    categories.push(catHome);
    // categories.push(catProds);
    const cat1: Category = {
      name: 'Amazon',
      checked: false,
      description: '',
      ecommerceCategoryId: '19',
      parentId: null,
      productsAssociated: 0,
      route: '/product/list/19'
    }
    const cat2: Category = {
      name: 'Abbigliamento',
      checked: false,
      description: '',
      ecommerceCategoryId: '16',
      parentId: null,
      productsAssociated: 0,
      route: '/product/list/16'
    }
    const cat3: Category = {
      name: 'Hoodies',
      checked: false,
      description: '',
      ecommerceCategoryId: '17',
      parentId: null,
      productsAssociated: 0,
      route: '/product/list/17'
    }
    const cat4: Category = {
      name: 'Uncategorised',
      checked: false,
      description: '',
      ecommerceCategoryId: '15',
      parentId: null,
      productsAssociated: 0,
      route: '/product/list/15'
    }
    const cat5: Category = {
      name: 'CategoryTest',
      checked: false,
      description: '',
      ecommerceCategoryId: '30',
      parentId: null,
      productsAssociated: 0,
      route: '/product/list/30'
    }
    categories.push(cat1);
    categories.push(cat2);
    categories.push(cat3);
    categories.push(cat4);
    categories.push(cat5);
    return categories;
  }

  // GetCategories(): Observable<Category[]> {
  //   return this.http.get<Category[]>(`${environment.baseApiUrl}GetCategories`);
  // }
}
