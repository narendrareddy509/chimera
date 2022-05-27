import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '@shared/shared.module';
import { PlanTemplateModule } from '../planTemplate/planTemplate.module';
import { DefaultComponent } from './layout/default/default.component';
import { AdminModule } from '../../master-management/admin.module';
import { ProductModule } from '../products/product.module';

@NgModule({
  declarations: [DefaultComponent],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    ProductModule,
    PlanTemplateModule,
    AdminModule,
  ],
  exports: [],
})
export class DashboardModule {}
