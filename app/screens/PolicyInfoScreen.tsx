import React, { useContext, useMemo } from 'react';
import { ScrollView, Text, View, Switch, Pressable } from 'react-native';
import { CaseContext } from '../App';
import SectionCard from '../components/SectionCard';
import NumericInput from '../components/NumericInput';
import SearchableDropdown from '../components/SearchableDropdown';
import MultiSelectChips from '../components/MultiSelectChips';
import { SOF_OPTIONS, SOW_OPTIONS } from '../data/constants';
import { PI_REQUIREMENTS } from '../data/piRequirements';

export default function PolicyInfoScreen({ navigation }: any) {
  const ctx = useContext(CaseContext);
  if (!ctx) return null;
  const { caseData, setCaseData } = ctx;
  const p = caseData.policyInput;

  const investorOptions = useMemo(
    () => [
      { label: 'INDIVIDUAL PROFESSIONAL INVESTOR', value: 'INDIVIDUAL PROFESSIONAL INVESTOR' },
      { label: 'CORPORATE PROFESSIONAL INVESTOR', value: 'CORPORATE PROFESSIONAL INVESTOR' },
    ],
    []
  );

  const scenarioOptions = useMemo(() => {
    const list = (PI_REQUIREMENTS as any)[p.piInvestorType] as Array<any> | undefined;
    return (list || []).map((x) => ({ label: x.label, value: x.key }));
  }, [p.piInvestorType]);

  const setPolicy = (patch: Partial<typeof p>) => {
    setCaseData((prev) => ({ ...prev, policyInput: { ...prev.policyInput, ...patch } }));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 12, color: '#0f172a' }}>Policy Info</Text>

      <SectionCard title="Basic">
        <SearchableDropdown
          label="Product Type"
          value={p.prodType}
          options={[{ label: 'Life', value: 'Life' }, { label: 'CI', value: 'CI' }]}
          onChange={(v) => setPolicy({ prodType: v })}
        />
        <SearchableDropdown
          label="Currency"
          value={p.curr}
          options={[{ label: 'HKD', value: 'HKD' }, { label: 'USD', value: 'USD' }]}
          onChange={(v) => setPolicy({ curr: v })}
        />
        <NumericInput label="Sum Assured" value={p.sumAssured} onChange={(v) => setPolicy({ sumAssured: v })} />
        <SearchableDropdown
          label="Plan Name"
          value={p.planName}
          options={[{ label: 'LionPatron', value: 'LionPatron' }, { label: 'Other', value: 'Other' }]}
          onChange={(v) => setPolicy({ planName: v })}
          placeholder="Select..."
        />
      </SectionCard>

      <SectionCard title="Dates & Payment">
        <NumericInput label="Application Sign Date (YYYY-MM-DD)" value={p.applicationSignDate} onChange={(v) => setPolicy({ applicationSignDate: v })} />
        <NumericInput label="Payment Date (YYYY-MM-DD)" value={p.paymentDate} onChange={(v) => setPolicy({ paymentDate: v })} />
        <SearchableDropdown
          label="Pay Mode"
          value={p.payMode}
          options={[{ label: 'Regular', value: 'Regular' }, { label: 'Prepay', value: 'Prepay' }]}
          onChange={(v) => setPolicy({ payMode: v })}
        />
        <NumericInput label="Premium Term (Years)" value={p.yearTerm} onChange={(v) => setPolicy({ yearTerm: v })} />
      </SectionCard>

      <SectionCard title="FNA (SoF / SoW)">
        <MultiSelectChips label="SoF" selected={p.fnaSof} options={SOF_OPTIONS} onChange={(next) => setPolicy({ fnaSof: next })} />
        <MultiSelectChips label="SoW" selected={p.fnaSow} options={SOW_OPTIONS} onChange={(next) => setPolicy({ fnaSow: next })} />
      </SectionCard>

      <SectionCard title="Commission Spreading (v2.8.5)">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ fontWeight: '800' }}>Commission Spreading</Text>
          <Switch value={p.commissionSpreading} onValueChange={(v) => setPolicy({ commissionSpreading: v })} />
        </View>

        {p.commissionSpreading ? (
          <>
            <SearchableDropdown
              label="PI Investor Type"
              value={p.piInvestorType}
              options={investorOptions}
              onChange={(v) => setPolicy({ piInvestorType: v, piScenarioKey: '' })}
            />
            <SearchableDropdown
              label="PI Scenario / Category"
              value={p.piScenarioKey}
              options={scenarioOptions}
              onChange={(v) => setPolicy({ piScenarioKey: v })}
              placeholder={p.piInvestorType ? 'Select scenario...' : 'Select investor type first'}
            />
          </>
        ) : null}
      </SectionCard>

      <Pressable
        onPress={() => navigation.navigate('Affordability')}
        style={{ padding: 14, backgroundColor: '#2563eb', borderRadius: 14, alignItems: 'center', marginBottom: 20 }}
      >
        <Text style={{ color: 'white', fontWeight: '900' }}>Go to Affordability</Text>
      </Pressable>

      <Text style={{ fontSize: 12, color: '#64748b' }}>
        Note: This mobile build is scaffolded for v2.8.5 and keeps core rules (rates, PI append). You can extend remaining Policy Info fields by following the same pattern.
      </Text>
    </ScrollView>
  );
}
