import AsyncStorage from '@react-native-async-storage/async-storage';
import { CaseData } from './caseTypes';

const ACTIVE_CASE_KEY = 'uwtool.activeCase.v2.8.5';
const CASE_INDEX_KEY = 'uwtool.caseIndex';
const CASE_SAVE_PREFIX = 'uwtool.savedCase.'; // matches TXT concept

export async function loadActiveCase(): Promise<CaseData | null> {
  try {
    const raw = await AsyncStorage.getItem(ACTIVE_CASE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CaseData;
  } catch {
    return null;
  }
}

export async function saveActiveCase(caseData: CaseData): Promise<void> {
  const next = { ...caseData, updatedAtISO: new Date().toISOString() };
  await AsyncStorage.setItem(ACTIVE_CASE_KEY, JSON.stringify(next));
}

export async function resetActiveCase(defaultCase: CaseData): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_CASE_KEY, JSON.stringify(defaultCase));
}

export async function listSavedCases(): Promise<Array<{ id: string; updatedAtISO: string; version: string }>> {
  const raw = await AsyncStorage.getItem(CASE_INDEX_KEY);
  const ids: string[] = raw ? JSON.parse(raw) : [];
  const out: Array<{ id: string; updatedAtISO: string; version: string }> = [];
  for (const id of ids) {
    const cRaw = await AsyncStorage.getItem(CASE_SAVE_PREFIX + id);
    if (!cRaw) continue;
    try {
      const parsed = JSON.parse(cRaw) as CaseData;
      out.push({ id, updatedAtISO: parsed.updatedAtISO, version: parsed.version });
    } catch {
      // ignore
    }
  }
  return out;
}

export async function saveNewCaseSnapshot(caseData: CaseData): Promise<string> {
  const id = String(Date.now());
  const raw = await AsyncStorage.getItem(CASE_INDEX_KEY);
  const ids: string[] = raw ? JSON.parse(raw) : [];
  ids.unshift(id);
  await AsyncStorage.setItem(CASE_INDEX_KEY, JSON.stringify(ids.slice(0, 50)));
  await AsyncStorage.setItem(CASE_SAVE_PREFIX + id, JSON.stringify(caseData));
  return id;
}

export async function loadSavedCase(id: string): Promise<CaseData | null> {
  const raw = await AsyncStorage.getItem(CASE_SAVE_PREFIX + id);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CaseData;
  } catch {
    return null;
  }
}
