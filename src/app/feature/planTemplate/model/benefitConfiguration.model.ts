/**
 * BenefitConfiguration Widget Model contains the following properties as in the class
 *
 *
 * @author [Anitha]
 *
 */

export class BenefitConfiguration {
  noClaimBenefitOptions?: NoClaimBenefitOptions;
  medicalBenefitOptions?: MedicalBenefitsObject;
  endowmentBenefitOptions?: EndowmentBenefitOptions;
  deathBenefitOptions?: DeathBenefitOptions;
  nonLifeBenefitOptions?: object;
}

export class NoClaimBenefitOptions{
  noClaimBenefitRateTable : Array<any>=[];
}
export class EndowmentBenefitOptions{
  endowmentBenefitRateTable : Array<any>=[];
}

export class DeathBenefitOptions {
  deathBenefitRate: number;
}

export class MedicalBenefitsObject{
  medicalBenefits : Array<MedicalBenefits>=[];
}
export class MedicalBenefits {
  benefitOid:string;
  benefitGroupId: string;
  benefitId:string;
  benefitName:string;
  benefitDescription:string;
  benefitExclusion:string;
  benefitAdditionalPremium:number;
  benefitDurationLimits:BenefitDurationLimits;
}
export class BenefitDurationLimits{
    benefitLimitPerDayCount:number =0;
    benefitLimitPerDayAmount:number=0;
    benefitLimitPerWeekCount: number=0;
    benefitLimitPerWeekAmount: number=0;
    benefitLimitPerMonthCount: number=0;
    benefitLimitPerMonthAmount: number=0;
    benefitLimitPerPolicyYearCount: number=0;
    benefitLimitPerPolicyYearAmount: number=0;
    benefitLimitPerOccuranceCount: number=0;
    benefitLimitPerOccuranceAmount: number=0; //Benefit limit per claim occurrence
    benefitLimitPerMaxLimitCount: number=0;
    benefitLimitPerMaxLimitAmount: number=0; //Aggregated Benefit Limit
}
