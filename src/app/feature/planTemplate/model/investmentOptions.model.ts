export class InvestmentOptions{
    funds?: Array<string>;
    withdrawal:Withdrawal;
    fundDepositRegular?:FundDeposit;
    fundDepositSubsequent?:FundDeposit;
    fundDepositInitial?:FundDeposit;
  }
export class Withdrawal{
  minAmount?: number;
  maxAmount?: number;
  currency?:string;
  freeWithdrawalAllowed?: number;
  freeWithdrawalFrequency?:string;
  freeWithdrawalInDays?: number;
  lockInPeriod?: number;
  lockInFrequency?:string;
  lockInPeriodInDays?: number;
}  

export class FundDeposit{
  minAmount?: number;
  maxAmount?: number;
  currency?:string;
}