import { catchError, filter, map, tap } from "rxjs/operators";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  Observable,
  Subject,
  Subscription,
} from "rxjs";
import { Product } from "../product";
import { ProductService } from "../product.service";
import { ProductCategoryService } from "../product-category.service";

@Component({
  selector: "app-products-list",
  templateUrl: "./products-list.component.html",
  styleUrls: ["./products-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent {
  pageTitle = "Product List";
  errMessage: string;
  private selectedCategorySubject = new BehaviorSubject<number>(0);
  public selectedCategoryAction$ = this.selectedCategorySubject.asObservable();

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

  productsSimpleFilter$ = combineLatest([
    this.productsWithCategorys$,
    this.selectedCategoryAction$,
  ]).pipe(
    map(([products, categoryId]) =>
      products.filter((product: Product) =>
        categoryId ? product.CategoryId === categoryId : true
      )
    ),
    catchError((err) => {
      this.errMessage = err;
      return EMPTY;
    })
  );

  categorys$ = this.categoryService.productCategorys$.pipe(
    catchError((err) => {
      this.errMessage = err;
      return EMPTY;
    })
  );

  constructor(
    private productService: ProductService,
    private categoryService: ProductCategoryService
  ) {}

  onSelected(event): void {
    this.selectedCategorySubject.next(+event);
  }
}
