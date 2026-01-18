import React from 'react';
import { Pressable, Text } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export default function CopyButton(props: { label: string; text: string; onCopied?: () => void }) {
  return (
    <Pressable
      onPress={async () => {
        await Clipboard.setStringAsync(props.text || '');
        props.onCopied?.();
      }}
      style={{ paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#0f172a', borderRadius: 12, alignItems: 'center' }}
    >
      <Text style={{ color: 'white', fontWeight: '800' }}>{props.label}</Text>
    </Pressable>
  );
}
