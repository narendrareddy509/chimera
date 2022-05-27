import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  ViewChild,
  Output,
} from '@angular/core';
import {
  MedicalBenefits,
  FeesChargesConfiguration,
  MedicalBenefitsObject,
} from '../../model/planIndex.model';
import { PlanService } from '@app/feature/planTemplate/services/plan.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared/custom/service/toast.service';
import { Subscription, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'ignatica-plan-medical-benefits',
  templateUrl: './plan-medical-benefits.component.html',
  styleUrls: ['./plan-medical-benefits.component.scss'],
})
export class PlanMedicalBenefitsComponent implements OnInit {
  @Input() medicalBenefits: Array<MedicalBenefits>;
  @Input() disableControl: boolean = false;
  medicalBenefitGroupName: string = null;
  saveClicked = false;
  eventsSubscription: Subscription;
  @Input() eventsSubject: Observable<void>;
  formValid = false;
  @Input() product: any;
  medicalBenefitGrouprequired = false;
  @ViewChild('medicalBenefitForm') medicalBenefitForm: NgForm;
  @Input() feesChargesConfiguration: FeesChargesConfiguration;
  @Input() deductibleFeesChargesOID: string;
  deductibleOccurance: number = 5;
  policyCurrencyOID: string;
  currencies = [];

  constructor(private planService: PlanService) {}

  ngOnInit(): void {
    this.planService.getCurrencyValue().subscribe((event) => {
      if (event) {
        this.policyCurrencyOID = event;
      }
    });
    if (this.feesChargesConfiguration.feesAndChargesOptions.length > 0) {
      let dPrc = this.feesChargesConfiguration.feesAndChargesOptions.filter(
        (x) => x.feesChargesOID == this.deductibleFeesChargesOID
      );
      this.deductibleOccurance =
        dPrc.length > 0 ? dPrc[0].feesChargesFixedAmount : 0;
    }
    this.eventsSubscription = this.eventsSubject.subscribe(() => {
      this.saveClicked = true;
      let emptyBenefits = this.medicalBenefits.filter(
        (x) =>
          !x.benefitName ||
          x.benefitName == undefined ||
          x.benefitName == '' ||
          x.benefitName.length == 0 ||
          !x.benefitDescription ||
          x.benefitDescription == undefined ||
          x.benefitDescription == '' ||
          x.benefitDescription.length == 0 ||
          !x.benefitExclusion ||
          x.benefitExclusion == undefined ||
          x.benefitExclusion == '' ||
          x.benefitExclusion.length == 0 ||
          !x.benefitDurationLimits.benefitLimitPerOccuranceAmount ||
          !x.benefitDurationLimits.benefitLimitPerMaxLimitAmount
      );
      this.formValid = this.deductibleOccurance && emptyBenefits.length <= 0;

      let taxIndex =
        this.feesChargesConfiguration.feesAndChargesOptions.findIndex(
          (x) => x.feesChargesOID == this.deductibleFeesChargesOID
        );
      this.feesChargesConfiguration.feesAndChargesOptions[
        taxIndex == -1
          ? this.feesChargesConfiguration.feesAndChargesOptions.length
          : taxIndex
      ] = {
        feesChargesOID: this.deductibleFeesChargesOID,
        feesChargesRate: 0,
        feesChargesFixedAmount: this.deductibleOccurance,
        feesChargesRateTable: [],
        isActive: true,
        isDeleted: false,
      };
    });
  }
  addMedicalBenefitGroup() {
    this.medicalBenefitGrouprequired = false;
    if (!this.medicalBenefitGroupName) {
      this.medicalBenefitGrouprequired = true;
      return;
    }
    let newMedicalObject: MedicalBenefits = {
      benefitOid: null,
      benefitGroupId: null,
      benefitId: this.medicalBenefitGroupName,
      benefitName: null,
      benefitDescription: null,
      benefitExclusion: null,
      benefitAdditionalPremium: 0,
      benefitDurationLimits: {
        benefitLimitPerDayCount: 0,
        benefitLimitPerDayAmount: 0,
        benefitLimitPerWeekCount: 0,
        benefitLimitPerWeekAmount: 0,
        benefitLimitPerMonthCount: 0,
        benefitLimitPerMonthAmount: 0,
        benefitLimitPerPolicyYearCount: 0,
        benefitLimitPerPolicyYearAmount: 0,
        benefitLimitPerOccuranceCount: 0,
        benefitLimitPerOccuranceAmount: 0,
        benefitLimitPerMaxLimitCount: 0,
        benefitLimitPerMaxLimitAmount: 0,
      },
    };
    this.medicalBenefits.push(newMedicalObject);
    this.medicalBenefitGroupName = null;
    this.medicalBenefitGrouprequired = false;
  }
  deleteMedicalBenefitGroup(index) {
    this.medicalBenefits.splice(index, 1);
  }
}
