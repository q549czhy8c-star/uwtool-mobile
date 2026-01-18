import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import PolicyInfoScreen from '../screens/PolicyInfoScreen';
import AffordabilityScreen from '../screens/AffordabilityScreen';
import CaseSummaryScreen from '../screens/CaseSummaryScreen';
import TextSplitterScreen from '../screens/TextSplitterScreen';
import PendingScreen from '../screens/PendingScreen';
import ExclusionScreen from '../screens/ExclusionScreen';
import OccupationScreen from '../screens/OccupationScreen';
import BrokerListScreen from '../screens/BrokerListScreen';
import ResidentLoadingLookupScreen from '../screens/ResidentLoadingLookupScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CaseStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Policy Info" component={PolicyInfoScreen} />
      <Stack.Screen name="Affordability" component={AffordabilityScreen} />
    </Stack.Navigator>
  );
}

function SummaryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Case Summary" component={CaseSummaryScreen} />
    </Stack.Navigator>
  );
}

function ToolsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Text Splitter" component={TextSplitterScreen} />
      <Stack.Screen name="Pending" component={PendingScreen} />
      <Stack.Screen name="Exclusion" component={ExclusionScreen} />
    </Stack.Navigator>
  );
}

function ReferenceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Occupation" component={OccupationScreen} />
      <Stack.Screen name="Master Broker List" component={BrokerListScreen} />
      <Stack.Screen name="Resident Loading" component={ResidentLoadingLookupScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, any> = {
            Case: 'assignment',
            Summary: 'description',
            Tools: 'build',
            Reference: 'search',
          };
          const name = map[route.name] || 'circle';
          return <MaterialIcons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Case" component={CaseStack} />
      <Tab.Screen name="Summary" component={SummaryStack} />
      <Tab.Screen name="Tools" component={ToolsStack} />
      <Tab.Screen name="Reference" component={ReferenceStack} />
    </Tab.Navigator>
  );
}
