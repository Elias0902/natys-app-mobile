import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { money } from '../ui';
import { useLayout } from '../layout';
import { Page, PageHeader } from '../components/Page';
import ActionButton from '../components/ActionButton';
import Icon from '../components/Icon';

// Cart: list of products on the left and the order summary on the right (one column on phones)
export default function CartScreen({ cart, onChange, onCheckout, onShop }) {
  const { isPhone, contentWidth } = useLayout();
  const items = Object.values(cart);
  const total = items.reduce((a, i) => a + i.qty * Number(i.p.precio_venta), 0);
  const count = items.reduce((a, i) => a + i.qty, 0);
  const twoColumns = !isPhone && contentWidth >= 760;

  return (
    <Page>
      <PageHeader icon="cart" title="Carrito de compras" crumb="Inicio  ›  Ecommerce  ›  Carrito">
        {items.length > 0 && <ActionButton icon="bag" size="lg" variant="outline" label="Seguir comprando" onPress={onShop} />}
      </PageHeader>

      {!items.length ? (
        <View style={s.empty}>
          <Icon name="cart" size={48} color={colors.muted} strokeWidth={1.5} />
          <Text style={s.emptyTitle}>Tu carrito está vacío</Text>
          <ActionButton icon="bag" size="lg" label="Ir a la tienda" onPress={onShop} />
        </View>
      ) : (
        <View style={[s.layout, twoColumns && s.layoutRow]}>
          <View style={[s.list, twoColumns && s.listWide]}>
            {items.map((i) => (
              <View key={i.p.id_producto} style={s.row}>
                <View style={s.thumb}><Text style={{ fontSize: 22 }}>🍪</Text></View>
                <View style={s.info}>
                  <Text style={s.name} numberOfLines={2}>{i.p.nombre_producto}</Text>
                  <Text style={s.price}>{money(i.p.precio_venta)} c/u</Text>
                </View>
                <View style={s.qty}>
                  <TouchableOpacity style={s.qBtn} onPress={() => onChange(i.p, -1)} accessibilityLabel="Quitar uno">
                    <Icon name="minus" size={14} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={s.qNum}>{i.qty}</Text>
                  <TouchableOpacity style={s.qBtn} onPress={() => onChange(i.p, 1)} accessibilityLabel="Agregar uno">
                    <Icon name="plus" size={14} color={colors.text} />
                  </TouchableOpacity>
                </View>
                <Text style={s.sub}>{money(i.qty * Number(i.p.precio_venta))}</Text>
              </View>
            ))}
          </View>

          <View style={[s.summary, twoColumns && s.summaryWide]}>
            <Text style={s.summaryTitle}>Resumen del pedido</Text>
            <View style={s.sumRow}><Text style={s.sumLabel}>Productos</Text><Text style={s.sumValue}>{count}</Text></View>
            <View style={[s.sumRow, s.totalRow]}><Text style={s.totalLabel}>Total</Text><Text style={s.total}>{money(total)}</Text></View>
            <ActionButton size="lg" label="Realizar pedido" onPress={onCheckout} />
          </View>
        </View>
      )}
    </Page>
  );
}

const s = StyleSheet.create({
  empty: { alignItems: 'center', gap: 14, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, paddingVertical: 40, paddingHorizontal: 20 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  layout: { gap: 16 },
  layoutRow: { flexDirection: 'row', alignItems: 'flex-start' },
  list: { gap: 10 },
  listWide: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 12 },
  thumb: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { color: colors.text, fontWeight: '600', fontSize: 13 },
  price: { color: colors.muted, fontSize: 11, marginTop: 2 },
  qty: { flexDirection: 'row', alignItems: 'center' },
  qBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  qNum: { color: colors.text, minWidth: 28, textAlign: 'center', fontWeight: '700' },
  sub: { color: '#fbbf24', fontWeight: '800', minWidth: 64, textAlign: 'right' },
  summary: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 16, gap: 10 },
  summaryWide: { width: 320 },
  summaryTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sumLabel: { color: colors.muted, fontSize: 13 },
  sumValue: { color: colors.text, fontSize: 13, fontWeight: '700' },
  totalRow: { borderTopColor: colors.border, borderTopWidth: 1, paddingTop: 10, marginBottom: 6 },
  totalLabel: { color: colors.muted, fontSize: 16 },
  total: { color: colors.text, fontSize: 22, fontWeight: '800' },
});
