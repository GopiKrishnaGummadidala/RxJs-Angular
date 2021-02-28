import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ProductsListComponent } from "./products-list/products-list.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [ProductsListComponent],
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: ProductsListComponent,
      },
    ]),
  ],
  providers: [],
})
export class ProductsModule {}
