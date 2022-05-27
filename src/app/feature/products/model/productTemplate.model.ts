export interface ProductTemplate {
  productTemplateOID: string;
  productTemplateGuid: string;
  category: string;
  description?: string;
  label: string;
  logo?: string;
  microserviceGuid: string;
  name: string;
  billingCurrencies: Array<billingCurrencies>;
  billingMethods: Array<billingMethods>;
  billingModes: Array<billingModes>;
  funds: Array<funds>;
  modules: Array<modules>;
  policyCurrencies: Array<policyCurrencies>;
  underwritingQuestions: Array<underwritingQuestions>;
  feesAndChargesOptions: Array<feesAndChargesOptions>;
  screenCode: string;
}

export class billingCurrencies {
  currencyOID: string;
  currencyId: string;
  numericCode: number;
  description: string;
  isEnabled: Boolean;
}

export class billingMethods {
  billingMethodOID: string;
  billingMethodId: string;
  numericCode: number;
  description: string;
  isEnabled: Boolean;
  isSelected?: Boolean;
}

export class billingModes {
  billingModeOID: string;
  billingModeId: string;
  numericCode: number;
  description: string;
  isEnabled: Boolean;
}

export class funds {
  fundOID: string;
  fundId: string;
  fundCategory: string;
  description: string;
  fundRiskCategory: string;
}
export class modules {
  moduleOID: string;
  moduleId: string;
  moduleType: string;
  moduleArea: string;
  description: string;
  uiDisplayElement?: string;
  uiHelpText?: string;
  widgetCode?: string;
  isEnabled?: Boolean;
  cronJobSettings?: string;
  selected?: boolean;
}
export class policyCurrencies {
  currencyOID: string;
  currencyId: string;
  numericCode: string;
  description: string;
  isEnabled: Boolean;
}
export class feesAndChargesOptions {
  feesChargesTypeId: string;
  feesChargesBasisId: string;
  feesChargesConsumptionId: string;
  feesChargesOID: string;
}

export class underwritingQuestions {
  questionOID: string;
  question: string;
  required: boolean;
  conditionAction: Array<ConditionAction>;
  source: string;
}

export class ConditionAction {
  answer: string;
  action: string;
  enabled: boolean;
}
