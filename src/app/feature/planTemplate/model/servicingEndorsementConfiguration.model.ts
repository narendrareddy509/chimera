/**
 * ServicingEndorsementConfiguration is the root entity within the plan configurator.
 *
 * <p>
 * Formerly included in seperate configurations eg Renewal, Billing Options etc
 * <p>
 *
 * @author Ignatica - [Anitha]
 *
 */
import { BillingOptions } from './billingOptions.model';
import { ReinstatementOptions } from './reinstatement.model';
import { RenewalOptions } from './renewal.model';

export class ServicingEndorsementConfiguration {
  renewalOptions: RenewalOptions;
  cashWithdrawalOptions?: CashWithdrawalOptions;
  billingOptions: BillingOptions;
  paymentOptions: object;
  cancellationOptions?: CancellationOptions;
  reinstatementOptions: ReinstatementOptions;
}

export class CancellationOptions {
  isCoolingOffAllowed?: boolean;
  coolingOffPeriodDays?: number;
}
export class CashWithdrawalOptions {
  isCashWithdrawalAllowed?: boolean =false;
  isDividendWithdrawalAllowed?: boolean =false;
}
