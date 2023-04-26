import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Order } from 'src/app/models/order';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/services/order.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
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
export class OrderDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('content', {static: false}) modalContent?: ElementRef;

  die$ = new Subject();
  loading: boolean;
  order?: Order;
  userEmail: string | null;
  orderNumber: string | null;
  tabActive: number;
  emailForm: FormGroup = new FormGroup({});
  orderNotFound: boolean;

  get email () { return this.emailForm.get('Email');}

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private orderService: OrderService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef
  ) {
    this.loading = false;
    this.order = undefined,
    this.userEmail = null;
    this.orderNumber = null
    this.tabActive = 1;
    this.orderNotFound = false;
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.GetOrderId();
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {

  }

  GetOrderId(): void {
    this.route.paramMap.subscribe(paramMap => {
      const encodedNumber = paramMap.get('id');
      if (encodedNumber) {
        this.orderNumber = decodeURI(encodedNumber);
        const auth = this.authService.GetAuthentication();
        if (auth) {
          if (auth.grant_type === 'client_credentials' && this.modalContent) {
            this.ShowEmailModal();
          } else {
            this.GetOrder(null);
          }
        } else {
          this.router.navigate(['/home']);
        }
      }
    })
  }

  ShowEmailModal(): void {
    this.EmailForm();
    this.modalService.open(this.modalContent, { ariaLabelledBy: 'modal-basic-title' , centered: true, backdrop: 'static'}).result.then(
			(result) => {

			}
		);
  }

  GetOrder(email: string | null): void {
    if (this.orderNumber) {
      this.loading = true;
      this.orderNotFound = false;
      this.orderService.GetOrder(this.orderNumber, email)
      .pipe(
        takeUntil(this.die$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: ord => {
          this.order = ord;
          if (this.order) {
            this.order.orderDate = new Date(this.order.orderDate);
            // for (let index = 0; index < 10; index++) {
            //   this.order.orderDetails.push(this.order.orderDetails[0]);
            // }

          }
        },
        error: e => {
          if (e.error === this.sharedService.ErrorOrderNotFound) {
            this.orderNotFound = true;
          }
        }
      })
    }
  }

  OpenTab(id: number): void {
    this.tabActive = id;
  }

  GetProductsTotal(): number {
    let tot = 0.00;
    if (this.order && this.order.orderDetails) {
      this.order.orderDetails.forEach(e => {
        tot = tot + (e.totalAmount);
      });
    }
    return tot;
  }

  GoToProdDetail(id: number): void {
    this.router.navigate([`/product/detail/${id}`])
  }

  EmailForm(): void {
    this.emailForm = this.fb.group({
      Email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });
  }

  GetOrderTotal(): number {
    let res = 0.00;
    if (this.order && this.order.orderEconomic) {
      res = res + (this.order.orderEconomic.paidAmount ? this.order.orderEconomic.paidAmount : 0.00) + (this.order.orderEconomic.shippingAmount ? this.order.orderEconomic.shippingAmount : 0.00)
    }
    return res;
  }

  SubmitOrderRequest(): void {
    if (this.email && this.email.value) {
      this.GetOrder(this.email.value);
      this.modalService.dismissAll();
    }
  }
}
