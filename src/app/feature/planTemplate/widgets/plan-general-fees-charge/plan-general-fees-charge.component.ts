import { Component, OnInit, Input } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductTemplate } from '../../../products/model/productTemplate.model';
import { FeesChargesConfiguration } from '../../model/planIndex.model';

@Component({
  selector: 'ignatica-plan-general-fees-charge',
  templateUrl: './plan-general-fees-charge.component.html',
  styleUrls: ['./plan-general-fees-charge.component.scss'],
})
export class PlanGeneralFeesChargeComponent implements OnInit {
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() eventsSubject: Observable<void>;
  @Input() product: ProductTemplate;
  @Input() disableControl: boolean = false;
  admimChargeOID: string;
  adminCharge: number;
  eventsSubscription: Subscription;
  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    if (this.product.feesAndChargesOptions) {
      this.admimChargeOID = this.product.feesAndChargesOptions.filter(
        (x) =>
          x.feesChargesBasisId == 'IG_CALCULATION_BASIS_FIXED_AMOUNT' &&
          x.feesChargesConsumptionId == 'IG_CHARGE_DEDUCTION_TYPE_BACKWARD' &&
          x.feesChargesTypeId == 'IG_CHARGES_POLICY_ADMINISTRATION'
      )[0].feesChargesOID;
    }
    if (this.feesChargesConfiguration.feesAndChargesOptions.length > 0) {
      let adminChargePrc =
        this.feesChargesConfiguration.feesAndChargesOptions.filter(
          (x) => x.feesChargesOID == this.admimChargeOID
        );
      this.adminCharge =
        adminChargePrc.length > 0 ? adminChargePrc[0].feesChargesFixedAmount  : 0;
    }
    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      let taxIndex =
        this.feesChargesConfiguration.feesAndChargesOptions.findIndex(
          (x) => x.feesChargesOID == this.admimChargeOID
        );
      this.feesChargesConfiguration.feesAndChargesOptions[
        taxIndex == -1
          ? this.feesChargesConfiguration.feesAndChargesOptions.length
          : taxIndex
      ] = {
        feesChargesOID: this.admimChargeOID,
        isActive: true,
        isDeleted: false,
        feesChargesFixedAmount : this.adminCharge,
        feesChargesRate: 0,
        feesChargesRateTable: [],
      };
    });
  }
}
