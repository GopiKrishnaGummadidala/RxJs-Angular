import { ProductCategoryService } from "./product-category.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { combineLatest, Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Product } from "./product";
import { ProductCategory } from "./product-category";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private productsUrl = "http://localhost:62799/api/products/getProducts";

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
  constructor(
    private http: HttpClient,
    private productCategoryService: ProductCategoryService
  ) {}

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
