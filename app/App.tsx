import 'react-native-gesture-handler';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import { CaseData, buildEmptyCase } from './storage/caseTypes';
import { loadActiveCase, saveActiveCase } from './storage/caseStorage';

export const CaseContext = React.createContext<{
  caseData: CaseData;
  setCaseData: React.Dispatch<React.SetStateAction<CaseData>>;
} | null>(null);

export default function App() {
  const [caseData, setCaseData] = useState<CaseData>(buildEmptyCase());
  const ctx = useMemo(() => ({ caseData, setCaseData }), [caseData]);

  useEffect(() => {
    (async () => {
      const loaded = await loadActiveCase();
      if (loaded) setCaseData(loaded);
    })();
  }, []);

  useEffect(() => {
    // persist active case on change (debounce omitted for simplicity)
    saveActiveCase(caseData).catch(() => undefined);
  }, [caseData]);

  return (
    <CaseContext.Provider value={ctx}>
      <NavigationContainer>
        <StatusBar />
        <SafeAreaView style={{ flex: 1 }}>
          <RootNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </CaseContext.Provider>
  );
}
