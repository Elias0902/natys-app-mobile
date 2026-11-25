import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../../utils/theme';
import { isPhone as isValidPhone, lengthBetween } from '../../../utils/validation';
import { money } from '../../../utils/format';
import { useLayout } from '../../../utils/layout';
import { Page, PageHeader } from '../../../components/Page';
import ActionButton from '../../../components/ActionButton';
import Icon from '../../../components/Icon';
import { BASE_URL } from '../../../utils/config';
import {
  changeQty,
  checkoutOrder,
  selectCart,
  selectCartTotal,
} from '../../../store/cartSlice';

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

const DEFAULT_VALUES = {
  direccion: '',
  telefono: '',
  observaciones: '',
  metodo: 'transferencia',
  referencia: '',
  comprobante: null,
};

const RULES = {
  direccion: {
    validate: (v) =>
      lengthBetween(v, 5, 200) || 'Ingresa la dirección de entrega (entre 5 y 200 caracteres).',
  },
  telefono: {
    validate: (v) => isValidPhone(v) || 'Ingresa un teléfono válido. Ej: 0412-1234567',
  },
  observaciones: {
    validate: (v) => String(v ?? '').length <= 250 || 'Las observaciones no pueden superar los 250 caracteres.',
  },
  metodo: {
    validate: (v) => METHODS.some((m) => m.id === v) || 'Selecciona un método de pago válido.',
  },
};

// Orders need at least 100 boxes, so the quantity can be typed. Applied when leaving the field.
function QtyInput({ qty, onSet }) {
  const [text, setText] = useState(String(qty));
  const commit = () => {
    const n = parseInt(text, 10);
    if (n > 0 && n !== qty) onSet(n);
    else setText(String(qty));
  };
  return (
    <TextInput
      style={s.qInput}
      value={text}
      onChangeText={setText}
      onBlur={commit}
      onSubmitEditing={commit}
      keyboardType="number-pad"
      selectTextOnFocus
      accessibilityLabel="Cantidad"
    />
  );
}

// Cart first, then "Finalizar pedido" with the same fields as the web checkout.
export default function CartScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cart = useSelector(selectCart);
  const total = useSelector(selectCartTotal);

  const [step, setStep] = useState('cart');
  const [sending, setSending] = useState(false);
  const { isPhone, contentWidth } = useLayout();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
  });

  const metodo = useWatch({ control, name: 'metodo' });
  const comprobante = useWatch({ control, name: 'comprobante' });
  const items = Object.values(cart);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const twoColumns = !isPhone && contentWidth >= 760;
  const serverRoot = BASE_URL.replace('/api', '');
  const requiresReference = ['transferencia', 'pago_movil'].includes(metodo);

  const change = (p, d) => dispatch(changeQty({ product: p, delta: d }));

  const goCheckout = () => {
    clearErrors();
    if (count < MIN_BOXES || count > MAX_BOXES) {
      setError('root', {
        message: `El pedido debe tener entre ${MIN_BOXES} y ${MAX_BOXES} cajas. Llevas ${count}.`,
      });
      return;
    }
    setStep('checkout');
  };

  const pickComprobante = async () => {
    clearErrors('root');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        base64: true,
      });
      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      if (!asset.base64) {
        setError('root', { message: 'No se pudo leer la imagen. Intenta con otra.' });
        return;
      }
      if ((asset.base64.length * 3) / 4 > MAX_COMPROBANTE) {
        setError('root', { message: 'El comprobante debe pesar menos de 3 MB.' });
        return;
      }
      const mime = /^image\/(png|webp)$/i.test(asset.mimeType || '') ? asset.mimeType : 'image/jpeg';
      setValue('comprobante', {
        name: asset.fileName || `comprobante.${mime.split('/')[1]}`,
        dataUri: `data:${mime};base64,${asset.base64}`,
      });
    } catch {
      setError('root', { message: 'No se pudo seleccionar el comprobante.' });
    }
  };

  const submit = async (values, pagarAhora) => {
    clearErrors('root');

    if (count < MIN_BOXES || count > MAX_BOXES) {
      setError('root', {
        message: `El pedido debe tener entre ${MIN_BOXES} y ${MAX_BOXES} cajas. Llevas ${count}.`,
      });
      return;
    }
    if (
      pagarAhora &&
      values.metodo !== 'credito' &&
      ['transferencia', 'pago_movil'].includes(values.metodo) &&
      !String(values.referencia || '').trim()
    ) {
      setError('referencia', { message: 'Ingresa el número de referencia para pagar ahora.' });
      return;
    }

    setSending(true);
    try {
      const r = await dispatch(
        checkoutOrder({
          direccion: values.direccion.trim(),
          telefono: values.telefono.replace(/\D/g, ''),
          observaciones: String(values.observaciones || '').trim(),
          metodo: values.metodo,
          referencia: String(values.referencia || '').trim(),
          pagar_ahora: pagarAhora && values.metodo !== 'credito' ? 1 : 0,
          img_pago: pagarAhora && values.comprobante ? values.comprobante.dataUri : '',
        }),
      ).unwrap();

      const folio = r?.pedido_id ? `\nN° de pedido: ${r.pedido_id}` : '';
      Alert.alert('Pedido registrado', `${r?.msj || r?.message || 'Tu pedido fue registrado.'}${folio}`);
      reset(DEFAULT_VALUES);
      navigation.navigate('ecommerce');
    } catch (e) {
      const message = typeof e === 'string' ? e : e?.message;
      setError('root', { message: message || 'No se pudo registrar el pedido.' });
    } finally {
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
          <ActionButton icon="bag" size="lg" label="Ir a la tienda" onPress={() => navigation.navigate('ecommerce')} />
        </View>
      </Page>
    );
  }

  if (step === 'cart') {
    return (
      <Page>
        <PageHeader icon="cart" title="Mi Carrito" crumb="Inicio  ›  Ecommerce  ›  Carrito">
          <ActionButton
            icon="bag"
            size="lg"
            variant="outline"
            label="Seguir comprando"
            onPress={() => navigation.navigate('ecommerce')}
          />
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
                    <TouchableOpacity style={s.qBtn} onPress={() => change(i.p, -1)} accessibilityLabel="Quitar uno">
                      <Icon name="minus" size={14} color={colors.text} />
                    </TouchableOpacity>
                    <QtyInput key={i.qty} qty={i.qty} onSet={(n) => change(i.p, n - i.qty)} />
                    <TouchableOpacity style={s.qBtn} onPress={() => change(i.p, 1)} accessibilityLabel="Agregar uno">
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
            {!!errors.root?.message && <Text style={s.error}>{errors.root.message}</Text>}
            <ActionButton size="lg" block label={`Pagar ahora ${money(total)}`} onPress={goCheckout} />
          </View>
        </View>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader icon="bag" title="Finalizar pedido" crumb="Inicio  ›  Ecommerce  ›  Carrito  ›  Finalizar pedido">
        <ActionButton
          icon="cart"
          size="lg"
          variant="outline"
          label="Volver al carrito"
          onPress={() => {
            clearErrors();
            setStep('cart');
          }}
        />
      </PageHeader>

      <View style={s.checkout}>
        <Text style={s.checkoutTitle}>Resumen del pedido</Text>
        <Text style={s.checkoutMeta}>{items.length} producto(s) · {count} cajas</Text>

        <Text style={s.label}>Dirección de entrega *</Text>
        <Controller
          name="direccion"
          control={control}
          rules={RULES.direccion}
          render={({ field, fieldState }) => (
            <>
              <TextInput
                style={[s.input, s.textArea, !!fieldState.error && s.inputError]}
                placeholder="Calle, número, ciudad"
                placeholderTextColor={colors.muted}
                {...field}
                multiline
              />
              {!!fieldState.error && <Text style={s.fieldError}>{fieldState.error.message}</Text>}
            </>
          )}
        />

        <Text style={s.label}>Teléfono de contacto *</Text>
        <Controller
          name="telefono"
          control={control}
          rules={RULES.telefono}
          render={({ field, fieldState }) => (
            <>
              <TextInput
                style={[s.input, !!fieldState.error && s.inputError]}
                placeholder="0412-1234567"
                placeholderTextColor={colors.muted}
                keyboardType="phone-pad"
                {...field}
              />
              {!!fieldState.error && <Text style={s.fieldError}>{fieldState.error.message}</Text>}
            </>
          )}
        />

        <Text style={s.label}>Observaciones</Text>
        <Controller
          name="observaciones"
          control={control}
          rules={RULES.observaciones}
          render={({ field, fieldState }) => (
            <>
              <TextInput
                style={[s.input, s.textArea, !!fieldState.error && s.inputError]}
                placeholder="Indicaciones para la entrega (opcional)"
                placeholderTextColor={colors.muted}
                {...field}
                multiline
              />
              {!!fieldState.error && <Text style={s.fieldError}>{fieldState.error.message}</Text>}
            </>
          )}
        />

        <Text style={s.label}>Método de pago *</Text>
        <Controller
          name="metodo"
          control={control}
          rules={RULES.metodo}
          render={({ field, fieldState }) => (
            <>
              <View style={s.chips}>
                {METHODS.map((method) => {
                  const active = field.value === method.id;
                  return (
                    <TouchableOpacity
                      key={method.id}
                      style={[s.chip, active && s.chipActive]}
                      onPress={() => field.onChange(method.id)}
                    >
                      {active ? <Icon name="check" size={13} color="#fff" /> : null}
                      <Text style={[s.chipText, active && s.chipTextActive]}>{method.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {!!fieldState.error && <Text style={s.fieldError}>{fieldState.error.message}</Text>}
            </>
          )}
        />

        {metodo !== 'credito' ? (
          <>
            <Text style={s.label}>N° de referencia{requiresReference ? ' *' : ' (opcional)'}</Text>
            <Controller
              name="referencia"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    style={[s.input, !!fieldState.error && s.inputError]}
                    placeholder="Número de referencia del pago"
                    placeholderTextColor={colors.muted}
                    {...field}
                  />
                  {!!fieldState.error && <Text style={s.fieldError}>{fieldState.error.message}</Text>}
                </>
              )}
            />
          </>
        ) : null}

        <Text style={s.label}>Comprobante / foto del pago (opcional)</Text>
        <View style={s.fileRow}>
          <Text style={s.fileName} numberOfLines={1}>{comprobante?.name || 'Ningún archivo seleccionado'}</Text>
          <ActionButton size="md" variant="outline" label="Seleccionar archivo" onPress={pickComprobante} />
        </View>

        <View style={[s.sumRow, s.totalRow]}><Text style={s.totalLabel}>Total</Text><Text style={s.total}>{money(total)}</Text></View>
        {!!errors.root?.message && <Text style={s.error}>{errors.root.message}</Text>}

        <View style={s.actions}>
          <ActionButton
            size="lg"
            block
            variant="outline"
            label="Pagar después"
            disabled={sending}
            onPress={handleSubmit((values) => submit(values, false))}
          />
          <ActionButton
            size="lg"
            block
            label="Pagar ahora"
            disabled={sending}
            onPress={handleSubmit((values) => submit(values, true))}
          />
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
  inputError: { borderColor: '#f87171' },
  textArea: { minHeight: 74, textAlignVertical: 'top' },
  label: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 10, marginBottom: 6 },
  fieldError: { color: '#f87171', fontSize: 11, marginTop: 4 },
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
