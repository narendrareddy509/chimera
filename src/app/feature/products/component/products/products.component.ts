import { Component, OnInit } from '@angular/core';
import { PlanService } from '@app/feature/planTemplate/services/plan.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProductComponent } from '../../../products/component/edit-product/edit-product.component';
import { Product } from '../../model/product.model';
import { ProductService } from '../../services/product.service';
import { ViewProductComponent } from '../view-product/view-product.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'ignatica-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  insuredProduct: Product;
  products = [];
  triggerPlan: boolean = false;
  configuredAdditinalPlans: any = [];
  basePlan: string;
  allPlans: any;
  product: any;

  constructor(
    public planService: PlanService,
    public dialog: NgbModal,
    private productService: ProductService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  viewProduct(insuranceProductGuid) {
    const dialogRef = this.dialog.open(ViewProductComponent, { size: 'xl' });
    dialogRef.componentInstance.bundleProductID = insuranceProductGuid;
  }

  addEditProduct(prod?) {
    const dialogRef = this.dialog.open(EditProductComponent, { size: 'xl' });
    if (
      prod &&
      prod.insuranceProductGuid &&
      prod.insuranceProductGuid !== undefined
    ) {
      dialogRef.componentInstance.product = prod;
      dialogRef.componentInstance.title = this.translateService.instant(
        'bundleProduct.createEditProduct.editProduct'
      );
    } else {
      dialogRef.componentInstance.title = this.translateService.instant(
        'bundleProduct.createEditProduct.createProduct'
      );
    }
    dialogRef.closed.subscribe((res) => {
      if (res && res.data) {
        this.products.unshift(res.data);
      } else this.getProducts();
    });
  }

  onSearch() {}

  getProducts() {
    this.productService.retrieveBundledProducts().subscribe((response: any) => {
      this.products = response.data.map((x) => {
        return {
          ...x,
          toggle: false,
        };
      });
    });
  }

  triggerPlanDetails(prod) {
    if (!prod.toggle) {
      for (let row of this.products) {
        row.toggle = row.insuranceProductGuid === prod.insuranceProductGuid;
      }
      this.insuredProduct = prod;
      this.triggerPlan = true;
      this.configuredAdditinalPlans = [];
      this.basePlan = '';
      // sorting plans sothat basic plans should load first
      const basicInsuredPlan = this.insuredProduct.configuredPlans.find(
        (p) => p.planType === 'IG_PRODUCT_PLAN_TYPE_BASIC'
      );

      const AdditionalInsuredPlans = this.insuredProduct.configuredPlans.filter(
        (p) => p.planType === 'IG_PRODUCT_PLAN_TYPE_RIDER'
      );

      let allPlans = [];
      /* Fetching base plan data first and then additional plans to show the data in sequence */
      this.planService
        .getPlan(basicInsuredPlan.planOID)
        .subscribe((res: any) => {
          this.basePlan = res.data.name;
          allPlans.push(res.data);
          AdditionalInsuredPlans.forEach((x) => {
            this.planService.getPlan(x.planOID).subscribe((res: any) => {
              if (x.planOID === res.data.planGuid) {
                this.configuredAdditinalPlans.push(res.data.name);
              }
              allPlans.push(res.data);
            });
          });
        });
      this.allPlans = allPlans;
    }
  }
}
