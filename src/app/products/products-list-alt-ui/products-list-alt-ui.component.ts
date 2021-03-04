import { ProductService } from "./../product.service";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BehaviorSubject, EMPTY, Subject } from "rxjs";
import { catchError } from "rxjs/operators";

@Component({
  selector: "app-products-list-alt-ui",
  templateUrl: "./products-list-alt-ui.component.html",
  styleUrls: ["./products-list-alt-ui.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListAltUIComponent implements OnInit {
  pageTitle = "Product List";
  errMessageAction$ = new Subject<string>();
  selectedProduct$ = this.productService.selectedProduct$;
  productsWithCategorys$ = this.productService.productsWithCategorys$.pipe(
    catchError((err) => {
      this.errMessageAction$.next(err);
      return EMPTY;
    })
  );
  constructor(private productService: ProductService) {}

  ngOnInit() {}

  onSelected(selectedProductId: number): void {
    this.productService.selectedProductChanged(selectedProductId);
  }
}
