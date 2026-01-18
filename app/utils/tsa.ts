import { FIN_USD_RATE } from '../data/constants';
import { convertByCurrency, parseNum } from './fx';

export function getTsaAllUSD(params: {
  prodType: string;
  sumAssured: string;
  planName: string;
  curr: string;
  otherInsurances: Array<{ currency: string; amount: string }>;
}): number {
  const { prodType, sumAssured, planName, curr, otherInsurances } = params;
  if (prodType !== 'Life' && prodType !== 'CI') return 0;

  let base = parseNum(sumAssured);
  if (planName === 'LionPatron') base = base * 1.5;

  let total = base;
  for (const ins of otherInsurances || []) {
    const amt = parseNum(ins.amount);
    total += convertByCurrency({ amount: amt, from: ins.currency, to: curr, rateForHKDUSD: FIN_USD_RATE });
  }

  if ((curr || '').toUpperCase() === 'HKD') {
    return Math.round(total / FIN_USD_RATE);
  }
  return Math.round(total);
}

export function getTsaMedUSD(checkSA_USD: string | number | null | undefined): number {
  // matches TXT: allow 0
  const v = parseNum(checkSA_USD ?? 0);
  return v;
}
