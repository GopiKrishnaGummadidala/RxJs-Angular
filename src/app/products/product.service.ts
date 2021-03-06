import { ProductCategoryService } from "./product-category.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  BehaviorSubject,
  combineLatest,
  from,
  merge,
  Observable,
  Subject,
  throwError,
} from "rxjs";
import {
  catchError,
  filter,
  map,
  mergeMap,
  scan,
  shareReplay,
  switchMap,
  tap,
  toArray,
} from "rxjs/operators";
import { Product } from "./product";
import { ProductCategory } from "./product-category";
import { SupplierService } from "../suppliers/supplier.service";
import { Supplier } from "../suppliers/supplier";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private productsUrl = "http://localhost:62799/api/Products/getProducts";
  private supplierUrl = this.supplierService.suppliersUrl;

  private selectedProductSubject = new BehaviorSubject<number>(0);
  selectedProductAction$ = this.selectedProductSubject.asObservable();

  private productAddSubject = new Subject<Product>();
  private productAddAction$ = this.productAddSubject.asObservable();

  products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    tap((data) => console.log("Products: ", JSON.stringify(data))),
    catchError(this.handleError)
  );

  productsWithCategorys$ = combineLatest([
    this.products$,
    this.productCategoryService.productCategorys$,
  ]).pipe(
    map(([products, categorys]) =>
      products.map(
        (product: Product) =>
          ({
            ...product,
            Price: product.Price * 1.5,
            SearchKey: [product.ProductName],
            Category: categorys.find((c) => c.Id === product.CategoryId).Name,
          } as Product)
      )
    ),
    shareReplay(1),
    tap((data) =>
      console.log("Products with Categorys: ", JSON.stringify(data))
    ),
    catchError(this.handleError)
  );

  selectedProduct$ = combineLatest([
    this.productsWithCategorys$,
    this.selectedProductAction$,
  ]).pipe(
    map(([products, selectedProductId]) => {
      return products.find((p) => p.Id === selectedProductId);
    }),
    tap((data) => console.log("Selected Product" + JSON.stringify(data)))
  );

  // selectedProductSuppliers$ = combineLatest([
  //   this.selectedProduct$,
  //   this.supplierService.suppliers$,
  // ]).pipe(
  //   map(([selectedProduct, suppliers]) => {
  //     return suppliers.filter((s) =>
  //       selectedProduct.SupplierIds.includes(s.Id)
  //     );
  //   }),
  //   tap((data) => console.log("Selected Product" + JSON.stringify(data)))
  // );

  selectedProductSuppliers$ = this.selectedProduct$.pipe(
    filter((selectedProduct) => Boolean(selectedProduct)),
    switchMap((selectedProduct) =>
      from(selectedProduct.SupplierIds).pipe(
        mergeMap((supplierId) =>
          this.http.get<Supplier>(`${this.supplierUrl}${supplierId}`)
        ),
        tap((suppliers) =>
          console.log("product suppliers", JSON.stringify(suppliers))
        )
      )
    )
  );

  productsWithAdd$ = merge(
    this.productsWithCategorys$,
    this.productAddAction$
  ).pipe(scan((acc: Product[], value: Product) => [...acc, value]));

  constructor(
    private http: HttpClient,
    private productCategoryService: ProductCategoryService,
    private supplierService: SupplierService
  ) {}

  selectedProductChanged(prodId: number): void {
    this.selectedProductSubject.next(prodId);
  }

  addProduct(product: Product): void {
    this.productAddSubject.next(this.fakeProduct());
  }

  private fakeProduct() {
    return {
      Id: 42,
      ProductName: "Another One",
      ProductCode: "TBX-0042",
      Description: "Our new product",
      Price: 8.9,
      CategoryId: 3,
      Category: "Toolbox",
      QuantityInStock: 30,
    };
  }

  public handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
