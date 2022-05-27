import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import {
  GeneralConfiguration,
  Module,
  PlanModule,
} from '../../model/generalConfiguration.model';
import { FeesChargesConfiguration } from '../../model/planIndex.model';
import { ReinstatementOptions } from '../../model/reinstatement.model';
import { PlanModulesListComponent } from '../shared/plan-modules-list/plan-modules-list.component';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';
import { BillingOptions } from '../../model/billingOptions.model';

import { modules } from '../../../products/model/productTemplate.model';

@Component({
  selector: 'ignatica-plan-lapsation-reinstatement',
  templateUrl: './plan-lapsation-reinstatement.component.html',
  styleUrls: ['./plan-lapsation-reinstatement.component.scss'],
})
export class PlanLapsationReinstatementComponent implements OnInit {
  @Input() product: any;
  @Input() billingOptions: BillingOptions;

  @Input() reinstatement: ReinstatementOptions;
  @Input() disableControl: boolean = false;
  @ViewChild('RIForm') RIForm: NgForm;
  @Input() modulesEventsSubject: Observable<any>;
  @Input() formulas: Array<any>;
  eventsSubscription: Subscription;
  saveClicked = false;
  formValid = true;
  @Input() generalConfiguration: GeneralConfiguration;
  reinstatementFeeVal: number;
  reinstatementFeViewChildeOID: string;
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  reinstatementFeeOID: string;
  ruleCategories = [
    'IG_RULE_CATEGORY_LAPSATION',
    'IG_RULE_CATEGORY_REINSTATEMENT',
  ];

  @Input() modulesArray: Array<Module>;
  public selectedModules: Array<modules> = [];
  selectedModulesObj: Array<PlanModule>;

  constructor(
    private modalService: NgbModal,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.product) {
      if (this.product.feesAndChargesOptions) {
        this.reinstatementFeeOID = this.product.feesAndChargesOptions.filter(
          (x) => x.feesChargesTypeId == 'IG_FEES_REINSTATEMENT'
        )[0].feesChargesOID;
      }
    }

    if (this.modulesArray && this.modulesArray.length) {
      this.modulesArray.map((module) => {
        module.formulas = this.product.modules
          .filter((x) => x.widgetCode == module.widgetCode && x.isEnabled)
          .map((x) => {
            x['selected'] = false;
            if (
              this.generalConfiguration.planModules
                .map((p) => p.moduleOID)
                .includes(x.moduleOID)
            ) {
              x.selected = true;
              this.selectedModules.push(x);
            }
            return x;
          });
        return module;
      });
    }

    if (this.feesChargesConfiguration.feesAndChargesOptions.length > 0) {
      let txPrc = this.feesChargesConfiguration.feesAndChargesOptions.filter(
        (x) => x.feesChargesOID == this.reinstatementFeeOID
      );
      this.reinstatementFeeVal =
        txPrc.length > 0 ? txPrc[0].feesChargesFixedAmount  : 0;
    }

    this.eventsSubscription = this.modulesEventsSubject.subscribe((data) => {
      if (data == 'publish') {
        this.saveClicked = true;
      }
      this.formValid = this.RIForm.valid;

      let taxIndex =
        this.feesChargesConfiguration.feesAndChargesOptions.findIndex(
          (x) => x.feesChargesOID == this.reinstatementFeeOID
        );
      this.feesChargesConfiguration.feesAndChargesOptions[
        taxIndex == -1
          ? this.feesChargesConfiguration.feesAndChargesOptions.length
          : taxIndex
      ] = {
        feesChargesOID: this.reinstatementFeeOID,
        isActive: true,
        isDeleted: false,
        feesChargesFixedAmount : this.reinstatementFeeVal,
        feesChargesRate: 0,
        feesChargesRateTable: [],
      };

      this.selectedModulesObj = [];
      if (this.selectedModules && this.selectedModules.length > 0) {
        this.selectedModules.forEach((formula) => {
          this.selectedModulesObj.push({
            moduleOID: formula.moduleOID,
            cronJobSettings: formula.cronJobSettings,
            isEnabled: true,
          });
        });
      }

      // this.formValid = this.RIForm.valid;
    });
  }
  showFormulas() {
    const modalRef = this.modalService.open(PlanModulesListComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.moduleList = this.modulesArray;
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.closed.subscribe((data) => {
      this.selectedModules = [];
      if (data) {
        data.forEach((element) => {
          element.formulas.forEach((formula) => {
            if (formula.selected) {
              this.selectedModules.push(formula);
            }
          });
        });
      }
    });
  }
  showUnderwritingRules() {
    const modalRef = this.modalService.open(PlanRulesModalComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.ruleCategory = this.ruleCategories;
    modalRef.componentInstance.subCategories = [
      {
        name: 'IG_RULE_SUBCATEGORY_PREVALIDATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Pass', 'Reject', 'Referred'],
        category: 'IG_RULE_CATEGORY_LAPSATION',
      },
      {
        name: 'IG_RULE_SUBCATEGORY_PREVALIDATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Pass', 'Reject', 'Referred'],
        category: 'IG_RULE_CATEGORY_REINSTATEMENT',
      },
      {
        name: 'IG_RULE_SUBCATEGORY_CALCULATION',
        isEdit: false,
        saveClicked: false,
        actions: ['Modifier'],
        category: 'IG_RULE_CATEGORY_REINSTATEMENT',
      },
    ];
    modalRef.componentInstance.heading =
      'plan.lapsationReinstatement.rulesTitle';
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.underwritingRuleData =
      this.feesChargesConfiguration.premiumModifiersRuleBased.filter((x) =>
        this.ruleCategories.includes(x.ruleCategory)
      );
    modalRef.closed.subscribe((data) => {
      let oldData =
        this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
          (x) => !this.ruleCategories.includes(x.ruleCategory)
        );
      this.feesChargesConfiguration.premiumModifiersRuleBased = [
        ...oldData,
        ...data,
      ];
    });
  }
}
