export interface ProductResponse {
  productsNumber: number;
  products: Product[];
}
export interface Product {
  id: number;
  sku: string;
  barcode: string;
  name: string;
  shortDescription: string;
  salePrice: number;
  price: number;
  vatType: number;
  thumbnail: string;
  insertDate: Date;
  lastUpdateDate: Date;
  quantity: number;
  manageStock: boolean;
  stockStatus: number;
  enabled: boolean;
  draft: boolean;
  published: boolean;
  taxClassId: string;
  startSalePrice: number;
  endSalePrice: number;
  sourceCategories: any;
  visible: boolean;
  weight: number;
}
export interface ProductDetail {
  id: number;
  sku: string;
  barcode: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  salePrice: number;
  price: number;
  vatType: number;
  thumbnail: string;
  imagesUrl: string[];
  insertDate: Date;
  lastUpdateDate: Date;
  quantity: number;
  manageStock: boolean;
  stockStatus: number;
  underStockQuantity: any | null;
  uom: number;
  weight: number | null;
  depth: number | null;
  height: number | null;
  width: number | null;
  draft: boolean;
  enabled: boolean;
  hasAccisa: boolean;
  isDangerous: boolean;
  xRated: boolean;
  isPhysicalProduct: boolean;
  videoUrl: string | null;
  published: boolean;
  mrsp: any | null;
  taxClassId: string;
  costTaxablePrice: number |null;
  startSalePrice: number |null;
  endSalePrice: number |null;
  productType: number;
  childrenProductsIds: string[];
  attributes: any | null;
  variations: any | null;
  syncError: boolean;
}
export interface FullWidthProduct {
  Product: ProductDetail,
  SelectedImage: number;
}
export interface Review {
  Id: number;
  Title: string;
  Author: string;
  Desc: string;
  Rating: number;
  Helpful: number;
  Unhelpful: number;
  Days: number;
}
export interface CartItem {
  name: string;
  quantity: number;
  imageUrl: string;
  price: number;
  taxClassId: string | null;
  productVariationId: any
  productId: number;
  weight: number | null;
}
export interface SaveCartRequest {
  productId: number,
  productVariationId: any,
  quantity: number;
}
export interface ProductMin {
  id: number;
  quantity: number;
  name: string;
  weight: number;
}
