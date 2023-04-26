export interface PaymentMethod {
  id: string;
  name: string;
}

export interface CreatePaymentOrder {
  Currency: string;
  Note: string;
  Products: PaymentProductDetails[];
  BillingAddress: BillingAddress | null;
  ShippingAddress: ShippingAddress;
  SuccessUrl: string;
  RecoveryUrl: string;
  BillingDocument: BillingDocument;
  PaymentMethod: PaymentCode;
  ShipmentMethodId: number;
  Email: string;
}

export interface PaymentProductDetails {
  ProductId: number;
  VariationId: number | null;
  Quantity: number;
}

export interface BillingAddress extends ShippingAddress {
  Name: string | null;          // REQUIRED IF PHYSICAL PERSON
  Surname: string | null;       // REQUIRED IF PHYSICAL PERSON
  CF: string | null;            // REQUIRED IF PHYSICAL PERSON
  VATNumber: string | null;     // REQUIRED IF COMPANY
  SDICode: string | null;       // REQUIRED IF COMPANY (OR PEC EMAIL)
  PecEmail: string | null;      // REQUIRED IF COMPANY (OR SDI)
  BusinessName: string | null;  // REQUIRED IF COMPANY
}

export interface ShippingAddress {
  Address: string;              // REQUIRED
  City: string;                 // REQUIRED
  Zip: string;                  // REQUIRED
  Province: string | null;      // REQUIRED IF COUNTRY = ITALY
  CountryCode: string;          // REQUIRED
  Email: string;                // REQUIRED
  PhoneNumber: string           // REQUIRED
}

export enum BillingDocument {
  Receipt = 0,
  Invoice
}

export enum PaymentCode {
  Paypal = 1,         // Paypal
  CartaCredito = 2,   // CreditCard
  Bonus = 3,          // Bonus
  Credito = 4,        // Credit
  Stripe = 5,         // Stripe
  Transfer = 6,       // Bonifico
  CashOnDelivery = 7  // Contrassegno
}

export enum PaymentStatus {
  Inserted,
  Refused,
  Completed,
  Refunded,
  Deleted
}
