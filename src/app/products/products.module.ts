import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ProductsListComponent } from "./products-list/products-list.component";
import { RouterModule } from "@angular/router";
import { ProductService } from "./product.service";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [ProductsListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: ProductsListComponent,
      },
    ]),
  ],
  providers: [ProductService],
})
export class ProductsModule {}
