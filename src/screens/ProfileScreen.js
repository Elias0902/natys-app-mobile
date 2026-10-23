import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { initials } from '../ui';

const TABS = [
  { key: 'perfil', label: 'Mi Perfil' },
  { key: 'datos', label: 'Datos Personales' },
  { key: 'credito', label: 'Crédito y Balance' },
  { key: 'ayuda', label: 'Ayuda' },
];

function Row({ label, value }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

export default function ProfileScreen({ user, lastAccess, initialTab = 'perfil' }) {
  const [tab, setTab] = useState(initialTab);
  useEffect(() => setTab(initialTab), [initialTab]);

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 12 }}>
      <View style={s.hero}>
        <View style={s.avatar}><Text style={s.avatarText}>{initials(user?.nombre_usuario)}</Text></View>
        <Text style={s.name}>@{user?.nombre_usuario}</Text>
        <Text style={s.role}>{user?.rol_usuario}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
        {TABS.map((t) => (
          <TouchableOpacity key={t.key} onPress={() => setTab(t.key)} style={[s.tab, tab === t.key && s.tabOn]}>
            <Text style={[s.tabText, tab === t.key && { color: '#fff' }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={s.card}>
        {tab === 'perfil' ? (
          <>
            <Text style={s.title}>Mi Perfil</Text>
            <Text style={s.sub}>Información de tu cuenta</Text>
            <Row label="Nombre de Usuario" value={`@${user?.nombre_usuario}`} />
            <Row label="Correo Electrónico" value={user?.email_usuario} />
            <Row label="Rol" value={user?.rol_usuario} />
            <Row label="Último acceso" value={lastAccess} />
          </>
        ) : (
          <>
            <Text style={s.title}>{TABS.find((t) => t.key === tab).label}</Text>
            <Text style={s.sub}>Sección pendiente de implementar</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: { alignItems: 'center', backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 18, marginBottom: 10 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 24 },
  name: { color: colors.text, fontSize: 18, fontWeight: '800' },
  role: { color: colors.red, fontWeight: '700', marginTop: 2 },
  tab: { borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8 },
  tabOn: { backgroundColor: colors.red, borderColor: colors.red },
  tabText: { color: colors.muted, fontWeight: '700', fontSize: 12 },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 16 },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  sub: { color: colors.muted, fontSize: 12, marginBottom: 12 },
  row: { borderTopColor: colors.border, borderTopWidth: 1, paddingVertical: 10 },
  rowLabel: { color: colors.muted, fontSize: 11, textTransform: 'uppercase' },
  rowValue: { color: colors.text, fontSize: 15, fontWeight: '600', marginTop: 2 },
});
