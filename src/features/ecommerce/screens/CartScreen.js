import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../../utils/theme';
import { money } from '../../../utils/format';
import { useLayout } from '../../../utils/layout';
import { Page, PageHeader } from '../../../components/Page';
import ActionButton from '../../../components/ActionButton';
import Icon from '../../../components/Icon';

// Same limits as Pedido::Registrar_Pedido
const MIN_BOXES = 100;
const MAX_BOXES = 300;

// Orders need at least 100 boxes, so the quantity can be typed. Applied when leaving the field.
function QtyInput({ qty, onSet }) {
  const [text, setText] = useState(String(qty));
  const commit = () => {
    const n = parseInt(text, 10);
    if (n > 0 && n !== qty) onSet(n);
    else setText(String(qty));
  };
  return (
    <TextInput style={s.qInput} value={text} onChangeText={setText} onBlur={commit} onSubmitEditing={commit}
      keyboardType="number-pad" selectTextOnFocus accessibilityLabel="Cantidad" />
  );
}

// Cart: list of products on the left and the order summary on the right (one column on phones)
export default function CartScreen({ cart, onChange, onCheckout, onShop }) {
  const [contact, setContact] = useState({ telefono: '', direccion: '', observaciones: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const setField = (k) => (v) => setContact((c) => ({ ...c, [k]: v }));
  const { isPhone, contentWidth } = useLayout();
  const items = Object.values(cart);
  const total = items.reduce((a, i) => a + i.qty * Number(i.p.precio_venta), 0);
  const count = items.reduce((a, i) => a + i.qty, 0);
  const twoColumns = !isPhone && contentWidth >= 760;

  const submit = async () => {
    setError('');
    if (count < MIN_BOXES || count > MAX_BOXES) return setError(`El pedido debe tener entre ${MIN_BOXES} y ${MAX_BOXES} cajas. Llevas ${count}.`);
    if (contact.telefono.replace(/\D/g, '').length !== 11) return setError('Ingresa un teléfono válido. Ej: 0412-1234567');
    setSending(true);
    try {
      await onCheckout(contact);
    } catch (e) {
      setError(e.message);
      setSending(false);
    }
  };

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
                  <QtyInput key={i.qty} qty={i.qty} onSet={(n) => onChange(i.p, n - i.qty)} />
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
            <Text style={s.hint}>Cada pedido debe tener entre {MIN_BOXES} y {MAX_BOXES} cajas.</Text>
            <TextInput style={s.input} placeholder="Teléfono (0412-1234567)" placeholderTextColor={colors.muted} keyboardType="phone-pad" value={contact.telefono} onChangeText={setField('telefono')} />
            <TextInput style={s.input} placeholder="Dirección de entrega (opcional)" placeholderTextColor={colors.muted} value={contact.direccion} onChangeText={setField('direccion')} />
            <TextInput style={s.input} placeholder="Observaciones (opcional)" placeholderTextColor={colors.muted} value={contact.observaciones} onChangeText={setField('observaciones')} />
            {!!error && <Text style={s.error}>{error}</Text>}
            {sending ? <ActivityIndicator color={colors.red} /> : <ActionButton size="lg" label="Realizar pedido" onPress={submit} />}
          </View>
        </View>
      )}
    </Page>
  );
}

const s = StyleSheet.create({
  qInput: { width: 48, textAlign: 'center', color: colors.text, fontWeight: '700', paddingVertical: 4, borderColor: colors.border, borderWidth: 1, borderRadius: 6 },
  hint: { color: colors.muted, fontSize: 12 },
  input: { color: colors.text, backgroundColor: colors.bg, borderColor: colors.border, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  error: { color: '#f87171', fontSize: 13, textAlign: 'center' },
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
