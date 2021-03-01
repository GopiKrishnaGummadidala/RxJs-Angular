export interface Product {
  Id: number;
  ProductName: string;
  ProductCode?: string;
  Description?: string;
  Price?: number;
  CategoryId?: number;
  QuantityInStock?: number;
  SearchKey?: string[];
  SupplierIds?: number[];
}
