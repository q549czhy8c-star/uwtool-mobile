import React, { useMemo, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View, FlatList } from 'react-native';

export type Option = { label: string; value: string };

export default function SearchableDropdown(props: {
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  const currentLabel = useMemo(() => {
    const found = props.options.find((o) => o.value === props.value);
    return found?.label ?? '';
  }, [props.value, props.options]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return props.options;
    return props.options.filter((o) => (o.label + ' ' + o.value).toLowerCase().includes(s));
  }, [q, props.options]);

  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 4 }}>{props.label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, backgroundColor: 'white' }}
      >
        <Text style={{ color: currentLabel ? '#0f172a' : '#94a3b8' }}>{currentLabel || props.placeholder || 'Select...'}</Text>
      </Pressable>

      <Modal visible={open} animationType="slide">
        <View style={{ flex: 1, padding: 16, backgroundColor: '#f8fafc' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', marginBottom: 10 }}>{props.label}</Text>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search..."
            style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 10, backgroundColor: 'white', marginBottom: 10 }}
          />
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  props.onChange(item.value);
                  setOpen(false);
                  setQ('');
                }}
                style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }}
              >
                <Text style={{ fontWeight: item.value === props.value ? '800' as any : '600' as any }}>{item.label}</Text>
              </Pressable>
            )}
          />
          <Pressable onPress={() => setOpen(false)} style={{ padding: 14, marginTop: 10, backgroundColor: '#0f172a', borderRadius: 12 }}>
            <Text style={{ textAlign: 'center', color: 'white', fontWeight: '800' }}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
