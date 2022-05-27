/**
 * FeesChargesConfiguration is the root entity within the plan configurator.
 *
 * <p>
 * Former known as combined premium,rate,underwriting and charge
 * <p>
 *
 * @author Ignatica - [RekhaG]
 *
 */
import { FeesAndChargesOptions } from './feesAndChargesOptions.model';
import { PremiumModifier } from './premiumModifier.model';
export class FeesChargesConfiguration {
  premiumOptions: Array<PlanRateTable> = [];
  premiumModifiers: Array<PremiumModifier> = [];
  commissionOptions: Array<PlanRateTable> = [];
  commissionModifiers: Array<any> = [];
  feesAndChargesOptions: Array<FeesAndChargesOptions> = [];
  premiumModifiersRuleBased?: Array<PremiumModifiersRuleBased> = [];
}
export class PremiumModifiersRuleBased {
  ruleOID: string;
  ruleSequence: number;
  ruleParameters: Array<RuleParameters>;
  ruleSubCategory:string;
  ruleCategory:string;
}

export class PlanRateTable {
  tableGuid: string = null;
  sourceFileName: string;
  tableName: string;
  tableRows: Array<PlanRateTableRow> = [];
  isActive: Boolean = true;
  isDeleted: Boolean = false;
}

export class PlanRateTableRow {
  rowGuid: string = null;
  effectiveStartDate?: any;
  effectiveEndDate?: any;
  rate: number;
  amount: number;
  rateTable: any;
  isActive: Boolean = true;
  isDeleted: Boolean = false;
}

export class RuleParameters {
  parameterDecimalValue: any;
  parameterName: string;
  parameterSequence: number;
  parameterTextValues?: Array<string>;
  contains?: ParamObject;
  equalsTo?: ParamObject;
  exact?: ParamObject;
  greaterThan?: ParamObject;
  lessThan?: ParamObject;
}

export class ParamObject {
  isRequired: boolean;
  isRulePassed: boolean;
  isRuleReferred: boolean;
  modifierExcess: any;
  modifierPercentage: any;
}
