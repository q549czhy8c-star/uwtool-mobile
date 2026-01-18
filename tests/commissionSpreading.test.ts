import { appendCommissionSpreadingIssueUN } from '../app/utils/commissionSpreading';
import { COMMISSION_SPREADING_PREFIX } from '../app/data/constants';

// Note: PI_REQUIREMENTS is generated. This test asserts dedupe behavior only.

describe('Commission Spreading dedupe', () => {
  test('does not append when commissionSpreading is false', () => {
    const out = appendCommissionSpreadingIssueUN({
      currentIssueUN: 'hello',
      commissionSpreading: false,
      piInvestorType: 'INDIVIDUAL PROFESSIONAL INVESTOR',
      piScenarioKey: 'IND_A',
    });
    expect(out).toBe('hello');
  });

  test('dedupe by prefix', () => {
    const base = `abc\n${COMMISSION_SPREADING_PREFIX}something`;
    const out = appendCommissionSpreadingIssueUN({
      currentIssueUN: base,
      commissionSpreading: true,
      piInvestorType: 'INDIVIDUAL PROFESSIONAL INVESTOR',
      piScenarioKey: 'IND_A',
    });
    expect(out).toBe(base.trim());
  });
});
