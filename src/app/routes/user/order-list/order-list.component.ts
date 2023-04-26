import { AfterViewInit, Component, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { OrderMin, OrderRequest } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, AfterViewInit, OnDestroy {

  die$ = new Subject();
  orders: OrderMin[];
  hasMoreData: boolean;
  loadingOrders: boolean;
  loadingMoreOrders: boolean;
  skip: number;
  take: number;
  itemsize: number;
  date: Date;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private _ngZone: NgZone
  ) {
    this.orders = [];
    this.hasMoreData = false;
    this.loadingOrders = false;
    this.loadingMoreOrders = false;
    this.skip = 0;
    this.take = 10;
    this.itemsize = 60
    this.date = new Date();
    this.date.setMonth(this.date.getMonth() > 1 ? this.date.getMonth() - 1 : 11);
  }

  ngOnInit(): void {
    // this.date  = new Date('2019-01-01T08:00:00');
    const ordersReq: OrderRequest = {
      fromDate: this.date,
      orderNumber: null,
      orderStatuses: null,
      skip: this.skip,
      take: this.take,
      toDate: null
    }
    this.GetOrders(ordersReq, true);
    this.onResize(null);
  }

  ngAfterViewInit(): void {
  }

  ScrollEvent(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      this.GetMoreData();
    }
  }

  GetMoreData() {
    if (!this.loadingMoreOrders && this.hasMoreData) {
      this.skip = this.skip + this.take;
      const ordersReq: OrderRequest = {
        fromDate: this.date,
        orderNumber: null,
        orderStatuses: null,
        skip: this.skip,
        take: this.take,
        toDate: null
      }
      this.GetOrders(ordersReq, false);
    }
  }

  ngOnDestroy(): void {
    this.die$.next(null);
    this.die$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (window.innerWidth > 990) {
      this.itemsize = 60;
    } else {
      this.itemsize = 122;
    }
  }

  GetOrders(req: OrderRequest, refresh: boolean): void {
    if (refresh) {
      this.loadingOrders = true;
    } else {
      this.loadingMoreOrders = true;
    }

    this.orderService.GetOrders(req).pipe(
      takeUntil(this.die$),
      finalize(() => {
          this.loadingOrders = false;
          this.loadingMoreOrders = false;
      })
    ).subscribe({
      next: orders => {
        this._ngZone.run(() => {
          if (orders) {
            this.hasMoreData = orders.ordersNumber && this.orders && this.orders.length < orders.ordersNumber ? true : false
            orders.orders = orders.orders ? orders.orders.map(o => {
              o.totalAmount = o.totalAmount ? o.totalAmount : 0.00;
              o.orderDate = new Date(o.orderDate);
               return o}) : [];
            if(refresh || (!refresh && !this.orders)) {
              this.orders = orders.orders;
            } else if (this.orders && !refresh) {
              this.orders = this.orders.concat(orders.orders);
            }
          } else {
            this.orders = [];
          }
        })
      },
      error: e => {
        this.orders = [];
      }
    })
  }

  GoShop(): void {
    this.router.navigate(['/product/list/all']);
  }

  GoToDetail(orderNumber: string): void {
    const encoded = encodeURI(orderNumber);
    this.router.navigate([`/order/detail/${encoded}`])
  }
}
