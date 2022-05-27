import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plan } from '@app/feature/planTemplate/model/plan.model';
import { PlanService } from '@app/feature/planTemplate/services/plan.service';
import { ProductTemplate } from '../../../products/model/productTemplate.model';
import { ProductTemplateService } from '../../../products/services/productTemplate.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ignatica-published-plans',
  templateUrl: './published-plans.component.html',
  styleUrls: ['./published-plans.component.scss'],
})
export class PublishedPlansComponent implements OnInit {
  @Input() triggerPlan: boolean = false;
  product: ProductTemplate;
  @Input() plans = [];
  planDetails: Plan;
  currency: any;
  funds: any = [];

  constructor(
    public planService: PlanService,
    private router: Router,
    private productTemplateService: ProductTemplateService
  ) {}

  ngOnInit(): void {}

  triggerPlanDetails(plan: Plan) {
    for (let row of this.plans) {
      if (row.planGuid !== plan.planGuid) {
        row.toggle = false;
      }
    }
    this.planDetails = plan;
    this.funds = [];
    this.currency = '';
    this.productTemplateService
      .retriveProductTemplateById(plan.productTemplateGuid)
      .subscribe((product: any) => {
        this.product = product.data;
        this.planService.productSelected = this.product;
        // Single policy currency used, hence index 0 taken into consideration
        this.currency = this.product.policyCurrencies.filter(
          (x) =>
            x.currencyOID ===
            this.planDetails.generalConfiguration.policyCurrencies[0]
              .currencyOID
        );
        // Fetching fund names from product
        if (
          this.planDetails.investmentConfiguration &&
          this.planDetails.investmentConfiguration.configuredFunds &&
          this.planDetails.investmentConfiguration.configuredFunds.length > 0
        )
          this.planDetails.investmentConfiguration.configuredFunds.forEach(
            (x) => {
              this.funds.push(
                this.product.funds.find((y) => y.fundOID === x.fundOID)
              );
            }
          );
      });
  }

  viewDetails(planGuid) {
    this.router.navigate([
      `planTemplate/${this.product.screenCode}/edit/${planGuid}`,
    ]);
  }

  addPlan() {
    this.router.navigate([`planTemplate/${this.product.screenCode}/new`]);
  }
}
