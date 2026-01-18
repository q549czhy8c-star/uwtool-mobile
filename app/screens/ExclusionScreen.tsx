import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View, Switch } from 'react-native';
import SectionCard from '../components/SectionCard';
import CopyButton from '../components/CopyButton';

function buildNonCancer(ncMajorEn: string, ncMinorEn: string, ncMajorCn: string, ncMinorCn: string) {
  if (!ncMajorEn && !ncMajorCn && !ncMinorEn && !ncMinorCn) return [] as Array<{ prefix: string; messages: string[] }>;
  const majorEn = ncMajorEn || ncMinorEn || '';
  const minorEn = ncMinorEn || ncMajorEn || '';
  const majorCn = ncMajorCn || ncMinorCn || '';
  const minorCn = ncMinorCn || ncMajorCn || '';
  return [
    {
      prefix: '@@@E',
      messages: [
        `Critical Illness Benefit for Major Critical Illness will not be payable if the loss or claim is directly or indirectly due to ${majorEn} and its complications.`,
      ],
    },
    {
      prefix: '@@@E',
      messages: [
        `Critical Illness Benefit for Early Stage or Minor Critical Illnesses will not be payable if the loss or claim is directly or indirectly due to ${minorEn} and its complications.`,
      ],
    },
    {
      prefix: '@@@C',
      messages: [`嚴重疾病 - 不保事項: ${majorCn} 及其併發症。`, `早期及/或非嚴重疾病- 不保事項: ${minorCn} 及其併發症。`],
    },
  ];
}

function buildCancer(cMajorEn: string, cMinorEn: string, cMajorCn: string, cMinorCn: string, metastasis: boolean) {
  if (!cMajorEn && !cMajorCn && !cMinorEn && !cMinorCn) return [] as Array<{ prefix: string; messages: string[] }>;
  const majorEn = cMajorEn || cMinorEn || '';
  const minorEn = cMinorEn || cMajorEn || '';
  const majorCn = cMajorCn || cMinorCn || '';
  const minorCn = cMinorCn || cMajorCn || '';

  const majorEngLine = metastasis
    ? `Critical Illness Benefit for Major Critical Illness will not be payable if the loss or claim is directly or indirectly due to Cancer of ${majorEn}, its treatment, metastasis and complications.`
    : `Critical Illness Benefit for Major Critical Illness will not be payable if the loss or claim is directly or indirectly due to cancer of ${majorEn} and its complications.`;

  const majorCnLine = metastasis
    ? `嚴重疾病 - 不保事項: ${majorCn}癌症及其治療、轉移及併發症。`
    : `嚴重疾病 - 不保事項: ${majorCn}癌症及其併發症。`;

  return [
    { prefix: '@@@E', messages: [majorEngLine] },
    {
      prefix: '@@@E',
      messages: [
        `Critical Illness Benefit for Early Stage or Minor Critical Illnesses will not be payable if the loss or claim is directly or indirectly due to Early Stage Malignancy / Carcinoma-in-situ of ${minorEn}, surgical excision of benign tumour of ${minorEn} and its complications.`,
      ],
    },
    {
      prefix: '@@@C',
      messages: [majorCnLine, `早期及/或非嚴重疾病- 不保事項: ${minorCn}早期惡性腫瘤/原位癌及${minorCn}良性腫廇切除手術及其併發症。`],
    },
  ];
}

export default function ExclusionScreen() {
  const [ncMajorEn, setNcMajorEn] = useState('');
  const [ncMajorCn, setNcMajorCn] = useState('');
  const [ncMinorEn, setNcMinorEn] = useState('');
  const [ncMinorCn, setNcMinorCn] = useState('');
  const [cMajorEn, setCMajorEn] = useState('');
  const [cMajorCn, setCMajorCn] = useState('');
  const [cMinorEn, setCMinorEn] = useState('');
  const [cMinorCn, setCMinorCn] = useState('');
  const [metastasis, setMetastasis] = useState(false);

  const nonCancerItems = useMemo(() => buildNonCancer(ncMajorEn, ncMinorEn, ncMajorCn, ncMinorCn), [ncMajorEn, ncMinorEn, ncMajorCn, ncMinorCn]);
  const cancerItems = useMemo(() => buildCancer(cMajorEn, cMinorEn, cMajorCn, cMinorCn, metastasis), [cMajorEn, cMinorEn, cMajorCn, cMinorCn, metastasis]);

  const allText = useMemo(() => {
    const lines: string[] = [];
    const all = [...nonCancerItems, ...cancerItems];
    for (const it of all) {
      for (const msg of it.messages) lines.push(`${it.prefix} ${msg}`.trim());
    }
    return lines.join('\n');
  }, [nonCancerItems, cancerItems]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 12, color: '#0f172a' }}>Exclusion Code</Text>

      <SectionCard title="(Non-cancer) Major CI & Minor CI">
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b' }}>Major CI (English)</Text>
        <TextInput value={ncMajorEn} onChangeText={setNcMajorEn} style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 10, backgroundColor: 'white', marginBottom: 8 }} />
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b' }}>Major CI (Chinese)</Text>
        <TextInput value={ncMajorCn} onChangeText={setNcMajorCn} style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 10, backgroundColor: 'white', marginBottom: 8 }} />
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b' }}>Minor CI (English)</Text>
        <TextInput value={ncMinorEn} onChangeText={setNcMinorEn} style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 10, backgroundColor: 'white', marginBottom: 8 }} />
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b' }}>Minor CI (Chinese)</Text>
        <TextInput value={ncMinorCn} onChangeText={setNcMinorCn} style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 10, backgroundColor: 'white' }} />
      </SectionCard>

      <SectionCard title="(Cancer) Major CI & Minor CI">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontWeight: '900' }}>Metastasis is required</Text>
          <Switch value={metastasis} onValueChange={setMetastasis} />
        </View>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b' }}>Major CI (English)</Text>
        <TextInput value={cMajorEn} onChangeText={setCMajorEn} style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 10, backgroundColor: 'white', marginBottom: 8 }} />
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b' }}>Major CI (Chinese)</Text>
        <TextInput value={cMajorCn} onChangeText={setCMajorCn} style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 10, backgroundColor: 'white', marginBottom: 8 }} />
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b' }}>Minor CI (English)</Text>
        <TextInput value={cMinorEn} onChangeText={setCMinorEn} style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 10, backgroundColor: 'white', marginBottom: 8 }} />
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b' }}>Minor CI (Chinese)</Text>
        <TextInput value={cMinorCn} onChangeText={setCMinorCn} style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 10, backgroundColor: 'white' }} />
      </SectionCard>

      <SectionCard title="Output">
        <CopyButton label="Copy All" text={allText} />
        <View style={{ height: 8 }} />
        <Text style={{ color: '#0f172a' }}>{allText || '(Fill in fields above)'}</Text>
      </SectionCard>
    </ScrollView>
  );
}
