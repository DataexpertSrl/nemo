export interface Filter {
  Categories: string[],
  Sort: number | null,
  PriceMin: number | null,
  PriceMax: number | null,
  Skip: number,
  Take: number,
  Search: string | null
}
export interface Category {
  ecommerceCategoryId: string;
  name: string;
  description: string;
  parentId: number | null,
  productsAssociated: number;
  checked: boolean;
  route: string | null;
}

export interface Sort {
  property: string;
  checked: boolean;
}
export interface PriceRange {
  minPrice: number;
  maxPrice: number;
}
