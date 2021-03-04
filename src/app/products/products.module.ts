import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ProductsListComponent } from "./products-list/products-list.component";
import { RouterModule } from "@angular/router";
import { ProductService } from "./product.service";
import { CommonModule } from "@angular/common";
import { ProductsListAltUIComponent } from "./products-list-alt-ui/products-list-alt-ui.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";
import { ProductShellComponent } from "./product-shell/product-shell.component";

@NgModule({
  declarations: [
    ProductsListComponent,
    ProductsListAltUIComponent,
    ProductDetailsComponent,
    ProductShellComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: ProductsListComponent,
      },
      {
        path: ":alternate",
        component: ProductShellComponent,
      },
    ]),
  ],
  providers: [ProductService],
})
export class ProductsModule {}
