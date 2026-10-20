import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getList } from '../api';
import { colors } from '../theme';
import { statusStyle, money } from '../ui';

const CARDS = [
  { label: 'Total Clientes', modulo: 'clientes', color: '#60a5fa', icon: '👥' },
  { label: 'Total Usuarios', modulo: 'usuarios', color: '#a78bfa', icon: '👤' },
  { label: 'Total Pedidos', modulo: 'pedidos', color: '#f87171', icon: '📋' },
  { label: 'Productos', modulo: 'productos', color: '#fbbf24', icon: '🍪' },
];

export default function DashboardScreen({ user }) {
  const [counts, setCounts] = useState({});
  const [pagos, setPagos] = useState([]);
  const [cats, setCats] = useState([]);

  useEffect(() => {
    CARDS.forEach(async (c) => {
      try {
        const list = await getList(c.modulo);
        setCounts((p) => ({ ...p, [c.label]: list.length }));
        if (c.modulo === 'productos') {
          const by = {};
          list.forEach((r) => { const k = r.nombre_categoria || 'Otros'; by[k] = (by[k] || 0) + Number(r.stock || 1); });
          setCats(Object.entries(by));
        }
      } catch {
        setCounts((p) => ({ ...p, [c.label]: '-' }));
      }
    });
    getList('pagos').then((l) => setPagos(l.slice(0, 4))).catch(() => {});
  }, []);

  const max = Math.max(1, ...cats.map(([, v]) => v));

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 12 }}>
      <View style={s.card}>
        <Text style={s.title}>Dashboard</Text>
        <Text style={s.muted}>Gestión integral de la empresa Larense C.A</Text>
        <Text style={s.hello}>Hola, @{user?.nombre_usuario}</Text>
      </View>

      <View style={s.grid}>
        {CARDS.map((c) => (
          <View key={c.label} style={[s.card, s.stat, { borderTopColor: c.color, borderTopWidth: 3 }]}>
            <View style={s.statTop}>
              <Text style={s.muted}>{c.label}</Text>
              <Text style={{ fontSize: 18 }}>{c.icon}</Text>
            </View>
            <Text style={s.number}>{counts[c.label] ?? '…'}</Text>
          </View>
        ))}
      </View>

      {cats.length > 0 && (
        <View style={s.card}>
          <Text style={s.section}>Ventas por Categoría</Text>
          {cats.map(([name, v], i) => (
            <View key={name} style={{ marginBottom: 10 }}>
              <View style={s.rowBetween}><Text style={s.text}>{name}</Text><Text style={s.badge}>{v}</Text></View>
              <View style={s.track}><View style={[s.bar, { width: `${(v / max) * 100}%`, backgroundColor: i ? colors.red : '#fbbf24' }]} /></View>
            </View>
          ))}
        </View>
      )}

      {pagos.length > 0 && (
        <View style={s.card}>
          <Text style={s.section}>Historial de Transacciones</Text>
          {pagos.map((p, i) => {
            const st = statusStyle(p.estado);
            return (
              <View key={i} style={s.txRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.text}>Pago #{p.id_pago}</Text>
                  <Text style={s.muted}>{p.fecha_pago}</Text>
                </View>
                <Text style={[s.text, { marginRight: 10 }]}>{money(p.monto)}</Text>
                <View style={[s.pill, { backgroundColor: st.bg }]}><Text style={{ color: st.fg, fontSize: 11, fontWeight: '800' }}>{p.estado}</Text></View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 10 },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  hello: { color: colors.red, marginTop: 6, fontWeight: '700' },
  muted: { color: colors.muted, fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  stat: { width: '48.5%' },
  statTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  number: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 4 },
  section: { color: colors.text, fontWeight: '800', marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  text: { color: colors.text, fontSize: 13 },
  badge: { color: '#000', backgroundColor: '#fbbf24', borderRadius: 4, paddingHorizontal: 6, fontSize: 11, fontWeight: '800', overflow: 'hidden' },
  track: { height: 4, backgroundColor: colors.border, borderRadius: 2 },
  bar: { height: 4, borderRadius: 2 },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopColor: colors.border, borderTopWidth: 1 },
  pill: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
});
