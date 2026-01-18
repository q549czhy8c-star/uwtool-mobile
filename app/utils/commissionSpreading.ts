import { COMMISSION_SPREADING_PREFIX } from '../data/constants';
import { PI_REQUIREMENTS } from '../data/piRequirements';

export function appendCommissionSpreadingIssueUN(params: {
  currentIssueUN: string;
  commissionSpreading?: boolean;
  piInvestorType?: string;
  piScenarioKey?: string;
}): string {
  const { currentIssueUN, commissionSpreading, piInvestorType, piScenarioKey } = params;
  let combined = (currentIssueUN ?? '').trim();

  if (!commissionSpreading || !piInvestorType || !piScenarioKey) return combined;
  const list = (PI_REQUIREMENTS as any)[piInvestorType] as Array<any> | undefined;
  const scenario = list?.find((x) => x.key === piScenarioKey);
  if (!scenario) return combined;

  const requirementText = String(scenario.requirementText ?? '');
  const csText = `${COMMISSION_SPREADING_PREFIX}${requirementText ? `\n${requirementText}` : ''}`;

  if (!combined.includes(COMMISSION_SPREADING_PREFIX)) {
    combined = combined ? `${combined}\n${csText}` : csText;
  }
  return combined;
}
