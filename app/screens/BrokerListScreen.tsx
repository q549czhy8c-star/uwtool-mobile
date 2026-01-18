import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import SectionCard from '../components/SectionCard';
import { MASTER_BROKER_DATA } from '../data/masterBrokerData';

function normalize(s: any) {
  return String(s || '').toLowerCase();
}

export default function BrokerListScreen() {
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const s = normalize(q).trim();
    const entries = Object.entries(MASTER_BROKER_DATA as any);
    if (!s) return entries;
    return entries.filter(([broker, rms]) => {
      if (normalize(broker).includes(s)) return true;
      for (const [rm, supports] of Object.entries(rms as any)) {
        if (normalize(rm).includes(s)) return true;
        if ((supports as any[]).some((x) => normalize(x).includes(s))) return true;
      }
      return false;
    });
  }, [q]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 12, color: '#0f172a' }}>Master Broker List</Text>
      <SectionCard title="Search">
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search broker / RM / support..."
          style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, backgroundColor: 'white' }}
        />
      </SectionCard>

      {results.slice(0, 30).map(([broker, rms]: any, idx: number) => (
        <SectionCard key={idx} title={broker}>
          {Object.entries(rms).map(([rm, supports]: any) => (
            <View key={rm} style={{ marginTop: 8 }}>
              <Text style={{ fontWeight: '900' }}>RM: {rm}</Text>
              <Text style={{ color: '#475569' }}>Support: {(supports || []).join(', ')}</Text>
            </View>
          ))}
        </SectionCard>
      ))}

      <Text style={{ fontSize: 11, color: '#94a3b8' }}>Showing up to 30 results for performance.</Text>
    </ScrollView>
  );
}
