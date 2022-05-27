import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ProductsComponent } from '../products/component/products/products.component';
import { EditProductComponent } from '../products/component/edit-product/edit-product.component';
import { PublishedPlansComponent } from './component/published-plans/published-plans.component';
import { ViewProductComponent } from './component/view-product/view-product.component';
@NgModule({
  declarations: [
    ProductsComponent,
    EditProductComponent,
    PublishedPlansComponent,
    ViewProductComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProductRoutingModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
  ],
  exports: [ProductsComponent],
})
export class ProductModule {}
