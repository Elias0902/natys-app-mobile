import { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Linking, ScrollView, Animated, Easing, Image, useWindowDimensions } from 'react-native';
import { login, signup, resetPassword } from '../services/authApi';
import { LANDING_URL } from '../../../utils/config';
import { colors } from '../../../utils/theme';
import LoginIllustration from '../components/LoginIllustration';

// Three views: login | signup | reset. On wide screens the illustration and the form swap sides.
const MODES = {
  login: { side: 0, title: 'Inicio de Sesión', sub: 'Ingresa tus credenciales para continuar', cta: 'Ingresar',
    caption: 'Gestiona tu negocio de galletas desde cualquier lugar' },
  signup: { side: 1, title: 'Crear Cuenta', sub: 'Regístrate para empezar a pedir', cta: 'Registrarme',
    caption: 'Únete a Natys y haz tus pedidos en minutos' },
  reset: { side: 1, title: 'Recuperar Contraseña', sub: 'Te enviaremos un enlace a tu correo', cta: 'Enviar enlace',
    caption: 'Recupera el acceso a tu cuenta de forma segura' },
};

function Field({ icon, right, ...props }) {
  return (
    <View style={s.field}>
      <Text style={s.icon}>{icon}</Text>
      <TextInput style={s.input} placeholderTextColor={colors.muted} autoCapitalize="none" {...props} />
      {right}
    </View>
  );
}

function Choice({ options, value, onChange }) {
  return (
    <View style={s.choices}>
      {options.map((o) => (
        <TouchableOpacity key={o} onPress={() => onChange(o)} style={[s.choice, value === o && s.choiceOn]}>
          <Text style={[s.choiceText, value === o && s.choiceTextOn]}>{o}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Same rules as the backend (models/Autenticator.php)
function signupError(f) {
  if (!f.username || !f.email || !f.password || !f.rif || !f.nombre || !f.tlf || !f.direccion || !f.sector) return 'Todos los campos son obligatorios.';
  if (!/^[a-zA-Z0-9@_]{5,20}$/.test(f.username.trim())) return 'El usuario debe tener de 5 a 20 caracteres: letras, números, @ o _.';
  if (!/^(?=.*[A-Z])(?=.*\.)[a-zA-Z0-9.]{6,11}$/.test(f.password)) return 'La contraseña debe tener de 6 a 11 caracteres, una mayúscula y un punto. Ej: Natys12.';
  if (f.password !== f.confirm) return 'Las contraseñas no coinciden.';
  if (!/^\d+$/.test(f.rif.trim())) return 'La cédula o RIF solo debe tener números.';
  return '';
}

export default function LoginScreen({ notice = '', onLogin }) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '', tipo_id: 'V', rif: '', nombre: '', tlf: '', direccion: '', sector: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState(notice);
  const [loading, setLoading] = useState(false);
  const [panelW, setPanelW] = useState(0);

  const slide = useRef(new Animated.Value(0)).current; // 0 = illustration left, 1 = illustration right
  const fade = useRef(new Animated.Value(1)).current;

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const go = (next) => {
    if (next === mode) return;
    setError('');
    setInfo('');
    Animated.timing(fade, { toValue: 0, duration: 140, useNativeDriver: true }).start(() => {
      setMode(next);
      Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: true }).start();
    });
    Animated.timing(slide, { toValue: MODES[next].side, duration: 520, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }).start();
  };

  const submit = async () => {
    setError('');
    setInfo('');
    try {
      if (mode === 'login') {
        if (!form.username || !form.password) return setError('Todos los campos son obligatorios.');
        setLoading(true);
        onLogin(await login(form.username.trim(), form.password));
      } else if (mode === 'signup') {
        const invalid = signupError(form);
        if (invalid) return setError(invalid);
        setLoading(true);
        const { confirm, ...data } = form;
        const r = await signup({ ...data, username: form.username.trim(), email: form.email.trim(), rif: form.rif.trim(), nombre: form.nombre.trim(), tlf: form.tlf.trim(), direccion: form.direccion.trim() });
        go('login'); // go() clears the messages, so the success text goes after it
        setInfo(r.message);
      } else {
        if (!form.email) return setError('Ingresa tu correo.');
        setLoading(true);
        const r = await resetPassword(form.email.trim());
        setInfo(r.message);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const m = MODES[mode];

  const formView = (
    <Animated.View style={{ opacity: fade }}>
      <Image source={require('../../../../assets/logo-clean.png')} style={s.logo} resizeMode="contain" />
      <Text style={s.title}>{m.title}</Text>
      <Text style={s.sub}>{m.sub}</Text>

      {mode !== 'reset' && <Field icon="👤" placeholder="Nombre de usuario" value={form.username} onChangeText={set('username')} />}
      {mode !== 'login' && <Field icon="✉" placeholder="Correo electrónico" keyboardType="email-address" value={form.email} onChangeText={set('email')} />}
      {mode !== 'reset' && (
        <Field icon="🔒" placeholder="Contraseña" secureTextEntry={!show} value={form.password} onChangeText={set('password')}
          onSubmitEditing={mode === 'login' ? submit : undefined}
          right={<TouchableOpacity onPress={() => setShow(!show)}><Text style={s.toggle}>{show ? 'Ocultar' : 'Ver'}</Text></TouchableOpacity>} />
      )}
      {mode === 'signup' && (
        <>
          <Field icon="🔒" placeholder="Confirmar contraseña" secureTextEntry={!show} value={form.confirm} onChangeText={set('confirm')} />
          <Text style={s.groupLabel}>Datos del cliente</Text>
          <Choice options={['V', 'J', 'G', 'E']} value={form.tipo_id} onChange={set('tipo_id')} />
          <Field icon="🪪" placeholder="Cédula o RIF (solo números)" keyboardType="number-pad" value={form.rif} onChangeText={set('rif')} />
          <Field icon="🏪" placeholder="Nombre o razón social" autoCapitalize="words" value={form.nombre} onChangeText={set('nombre')} />
          <Field icon="📞" placeholder="Teléfono" keyboardType="phone-pad" value={form.tlf} onChangeText={set('tlf')} />
          <Field icon="📍" placeholder="Dirección" autoCapitalize="sentences" value={form.direccion} onChangeText={set('direccion')} />
          <Text style={s.groupLabel}>Sector</Text>
          <Choice options={['Norte', 'Sur', 'Este', 'Oeste']} value={form.sector} onChange={set('sector')} />
        </>
      )}

      {mode === 'login' && (
        <TouchableOpacity onPress={() => go('reset')} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
          <Text style={s.link}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      )}

      {!!error && <Text style={s.error}>{error}</Text>}
      {!!info && <Text style={s.info}>{info}</Text>}

      <TouchableOpacity style={s.btn} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>{m.cta}</Text>}
      </TouchableOpacity>

      <View style={s.switchRow}>
        {mode === 'login' ? (
          <Text style={s.muted}>¿No tienes cuenta? <Text style={s.link} onPress={() => go('signup')}>Regístrate</Text></Text>
        ) : (
          <Text style={s.muted}>¿Ya tienes cuenta? <Text style={s.link} onPress={() => go('login')}>Inicia sesión</Text></Text>
        )}
      </View>

      <TouchableOpacity style={s.btnOutline} onPress={() => Linking.openURL(LANDING_URL)}>
        <Text style={s.btnOutlineText}>Ir a la landing  →</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const art = (
    <View style={s.artInner}>
      <LoginIllustration size={wide ? 320 : 170} />
      {wide && <Animated.Text style={[s.caption, { opacity: fade }]}>{m.caption}</Animated.Text>}
    </View>
  );

  return (
    <ScrollView style={s.page} contentContainerStyle={s.pageInner} keyboardShouldPersistTaps="handled">
      <View style={[s.blob, { top: -80, right: -60 }]} />
      <View style={[s.blob, { bottom: -100, left: -80, width: 260, height: 260 }]} />

      {wide ? (
        <View style={s.cardWide} onLayout={(e) => setPanelW(e.nativeEvent.layout.width / 2)}>
          {/* Both panels are half the card and slide past each other */}
          <Animated.View style={[s.panel, s.art, { left: 0, transform: [{ translateX: Animated.multiply(slide, panelW) }] }]}>{art}</Animated.View>
          <Animated.View style={[s.panel, { left: panelW, transform: [{ translateX: Animated.multiply(slide, -panelW) }] }]}>
            <ScrollView contentContainerStyle={s.formWide} showsVerticalScrollIndicator={false}>{formView}</ScrollView>
          </Animated.View>
        </View>
      ) : (
        <View style={s.card}>
          <View style={[s.art, { paddingVertical: 10 }]}>{art}</View>
          <View style={s.formNarrow}>{formView}</View>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#12070b' },
  pageInner: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  blob: { position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: '#7f1d1d', opacity: 0.45 },
  card: { width: '100%', maxWidth: 420, backgroundColor: colors.card, borderRadius: 24, overflow: 'hidden', borderColor: colors.border, borderWidth: 1 },
  cardWide: { width: '100%', maxWidth: 900, height: 600, backgroundColor: colors.card, borderRadius: 24, overflow: 'hidden', borderColor: colors.border, borderWidth: 1 },
  panel: { position: 'absolute', top: 0, bottom: 0, width: '50%' },
  art: { backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  artInner: { alignItems: 'center', justifyContent: 'center' },
  caption: { color: '#fff', fontWeight: '700', fontSize: 16, textAlign: 'center', marginTop: 8, maxWidth: 280 },
  formWide: { flexGrow: 1, justifyContent: 'center', padding: 40 },
  formNarrow: { padding: 22 },
  logo: { width: 140, height: 82, alignSelf: 'center', marginBottom: 10 },
  title: { color: colors.text, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  sub: { color: colors.muted, fontSize: 12, textAlign: 'center', marginBottom: 20 },
  field: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, borderColor: colors.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, marginBottom: 12 },
  icon: { fontSize: 15, marginRight: 8 },
  input: { flex: 1, color: colors.text, paddingVertical: 13, outlineStyle: 'none' },
  toggle: { color: colors.red, fontWeight: '700', fontSize: 12 },
  groupLabel: { color: colors.muted, fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: 2 },
  choices: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  choice: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bg },
  choiceOn: { backgroundColor: colors.red, borderColor: colors.red },
  choiceText: { color: colors.text, fontWeight: '700', fontSize: 12 },
  choiceTextOn: { color: '#fff' },
  link: { color: colors.red, fontWeight: '700', fontSize: 12 },
  muted: { color: colors.muted, fontSize: 12 },
  error: { color: '#f87171', marginBottom: 10, textAlign: 'center', fontSize: 13 },
  info: { color: '#4ade80', marginBottom: 10, textAlign: 'center', fontSize: 13 },
  btn: { backgroundColor: colors.red, borderRadius: 12, padding: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  switchRow: { alignItems: 'center', marginVertical: 14 },
  btnOutline: { borderColor: colors.red, borderWidth: 1.5, borderRadius: 12, padding: 12, alignItems: 'center' },
  btnOutlineText: { color: colors.red, fontWeight: '800' },
});
