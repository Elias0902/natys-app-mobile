import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { initials } from '../ui';
import { useLayout } from '../layout';
import { Page, PageHeader } from '../components/Page';

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

// Profile: user card on the left and the tabs on the right (stacked on phones)
export default function ProfileScreen({ user, lastAccess, initialTab = 'perfil' }) {
  const { isPhone, contentWidth } = useLayout();
  const [tab, setTab] = useState(initialTab);
  useEffect(() => setTab(initialTab), [initialTab]);
  const twoColumns = !isPhone && contentWidth >= 700;

  return (
    <Page>
      <PageHeader icon="user" title="Mi Perfil" crumb="Inicio  ›  Mi Perfil" />

      <View style={[s.layout, twoColumns && s.layoutRow]}>
        <View style={[s.hero, twoColumns && s.heroWide]}>
          <View style={s.avatar}><Text style={s.avatarText}>{initials(user?.nombre_usuario)}</Text></View>
          <Text style={s.name} numberOfLines={1}>@{user?.nombre_usuario}</Text>
          <Text style={s.mail} numberOfLines={1}>{user?.email_usuario}</Text>
          <Text style={s.role}>{user?.rol_usuario}</Text>
        </View>

        <View style={twoColumns ? s.mainWide : null}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabs} contentContainerStyle={s.tabsInner}>
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
        </View>
      </View>
    </Page>
  );
}

const s = StyleSheet.create({
  layout: { gap: 16 },
  layoutRow: { flexDirection: 'row', alignItems: 'flex-start' },
  hero: { alignItems: 'center', backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 20 },
  heroWide: { width: 280 },
  mainWide: { flex: 1 },
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 24 },
  name: { color: colors.text, fontSize: 18, fontWeight: '800' },
  mail: { color: colors.muted, fontSize: 12, marginTop: 2 },
  role: { color: colors.red, fontWeight: '700', marginTop: 6 },
  tabs: { marginBottom: 12, flexGrow: 0 },
  tabsInner: { gap: 8 },
  tab: { borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 7 },
  tabOn: { backgroundColor: colors.red, borderColor: colors.red },
  tabText: { color: colors.muted, fontWeight: '700', fontSize: 12 },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 18 },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  sub: { color: colors.muted, fontSize: 12, marginBottom: 12 },
  row: { borderTopColor: colors.border, borderTopWidth: 1, paddingVertical: 10 },
  rowLabel: { color: colors.muted, fontSize: 11, textTransform: 'uppercase' },
  rowValue: { color: colors.text, fontSize: 15, fontWeight: '600', marginTop: 2 },
});
