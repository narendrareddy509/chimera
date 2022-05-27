/**
 * Billing Component Widget contains the Billing currency, Billing Methods, Billing Modes and Grace Period Days
 *
 *
 * @author [Anitha]
 *
 */

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BillingOptions } from '../../model/billingOptions.model';
import { Subscription, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { PlanService } from '@app/feature/planTemplate/services/plan.service';
import {
  ProductTemplate,
  billingMethods,
  billingModes,
} from '../../../products/model/productTemplate.model';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';
import { FeesChargesConfiguration } from '../../model/planIndex.model';

@Component({
  selector: 'ignatica-plan-billing',
  templateUrl: './plan-billing.component.html',
  styleUrls: ['./plan-billing.component.scss'],
})
export class PlanBillingComponent implements OnInit {
  @Input() billingOptions: BillingOptions;
  @Input() product: ProductTemplate;
  @Input() disableControl: boolean = false;
  selectedBillingModes: any = [];
  billingModesEnabledList: Array<billingModes> = [];
  billingMethodEnabledList: Array<billingMethods> = [];
  selectedBillingMethods: any = [];
  saveClicked = false;
  eventsSubscription: Subscription;
  @Input() eventsSubject: Observable<void>;
  @ViewChild('billingForm') billingForm: NgForm;
  formValid = false;
  selectBillingMethodArray: any = [];
  selectBillingModeArray: any = [];
  currencyValue: any;
  billingMethodChoiceValue: any;
  billingModeChoiceValue: any;
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() showRulesButton: boolean = false;

  constructor(
    private planService: PlanService,
    private modalService: NgbModal,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.billingModesEnabledList = this.product.billingModes
      .filter((x) => x.isEnabled)
      .map((x) => {
        x.description = x.description.split('-')[0];
        return x;
      });
    console.log(this.billingMethodEnabledList);

    this.getCurrencies();
    this.getBillingMethods();
    this.getBillingModes();
    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      let selectBillingModes = this.selectBillingModeArray.map((x) => {
        let obj: any = {
          billingModeOID: x.billingModeOID,
          billingModalFactor: x.billingModalFactor,
          isEnabled: true,
        };
        return obj;
      });
      this.billingOptions.billingModes = selectBillingModes;

      this.billingOptions.billingMethods = [];
      if (
        this.billingMethodEnabledList.filter((m) => m.isSelected).length > 0
      ) {
        this.billingOptions.billingMethods = this.billingMethodEnabledList
          .filter((m) => m.isSelected)
          .map((x) => {
            let obj: any = {
              billingMethodOID: x.billingMethodOID,
              isEnabled: true,
            };
            return obj;
          });
      }
      this.saveClicked = false;
      this.formValid =
        this.billingForm.valid &&
        this.billingOptions.billingModes &&
        this.billingOptions.billingModes.length > 0 &&
        this.billingOptions.billingMethods &&
        this.billingOptions.billingMethods.length > 0 &&
        this.billingOptions.billingCurrencies &&
        this.billingOptions.billingCurrencies.length > 0;
    });
  }

  onBillingModeChanged(event: any): void {
    this.selectedBillingModes = this.product.billingModes.find(
      (x) => x['billingModeOID'] == event
    );
  }

  addBillingModeChoice() {
    if (this.selectedBillingModes.length === 0) {
      return;
    }
    let isExists = this.billingOptions.billingModes.some(
      (item) =>
        item.billingModeOID === this.selectedBillingModes['billingModeOID']
    );
    if (!isExists) {
      this.billingOptions.billingModes.push({
        billingModeOID: this.selectedBillingModes['billingModeOID'],
        billingModalFactor: null,
        isEnabled: true,
      });
      this.product.billingModes.map((e) => {
        if (e.billingModeOID === this.selectedBillingModes['billingModeOID']) {
          this.selectBillingModeArray.push({
            billingModeOID: this.selectedBillingModes['billingModeOID'],
            billingModalFactor: null,
            description: e.description,
          });
        }
      });
    }
  }

  deleteBillingModeChoices(index) {
    this.billingOptions.billingModes.splice(index, 1);
    this.selectBillingModeArray.splice(index, 1);
  }

  getCurrencies() {
    this.planService.getCurrencyValue().subscribe((event) => {
      this.product.policyCurrencies.map((e) => {
        if (event && e.currencyOID === event) {
          this.currencyValue = e.currencyId + '-' + e.description;
          this.billingOptions.billingCurrencies = [
            {
              currencyOID: event,
              isEnabled: true,
            },
          ];
        }
      });
    });
  }

  getBillingMethods() {
    this.billingMethodEnabledList = this.product.billingMethods
      .filter((x) => x.isEnabled)
      .map((method) => {
        return {
          billingMethodOID: method.billingMethodOID,
          description: method.description,
          billingMethodId: method.billingMethodId,
          numericCode: method.numericCode,
          isEnabled: method.isEnabled,
          isSelected:
            this.billingOptions.billingMethods.filter(
              (x) => x.billingMethodOID === method.billingMethodOID
            ).length > 0,
        };
      });

    if (this.billingOptions.billingMethods.length == 0) {
      this.billingMethodEnabledList[0].isSelected = true;
    }
    console.log(this.billingMethodEnabledList);
  }

  getBillingModes() {
    if (this.billingOptions && this.billingOptions.billingModes.length > 0) {
      this.billingOptions.billingModes.forEach(async (item) => {
        this.product.billingModes.findIndex((prodEle) => {
          if (
            prodEle.billingModeOID === item.billingModeOID &&
            prodEle.isEnabled
          ) {
            this.selectBillingModeArray.push({
              billingModeOID: item.billingModeOID,
              description: prodEle.description.split('-')[0],
              billingModalFactor: item.billingModalFactor,
            });
          }
        });
      });
    } else {
      this.selectBillingModeArray.push({
        billingModeOID: this.product.billingModes[0].billingModeOID,
        description: this.product.billingModes[0].description.split('-')[0],
        billingModalFactor: 0,
      });
    }
  }

  showBillingModeChangeRules() {
    const modalRef = this.modalService.open(PlanRulesModalComponent, {
      size: 'xl customcell',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.ruleCategory =
      'IG_RULE_CATEGORY_BILLING_MODE_CHANGE';
    modalRef.componentInstance.heading =
      'plan.financialChanges.billingModeChangeTitle';
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.underwritingRuleData =
      this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
        (x) => x.ruleCategory == 'IG_RULE_CATEGORY_BILLING_MODE_CHANGE'
      );
    modalRef.closed.subscribe((data) => {
      let oldData =
        this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
          (x) => x.ruleCategory !== 'IG_RULE_CATEGORY_BILLING_MODE_CHANGE'
        );
      this.feesChargesConfiguration.premiumModifiersRuleBased = [
        ...oldData,
        ...data,
      ];
    });
  }
}
