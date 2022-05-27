export const product_category = [
  {
    name: 'Life',
    code: 'IG_CATEGORY_LIFE',
    isActive: true,
    displayInBundleProduct: true,
    icon: 'user',
    subCategories: [
      {
        name: 'ILAS',
        code: 'IG_CATEGORY_INVESTMENT_LIFE',
        isActive: true,
      },
      {
        name: 'Term Life',
        code: 'IG_CATEGORY_TERM_LIFE',
        isActive: true,
      },
      {
        name: 'Credit Life',
        code: 'IG_CATEGORY_CREDIT_LIFE',
        isActive: true,
      },
      {
        name: 'Whole Life',
        isActive: false,
      },
      {
        name: 'Endowment',
        isActive: false,
      },
    ],
  },
  {
    name: 'Health',
    code: 'IG_CATEGORY_HEALTH',
    isActive: false,
    displayInBundleProduct: false,
    icon: 'heart',
    subCategories: [
      {
        name: 'Medical',
        code: 'IG_CATEGORY_MEDICAL',
        isActive: false,
      },
    ],
  },
  {
    name: 'Property & Casualty',
    code: 'IG_CATEGORY_GENERAL',
    icon: 'box',
    isActive: true,
    displayInBundleProduct: false,
    subCategories: [
      {
        name: 'Motor',
        code: 'IG_CATEGORY_MOTOR',
        isActive: true,
      },
    ],
  },
  {
    name: 'Commercial',
    code: 'IG_CATEGORY_COMMERCIAL',
    isActive: false,
    displayInBundleProduct: false,
  },
];

//Used for bundled products
export const sub_categories = [
  {
    mainCategoryName: 'Life',
    name: 'ILAS',
    code: 'IG_CATEGORY_INVESTMENT_LIFE',
    mainCategoryCode: 'IG_CATEGORY_LIFE',
    isActive: true,
  },
  {
    mainCategoryName: 'Life',
    name: 'Term Life',
    code: 'IG_CATEGORY_TERM_LIFE',
    mainCategoryCode: 'IG_CATEGORY_LIFE',
    isActive: true,
  },
  {
    mainCategoryName: 'Life',
    name: 'Credit Life',
    code: 'IG_CATEGORY_CREDIT_LIFE',
    mainCategoryCode: 'IG_CATEGORY_LIFE',
    isActive: false, // Disabled credit life from bundling for now
  },
  {
    mainCategoryName: 'Health',
    name: 'Medical',
    code: 'IG_CATEGORY_MEDICAL',
    mainCategoryCode: 'IG_CATEGORY_HEALTH',
    isActive: false,
  },
  {
    mainCategoryName: 'Property & Casualty',
    name: 'Motor',
    code: 'IG_CATEGORY_MOTOR',
    mainCategoryCode: 'IG_CATEGORY_GENERAL',
    isActive: false, // Disabled P&C from bundling for now
  },
];
