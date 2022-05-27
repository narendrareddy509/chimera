import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FeesChargesConfiguration } from '../../model/planIndex.model';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';
@Component({
  selector: 'ignatica-plan-financial-changes',
  templateUrl: './plan-financial-changes.component.html',
  styleUrls: ['./plan-financial-changes.component.scss'],
})
export class PlanFinancialChangesComponent implements OnInit {
  @Input() product: any;
  @Input() disableControl: boolean = false;
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() showFundAllocation: boolean = false;

  constructor(
    private modalService: NgbModal,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  showFaceAmountRules() {
    const modalRef = this.modalService.open(PlanRulesModalComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.ruleCategory =
      'IG_RULE_CATEGORY_FACE_AMOUNT_CHANGE';
    modalRef.componentInstance.heading =
      'plan.financialChanges.faceAmountTitle';
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.underwritingRuleData =
      this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
        (x) => x.ruleCategory == 'IG_RULE_CATEGORY_FACE_AMOUNT_CHANGE'
      );
    modalRef.closed.subscribe((data) => {
      let oldData =
        this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
          (x) => x.ruleCategory !== 'IG_RULE_CATEGORY_FACE_AMOUNT_CHANGE'
        );
      this.feesChargesConfiguration.premiumModifiersRuleBased = [
        ...oldData,
        ...data,
      ];
    });
  }
  showFundAllocationRules() {
    const modalRef = this.modalService.open(PlanRulesModalComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.ruleCategory =
      'IG_RULE_CATEGORY_FUND_ALLOCATION_CHANGE';
    modalRef.componentInstance.heading = 'plan.financialChanges.fundTitle';
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.underwritingRuleData =
      this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
        (x) => x.ruleCategory == 'IG_RULE_CATEGORY_FUND_ALLOCATION_CHANGE'
      );
    modalRef.closed.subscribe((data) => {
      let oldData =
        this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
          (x) => x.ruleCategory !== 'IG_RULE_CATEGORY_FUND_ALLOCATION_CHANGE'
        );
      this.feesChargesConfiguration.premiumModifiersRuleBased = [
        ...oldData,
        ...data,
      ];
    });
  }
}
