import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  WithdrawalOptions,
  InvestmentConfiguration,
  FeesChargesConfiguration,
  GeneralConfiguration,
} from '../../model/planIndex.model';
import { PlanService } from '../../../planTemplate/services/plan.service';
import { PlanRulesModalComponent } from '../shared/plan-rules-modal/plan-rules-modal.component';
import { EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'ignatica-fund-withdrawal',
  templateUrl: './fund-withdrawal.component.html',
  styleUrls: ['./fund-withdrawal.component.scss'],
})
export class FundWithdrawalComponent implements OnInit {
  @Input() withdrawalOptions: WithdrawalOptions;
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() investmentConfiguration: InvestmentConfiguration;
  @Input() feesAndChargesOptions: any[] = [];
  @Input() chargeType: string;
  @Input() feesChargesOID: string;
  @Input() heading: string;
  @Input() planGuid: string = null;
  @Input() product: any;
  @Input() disableControl: boolean = false;
  @Input() generalConfiguration: GeneralConfiguration;
  freeWithdrawalAllowed: number;
  freeWithdrawalFrequency: string;
  lockInPeriod: number;
  lockInFrequency: string;
  @Output() saveChargesFromChildEmit = new EventEmitter<object>();
  @ViewChild('FWForm') FWForm: NgForm;
  currencies = [];
  saveClicked = false;
  eventsSubscription: Subscription;
  @Input() eventsSubject: Observable<void>;
  symbol: any;
  formValid = false;
  @Input() ruleCategory: string = 'IG_RULE_CATEGORY_FUND_WITHDRAWAL_REGULAR';

  constructor(
    private planService: PlanService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.planService.getCurrencyValue().subscribe((event) => {
      if (event) {
        this.withdrawalOptions.withdrawalCurrencyOID = event;
      }
    });
    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      this.saveClicked = true;
      this.investmentConfiguration.withdrawalOptions.freeWithdrawalPerDayCount = 0;
      this.investmentConfiguration.withdrawalOptions.freeWithdrawalPerWeekCount = 0;
      this.investmentConfiguration.withdrawalOptions.freeWithdrawalPerPolicyMonthCount = 0;
      this.investmentConfiguration.withdrawalOptions.freeWithdrawalPerPolicyQuarterCount = 0;
      this.investmentConfiguration.withdrawalOptions.freeWithdrawalPerPolicyYearCount = 0;
      this.investmentConfiguration.withdrawalOptions[
        this.freeWithdrawalFrequency
      ] = this.freeWithdrawalAllowed;
      this.investmentConfiguration.withdrawalOptions.lockPeriodInMonths = 0;
      this.investmentConfiguration.withdrawalOptions.lockPeriodInYears = 0;
      this.investmentConfiguration.withdrawalOptions[this.lockInFrequency] =
        this.lockInPeriod;
      // Min withdrawal amount is hidden in Annuity plan but it is mandatory field in API, hence assigning 0 value
      if (this.product.screenCode === 'kfbtvvcl')
        this.withdrawalOptions.minWithdrawalAmount = 0;
    });
    for (const [key, value] of Object.entries(
      this.investmentConfiguration.withdrawalOptions
    )) {
      if (
        key.indexOf('freeWithdrawal') !== -1 &&
        value !== 0 &&
        key !== 'freeWithdrawalAllowed'
      ) {
        this.freeWithdrawalAllowed =
          this.investmentConfiguration.withdrawalOptions[key];
        this.freeWithdrawalFrequency = key;
      }
    }
    if (
      this.investmentConfiguration.withdrawalOptions.lockPeriodInMonths !== 0
    ) {
      this.lockInPeriod =
        this.investmentConfiguration.withdrawalOptions.lockPeriodInMonths;
      this.lockInFrequency = 'lockPeriodInMonths';
    }
    if (
      this.investmentConfiguration.withdrawalOptions.lockPeriodInYears !== 0
    ) {
      this.lockInPeriod =
        this.investmentConfiguration.withdrawalOptions.lockPeriodInYears;
      this.lockInFrequency = 'lockPeriodInYears';
    }
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

  validateMinMaxFund() {
    if (
      (this.product.screenCode !== 'kfbtvvcl' &&
        Number(this.withdrawalOptions.minWithdrawalAmount) <= 0) ||
      Number(this.withdrawalOptions.minWithdrawalAmount) >=
        Number(this.withdrawalOptions.maxWithdrawalAmount)
    ) {
      return true;
    }
    return false;
  }
  showUnderwritingRules() {
    const modalRef = this.modalService.open(PlanRulesModalComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.ruleCategory = this.ruleCategory;

    modalRef.componentInstance.heading =
      'plan.investmentConfiguration.rulesTitle';
    modalRef.componentInstance.disableControl = this.disableControl;
    modalRef.componentInstance.underwritingRuleData =
      this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
        (x) => x.ruleCategory == this.ruleCategory
      );
    modalRef.componentInstance.title = 'Fund Withdrawal';
    modalRef.closed.subscribe((data) => {
      let oldData =
        this.feesChargesConfiguration.premiumModifiersRuleBased.filter(
          (x) => x.ruleCategory !== this.ruleCategory
        );
      this.feesChargesConfiguration.premiumModifiersRuleBased = [
        ...oldData,
        ...data,
      ];
    });
  }
}
