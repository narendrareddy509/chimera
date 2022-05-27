/**
 * InvestmentConfiguration is the root entity within the product configurator.
 *
 * <p>
 * Former this is part of InvestmentOptions.
 * <p>
 *
 * @author Ignatica - [Narendrareddy Chitta]
 *
 */

export class InvestmentConfiguration {
  minAccountBalance: number;
  isPremiumHoliday: boolean;
  initialDepositOptions?: InitialDepositOptions;
  withdrawalOptions: WithdrawalOptions;
  switchingOptions?: any;
  configuredFunds: Array<ConfiguredFunds>;
}

export class InitialDepositOptions {
  minRegularDepositAmount?: number;
  maxRegularDepositAmount?: number;
  minTopupDepositAmount?: number;
  maxTopupDepositAmount?: number;
  depositCurrencyOID?: string;
}

export class WithdrawalOptions {
  minWithdrawalAmount?: number;
  maxWithdrawalAmount?: number;
  withdrawalCurrencyOID?: string;
  freeWithdrawalAllowed: boolean;
  freeWithdrawalPerDayCount?: number;
  freeWithdrawalPerWeekCount?: number;
  freeWithdrawalPerPolicyMonthCount?: number;
  freeWithdrawalPerPolicyQuarterCount?: number;
  freeWithdrawalPerPolicyYearCount?: number;
  lockInPeriodAllowed: boolean;
  lockPeriodInMonths?: number;
  lockPeriodInYears?: number;
}

export class ConfiguredFunds {
  fundOID: string;
  isEnabled: boolean = true;
}
