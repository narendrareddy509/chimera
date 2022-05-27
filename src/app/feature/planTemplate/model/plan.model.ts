import { GeneralConfiguration } from '../model/generalConfiguration.model';
import { NoClaimDiscountRateChoices } from '../model/noClaimDiscount.model';
import { BenefitConfiguration } from './benefitConfiguration.model';
import { InvestmentConfiguration } from '../model/investmentConfiguration.model';
import { FeesChargesConfiguration } from './feesChargesConfiguration.model';
import { ServicingEndorsementConfiguration } from './servicingEndorsementConfiguration.model';
import { Underwriting } from './underwriting.model';

export class Plan {
  name: string;
  planZoneId: string = 'Asia/Calcutta';
  description: string;
  planCode: string;
  integerPlanCode: number;
  microserviceGuid: string;
  planGuid: string;
  productTemplateId: string;
  productTemplateGuid?: string;
  category: string;
  label: string;
  generalConfiguration: GeneralConfiguration;
  benefitConfiguration: BenefitConfiguration;
  servicingEndorsementConfiguration: ServicingEndorsementConfiguration;
  feesChargesConfiguration: FeesChargesConfiguration;
  active?: boolean;
  deleted?: boolean;
  investmentConfiguration?: InvestmentConfiguration;
  noClaimDiscountRateChoices: Array<NoClaimDiscountRateChoices>;
  planOptionSelected?: boolean;
  premiumRateTableKeys: Array<string>;
  premiumRateTableRows: Array<any>;
  publishStatus?: string;
  nbUnderwritingConfiguration: Underwriting;
  questionnaireGuids: Array<string>;
}
