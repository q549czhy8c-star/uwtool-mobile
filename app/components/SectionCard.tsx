import React from 'react';
import { View, Text } from 'react-native';

export default function SectionCard(props: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' }}>
      <Text style={{ fontWeight: '700', marginBottom: 8, color: '#334155' }}>{props.title}</Text>
      {props.children}
    </View>
  );
}
