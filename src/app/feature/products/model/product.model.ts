/**
 * Product which bundles the selected base plan with different plans .
 *
 *
 * @author Ignatica - [Anitha]
 *
 */

export class Product {
  toggle: number = 0;
  productName: string;
  productGuid: string;
  productIcon: any;
  productCategory: string;
  productCode: string;
  isGroupProduct: boolean;
  productDescription: string;
  effectiveStartDate: string;
  effectiveEndDate: string;
  configuredPlans: Array<ConfiguredPlans> = [];
  productStatus: string;
  productScreenCode: string;
  premiumCommissionConfiguration: {
    premiumModifiers: [
      // {
    //   modifierGuid: string;
    //   modifierName: string;
    //   modifierPercentage: number;
    //   modifierExcess: number;
    // }
    ];
    commissionModifiers: [
      // {
    //   modifierGuid: string;
    //   modifierName: string;
    //   modifierPercentage: number;
    //   modifierExcess: number;
    // }
    ];
  };
}

export class ConfiguredPlans {
  planOID: string;
  planType: string;
  isRequired: boolean;
  isDefault: boolean;
  isEnabled: boolean;
  planCategory?: any;
}
