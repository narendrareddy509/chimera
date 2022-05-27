export class Underwriting {
  underwritingCategory: string;
  minFaceAmount: number;
  maxFaceAmount: number;
  minIssueAge: number;
  maxIssueAge: number;
  minPolicyOwnerAge: number;
  maxPolicyOwnerAge: number;
  questions: Array<Questions>;
  underwritingLoading: Array<UnderwritingLoading>;
}

export class Questions {
  questionOID: string;
  isEnabled: boolean;
}

export class UnderwritingLoading {
  loadingCategory: string;
  maxLoadingPercentage: number;
  isEnabled: boolean;
}
