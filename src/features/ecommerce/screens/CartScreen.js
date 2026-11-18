import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../../utils/theme';
import { isPhone as isValidPhone, lengthBetween } from '../../../utils/validation';
import { money } from '../../../utils/format';
import { useLayout } from '../../../utils/layout';
import { Page, PageHeader } from '../../../components/Page';
import ActionButton from '../../../components/ActionButton';
import Icon from '../../../components/Icon';
import { BASE_URL } from '../../../utils/config';

// Same limits as Pedido::Registrar_Pedido
const MIN_BOXES = 100;
const MAX_BOXES = 300;
const MAX_COMPROBANTE = 3 * 1024 * 1024;

const METHODS = [
  { id: 'transferencia', label: 'Transferencia' },
  { id: 'pago_movil', label: 'Pago móvil' },
  { id: 'efectivo', label: 'Efectivo' },
  { id: 'credito', label: 'Crédito' },
];

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

// Cart first, then "Finalizar pedido" with the same fields as the web checkout.
export default function CartScreen({ cart, onChange, onCheckout, onShop }) {
  const [step, setStep] = useState('cart');
  const [form, setForm] = useState({
    direccion: '',
    telefono: '',
    observaciones: '',
    metodo: 'transferencia',
    referencia: '',
  });
  const [comprobante, setComprobante] = useState(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const { isPhone, contentWidth } = useLayout();

  const setField = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));
  const items = Object.values(cart);
  const total = items.reduce((sum, i) => sum + i.qty * Number(i.p.precio_venta), 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const twoColumns = !isPhone && contentWidth >= 760;
  const serverRoot = BASE_URL.replace('/api', '');
  const requiresReference = ['transferencia', 'pago_movil'].includes(form.metodo);

  const goCheckout = () => {
    setError('');
    if (count < MIN_BOXES || count > MAX_BOXES) {
      setError(`El pedido debe tener entre ${MIN_BOXES} y ${MAX_BOXES} cajas. Llevas ${count}.`);
      return;
    }
    setStep('checkout');
  };

  const pickComprobante = async () => {
    setError('');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        base64: true,
      });
      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      if (!asset.base64) {
        setError('No se pudo leer la imagen. Intenta con otra.');
        return;
      }
      if ((asset.base64.length * 3) / 4 > MAX_COMPROBANTE) {
        setError('El comprobante debe pesar menos de 3 MB.');
        return;
      }
      const mime = /^image\/(png|webp)$/i.test(asset.mimeType || '') ? asset.mimeType : 'image/jpeg';
      setComprobante({
        name: asset.fileName || `comprobante.${mime.split('/')[1]}`,
        dataUri: `data:${mime};base64,${asset.base64}`,
      });
    } catch {
      setError('No se pudo seleccionar el comprobante.');
    }
  };

  const submit = async (pagarAhora) => {
    setError('');
    if (count < MIN_BOXES || count > MAX_BOXES) {
      setError(`El pedido debe tener entre ${MIN_BOXES} y ${MAX_BOXES} cajas. Llevas ${count}.`);
      return;
    }
    if (!lengthBetween(form.direccion, 5, 200)) {
      setError('Ingresa la dirección de entrega (entre 5 y 200 caracteres).');
      return;
    }
    if (!isValidPhone(form.telefono)) {
      setError('Ingresa un teléfono válido. Ej: 0412-1234567');
      return;
    }
    if (form.observaciones.length > 250) {
      setError('Las observaciones no pueden superar los 250 caracteres.');
      return;
    }
    if (!METHODS.some((m) => m.id === form.metodo)) {
      setError('Selecciona un método de pago válido.');
      return;
    }
    if (pagarAhora && form.metodo !== 'credito' && requiresReference && !form.referencia.trim()) {
      setError('Ingresa el número de referencia para pagar ahora.');
      return;
    }

    setSending(true);
    try {
      await onCheckout({
        direccion: form.direccion.trim(),
        telefono: form.telefono.replace(/\D/g, ''),
        observaciones: form.observaciones.trim(),
        metodo: form.metodo,
        referencia: form.referencia.trim(),
        pagar_ahora: pagarAhora && form.metodo !== 'credito' ? 1 : 0,
        img_pago: pagarAhora && comprobante ? comprobante.dataUri : '',
      });
    } catch (e) {
      setError(e.message);
      setSending(false);
    }
  };

  if (!items.length) {
    return (
      <Page>
        <PageHeader icon="cart" title="Mi Carrito" crumb="Inicio  ›  Ecommerce  ›  Carrito" />
        <View style={s.empty}>
          <Icon name="cart" size={48} color={colors.muted} strokeWidth={1.5} />
          <Text style={s.emptyTitle}>Tu carrito está vacío</Text>
          <ActionButton icon="bag" size="lg" label="Ir a la tienda" onPress={onShop} />
        </View>
      </Page>
    );
  }

  if (step === 'cart') {
    return (
      <Page>
        <PageHeader icon="cart" title="Mi Carrito" crumb="Inicio  ›  Ecommerce  ›  Carrito">
          <ActionButton icon="bag" size="lg" variant="outline" label="Seguir comprando" onPress={onShop} />
        </PageHeader>

        <View style={[s.layout, twoColumns && s.layoutRow]}>
          <View style={[s.list, twoColumns && s.listWide]}>
            {items.map((i) => {
              const imageUrl = i.p.imagen ? `${serverRoot}/${i.p.imagen}` : null;
              return (
                <View key={i.p.id_producto} style={s.row}>
                  <View style={s.thumb}>
                    {imageUrl ? (
                      <Image source={{ uri: imageUrl }} style={s.thumbImage} resizeMode="cover" />
                    ) : (
                      <Text style={{ fontSize: 22 }}>🍪</Text>
                    )}
                  </View>
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
              );
            })}
          </View>

          <View style={[s.summary, twoColumns && s.summaryWide]}>
            <Text style={s.summaryTitle}>Resumen</Text>
            <View style={s.sumRow}><Text style={s.sumLabel}>Productos</Text><Text style={s.sumValue}>{items.length}</Text></View>
            <View style={s.sumRow}><Text style={s.sumLabel}>Cajas</Text><Text style={s.sumValue}>{count}</Text></View>
            <View style={s.sumRow}><Text style={s.sumLabel}>Subtotal</Text><Text style={s.sumValue}>{money(total)}</Text></View>
            <View style={[s.sumRow, s.totalRow]}><Text style={s.totalLabel}>Total</Text><Text style={s.total}>{money(total)}</Text></View>
            <Text style={s.hint}>Cada pedido debe tener entre {MIN_BOXES} y {MAX_BOXES} cajas.</Text>
            {!!error && <Text style={s.error}>{error}</Text>}
            <ActionButton size="lg" block label={`Pagar ahora ${money(total)}`} onPress={goCheckout} />
          </View>
        </View>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader icon="bag" title="Finalizar pedido" crumb="Inicio  ›  Ecommerce  ›  Carrito  ›  Finalizar pedido">
        <ActionButton icon="cart" size="lg" variant="outline" label="Volver al carrito" onPress={() => { setError(''); setStep('cart'); }} />
      </PageHeader>

      <View style={s.checkout}>
        <Text style={s.checkoutTitle}>Resumen del pedido</Text>
        <Text style={s.checkoutMeta}>{items.length} producto(s) · {count} cajas</Text>

        <Text style={s.label}>Dirección de entrega *</Text>
        <TextInput style={[s.input, s.textArea]} placeholder="Calle, número, ciudad" placeholderTextColor={colors.muted}
          value={form.direccion} onChangeText={setField('direccion')} multiline />

        <Text style={s.label}>Teléfono de contacto *</Text>
        <TextInput style={s.input} placeholder="0412-1234567" placeholderTextColor={colors.muted} keyboardType="phone-pad"
          value={form.telefono} onChangeText={setField('telefono')} />

        <Text style={s.label}>Observaciones</Text>
        <TextInput style={[s.input, s.textArea]} placeholder="Indicaciones para la entrega (opcional)" placeholderTextColor={colors.muted}
          value={form.observaciones} onChangeText={setField('observaciones')} multiline />

        <Text style={s.label}>Método de pago *</Text>
        <View style={s.chips}>
          {METHODS.map((method) => {
            const active = form.metodo === method.id;
            return (
              <TouchableOpacity key={method.id} style={[s.chip, active && s.chipActive]}
                onPress={() => setField('metodo')(method.id)}>
                {active ? <Icon name="check" size={13} color="#fff" /> : null}
                <Text style={[s.chipText, active && s.chipTextActive]}>{method.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {form.metodo !== 'credito' ? (
          <>
            <Text style={s.label}>N° de referencia{requiresReference ? ' *' : ' (opcional)'}</Text>
            <TextInput style={s.input} placeholder="Número de referencia del pago" placeholderTextColor={colors.muted}
              value={form.referencia} onChangeText={setField('referencia')} />
          </>
        ) : null}

        <Text style={s.label}>Comprobante / foto del pago (opcional)</Text>
        <View style={s.fileRow}>
          <Text style={s.fileName} numberOfLines={1}>{comprobante?.name || 'Ningún archivo seleccionado'}</Text>
          <ActionButton size="md" variant="outline" label="Seleccionar archivo" onPress={pickComprobante} />
        </View>

        <View style={[s.sumRow, s.totalRow]}><Text style={s.totalLabel}>Total</Text><Text style={s.total}>{money(total)}</Text></View>
        {!!error && <Text style={s.error}>{error}</Text>}

        <View style={s.actions}>
          <ActionButton size="lg" block variant="outline" label="Pagar después" disabled={sending}
            onPress={() => submit(false)} />
          <ActionButton size="lg" block label="Pagar ahora" disabled={sending} onPress={() => submit(true)} />
        </View>
        {sending ? <ActivityIndicator color={colors.red} style={s.spinner} /> : null}
      </View>
    </Page>
  );
}

const s = StyleSheet.create({
  qInput: { width: 48, textAlign: 'center', color: colors.text, fontWeight: '700', paddingVertical: 4, borderColor: colors.border, borderWidth: 1, borderRadius: 6 },
  hint: { color: colors.muted, fontSize: 12 },
  input: { color: colors.text, backgroundColor: colors.bg, borderColor: colors.border, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  textArea: { minHeight: 74, textAlignVertical: 'top' },
  label: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 10, marginBottom: 6 },
  error: { color: '#f87171', fontSize: 13, textAlign: 'center' },
  empty: { alignItems: 'center', gap: 14, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, paddingVertical: 40, paddingHorizontal: 20 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  layout: { gap: 16 },
  layoutRow: { flexDirection: 'row', alignItems: 'flex-start' },
  list: { gap: 10 },
  listWide: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 12 },
  thumb: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  thumbImage: { width: '100%', height: '100%' },
  info: { flex: 1 },
  name: { color: colors.text, fontWeight: '600', fontSize: 13 },
  price: { color: colors.muted, fontSize: 11, marginTop: 2 },
  qty: { flexDirection: 'row', alignItems: 'center' },
  qBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  sub: { color: '#fbbf24', fontWeight: '800', minWidth: 64, textAlign: 'right' },
  summary: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 16, gap: 10 },
  summaryWide: { width: 320 },
  summaryTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sumLabel: { color: colors.muted, fontSize: 13 },
  sumValue: { color: colors.text, fontSize: 13, fontWeight: '700' },
  totalRow: { borderTopColor: colors.border, borderTopWidth: 1, paddingTop: 10, marginTop: 6 },
  totalLabel: { color: colors.muted, fontSize: 16 },
  total: { color: colors.text, fontSize: 22, fontWeight: '800' },
  checkout: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 16 },
  checkoutTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  checkoutMeta: { color: colors.muted, fontSize: 13, marginTop: 4, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 7 },
  chipActive: { backgroundColor: colors.red, borderColor: colors.red },
  chipText: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: '#fff' },
  fileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderColor: colors.border, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  fileName: { color: colors.muted, fontSize: 12, flexShrink: 1 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  spinner: { marginTop: 10 },
});
