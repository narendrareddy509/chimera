import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';

import { PlanService } from '../../services/plan.service';
import { Plan } from '@app/feature/planTemplate/model/plan.model';
import { map } from 'rxjs/operators';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductTemplateService } from '../../../products/services/productTemplate.service';
import { SidebarService } from '@shared/custom/component/sidebar/sidebar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { product_category } from '../../../../shared/utility/product-category';
import { ToastService } from '@shared/custom/service/toast.service';

@Component({
  selector: 'ignatica-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss'],
})
export class PlanListComponent implements OnInit, OnDestroy {
  // product: Observable<any>;
  productGuid: string;
  plans: Observable<Plan[]>;
  publishStatuses: Subscription;
  @Output() planConfirmed: EventEmitter<any> = new EventEmitter<boolean>();
  shouldEnablePlanListRefresh: boolean = false;
  planTemplateList: Array<any> = [];
  selectedPlanTemplate: any;
  planTemplateCategory: string;

  constructor(
    public planService: PlanService,
    public toastService: ToastService,
    private router: Router,
    private productTemplateService: ProductTemplateService,
    private sidebarService: SidebarService,
    private route: ActivatedRoute,
    public dialog: NgbModal
  ) {
    this.plans = null;
    this.route.params.subscribe(({ type, id }) => {
      if (type) {
        let templateCode = 'IG_CATEGORY_' + type.toUpperCase();
        let planTemplate = product_category.find(
          (x) => x.isActive && x.code === templateCode
        );
        this.planTemplateCategory = planTemplate.name;

        let planTemplateList = planTemplate['subCategories'].map((s) => s.code);

        this.productTemplateService
          .retrivePlanTemplates()
          .subscribe((response) => {
            this.planTemplateList = response['data'].filter((obj) =>
              planTemplateList.includes(obj.category)
            );
            if (!this.selectedPlanTemplate) {
              this.selectedPlanTemplate = this.planTemplateList[0];
            }
            this.getPlanListByTemplateGuid();
          });
      } else if (id) {
        this.productGuid = id;

        this.productTemplateService
          .retrivePlanTemplates()
          .subscribe((response) => {
            this.selectedPlanTemplate = response['data'].find(
              (x) => x.productTemplateGuid === id
            );
            let planTemplate = product_category.find(
              (x) =>
                x.isActive &&
                x.subCategories
                  .map((y) => y.code)
                  .includes(this.selectedPlanTemplate.category)
            );
            this.planTemplateCategory = planTemplate.name;

            let planTemplateList = planTemplate['subCategories'].map(
              (s) => s.code
            );
            this.planTemplateList = response['data'].filter((obj) =>
              planTemplateList.includes(obj.category)
            );
            if (!this.selectedPlanTemplate) {
              this.selectedPlanTemplate = this.planTemplateList[0];
            }
            this.getPlanListByTemplateGuid();
          });
      }
    });
  }

  getPlanListByTemplateGuid() {
    this.plans = null;
    this.productGuid = this.selectedPlanTemplate.productTemplateGuid;
    this.planService.productSelected = null;
    this.productTemplateService
      .retriveProductTemplateById(this.productGuid)
      .subscribe(
        (response) => {
          this.planService.productSelected = response['data'];
          this.planService
            .retriveAllPlansByTemplateGuid(
              this.selectedPlanTemplate.productTemplateGuid
            )
            .subscribe(
              (responsePlans: any) => {
                this.plans = null;
                this.plans = responsePlans.data;
              },
              (error) => {
                this.plans = null;
              }
            );
        },
        (err) => {
          this.toastService.show({
            title: 'Error',
            description: err,
            classname: 'warning',
          });
        }
      );
  }

  ngOnInit(): void {
    this.plans = null;
    this.sidebarService.selectedProductType$.subscribe(
      (productType: string) => {
        this.plans = null;
      }
    );
    this.planService.setCurrencyValue(null);
  }

  checkIfStatusToBeRefreshed(): Observable<any> {
    try {
      return this.plans.pipe(
        map((plans) =>
          plans.filter(
            (plan: any) =>
              !['NOT_PUBLISHED', 'PUBLISHED'].includes(plan.publishStatus)
          )
        )
      );
    } catch (e) {
      console.log('[PlanListComponent.checkIfStatusToBeRefreshed] Error: ', e);
    }
  }

  editPlan(id: string) {
    this.router.navigate([
      `planTemplate/${this.planService.productSelected.screenCode}/edit/${id}`,
    ]);
  }

  clonePlan(id: string) {
    this.router.navigate([
      `planTemplate/${this.planService.productSelected.screenCode}/clone/${id}`,
    ]);
  }

  addPlan() {
    this.router.navigate([
      `planTemplate/${this.planService.productSelected.screenCode}/new`,
    ]);
  }

  ngOnDestroy() {
    if (this.publishStatuses) {
      this.publishStatuses.unsubscribe();
    }
  }

  checkForPlanChange(plan: any) {
    return plan.planGuid;
  }

  onSelectplanTemplate(planTemplate: any) {
    this.selectedPlanTemplate = planTemplate;
    this.getPlanListByTemplateGuid();
  }
}
