import { SUPP_BENEFIT_LOADING_RULE } from '../data/suppBenefitRuleData';

export function mapSupplementaryFromBasic(rule: any): { supplementary: string; multiplier?: number } {
  if (!rule || !rule.type) return { supplementary: 'unknown' };
  if (rule.type === 'standard') return { supplementary: SUPP_BENEFIT_LOADING_RULE.standard.supplementary };
  if (rule.type === 'extra_per_1000') {
    const amt = Number(rule.amount);
    if (amt === 1) return { supplementary: 'multiplier', multiplier: SUPP_BENEFIT_LOADING_RULE.extra_per_1000['1'].multiplier };
    if (amt === 2) return { supplementary: 'multiplier', multiplier: SUPP_BENEFIT_LOADING_RULE.extra_per_1000['2'].multiplier };
    if (amt >= 3) return { supplementary: 'not_acceptable' };
  }
  return { supplementary: 'unknown' };
}
