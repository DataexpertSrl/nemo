export interface OrderRequest {
  orderNumber: string | null
  take: number;
  skip: number;
  fromDate: Date | null
  toDate: Date | null
  orderStatuses: number[] | null
}

export interface OrderDetailRequest {
  orderNumber: string;
  email: string;
}

export enum OrderStatuses {
  OnHold = 0,
  New = 1 ,
  PartiallyShipped,
  Shipped,
  PartiallyRefunded,
  Refunded,
  Deleted,
  Failed,
}

export interface OrderResponse {
  ordersNumber: number;
  orders: OrderMin[];
}

export interface OrderMin {
  orderNumber: string;
  businessName: string;
  totalAmount: number;
  orderStatus: number;
  orderDate: Date;
  whereAt: string;
}

export interface Order {
  orderNumber: string;
  orderDate: Date;
  orderStatus: number;
  orderShippingName: string;
  metadata: any;
  customerNote: string;
  orderNote: string;
  orderDetails: OrderDetails[];
  orderEconomic: OrderEconomic;
  orderShippingDetails: OrderShippingDetails[];
  orderBillingAddress: OrderBillingAddress;
}

export interface OrderEconomic {
  paymentType: PaymentType;
  paidAmount: number;
  taxablePaidAmount?: number;
  refundedAmount?: number;
  taxableTotalDiscountAmount?: number;
  paymentDate: Date;
  fulfillmentDate: Date;
  totalDiscountAmount?: number;
  currency: string;
  shippingTaxableAmount?: number;
  shippingTaxableRefundedAmount?: number;
  shippingVATRate?: number;
  shippingAmount?: number;
  shippingRefundedAmount?: number;
}

export interface PaymentType {
  item1: string;
  item2: string;
}

export interface OrderShippingDetails {
  productId: string;
  sku: string;
  quantity: number;
  refundedQuantity: number;
  shippedQuantity: number;
  returnedQuantity: string;
  refundedAmount: number;
  taxableDiscountUnitAmount: number;
  taxableTotalDiscountAmount: number;
  discountUnitAmount: number;
  totalDiscountAmount: number;
  taxableRefundedAmount: number;
  taxableUnitAmount: number;
  taxableTotalAmount: number;
  totalAmount: number;
  vatRate: number;
  description: string;
  unitAmount: number;
  imageUrl: string;
  productType: string;
  variationId: string;
}

export interface OrderBillingAddress {
  name: string;
  surname: string;
  businessName: string;
  address: string;
  city: string;
  province: string;
  zip: string;
  countryCode: string;
  cf: string;
  vatNumber: string;
  reference: string;
  email: string;
  sdiCode: string;
  pecEmail: string;
  phone: string;
}

export interface OrderDetails {
  productId: string;
  sku: string;
  quantity: number;
  refundedQuantity: number;
  shippedQuantity: number;
  returnedQuantity: string;
  refundedAmount: number;
  taxableDiscountUnitAmount: number;
  taxableTotalDiscountAmount: number;
  discountUnitAmount: number;
  totalDiscountAmount: number;
  taxableRefundedAmount: number;
  taxableUnitAmount: number;
  taxableTotalAmount: number;
  totalAmount: number;
  vatRate: number;
  description: string;
  unitAmount: number;
  imageUrl: string;
  productType: string;
  variationId: string;
}
