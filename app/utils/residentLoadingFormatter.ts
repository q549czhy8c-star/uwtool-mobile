export type ResidentLoadingRule =
  | { type: 'standard' }
  | { type: 'case_by_case' }
  | { type: 'not_applicable' }
  | { type: 'extra_per_1000'; amount: number; currency_symbol?: string; war_exclusion?: boolean }
  | {
      type: 'conditional_standard_selected_cities';
      extra_per_1000_unselected_cities: number;
      currency_symbol?: string;
      war_exclusion?: boolean;
    }
  | { type: string; [k: string]: any };

export function formatResidentLoadingRule(rule: any): string | null {
  if (!rule || !rule.type) return null;
  switch (rule.type) {
    case 'standard':
      return 'Standard';
    case 'case_by_case':
      return 'Case by case';
    case 'not_applicable':
      return 'N/A';
    case 'extra_per_1000': {
      const sym = rule.currency_symbol || '$';
      const war = rule.war_exclusion ? ' (War exclusion)' : '';
      return `${sym}${rule.amount} per 1,000${war}`;
    }
    case 'conditional_standard_selected_cities': {
      const sym = rule.currency_symbol || '$';
      const war = rule.war_exclusion ? ' (War exclusion)' : '';
      return `Conditional standard (selected cities); unselected cities: ${sym}${rule.extra_per_1000_unselected_cities} per 1,000${war}`;
    }
    default:
      return rule.type;
  }
}
