import { Component, Input, OnInit } from '@angular/core';
import { ProductTemplateService } from '../../../products/services/productTemplate.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../services/product.service';
import {
  product_category,
  sub_categories,
} from '../../../../shared/utility/product-category';
import { PlanService } from '@app/feature/planTemplate/services/plan.service';
import { Product } from '../../model/product.model';

@Component({
  selector: 'ignatica-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent implements OnInit {
  productCatDisplay: string;
  basePlan: any;
  configuredPlans = [];
  allPublishedPlans = [];
  @Input() bundleProductID;
  productCategoryList = [];
  product: Product;

  constructor(
    public dialogRef: NgbActiveModal,
    private productService: ProductService,
    private productTemplateService: ProductTemplateService,
    private planService: PlanService
  ) {}

  ngOnInit(): void {
    this.getBundledProductByGuid();
  }
  onClose() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  getBundledProductByGuid() {
    this.productService
      .retrieveBundledProductByGuid(this.bundleProductID)
      .subscribe((res: any) => {
        this.product = res.data;
        //this.getProductDetails();
        this.productCategoryList = product_category
          .filter((p) => p.isActive)
          .map((product) => {
            return {
              name: product.name,
              code: product.code,
            };
          });
        this.productCatDisplay = this.productCategoryList.filter(
          (x) => x.code == this.product.productCategory
        )[0].name;
        (async () => {
          let productTemplateGuids = await this.getAllProductTemplateGuids(
            this.product
          );
        })();
      });
  }
  getProductBindings() {
    this.configuredPlans = this.product.configuredPlans.filter(
      (x) => x.planType == 'IG_PRODUCT_PLAN_TYPE_RIDER'
    );
    this.configuredPlans.map((x) => {
      let planDetail = this.allPublishedPlans.filter(
        (y) => y.planGuid == x.planOID
      )[0];
      let planCategories = planDetail?.category;
      x['name'] = planDetail?.name;
      x['planCategory'] = sub_categories.filter(
        (p) => p.code == planCategories
      )[0]?.mainCategoryName;
      return x;
    });

    let planOID = this.product.configuredPlans.filter(
      (x) => x.planType == 'IG_PRODUCT_PLAN_TYPE_BASIC'
    )[0]?.planOID;
    this.basePlan = this.allPublishedPlans.filter(
      (y) => y.planGuid == planOID
    )[0]?.name;
  }

  getAllProductTemplateGuids = async (product) => {
    let productTemplateGuids;
    await this.productService
      .retrieveProductTemplates()
      .subscribe(async (res: any) => {
        productTemplateGuids = res.data.map((x) => x.productTemplateGuid);
        await this.getAllPublishedPlans(product, productTemplateGuids);
      });
    return productTemplateGuids;
  };
  getAllPublishedPlans = async (product, productTemplateGuids) => {
    let plans;
    await Promise.all(
      productTemplateGuids.map(async (element) => {
        let planList = await this.planService
          .retriveAllPlansByTemplateGuid(element)
          .toPromise()
          .then(
            (response: any) => {
              console.log('subscribe');
              let publishedPlans = response.data.filter((p) => {
                return p.publishStatus === 'PUBLISHED';
              });
              this.allPublishedPlans.push(...publishedPlans);
            },
            (error) => {
              this.allPublishedPlans = [];
            }
          );
      })
    ).then((x) => {
      if (product) {
        this.getProductBindings();
      }
    });
  };
}
