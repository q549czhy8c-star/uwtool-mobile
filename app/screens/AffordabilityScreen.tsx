import React, { useContext, useMemo } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { CaseContext } from '../App';
import SectionCard from '../components/SectionCard';
import NumericInput from '../components/NumericInput';
import SearchableDropdown from '../components/SearchableDropdown';
import { parseNum } from '../utils/fx';
import { USD_RATE } from '../data/constants';

function toUsd(premium: number, currency: string): number {
  const c = (currency || '').toUpperCase();
  if (c === 'HKD') return premium / USD_RATE;
  return premium;
}

export default function AffordabilityScreen() {
  const ctx = useContext(CaseContext);
  if (!ctx) return null;
  const { caseData, setCaseData } = ctx;
  const a = caseData.affordabilityInput;

  const setAff = (patch: Partial<typeof a>) => {
    setCaseData((prev) => ({ ...prev, affordabilityInput: { ...prev.affordabilityInput, ...patch } }));
  };

  const totalPremiumUSD = useMemo(() => {
    let total = 0;
    for (const pol of a.policies) {
      const prem = parseNum(pol.premium);
      let v = toUsd(prem, pol.currency);
      // TXT rule: if Applying and Prepay multiply by yearTerm
      const yearTerm = parseNum(a.yearTerm);
      if (pol.status === 'Applying' && a.payMode === 'Prepay' && yearTerm > 0) v *= yearTerm;
      total += v;
    }
    return total;
  }, [a.policies, a.payMode, a.yearTerm]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 12, color: '#0f172a' }}>Affordability</Text>

      <SectionCard title="Mode">
        <SearchableDropdown
          label="Pay Mode"
          value={a.payMode}
          options={[{ label: 'Regular', value: 'Regular' }, { label: 'Prepay', value: 'Prepay' }]}
          onChange={(v) => setAff({ payMode: v })}
        />
        <NumericInput label="Year Term" value={a.yearTerm} onChange={(v) => setAff({ yearTerm: v })} />
      </SectionCard>

      <SectionCard title="Policies">
        {a.policies.map((pol, idx) => (
          <View key={idx} style={{ marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }}>
            <SearchableDropdown
              label={`Policy ${idx + 1} Status`}
              value={pol.status}
              options={[{ label: 'Applying', value: 'Applying' }, { label: 'Existing', value: 'Existing' }]}
              onChange={(v) => {
                const next = [...a.policies];
                next[idx] = { ...next[idx], status: v as any };
                setAff({ policies: next });
              }}
            />
            <SearchableDropdown
              label="Currency"
              value={pol.currency}
              options={[{ label: 'HKD', value: 'HKD' }, { label: 'USD', value: 'USD' }]}
              onChange={(v) => {
                const next = [...a.policies];
                next[idx] = { ...next[idx], currency: v };
                setAff({ policies: next });
              }}
            />
            <NumericInput
              label="Annual Premium"
              value={pol.premium}
              onChange={(v) => {
                const next = [...a.policies];
                next[idx] = { ...next[idx], premium: v };
                setAff({ policies: next });
              }}
            />
            <Pressable
              onPress={() => {
                const next = a.policies.filter((_, i) => i !== idx);
                setAff({ policies: next.length ? next : [{ premium: '', currency: 'HKD', status: 'Applying', termYears: '' }] });
              }}
              style={{ padding: 10, backgroundColor: '#ef4444', borderRadius: 12, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontWeight: '800' }}>Remove</Text>
            </Pressable>
          </View>
        ))}

        <Pressable
          onPress={() => setAff({ policies: [...a.policies, { premium: '', currency: 'HKD', status: 'Existing', termYears: '' }] })}
          style={{ padding: 12, backgroundColor: '#0f172a', borderRadius: 12, alignItems: 'center' }}
        >
          <Text style={{ color: 'white', fontWeight: '800' }}>Add Policy</Text>
        </Pressable>
      </SectionCard>

      <SectionCard title="Result">
        <Text style={{ fontSize: 16, fontWeight: '900' }}>Total Premium (USD): {totalPremiumUSD.toFixed(2)}</Text>
        <Text style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
          Note: This screen currently implements the exact v2.8.5 rule for Prepay multiplying applying policy by year term.
        </Text>
      </SectionCard>
    </ScrollView>
  );
}
