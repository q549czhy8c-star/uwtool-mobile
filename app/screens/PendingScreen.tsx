import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View, Pressable } from 'react-native';
import SectionCard from '../components/SectionCard';
import CopyButton from '../components/CopyButton';
import { PENDING_MESSAGES } from '../data/pendingMessages';

export default function PendingScreen() {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return PENDING_MESSAGES;
    return PENDING_MESSAGES.filter((m: any) => String(m.text || '').toLowerCase().includes(s));
  }, [q]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 12, color: '#0f172a' }}>Pending</Text>
      <SectionCard title="Search">
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search pending messages..."
          style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, backgroundColor: 'white' }}
        />
      </SectionCard>

      {filtered.slice(0, 100).map((m: any, idx: number) => (
        <SectionCard key={idx} title={m.title || `Message ${idx + 1}`}>
          <Text style={{ color: '#0f172a', marginBottom: 10 }}>{m.text}</Text>
          <CopyButton label="Copy" text={m.text || ''} />
        </SectionCard>
      ))}
      <Text style={{ fontSize: 11, color: '#94a3b8' }}>Showing up to 100 results for performance. Refine your search to see others.</Text>
    </ScrollView>
  );
}
