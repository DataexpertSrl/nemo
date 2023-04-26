import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { CartItem } from 'src/app/models/product';
import { ShippingMethod, ShippingMethodReq } from 'src/app/models/shipping';
import { OrderService } from 'src/app/services/order.service';
import { SharedService } from 'src/app/shared/shared.service';
import * as countries from "i18n-iso-countries" ;
import { BillingAddress, BillingDocument, CreatePaymentOrder, PaymentCode, PaymentMethod, PaymentProductDetails, ShippingAddress } from 'src/app/models/payment';
import { environment } from 'src/environments/environment';
declare const require: any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  animations: [

    trigger('FadeInOut', [
      transition(':enter', [
        style({ opacity: 0}),
        animate('350ms', style({ opacity: 1})),
      ]),
      transition(':leave', [
        style({ opacity: 1}),
        animate('350ms', style({ opacity: 0,})),
      ]),
    ]),
  ]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('coupon_input', {static: false}) couponInput?: ElementRef;
  die$ = new Subject();
  billRequired: boolean;
  createAccount: boolean
  billingDetailForm: FormGroup = new FormGroup({});
  shippingDetailForm: FormGroup = new FormGroup({});
  coupon: string;
  couponPlaceholder: boolean;
  cart?: CartItem[];
  loadingShipMethods: boolean;
  loadingPayMethods: boolean;
  shippingMethods?: ShippingMethod[];
  selectedShippingMethod?: ShippingMethod;
  paymentMethods?: PaymentMethod[];
  selectedPaymentMethod?: PaymentMethod;
  availableCountries: any;
  isCompany: boolean;
  savingOrder: boolean;
  accordionOpen?: number;
  provinceMaxLength: number;

  constructor(
    private fb: FormBuilder,
    public sharedService: SharedService,
    private translate: TranslateService,
    private renderer: Renderer2,
    private orderService: OrderService
  ) {
    this.billRequired = false;
    this.createAccount = false;
    this.coupon = '';
    this.couponPlaceholder = true;
    this.cart = undefined;
    this.couponInput = undefined;
    this.loadingShipMethods = false;
    this.loadingPayMethods = false;
    this.shippingMethods = undefined;
    this.selectedShippingMethod = undefined
    this.paymentMethods = undefined;
    this.selectedPaymentMethod = undefined
    this.isCompany = false;
    this.savingOrder = false;
    this.accordionOpen = undefined;
    this.provinceMaxLength = 2;
  }

  get firstName () { return this.billingDetailForm.get('Name');}
  get lastName () { return this.billingDetailForm.get('Surname');}
  get companyName () { return this.billingDetailForm.get('BusinessName');}
  get country () { return this.billingDetailForm.get('CountryCode');}
  get streetAddress () { return this.billingDetailForm.get('Address');}
  get city () { return this.billingDetailForm.get('City');}
  get state () { return this.billingDetailForm.get('Province');}
  get zip () { return this.billingDetailForm.get('Zip');}
  get phone () { return this.billingDetailForm.get('PhoneNumber');}
  get email () { return this.billingDetailForm.get('Email');}
  get emailPEC () { return this.billingDetailForm.get('PecEmail');}
  get CF () { return this.billingDetailForm.get('CF');}
  get SDICode () { return this.billingDetailForm.get('SDICode');}
  get VATNumber () { return this.billingDetailForm.get('VATNumber');}


  get businessNameShip () { return this.shippingDetailForm.get('BusinessName');}
  get countryShip () { return this.shippingDetailForm.get('CountryCode');}
  get address () { return this.shippingDetailForm.get('Address');}
  get cityShip () { return this.shippingDetailForm.get('City');}
  get stateShip () { return this.shippingDetailForm.get('Province');}
  get zipShip () { return this.shippingDetailForm.get('Zip');}
  get phoneShip () { return this.shippingDetailForm.get('PhoneNumber');}
  get emailShip () { return this.shippingDetailForm.get('Email');}

  ngOnInit(): void {
    this.CreateForm();
    this.GetCart();
    // this.GetPaymentMethods();
    // get payment methods hardcoded based on enum
    this.ConvertEnumToArray();
    this.ListenOnCountryandZIPChange();

    countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
    countries.registerLocale(require("i18n-iso-countries/langs/it.json"));

    const lang = this.translate.currentLang;
    this.availableCountries = countries.getNames(lang);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.availableCountries = countries.getNames(event.lang);
      if (this.countryShip) {
        this.countryShip.reset();
      }
      if (this.country) {
        this.country.reset();
      }
    });
  }

  ngOnDestroy(): void {

  }

  CreateForm(): void {
    this.shippingDetailForm = this.fb.group({
      BusinessName: [null, Validators.required],
      CountryCode: [null, Validators.required],
      Address: [null, Validators.required],
      City: [null, Validators.required],
      Province: [null, Validators.maxLength(2)],
      Zip: [null, Validators.required],
      PhoneNumber: [null, Validators.required],
      Email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
    },
    {
      validator: this.ValidateProvince('CountryCode', 'Province')
    });

    this.CreateBillingForm();
  }

  CreateBillingFormCompany(): void {
    this.billingDetailForm = this.fb.group({
      BusinessName: [null],
      CountryCode: [null, Validators.required],
      Address: [null, Validators.required],
      City: [null, Validators.required],
      Province: [null, Validators.maxLength(2)],
      Zip: [null, Validators.required],
      Email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      PecEmail: [null, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      SDICode: [null],
      VATNumber: [null, Validators.required]
    },
    {
      validator: [this.ValidateCompanyInfo('PecEmail', 'SDICode'), this.ValidateProvince('CountryCode', 'Province')]
    });
  }

  ValidateCompanyInfo(controlName1: string, controlName2: string): (formGroup: FormGroup) => void {
    return (formGroup: FormGroup) => {
      const control1 = formGroup.controls[controlName1];
      const control2 = formGroup.controls[controlName2];

      if (
        control1.errors && !control1.errors['SIDorPEC'] &&
        control2.errors && !control2.errors['SIDorPEC']
      ) {
        return;
      }
      if (!control1.value && !control2.value) {
        control1.setErrors({SIDorPEC : true});
        control2.setErrors({SIDorPEC : true});
      } else {
        control1.setErrors(null);
        control2.setErrors(null);
      }
    };
  }

  ValidateProvince(controlName1: string, controlName2: string): (formGroup: FormGroup) => void {
    return (formGroup: FormGroup) => {
      const control1 = formGroup.controls[controlName1];
      const control2 = formGroup.controls[controlName2];
      if (
        control2.errors && !control2.errors['country_required']
      ) {
        return;
      }

      if (control1.value && control1.value === 'it') {
        if (!control2.value) {
          control2.setErrors({country_required : true});
        }
      } else {
        control2.setErrors(null);
      }
    };
  }

  CreateBillingForm(): void {
    this.billingDetailForm = this.fb.group({
      Name: [null, Validators.required],
      Surname: [null, Validators.required],
      CountryCode: [null, Validators.required],
      Address: [null, Validators.required],
      City: [null, Validators.required],
      Province: [null, Validators.maxLength(2)],
      Zip: [null, Validators.required],
      Email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      CF: [null, Validators.required]
    },
    {
      validator: this.ValidateProvince('CountryCode', 'Province')
    });
  }

  ShowCouponPlaceholder(val: boolean, isBlur: boolean): void {
    if (val) {
      if (this.coupon) {
        val = false;
      }
    }
    this.couponPlaceholder = val;
    if (!this.couponPlaceholder && !isBlur) {
      setTimeout(()=>{ // this will make the execution after the above boolean has changed
        const element = this.renderer.selectRootElement('#coupon_input');
        if (element) {
          element.focus();
        }
      },400);

    }
  }

  GetCart(): void {
    this.sharedService.cart$.pipe(takeUntil(this.die$))
    .subscribe({
      next: res => {
        if (res) {
          this.cart = res.map(i => {i.price = i.price ? i.price : 0.00; return i});
        } else {
          this.cart = [];
        }
      }
    })
  }

  GetCartTotal(): number {
    let tot = 0.00;
    if (this.cart) {
      this.cart.forEach(item => {
          tot = tot + (item.price * item.quantity);
      });
      if (this.selectedShippingMethod) {
        tot = tot + this.selectedShippingMethod.price;
      }
    }
    return tot;
  }

  GetTotal(): number {
    let tot = 0.00;
    if (this.cart) {
      this.cart.forEach(item => {
          tot = tot + (item.price * item.quantity);
      });
    }
    return tot;
  }

  GetWeight(): number {
    let tot = 0;
    if (this.cart) {
      this.cart.forEach(item => {
        if (item.weight) {
          tot = tot + (item.weight * item.quantity);
        }
      });
    }
    return tot;
  }

  GetItemPrice(item: CartItem): number {
    let val = 0.00;
    if (item) {
      val = item.price * item.quantity;
    }
    return val;
  }

  IsDisabled(): boolean {
    let res = false;
    if (!this.cart || (this.cart && this.cart.length === 0)) {
      res = true;
    } else {
      if (this.shippingDetailForm.invalid) {
        res = true;
      }
      if (this.billRequired && (this.billingDetailForm.invalid || this.shippingDetailForm.invalid)) {
        res = true;
      }
    }
    if (!this.selectedPaymentMethod || !this.selectedShippingMethod) {
      res = true;
    }
    return res;
  }

  OpenShipmentDetailForm(): void {
    if (this.billRequired) {
      this.billingDetailForm.reset();
    }
  }

  GetShippingMethods(): void {
    if ((!this.shippingMethods || (this.shippingMethods && this.shippingMethods.length === 0)) && this.countryShip && this.zipShip) {
      if (this.countryShip.value) {
        const req: ShippingMethodReq = {
          country_code: this.countryShip.value,
          price: this.GetTotal(),
          weight: this.GetWeight(),
          zip_code: this.zipShip?.value
        }
        this.loadingShipMethods = true;
        this.orderService.GetShippingMethods(req).pipe(takeUntil(this.die$), finalize(() => this.loadingShipMethods = false))
          .subscribe({
            next: res => {
              if (res) {
                this.shippingMethods = res.map(x => {x.price = x.price ? x.price : 0.00; return x});
              } else {
                this.shippingMethods = [];
              }
            }
          });
      }
    }
  }

  ResolveCountryCode(code: any): string {
    return code.toString().toLowerCase();
  }

  SelectShippingMethod(method: ShippingMethod) :void {
    if (this.selectedShippingMethod  && this.selectedShippingMethod.id === method.id) {
      this.selectedShippingMethod = undefined;
    } else {
      this.selectedShippingMethod = method;
    }
  }

  GetPaymentMethods(): void {
    this.orderService.GetPaymentMethods().pipe(takeUntil(this.die$))
    .subscribe({
      next: res => {
        if (res) {
          this.paymentMethods = res;
        } else {
          this.paymentMethods = [];
        }
      }
    })
  }

  ConvertEnumToArray(): void {
    this.paymentMethods = [];
    for (var enumMember in PaymentCode) {
      const isValueProperty = parseInt(enumMember, 10) >= 0;
      if (isValueProperty) {
        const el: PaymentMethod = {
          id: enumMember,
          name: PaymentCode[enumMember]
        };
        // 1 = Paypal - 2 = CartaCredito - 5 = Stripe
        const availablePayment = ['1', '2', '5']
        if (availablePayment.some(x => x === el.id)) {
          this.paymentMethods.push(el);
        }

      }
    }
  }

  SelectPaymentMethod(method: PaymentMethod) :void {
    if (this.selectedPaymentMethod  && this.selectedPaymentMethod.id === method.id) {
      this.selectedPaymentMethod = undefined;
    } else {
      this.selectedPaymentMethod = method;
    }
  }

  ListenOnCountryandZIPChange(): void {
    if (this.countryShip) {
      this.countryShip.valueChanges.subscribe({
        next: val => {
          this.shippingMethods = undefined;
          if (this.selectedShippingMethod) {
            this.selectedShippingMethod = undefined;
          }
        }
      })
    }
    if (this.zipShip) {
      this.zipShip.valueChanges.subscribe({
        next: val => {
          this.shippingMethods = undefined;
          if (this.selectedShippingMethod) {
            this.selectedShippingMethod = undefined;
          }
        }
      })
    }
  }

  ChangeBillingType(): void {
    this.isCompany = !this.isCompany;
    if (this.isCompany) {
      this.CreateBillingFormCompany();
    } else {
      this.CreateBillingForm();
    }
  }

  ResolvePaymentMethod(id: string): PaymentCode | null {
    let paymentMethod: PaymentCode | null = null;
    if (id) {
      let idNumber = Number(id);
      if (idNumber) {
        try {
          paymentMethod = idNumber;
        }
        catch
        {
          return null;
        }
      }
    }
    return paymentMethod
  }

  ScrollTo(el: HTMLElement, accordion: number): void {
    if ( accordion !== 0 && this.accordionOpen !== accordion) {
      el.scrollIntoView();
    }
    this.accordionOpen = accordion;
  }

  SubmitOrder(): void {
    if (this.selectedPaymentMethod && this.selectedShippingMethod && this.cart && this.cart.length > 0 && !this.savingOrder) {
      const enumPayment = this.ResolvePaymentMethod(this.selectedPaymentMethod.id);
      const shipId = this.selectedShippingMethod.id;
      let mappedProduct: PaymentProductDetails[] = [];
      mappedProduct = this.cart.map(x => {
        const mapped: PaymentProductDetails = {ProductId: x.productId, Quantity: x.quantity, VariationId: x.productVariationId};
        return mapped;
      });
      if (enumPayment && shipId && mappedProduct && mappedProduct.length > 0) {
        const request: CreatePaymentOrder = {
          Currency: 'eur',
          Note: '',
          ShippingAddress: this.shippingDetailForm.value as ShippingAddress,
          BillingAddress: this.billRequired ? this.billingDetailForm.value as BillingAddress: null,
          RecoveryUrl: window.location.origin  + environment.RecoveryUrl,
          SuccessUrl: window.location.origin + environment.SuccessUrl,
          BillingDocument: this.billRequired ? BillingDocument.Invoice : BillingDocument.Receipt,
          PaymentMethod: enumPayment,
          ShipmentMethodId: shipId,
          Products: mappedProduct,
          Email: this.sharedService.userLoggedIn ? null : (this.billRequired ? this.email?.value : this.emailShip?.value)
        }
        this.savingOrder = true;
        this.sharedService._generalLoading.next(true);
        this.orderService.CreatePayment(request)
        .pipe(
          takeUntil(this.die$),
          finalize(() => {
            this.savingOrder = false;
            this.sharedService._generalLoading.next(false);
          })
        ).subscribe({
          next: res => {
            if (res) {
              window.open(res, '_self')
            }
          }
        });
      }
    }
  }
}
