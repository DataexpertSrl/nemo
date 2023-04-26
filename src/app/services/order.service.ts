import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order, OrderRequest, OrderResponse } from '../models/order';
import { CreatePaymentOrder, PaymentMethod } from '../models/payment';
import { ShippingMethod, ShippingMethodReq } from '../models/shipping';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  GetShippingMethods (req: ShippingMethodReq): Observable<ShippingMethod[]> {
    let queryParams: HttpParams = new HttpParams();
    if (req) {
      if (req.country_code) { // required
        queryParams = (queryParams || new HttpParams()).append('country_code', req.country_code);
      }
      if (req.zip_code) { // required
        queryParams = (queryParams || new HttpParams()).append('zip_code', req.zip_code);
      }
      if (req.weight) { // required
        queryParams = (queryParams || new HttpParams()).append('weight', req.weight);
      }
      if (req.price) { // required
        queryParams = (queryParams || new HttpParams()).append('price', req.price);
      }
    }
    return this.http.get<ShippingMethod[]>(`${environment.baseApiUrl}GetShippingMethods`, { params: queryParams });
  }

  GetPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${environment.baseApiUrl}GetPayments`);
  }

  GetOrder(orderNumber: string, email: string | null): Observable<Order> {
    let url = `${environment.baseApiUrl}GetOrder/${orderNumber}`;
    if (email) {
      url = url + `/${email}`;
    }
    return this.http.get<Order>(url);
  }

  GetOrders(request: OrderRequest): Observable<OrderResponse> {
    let queryParams: HttpParams = new HttpParams();
    if (request) {
      if (request.orderNumber) {
        queryParams = (queryParams || new HttpParams()).append('order_number', request.orderNumber);
      }
      if (request.take !== undefined && request.take !== null) {
        queryParams = (queryParams || new HttpParams()).append('take', request.take.toString());
      }
      if (request.skip !== undefined && request.skip !== null) {
        queryParams = (queryParams || new HttpParams()).append('skip', request.skip.toString());
      }
      if (request.fromDate) {
        const dateFormatted = this.datePipe.transform(request.fromDate, 'YYYY-MM-ddT00:00:00')
        queryParams = (queryParams || new HttpParams()).append('from_date', dateFormatted!);
      }
      if (request.toDate) {
        const dateFormatted = this.datePipe.transform(request.toDate, 'YYYY-MM-ddT00:00:00')
        queryParams = (queryParams || new HttpParams()).append('to_date', dateFormatted!);
      }
      if (request.orderStatuses && request.orderStatuses.length > 0) {
        let statuses = request.orderStatuses.join(',');
        queryParams = (queryParams || new HttpParams()).append('order_statuses', statuses);
      }
    }
    return this.http.get<OrderResponse>(`${environment.baseApiUrl}GetOrders`, { params: queryParams });
  }

  CreatePayment(req: CreatePaymentOrder): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.post<string>(`${environment.baseApiUrl}CreatePaymentOrder`, req, { headers, responseType: 'text' as 'json' });
  }
}
