import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../../model/product.model';
import {
  product_category,
  sub_categories,
} from '../../../../shared/utility/product-category';
import { PlanService } from '../../../planTemplate/services/plan.service';
import { ProductService } from '../../services/product.service';
import { ToastService } from '@shared/custom/service/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ProductTemplateService } from '../../../products/services/productTemplate.service';

@Component({
  selector: 'ignatica-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  @Input() title: string;
  @Input() product: Product;
  disableControl: boolean = false;
  saveClicked = false;
  @ViewChild('productForm') productForm: NgForm;
  productCategoryList = [];
  activePlanList = [];
  basePlanList: any = [];
  allPublishedPlans: any = [];
  basePlan: any;
  underwritingRuleData: any;
  formValid: boolean = false;
  planCategoryList: any = [];
  configuredPlans: any = [];
  @ViewChild('labelImport')
  labelImport: ElementRef;
  showInvalid = false;
  showMaxImageSizeError: boolean = false;
  productIcon: string = null;
  activeSubCategories: any = sub_categories.filter((s) => s.isActive);

  constructor(
    public dialogRef: NgbActiveModal,
    public planService: PlanService,
    private productService: ProductService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private productTemplateService: ProductTemplateService
  ) {
    this.product = new Product();
    this.product.configuredPlans = [];
    this.configuredPlans = [];
  }

  ngOnInit(): void {
    this.productCategoryList = product_category
      .filter((p) => p.isActive && p.displayInBundleProduct)
      .map((product) => {
        return {
          name: product.name,
          code: product.code,
        };
      });
    (async () => {
      let productTemplateGuids = await this.getAllProductTemplateGuids(
        this.title,
        this.product
      );
    })();
    // If product icon is available in saved data then assigning it to a variable to show on load
    if (this.product.productIcon && this.product.productIcon.data) {
      this.productIcon = this.product.productIcon.data;
    }
  }

  getProductBindings() {
    this.configuredPlans = this.product.configuredPlans.filter(
      (x) => x.planType == 'IG_PRODUCT_PLAN_TYPE_RIDER'
    );
    this.configuredPlans.map((x) => {
      let planCategories = this.allPublishedPlans.filter(
        (y) => y.planGuid == x.planOID
      )[0]?.category;
      if (planCategories) {
        x.planCategory = sub_categories.filter(
          (p) => p.code == planCategories
        )[0]?.mainCategoryCode;
        x.planList = this.allPublishedPlans.filter((planEle) => {
          return (
            planCategories.includes(planEle.category) &&
            planEle.publishStatus == 'PUBLISHED'
          );
        });
      }
      return x;
    });
    this.onProductCategorySelection(this.product.productCategory);
    this.basePlan = this.product.configuredPlans.filter(
      (x) => x.planType == 'IG_PRODUCT_PLAN_TYPE_BASIC'
    )[0].planOID;
  }

  addAdditionalPlan() {
    this.configuredPlans.push({
      planOID: null,
      planType: 'IG_PRODUCT_PLAN_TYPE_RIDER',
      isRequired: true,
      isDefault: true,
      isEnabled: true,
      planList: [],
    });
  }
  deleteAdditionalPlan(index) {
    this.configuredPlans.splice(index, 1);
  }

  onProductCategorySelection(event) {
    let planCategories = sub_categories
      .filter(
        (x) =>
          x.mainCategoryCode == event &&
          x.code === 'IG_CATEGORY_INVESTMENT_LIFE' // Fetching only ILAS plans in baseplan dropdown
      )
      .map((y) => y.code);
    this.basePlanList = [];
    if (planCategories && planCategories.length > 0) {
      this.basePlanList = this.allPublishedPlans.filter((planEle) => {
        return (
          planCategories.includes(planEle.category) &&
          planEle.publishStatus == 'PUBLISHED'
        );
      });
    }
  }

  getPlanList(event, i) {
    let planCategories = sub_categories
      .filter(
        (x) => x.mainCategoryCode == event && x.code === 'IG_CATEGORY_TERM_LIFE' // Fetching only TERM LIFE plans in additional plans dropdown
      )
      .map((y) => y.code);
    if (planCategories && planCategories.length > 0) {
      this.configuredPlans[i].planList = this.allPublishedPlans.filter(
        (planEle) => {
          return (
            planCategories.includes(planEle.category) &&
            planEle.publishStatus == 'PUBLISHED'
          );
        }
      );
    } else {
      this.configuredPlans[i].planList = [];
    }
  }

  onSaveValidation(prodStatus) {
    this.saveClicked = true;

    if (this.configuredPlans.length > 0 && !this.basePlan) {
      this.formValid = false;
    } else {
      this.formValid = this.productForm.valid;
    }
    if (this.formValid) {
      this.product = {
        ...this.product,
        productStatus: prodStatus,
        effectiveStartDate: new Date(Date.now())
          .toISOString()
          .replace('Z', '+0000'),
        effectiveEndDate: new Date(Date.now())
          .toISOString()
          .replace('Z', '+0000'),
        premiumCommissionConfiguration: {
          premiumModifiers: [],
          commissionModifiers: [],
        },
      };
      delete this.product.toggle;
      this.product.configuredPlans = this.configuredPlans.map((x: any) => {
        if (x.planCategory) {
          delete x.planCategory;
          delete x.planList;
        }
        return x;
      });
      this.product.configuredPlans.push({
        planOID: this.basePlan,
        planType: 'IG_PRODUCT_PLAN_TYPE_BASIC',
        isRequired: true,
        isDefault: true,
        isEnabled: true,
      });
      // Saving productIcon data in API
      this.product.productIcon = this.productIcon;
      this.savePubProduct(prodStatus);
    }
  }

  savePubProduct(prodStatus) {
    if (this.title === 'Edit Product') {
      this.productService.updateBundledProducts(this.product).subscribe(
        (res: any) => {
          this.dialogRef.close({
            event: 'Save',
          });
          let message;
          if (prodStatus === 'IG_PRODUCT_STATUS_PUBLISHED') {
            message = this.translateService.instant(
              'bundleProduct.createEditProduct.prodPublishSuccess'
            );
          } else if (prodStatus === 'IG_PRODUCT_STATUS_SAVED') {
            message = this.translateService.instant(
              'bundleProduct.createEditProduct.prodUpdateSuccess'
            );
          }
          this.toastService.show({
            title: 'Success',
            description: message,
            classname: 'success',
          });
        },
        (error) => {
          let message = this.translateService.instant(
            'bundleProduct.createEditProduct.prodUpdateError'
          );
          this.toastService.show({
            title: this.translateService.instant(
              'plan.alertMessages.errorHeading'
            ),
            description: message,
            classname: 'warning',
          });
        }
      );
    } else {
      this.productService.createProduct(this.product).subscribe(
        (res) => {
          this.dialogRef.close({
            event: 'Save',
            data: {
              ...this.product,
              insuranceProductGuid: res.data.insuranceProductGuid,
            },
          });
          let message;
          if (prodStatus === 'IG_PRODUCT_STATUS_PUBLISHED') {
            message = this.translateService.instant(
              'bundleProduct.createEditProduct.prodPublishSuccess'
            );
          } else if (prodStatus === 'IG_PRODUCT_STATUS_SAVED') {
            message = this.translateService.instant(
              'bundleProduct.createEditProduct.prodCreationSuccess'
            );
          }
          this.toastService.show({
            title: this.translateService.instant(
              'plan.alertMessages.errorHeading'
            ),
            description: message,
            classname: 'warning',
          });
        },
        (error) => {
          let message = this.translateService.instant(
            'bundleProduct.createEditProduct.prodCreationError'
          );
          this.toastService.show({
            title: this.translateService.instant(
              'plan.alertMessages.errorHeading'
            ),
            description: message,
            classname: 'warning',
          });
        }
      );
    }
  }

  onClose() {
    this.dialogRef.close({ event: 'Cancel' });
  }
  getAllProductTemplateGuids = async (title, product) => {
    let productTemplateGuids;
    await this.productService
      .retrieveProductTemplates()
      .subscribe(async (res: any) => {
        productTemplateGuids = res.data
          .filter((p) =>
            this.activeSubCategories.map((c) => c.code).includes(p.category)
          )
          .map((x) => x.productTemplateGuid);
        await this.getAllPublishedPlans(title, product, productTemplateGuids);
      });
    return productTemplateGuids;
  };
  getAllPublishedPlans = async (title, product, productTemplateGuids) => {
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
      if (title === 'Edit Product' && product) {
        this.getProductBindings();
      }
    });
  };

  onProductIconUpload(files: FileList) {
    this.labelImport.nativeElement.innerText = '';
    this.showMaxImageSizeError = false;

    // Checking if uploaded one is an image
    if (!files.item(0).type.includes('image')) {
      this.showInvalid = true;
      return;
    } else if (files.item(0).size / 1024 > 500) {
      this.showMaxImageSizeError = true;
      return;
    }

    this.showInvalid = false;
    this.labelImport.nativeElement.innerText = Array.from(files)
      .map((f) => f.name)
      .join(', ');
    if (!this.showInvalid) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]); // Converting image to base64 format to save it to DB

      reader.onload = this.handleReaderLoaded.bind(this);
    }
  }

  handleReaderLoaded(e) {
    // Passing only image content as API will accept the image content only
    this.productIcon = e.target.result.split('base64,')[1];
  }
}
