import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput } from 'react-native';
import SectionCard from '../components/SectionCard';
import { OCCUPATION_DB } from '../data/occupationDb';

export default function OccupationScreen({ navigation }: any) {
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return OCCUPATION_DB;
    return OCCUPATION_DB.filter((it: any) =>
      `${it.title} ${it.titleEn} ${it.industry}`.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 12, color: '#0f172a' }}>Occupation Rating</Text>
      <SectionCard title="Search">
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search occupation (中文/English)..."
          style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, backgroundColor: 'white' }}
        />
      </SectionCard>

      {list.slice(0, 50).map((it: any, idx: number) => (
        <SectionCard key={idx} title={`${it.title} / ${it.titleEn}`}>
          <Text style={{ color: '#475569' }}>Industry: {it.industry}</Text>
          <Text style={{ fontWeight: '900', marginTop: 6 }}>Life: {it.life}   CI: {it.ci}   WP: {it.wp}</Text>
        </SectionCard>
      ))}

      <SectionCard title="More">
        <Text style={{ color: '#0f172a' }} onPress={() => navigation.navigate('Resident Loading')}>
          Open Resident Loading Lookup →
        </Text>
        <Text style={{ fontSize: 11, color: '#94a3b8' }}>
          Showing up to 50 results for performance. Refine your search.
        </Text>
      </SectionCard>
    </ScrollView>
  );
}
