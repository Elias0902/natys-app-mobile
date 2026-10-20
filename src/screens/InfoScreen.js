import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function InfoScreen({ title, text }) {
  return (
    <View style={s.container}>
      <Text style={s.title}>{title}</Text>
      <Text style={s.muted}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  muted: { color: colors.muted, marginTop: 8, textAlign: 'center' },
});
