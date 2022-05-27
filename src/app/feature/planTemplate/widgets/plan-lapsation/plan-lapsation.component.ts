import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FeesChargesConfiguration } from '../../model/planIndex.model';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';

@Component({
  selector: 'ignatica-plan-lapsation',
  templateUrl: './plan-lapsation.component.html',
  styleUrls: ['./plan-lapsation.component.scss'],
})
export class PlanLapsationComponent implements OnInit {
  @Input() product: any;
  @Input() disableControl: boolean = false;
  @Input() feesChargesConfiguration: FeesChargesConfiguration;

  constructor(
    private modalService: NgbModal,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  showLapsationRules() {
    const modalRef = this.modalService.open(PlanRulesModalComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.ruleCategory = 'IG_RULE_CATEGORY_LAPSATION';
    modalRef.componentInstance.heading = 'plan.lapsation.rulesTitle';
    modalRef.componentInstance.subCategories = [
      {
        name: 'IG_RULE_SUBCATEGORY_PREVALIDATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Pass', 'Reject', 'Referred'],
        category: 'IG_RULE_CATEGORY_LAPSATION',
      },
    ];
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.underwritingRuleData =
      this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
        (x) => x.ruleCategory == 'IG_RULE_CATEGORY_LAPSATION'
      );
    modalRef.componentInstance.title = 'Lapsation';
    modalRef.closed.subscribe((data) => {
      let oldData =
        this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
          (x) => x.ruleCategory !== 'IG_RULE_CATEGORY_LAPSATION'
        );
      this.feesChargesConfiguration.premiumModifiersRuleBased = [
        ...oldData,
        ...data,
      ];
    });
  }
}
