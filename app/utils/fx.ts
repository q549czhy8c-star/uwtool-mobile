import { FIN_USD_RATE, USD_RATE } from '../data/constants';

export function parseNum(v: unknown): number {
  const n = Number(String(v ?? '').replace(/,/g, '').trim());
  return Number.isFinite(n) ? n : 0;
}

export function hkdToUsd(hkd: number, rate: number): number {
  return hkd / rate;
}

export function usdToHkd(usd: number, rate: number): number {
  return usd * rate;
}

export function convertByCurrency(params: { amount: number; from: string; to: string; rateForHKDUSD: number }): number {
  const { amount, from, to, rateForHKDUSD } = params;
  const f = (from || '').toUpperCase();
  const t = (to || '').toUpperCase();
  if (f === t) return amount;
  if (f === 'HKD' && t === 'USD') return hkdToUsd(amount, rateForHKDUSD);
  if (f === 'USD' && t === 'HKD') return usdToHkd(amount, rateForHKDUSD);
  return amount;
}

export function currencyRateFor(kind: 'general' | 'financial'): number {
  return kind === 'financial' ? FIN_USD_RATE : USD_RATE;
}
