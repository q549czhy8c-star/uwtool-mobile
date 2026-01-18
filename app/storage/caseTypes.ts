export type Currency = 'HKD' | 'USD' | string;

export type OtherInsurance = { currency: Currency; amount: string };

export type PolicyInput = {
  planName: string;
  prodType: string;
  curr: Currency;
  sumAssured: string;

  applicationSignDate: string;
  signingDate: string;
  paymentDate: string;

  payMode: string;
  yearTerm: string;

  isSamePerson: boolean;
  phDob: string;
  insDob: string;
  isDateBack: boolean;

  monthlyIncome: string;
  targetSavingHKD: string;
  targetYear: string;
  surrenderValueUSD: string;

  fnaSof: string[];
  fnaSow: string[];

  commissionSpreading: boolean;
  piInvestorType: string;
  piScenarioKey: string;

  otherInsurances: OtherInsurance[];

  medicalReq: { checkSA_USD: string };
};

export type AffordabilityPolicy = {
  premium: string;
  currency: Currency;
  status: 'Applying' | 'Existing';
  termYears: string;
};

export type AffordabilityInput = {
  payMode: string;
  yearTerm: string;
  annualIncomeUSD: string;
  totalAssetsUSD: string;
  currentAge: string;
  retirementAge: string;
  policies: AffordabilityPolicy[];
};

export type CaseData = {
  version: string;
  updatedAtISO: string;
  policyInput: PolicyInput;
  affordabilityInput: AffordabilityInput;
  caseSummary: { issueUN: string };
  textSplitter: {
    bulkTextA: string;
    lineLength: number;
    rowLimit: number;
    firstColRowLimit: string;
    removeNumbering: boolean;
    rows: Array<{ prefixType: 'pending' | 'fyi' | 'none'; customPrefix: string; textA: string; textB: string }>;
  };
  uiPrefs: {
    portfolioGte8m: boolean;
    exclusionMetastasis: boolean;
  };
};

export function buildEmptyCase(): CaseData {
  return {
    version: 'v2.8.5',
    updatedAtISO: new Date().toISOString(),
    policyInput: {
      planName: '',
      prodType: 'Life',
      curr: 'HKD',
      sumAssured: '',
      applicationSignDate: '',
      signingDate: '',
      paymentDate: '',
      payMode: 'Regular',
      yearTerm: '',
      isSamePerson: true,
      phDob: '',
      insDob: '',
      isDateBack: false,
      monthlyIncome: '',
      targetSavingHKD: '',
      targetYear: '',
      surrenderValueUSD: '',
      fnaSof: [],
      fnaSow: [],
      commissionSpreading: false,
      piInvestorType: '',
      piScenarioKey: '',
      otherInsurances: [],
      medicalReq: { checkSA_USD: '0' }
    },
    affordabilityInput: {
      payMode: 'Regular',
      yearTerm: '',
      annualIncomeUSD: '',
      totalAssetsUSD: '',
      currentAge: '',
      retirementAge: '',
      policies: [
        { premium: '', currency: 'HKD', status: 'Applying', termYears: '' }
      ]
    },
    caseSummary: { issueUN: '' },
    textSplitter: {
      bulkTextA: '',
      lineLength: 40,
      rowLimit: 12,
      firstColRowLimit: '',
      removeNumbering: true,
      rows: [{ prefixType: 'pending', customPrefix: '', textA: '', textB: '' }]
    },
    uiPrefs: { portfolioGte8m: false, exclusionMetastasis: false }
  };
}
