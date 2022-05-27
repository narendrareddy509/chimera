/**
 * BillingOptions is the root entity within the ServicingEndorsementConfiguration configurator.
 *
 *
 * @author Ignatica - [Anitha]
 *
 */

export class BillingOptions {
  gracePeriodDays: number;
  billingCurrencies: Array<BillingCurrencies>;
  billingMethods: Array<BillingMethods>;
  billingModes: Array<BillingModes>;
}

export class BillingCurrencies {
  currencyOID: string;
  isEnabled: boolean;
}

export class BillingMethods {
  billingMethodOID: string;
  isEnabled: boolean;
}

export class BillingModes {
  billingModeOID: string;
  billingModalFactor: number;
  isEnabled: boolean;
}
