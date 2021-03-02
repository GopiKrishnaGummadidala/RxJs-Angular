import { catchError, tap } from "rxjs/operators";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { EMPTY, Observable, Subscription } from "rxjs";
import { Product } from "../product";
import { ProductService } from "../product.service";

@Component({
  selector: "app-products-list",
  templateUrl: "./products-list.component.html",
  styleUrls: ["./products-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent {
  pageTitle = "Product List";
  errMessage: string;
  products$ = this.productService.products$.pipe(
    catchError((err) => {
      this.errMessage = err;
      return EMPTY;
    })
  );

  productsWithCategorys$ = this.productService.productsWithCategorys$.pipe(
    catchError((err) => {
      this.errMessage = err;
      return EMPTY;
    })
  );

  constructor(private productService: ProductService) {}
}
