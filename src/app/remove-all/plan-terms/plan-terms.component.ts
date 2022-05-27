import { Component, OnInit, Input, ViewChild } from '@angular/core';
// import {
//   GeneralConfiguration,
//   ServicingEndorsementConfiguration,
// } from '../../../model/planIndex.model';
import * as currencyData from 'currency-codes/data';
import { Subscription, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
// import { PlanService } from '@app/feature/planTemplate/services/plan.service';
// import {
//   policyCurrencies,
//   ProductTemplate,
// } from '../../../../products/model/productTemplate.model';

@Component({
  selector: 'ignatica-plan-terms',
  templateUrl: './plan-terms.component.html',
  styleUrls: ['./plan-terms.component.scss'],
})
export class PlanTermsComponent implements OnInit {
  // @Input() generalConfiguration: GeneralConfiguration;
  // @Input() servicingEndorsementConfiguration: ServicingEndorsementConfiguration;
  // @Input() product: ProductTemplate;
  // @Input() disableControl: boolean = false;
  // @Input() formulas: Array<any>;
  // gpValidated: boolean = false;
  // currencies: any;
  // events: any;
  // saveClicked = false;
  // eventsSubscription: Subscription;
  // @Input() eventsSubject: Observable<void>;
  // @ViewChild('GPForm') GPForm: NgForm;
  // formValid = false;
  // dateInValidate = false;
  // @Input() showGlobalParameters: boolean = false;

  // effectiveStartDateDisplay: NgbDate;
  // effectiveEndDateDisplay: NgbDate;
  // policyCurrencies: any;
  // coolingOffPeriodDaysVal: number;

  // nonExpiryTerm: boolean = false;

  // constructor(private planService: PlanService) {}
  ngOnInit(): void {
    //   if (this.product && this.product.screenCode === 'kfbtvvcl') {
    //     this.nonExpiryTerm = true;
    //     this.generalConfiguration.policyTermYears = !this.generalConfiguration
    //       .policyTermYears
    //       ? 99999999
    //       : this.generalConfiguration.policyTermYears;
    //   }
    //   if (this.generalConfiguration.effectiveStartDate) {
    //     this.effectiveStartDateDisplay = this.parseToNgbDate(
    //       this.generalConfiguration.effectiveStartDate
    //     );
    //   }
    //   if (this.generalConfiguration.effectiveEndDate) {
    //     this.effectiveEndDateDisplay = this.parseToNgbDate(
    //       this.generalConfiguration.effectiveEndDate
    //     );
    //   }
    //   if (
    //     this.servicingEndorsementConfiguration &&
    //     this.servicingEndorsementConfiguration.cancellationOptions &&
    //     this.servicingEndorsementConfiguration.cancellationOptions
    //       .coolingOffPeriodDays
    //   ) {
    //     this.coolingOffPeriodDaysVal =
    //       this.servicingEndorsementConfiguration.cancellationOptions.coolingOffPeriodDays;
    //   }
    //   this.getCurrencies();
    //   this.eventsSubscription = this.eventsSubject.subscribe(() => {
    //     this.saveClicked = true;
    //     if (this.effectiveStartDateDisplay) {
    //       this.generalConfiguration.effectiveStartDate = this.parseToDate(
    //         this.effectiveStartDateDisplay
    //       );
    //     }
    //     if (this.effectiveEndDateDisplay) {
    //       this.generalConfiguration.effectiveEndDate = this.parseToDate(
    //         this.effectiveEndDateDisplay
    //       );
    //     }
    //     // Adding coolingoffperiod days to plan
    //     if (this.coolingOffPeriodDaysVal) {
    //       this.servicingEndorsementConfiguration.cancellationOptions = {
    //         isCoolingOffAllowed: true,
    //         coolingOffPeriodDays: this.coolingOffPeriodDaysVal,
    //       };
    //     }
    //     this.formValid = this.GPForm.valid && !this.compareTwoDates();
    //   });
  }
  // onPolicyCurrencyChanged(event) {
  //   this.planService.setCurrencyValue(event);
  //   this.generalConfiguration.policyCurrencies = [];
  //   this.generalConfiguration.policyCurrencies.push({
  //     currencyOID: event,
  //     isEnabled: true,
  //   });
  // }

  // getCurrencies() {
  //   const currencyMap = currencyData.reduce((prev, { code, currency }) => {
  //     prev[code] = currency;
  //     return prev;
  //   }, {});
  //   this.currencies = this.product.policyCurrencies
  //     .filter((x) => x.isEnabled)
  //     .map((eachCurrency: policyCurrencies) => ({
  //       name: eachCurrency.description
  //         ? eachCurrency.currencyId + '-' + eachCurrency.description
  //         : currencyMap[eachCurrency],
  //       value: eachCurrency.currencyOID
  //         ? eachCurrency.currencyOID
  //         : eachCurrency,
  //     }));
  //   if (this.generalConfiguration.policyCurrencies) {
  //     this.policyCurrencies =
  //       this.generalConfiguration.policyCurrencies[0].currencyOID;
  //     this.planService.setCurrencyValue(this.policyCurrencies);
  //   }
  // }
  // parseToNgbDate(dateString: string): NgbDate {
  //   if (dateString) {
  //     const date = new Date(dateString);
  //     return new NgbDate(
  //       date.getFullYear(),
  //       date.getMonth() + 1,
  //       date.getDate()
  //     );
  //   }
  //   return null;
  // }

  // parseToDate(dateString: NgbDate): string {
  //   if (dateString) {
  //     return [
  //       dateString.year,
  //       ('0' + dateString.month).slice(-2),
  //       ('0' + dateString.day).slice(-2),
  //     ].join('-');
  //   }
  //   return null;
  // }

  // public compareTwoDates() {
  //   return (
  //     this.saveClicked &&
  //     this.generalConfiguration.effectiveEndDate &&
  //     this.generalConfiguration.effectiveStartDate &&
  //     this.generalConfiguration.effectiveStartDate >=
  //       this.generalConfiguration.effectiveEndDate
  //   );
  // }

  // /* Non-expiry Term Switch is put (On / Off, Mandatory),
  // Once, it is Off, the Policy Term is shown back.
  // When it is On, we will take 99999999 as policyTermYears. */
  // onNonExpiryTermChange(e) {
  //   if (e) {
  //     this.generalConfiguration.policyTermYears = 99999999;
  //   }
  // }
}
