import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { InitialDepositOptions } from '../../model/investmentConfiguration.model';
import { PlanService } from '../../services/plan.service';
import { FeesChargesConfiguration } from '../../model/planIndex.model';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';

@Component({
  selector: 'ignatica-fund-deposit',
  templateUrl: './fund-deposit.component.html',
  styleUrls: ['./fund-deposit.component.scss'],
})
export class FundDepositComponent implements OnInit {
  @Input() initialDepositOptions: InitialDepositOptions;
  @Input() feesAndChargesOptions: any[] = [];
  @Input() chargeType: string;
  @Input() feesChargesOID: string;
  @Input() heading: string;
  @Input() planGuid: string = null;
  @Input() product: any;
  @Input() disableControl: boolean = false;
  @Output() saveChargesFromChildEmit = new EventEmitter<object>();
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  constructor(
    private modalService: NgbModal,
    public translateService: TranslateService,
    private planService: PlanService
  ) {}

  ngOnInit(): void {
    this.planService.getCurrencyValue().subscribe((event) => {
      if (event) {
        this.initialDepositOptions.depositCurrencyOID = event;
      }
    });
  }

  saveChargesEmit(charges, chargeType) {
    this.saveChargesFromChildEmit.emit({ param1: charges, param2: chargeType });
  }

  getDataByType() {
    let charges = Array.prototype.concat.apply(
      [],
      this.feesAndChargesOptions
        .filter((x) => x.feesChargesOID == this.feesChargesOID)
        .map((x) => x.feesChargesRateTable)
    );
    return charges ? charges : [];
  }
  showTopUpRules() {
    const modalRef = this.modalService.open(PlanRulesModalComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.ruleCategory = 'IG_RULE_CATEGORY_TOPUP_PREMIUM';
    modalRef.componentInstance.heading = this.heading;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.underwritingRuleData =
      this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
        (x) => x.ruleCategory == 'IG_RULE_CATEGORY_TOPUP_PREMIUM'
      );
    modalRef.closed.subscribe((data) => {
      let oldData =
        this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
          (x) => x.ruleCategory !== 'IG_RULE_CATEGORY_TOPUP_PREMIUM'
        );
      this.feesChargesConfiguration.premiumModifiersRuleBased = [
        ...oldData,
        ...data,
      ];
    });
  }
}
