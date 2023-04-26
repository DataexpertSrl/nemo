export interface ShippingMethodReq {
  country_code: string; // required
  zip_code: string; // required
  weight: number; // required
  price: number; // required

}

export interface ShippingMethod {
  id: number;
  name: string;
  price: number;
  varRate: number;
  additionalServices: AdditionalService [] ;
}

export interface AdditionalService {
  name: string;
  serviceName: string;
  serviceType: string;
  priceType: string;
  isIncluded: boolean;
  amount: number | null
}
