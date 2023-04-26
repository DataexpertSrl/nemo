import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OrderStatuses } from 'src/app/models/order';

@Component({
  selector: 'app-order-status-badge',
  templateUrl: './order-status-badge.component.html',
  styleUrls: ['./order-status-badge.component.scss']
})
export class OrderStatusBadgeComponent implements OnInit, OnDestroy {

  @Input() status: OrderStatuses | null;
  translatedStatus: string | null;
  statusEnum = OrderStatuses;

  constructor(
    private transalte:TranslateService
  ) {
    this.status = null;
    this.translatedStatus = null;

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }
}
