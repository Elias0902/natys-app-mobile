import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { money } from '../ui';

export default function CartScreen({ cart, onChange, onCheckout, onShop }) {
  const items = Object.values(cart);
  const total = items.reduce((a, i) => a + i.qty * Number(i.p.precio_venta), 0);

  if (!items.length) {
    return (
      <View style={s.center}>
        <Text style={{ fontSize: 50 }}>🛒</Text>
        <Text style={s.title}>Tu carrito está vacío</Text>
        <TouchableOpacity style={s.btn} onPress={onShop}><Text style={s.btnText}>Ir a la tienda</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <FlatList
        contentContainerStyle={{ padding: 12 }}
        data={items}
        keyExtractor={(i) => String(i.p.id_producto)}
        renderItem={({ item: i }) => (
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.name} numberOfLines={2}>{i.p.nombre_producto}</Text>
              <Text style={s.price}>{money(i.p.precio_venta)} c/u</Text>
            </View>
            <View style={s.qty}>
              <TouchableOpacity style={s.qBtn} onPress={() => onChange(i.p, -1)}><Text style={s.qText}>−</Text></TouchableOpacity>
              <Text style={s.qNum}>{i.qty}</Text>
              <TouchableOpacity style={s.qBtn} onPress={() => onChange(i.p, 1)}><Text style={s.qText}>+</Text></TouchableOpacity>
            </View>
            <Text style={s.sub}>{money(i.qty * Number(i.p.precio_venta))}</Text>
          </View>
        )}
      />
      <View style={s.footer}>
        <View style={s.totalRow}><Text style={s.totalLabel}>Total</Text><Text style={s.total}>{money(total)}</Text></View>
        <TouchableOpacity style={s.btn} onPress={onCheckout}><Text style={s.btnText}>Realizar pedido</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { color: colors.text, fontSize: 18, fontWeight: '800', marginVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 8 },
  name: { color: colors.text, fontWeight: '600', fontSize: 13 },
  price: { color: colors.muted, fontSize: 11, marginTop: 2 },
  qty: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 },
  qBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  qText: { color: colors.text, fontWeight: '800' },
  qNum: { color: colors.text, marginHorizontal: 8, fontWeight: '700' },
  sub: { color: '#fbbf24', fontWeight: '800', minWidth: 52, textAlign: 'right' },
  footer: { backgroundColor: '#000', padding: 14 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  totalLabel: { color: colors.muted, fontSize: 16 },
  total: { color: colors.text, fontSize: 22, fontWeight: '800' },
  btn: { backgroundColor: colors.red, borderRadius: 10, padding: 14, alignItems: 'center', paddingHorizontal: 24 },
  btnText: { color: '#fff', fontWeight: '800' },
});
