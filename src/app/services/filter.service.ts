import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category, PriceRange } from '../models/filter';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {


  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {
  }

  GetSortBy(): Observable<string[]> {
    let onStorage = this.sessionService.GetFromStoratge('SortByList');
    if (onStorage) {
      const sort: string[] = JSON.parse(onStorage);
      return of(sort);
    } else {
      return this.http.get<string[]>(`${environment.baseApiUrl}GetSortByList`);
    }
  }

  GetRangePrice(): Observable<PriceRange> {
    let onStorage = this.sessionService.GetFromStoratge('RangePrice');
    if (onStorage) {
      const range: PriceRange = JSON.parse(onStorage);
      return of(range);
    } else {
      return this.http.get<PriceRange>(`${environment.baseApiUrl}GetRangePrice`);
    }
  }

  GetCategories(): Observable<Category[]> {
    let onStorage = this.sessionService.GetFromStoratge('Categories');
    if (onStorage) {
      const categories:Category[] = JSON.parse(onStorage);
      return of(categories);
    } else {
      return this.http.get<Category[]>(`${environment.baseApiUrl}GetCategories`);
    }
  }
}
