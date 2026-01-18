import React, { useMemo, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View, FlatList } from 'react-native';

export default function MultiSelectChips(props: {
  label: string;
  selected: string[];
  options: readonly string[] | string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const opts = Array.from(props.options);
    if (!s) return opts;
    return opts.filter((o) => o.toLowerCase().includes(s));
  }, [q, props.options]);

  const toggle = (v: string) => {
    const has = props.selected.includes(v);
    props.onChange(has ? props.selected.filter((x) => x !== v) : [...props.selected, v]);
  };

  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 4 }}>{props.label}</Text>
      <Pressable onPress={() => setOpen(true)} style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 as any }}>
          {props.selected.length === 0 ? (
            <Text style={{ color: '#94a3b8' }}>Select...</Text>
          ) : (
            props.selected.map((s) => (
              <View key={s} style={{ backgroundColor: '#e2e8f0', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 }}>
                <Text style={{ fontWeight: '700' }}>{s}</Text>
              </View>
            ))
          )}
        </View>
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
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const selected = props.selected.includes(item);
              return (
                <Pressable onPress={() => toggle(item)} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontWeight: selected ? '800' as any : '600' as any }}>{item}</Text>
                  <Text>{selected ? '✓' : ''}</Text>
                </Pressable>
              );
            }}
          />
          <Pressable onPress={() => setOpen(false)} style={{ padding: 14, marginTop: 10, backgroundColor: '#0f172a', borderRadius: 12 }}>
            <Text style={{ textAlign: 'center', color: 'white', fontWeight: '800' }}>Done</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
