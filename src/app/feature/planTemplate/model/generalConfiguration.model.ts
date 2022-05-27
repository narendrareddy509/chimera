/**
 * GeneralConfiguration is the root entity within the product configurator.
 *
 * <p>
 * Former this is part of GlobalParameters.
 * <p>
 *
 * @author Ignatica - [Narendrareddy Chitta]
 *
 */

import { modules } from '../../products/model/productTemplate.model';

export class GeneralConfiguration {
  planType: string;
  effectiveStartDate: any;
  effectiveEndDate: any;
  policyTermYears: number;
  subPlans: Array<any>;
  planModules: Array<PlanModule> = [];
  policyCurrencies: Array<PolicyCurrencies>;
  groupInsurance: object;
  usageBasedInsurance: object;
  participatingPlan?: ParticipatingPlan;
}

export class PolicyCurrencies {
  currencyOID: string;
  isEnabled: boolean;
}
export class ParticipatingPlan {
  isParticipating: boolean = false;
  dividendRate: number;
}

export class PlanModule {
  moduleOID: string;
  cronJobSettings: string = null;
  isEnabled: Boolean = true;
}

export class Module {
  name: string;
  widgetCode: string;
  formulas?: Array<modules>;
  selectedFormula?: modules;
}
