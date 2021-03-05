import { ProductCategoryService } from "./product-category.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  Subject,
  throwError,
} from "rxjs";
import { catchError, map, scan, tap } from "rxjs/operators";
import { Product } from "./product";
import { ProductCategory } from "./product-category";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private productsUrl = "http://localhost:62799/api/Products/getProducts";

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

  productsWithAdd$ = merge(
    this.productsWithCategorys$,
    this.productAddAction$
  ).pipe(scan((acc: Product[], value: Product) => [...acc, value]));

  constructor(
    private http: HttpClient,
    private productCategoryService: ProductCategoryService
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
