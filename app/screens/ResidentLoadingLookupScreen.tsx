import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput } from 'react-native';
import SectionCard from '../components/SectionCard';
import { RESIDENT_LOADING } from '../data/residentLoading';
import { formatResidentLoadingRule } from '../utils/residentLoadingFormatter';

export default function ResidentLoadingLookupScreen() {
  const [q, setQ] = useState('');
  const entries = useMemo(() => Object.entries(RESIDENT_LOADING as any), []);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return entries;
    return entries.filter(([k]) => k.toLowerCase().includes(s));
  }, [q, entries]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 12, color: '#0f172a' }}>Resident Loading Lookup</Text>
      <SectionCard title="Search Residency">
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Type residency / country key..."
          style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, backgroundColor: 'white' }}
        />
      </SectionCard>

      {filtered.slice(0, 50).map(([k, v]: any) => (
        <SectionCard key={k} title={k}>
          <Text style={{ fontWeight: '900' }}>Life: {formatResidentLoadingRule(v?.life) || '-'}</Text>
          <Text style={{ fontWeight: '900', marginTop: 6 }}>CI: {formatResidentLoadingRule(v?.ci) || '-'}</Text>
          <Text style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>Raw: {JSON.stringify(v)}</Text>
        </SectionCard>
      ))}

      <Text style={{ fontSize: 11, color: '#94a3b8' }}>Showing up to 50 results for performance.</Text>
    </ScrollView>
  );
}
