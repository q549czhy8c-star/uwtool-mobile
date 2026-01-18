import React from 'react';
import { View, Text, TextInput } from 'react-native';

export default function NumericInput(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 4 }}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChange}
        placeholder={props.placeholder}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 10, backgroundColor: 'white' }}
      />
    </View>
  );
}
