import React, { useContext, useMemo } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { CaseContext } from '../App';
import SectionCard from '../components/SectionCard';
import NumericInput from '../components/NumericInput';
import CopyButton from '../components/CopyButton';
import { buildExcelBlocks } from '../utils/textSplitter';

export default function TextSplitterScreen() {
  const ctx = useContext(CaseContext);
  if (!ctx) return null;
  const { caseData, setCaseData } = ctx;
  const t = caseData.textSplitter;

  const blocks = useMemo(() => {
    const first = t.firstColRowLimit.trim() ? Number(t.firstColRowLimit) : null;
    return buildExcelBlocks({
      bulkTextA: t.bulkTextA,
      lineLength: Number(t.lineLength) || 40,
      rowLimit: Number(t.rowLimit) || 12,
      firstColRowLimit: first,
    });
  }, [t.bulkTextA, t.lineLength, t.rowLimit, t.firstColRowLimit]);

  const excelA = useMemo(() => blocks.map((b) => b.textA).join('\n'), [blocks]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 12, color: '#0f172a' }}>Text Splitter</Text>

      <SectionCard title="Settings">
        <NumericInput
          label="Line Length"
          value={String(t.lineLength)}
          onChange={(v) => setCaseData((prev) => ({ ...prev, textSplitter: { ...prev.textSplitter, lineLength: Number(v) || 40 } }))}
        />
        <NumericInput
          label="Row Limit (per block)"
          value={String(t.rowLimit)}
          onChange={(v) => setCaseData((prev) => ({ ...prev, textSplitter: { ...prev.textSplitter, rowLimit: Number(v) || 12 } }))}
        />
        <NumericInput
          label="First Block Row Limit (optional)"
          value={String(t.firstColRowLimit)}
          onChange={(v) => setCaseData((prev) => ({ ...prev, textSplitter: { ...prev.textSplitter, firstColRowLimit: v } }))}
        />
      </SectionCard>

      <SectionCard title="Input (bulkTextA)">
        <TextInput
          value={t.bulkTextA}
          onChangeText={(v) => setCaseData((prev) => ({ ...prev, textSplitter: { ...prev.textSplitter, bulkTextA: v } }))}
          multiline
          style={{ minHeight: 180, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, backgroundColor: 'white', textAlignVertical: 'top' }}
          placeholder="Paste numbered messages here..."
        />
      </SectionCard>

      <SectionCard title="Output">
        <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
          Rows: {blocks.length} (blocks are grouped every {t.rowLimit} rows)
        </Text>
        <CopyButton label="Copy Column A" text={excelA} />
      </SectionCard>
    </ScrollView>
  );
}
