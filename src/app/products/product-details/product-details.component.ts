import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { EMPTY, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { ProductService } from "../product.service";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnInit {
  pageTitle = "Product Details";
  errMessage: string;
  private errMessageSubject = new Subject();
  errMessageAction$ = this.errMessageSubject.asObservable();
  product$ = this.productService.selectedProduct$.pipe(
    catchError((err) => {
      this.errMessageSubject.next(err);
      return EMPTY;
    })
  );

  selectedProductSuppliers$ = this.productService.selectedProductSuppliers$.pipe(
    catchError((err) => {
      this.errMessageSubject.next(err);
      return EMPTY;
    })
  );

  constructor(private productService: ProductService) {}

  ngOnInit() {}
}
