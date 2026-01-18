import React, { useContext, useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View, Pressable, Alert } from 'react-native';
import { CaseContext } from '../App';
import SectionCard from '../components/SectionCard';
import CopyButton from '../components/CopyButton';
import { getTsaAllUSD, getTsaMedUSD } from '../utils/tsa';
import { appendCommissionSpreadingIssueUN } from '../utils/commissionSpreading';
import { buildEmptyCase } from '../storage/caseTypes';
import { resetActiveCase, saveNewCaseSnapshot, listSavedCases, loadSavedCase } from '../storage/caseStorage';

export default function CaseSummaryScreen() {
  const ctx = useContext(CaseContext);
  if (!ctx) return null;
  const { caseData, setCaseData } = ctx;
  const [savedList, setSavedList] = useState<Array<{ id: string; updatedAtISO: string; version: string }>>([]);

  const p = caseData.policyInput;

  const tsaAllUSD = useMemo(() =>
    getTsaAllUSD({
      prodType: p.prodType,
      sumAssured: p.sumAssured,
      planName: p.planName,
      curr: p.curr,
      otherInsurances: p.otherInsurances,
    }),
  [p.prodType, p.sumAssured, p.planName, p.curr, p.otherInsurances]);

  const tsaMedUSD = useMemo(() => getTsaMedUSD(p.medicalReq?.checkSA_USD), [p.medicalReq?.checkSA_USD]);

  const fullSummary = useMemo(() => {
    const lines: string[] = [];
    lines.push(`UW assessment tool (v2.8.5)`);
    lines.push(`Product Type: ${p.prodType}`);
    lines.push(`Currency: ${p.curr}`);
    lines.push(`Plan: ${p.planName}`);
    lines.push(`Sum Assured: ${p.sumAssured}`);
    lines.push(`TSA(All) USD: ${tsaAllUSD}`);
    lines.push(`TSA(Med) USD: ${tsaMedUSD}`);
    lines.push('');
    lines.push('Issue UN:');
    lines.push(caseData.caseSummary.issueUN || '');
    return lines.join('\n');
  }, [p, tsaAllUSD, tsaMedUSD, caseData.caseSummary.issueUN]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 12, color: '#0f172a' }}>Case Summary</Text>

      <SectionCard title="Key Metrics">
        <Text style={{ fontWeight: '900' }}>TSA(All) USD: {tsaAllUSD}</Text>
        <Text style={{ fontWeight: '900', marginTop: 6 }}>TSA(Med) USD: {tsaMedUSD}</Text>
      </SectionCard>

      <SectionCard title="Issue UN">
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 6 }}>
          (Auto-append Commission Spreading + PI checklist is supported)
        </Text>
        <TextInput
          value={caseData.caseSummary.issueUN}
          onChangeText={(v) => setCaseData((prev) => ({ ...prev, caseSummary: { ...prev.caseSummary, issueUN: v } }))}
          multiline
          style={{ minHeight: 160, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, backgroundColor: 'white', textAlignVertical: 'top' }}
        />
        <View style={{ height: 10 }} />
        <Pressable
          onPress={() => {
            const next = appendCommissionSpreadingIssueUN({
              currentIssueUN: caseData.caseSummary.issueUN,
              commissionSpreading: p.commissionSpreading,
              piInvestorType: p.piInvestorType,
              piScenarioKey: p.piScenarioKey,
            });
            setCaseData((prev) => ({ ...prev, caseSummary: { ...prev.caseSummary, issueUN: next } }));
          }}
          style={{ padding: 12, backgroundColor: '#2563eb', borderRadius: 12, alignItems: 'center' }}
        >
          <Text style={{ color: 'white', fontWeight: '900' }}>Apply PI Checklist to Issue UN</Text>
        </Pressable>

        <View style={{ height: 10 }} />
        <CopyButton label="Copy Full Summary" text={fullSummary} />
      </SectionCard>

      <SectionCard title="Case Actions">
        <Pressable
          onPress={async () => {
            const id = await saveNewCaseSnapshot(caseData);
            Alert.alert('Saved', `Saved case id: ${id}`);
          }}
          style={{ padding: 12, backgroundColor: '#0f172a', borderRadius: 12, alignItems: 'center', marginBottom: 10 }}
        >
          <Text style={{ color: 'white', fontWeight: '900' }}>Save Case Snapshot</Text>
        </Pressable>

        <Pressable
          onPress={async () => {
            const list = await listSavedCases();
            setSavedList(list);
            Alert.alert('Saved Cases', list.length ? `Loaded ${list.length} snapshots.` : 'No saved cases yet.');
          }}
          style={{ padding: 12, backgroundColor: '#334155', borderRadius: 12, alignItems: 'center', marginBottom: 10 }}
        >
          <Text style={{ color: 'white', fontWeight: '900' }}>Refresh Saved Cases</Text>
        </Pressable>

        {savedList.slice(0, 5).map((s) => (
          <Pressable
            key={s.id}
            onPress={async () => {
              const loaded = await loadSavedCase(s.id);
              if (!loaded) return Alert.alert('Error', 'Failed to load case');
              setCaseData(loaded);
              Alert.alert('Loaded', `Loaded case id: ${s.id}`);
            }}
            style={{ padding: 10, backgroundColor: '#e2e8f0', borderRadius: 12, marginBottom: 8 }}
          >
            <Text style={{ fontWeight: '800' }}>Load {s.id}</Text>
            <Text style={{ fontSize: 12, color: '#64748b' }}>{s.updatedAtISO}</Text>
          </Pressable>
        ))}

        <Pressable
          onPress={async () => {
            await resetActiveCase(buildEmptyCase());
            setCaseData(buildEmptyCase());
            Alert.alert('Reset', 'Active case reset.');
          }}
          style={{ padding: 12, backgroundColor: '#ef4444', borderRadius: 12, alignItems: 'center', marginTop: 10 }}
        >
          <Text style={{ color: 'white', fontWeight: '900' }}>Reset Active Case</Text>
        </Pressable>

        <View style={{ height: 10 }} />
        <CopyButton label="Copy Export JSON" text={JSON.stringify(caseData)} />
        <Text style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
          Import: paste JSON into Issue UN for now (quick path). You can extend to a dedicated Import modal if needed.
        </Text>
      </SectionCard>

      <Text style={{ fontSize: 11, color: '#94a3b8' }}>
        Build note: This mobile pack focuses on parity of core rules (rates, TSA, PI checklist append, text tools, DB search) and provides a solid base for completing the remaining Policy Info fields from v2.8.5.
      </Text>
    </ScrollView>
  );
}
