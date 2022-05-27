/**
 * FeesAndChargesOptions is the root entity within the FeesChargesConfiguration configurator.
 * 
 * <p>
 * Former known as charges  outside the plan configurator.
 * <p>
 * 
 * @author Ignatica - [RekhaG]
 *
 */
export class FeesAndChargesOptions {
    feesChargesOID: string;
    feesChargesRate: number = 0;
    feesChargesFixedAmount: number = 0;
    feesChargesRateTable: Array<FeesChargesRateTable> = []; 
    isActive:Boolean = true;
    isDeleted:Boolean = false;  
  } 
  export class FeesChargesRateTable {
    rate: number;
    periodInYears:number;
  }