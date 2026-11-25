import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  ScrollView,
  Animated,
  Easing,
  Image,
  useWindowDimensions,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { signup, resetPassword } from '../services/authApi';
import { LANDING_URL } from '../../../utils/config';
import { colors } from '../../../utils/theme';
import {
  digitsOnly,
  inList,
  isEmail,
  isPassword,
  isPhone,
  isRif,
  isUsername,
  lengthBetween,
} from '../../../utils/validation';
import LoginIllustration from '../components/LoginIllustration';

// Tres vistas: login | signup | reset. En pantallas anchas ilustración y formulario se intercambian.
const MODES = {
  login: {
    side: 0,
    title: 'Inicio de Sesión',
    sub: 'Ingresa tus credenciales para continuar',
    cta: 'Ingresar',
    caption: 'Gestiona tu negocio de galletas desde cualquier lugar',
  },
  signup: {
    side: 1,
    title: 'Crear Cuenta',
    sub: 'Regístrate para empezar a pedir',
    cta: 'Registrarme',
    caption: 'Únete a Natys y haz tus pedidos en minutos',
  },
  reset: {
    side: 1,
    title: 'Recuperar Contraseña',
    sub: 'Te enviaremos un enlace a tu correo',
    cta: 'Enviar enlace',
    caption: 'Recupera el acceso a tu cuenta de forma segura',
  },
};

const DEFAULT_VALUES = {
  username: '',
  email: '',
  password: '',
  confirm: '',
  tipo_id: 'V',
  rif: '',
  nombre: '',
  tlf: '',
  direccion: '',
  sector: '',
};

// Mismas reglas que el backend (models/Autenticator.php), ahora como reglas de RHF.
const SIGNUP_RULES = {
  username: {
    required: 'Ingresa un nombre de usuario.',
    validate: (v) =>
      isUsername(v) || 'El usuario debe tener de 5 a 20 caracteres: letras, números, @ o _.',
  },
  email: {
    required: 'Ingresa tu correo.',
    validate: (v) => isEmail(v) || 'Ingresa un correo electrónico válido.',
  },
  password: {
    required: 'Ingresa tu contraseña.',
    validate: (v) =>
      isPassword(v) ||
      'La contraseña debe tener de 6 a 11 caracteres, una mayúscula y un punto. Ej: Natys12.',
  },
  confirm: {
    required: 'Confirma tu contraseña.',
    validate: (v, values) => v === values.password || 'Las contraseñas no coinciden.',
  },
  tipo_id: {
    validate: (v) => inList(v, ['V', 'J', 'G', 'E']) || 'Selecciona un tipo de documento válido.',
  },
  rif: {
    required: 'Ingresa tu cédula o RIF.',
    validate: (v) => isRif(v) || 'La cédula o RIF solo debe tener números.',
  },
  nombre: {
    required: 'Ingresa tu nombre.',
    validate: (v) => lengthBetween(v, 2, 100) || 'El nombre debe tener entre 2 y 100 caracteres.',
  },
  tlf: {
    required: 'Ingresa tu teléfono.',
    validate: (v) => isPhone(v) || 'Ingresa un teléfono válido de 11 dígitos (ej: 04163213495).',
  },
  direccion: {
    required: 'Ingresa tu dirección.',
    validate: (v) => lengthBetween(v, 5, 200) || 'La dirección debe tener entre 5 y 200 caracteres.',
  },
  sector: {
    validate: (v) =>
      inList(v, ['Norte', 'Sur', 'Este', 'Oeste']) || 'Selecciona un sector válido.',
  },
};

function Field({ icon, right, error, ...props }) {
  return (
    <View style={s.fieldWrap}>
      <View style={s.field}>
        <Text style={s.icon}>{icon}</Text>
        <TextInput
          style={s.input}
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          {...props}
        />
        {right}
      </View>
      {!!error && <Text style={s.fieldError}>{error}</Text>}
    </View>
  );
}

function Choice({ options, value, onChange, error }) {
  return (
    <View>
      <View style={s.choices}>
        {options.map((o) => (
          <TouchableOpacity
            key={o}
            onPress={() => onChange(o)}
            style={[s.choice, value === o && s.choiceOn]}
          >
            <Text style={[s.choiceText, value === o && s.choiceTextOn]}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {!!error && <Text style={s.fieldErrorChoice}>{error}</Text>}
    </View>
  );
}

export default function LoginScreen({ notice = '', onLogin, onClearNotice = () => {} }) {
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const [mode, setMode] = useState('login');
  const [show, setShow] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [localInfo, setLocalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [panelW, setPanelW] = useState(0);
  const info = notice || localInfo;

  const { control, handleSubmit, reset } = useForm({
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    shouldUnregister: true,
  });

  const [slide] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(1));

  const rulesFor = (name) => {
    if (mode === 'login') {
      if (name === 'username') return { required: 'Ingresa tu usuario.' };
      if (name === 'password') return { required: 'Ingresa tu contraseña.' };
      return {};
    }
    if (mode === 'reset') return name === 'email' ? SIGNUP_RULES.email : {};
    return SIGNUP_RULES[name] || {};
  };

  const go = (next) => {
    if (next === mode) return;
    setGlobalError('');
    setLocalInfo('');
    reset(DEFAULT_VALUES);

    Animated.timing(fade, { toValue: 0, duration: 140, useNativeDriver: true }).start(() => {
      setMode(next);
      Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: true }).start();
    });
    Animated.timing(slide, {
      toValue: MODES[next].side,
      duration: 520,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const onSubmit = async (values) => {
    setGlobalError('');
    setLocalInfo('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await onLogin(values.username.trim(), values.password);
      } else if (mode === 'signup') {
        const { confirm, ...data } = values;
        const r = await signup({
          ...data,
          username: values.username.trim(),
          email: values.email.trim(),
          rif: values.rif.trim(),
          nombre: values.nombre.trim(),
          tlf: digitsOnly(values.tlf),
          direccion: values.direccion.trim(),
        });
        go('login'); // go() limpia mensajes: el éxito se coloca después.
        onClearNotice();
        setLocalInfo(r.message);
      } else {
        const r = await resetPassword(values.email.trim());
        onClearNotice();
        setLocalInfo(r.message);
      }
    } catch (e) {
      setGlobalError(e.message || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const submitForm = () => handleSubmit(onSubmit)();

  const m = MODES[mode];

  const formView = (
    <Animated.View style={{ opacity: fade }}>
      <Image source={require('../../../../assets/logo-clean.png')} style={s.logo} resizeMode="contain" />
      <Text style={s.title}>{m.title}</Text>
      <Text style={s.sub}>{m.sub}</Text>

      {mode !== 'reset' && (
        <Controller
          name="username"
          control={control}
          rules={rulesFor('username')}
          render={({ field, fieldState }) => (
            <Field
              icon="👤"
              placeholder="Nombre de usuario"
              {...field}
              error={fieldState.error?.message}
              onSubmitEditing={mode === 'login' ? submitForm : undefined}
            />
          )}
        />
      )}

      {mode !== 'login' && (
        <Controller
          name="email"
          control={control}
          rules={rulesFor('email')}
          render={({ field, fieldState }) => (
            <Field
              icon="✉"
              placeholder="Correo electrónico"
              keyboardType="email-address"
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />
      )}

      {mode !== 'reset' && (
        <Controller
          name="password"
          control={control}
          rules={rulesFor('password')}
          render={({ field, fieldState }) => (
            <Field
              icon="🔒"
              placeholder="Contraseña"
              secureTextEntry={!show}
              {...field}
              error={fieldState.error?.message}
              onSubmitEditing={mode === 'login' ? submitForm : undefined}
              right={
                <TouchableOpacity onPress={() => setShow(!show)}>
                  <Text style={s.toggle}>{show ? 'Ocultar' : 'Ver'}</Text>
                </TouchableOpacity>
              }
            />
          )}
        />
      )}

      {mode === 'signup' && (
        <>
          <Controller
            name="confirm"
            control={control}
            rules={rulesFor('confirm')}
            render={({ field, fieldState }) => (
              <Field
                icon="🔒"
                placeholder="Confirmar contraseña"
                secureTextEntry={!show}
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
          <Text style={s.groupLabel}>Datos del cliente</Text>
          <Controller
            name="tipo_id"
            control={control}
            rules={rulesFor('tipo_id')}
            render={({ field, fieldState }) => (
              <Choice
                options={['V', 'J', 'G', 'E']}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="rif"
            control={control}
            rules={rulesFor('rif')}
            render={({ field, fieldState }) => (
              <Field
                icon="🪪"
                placeholder="Cédula o RIF (solo números)"
                keyboardType="number-pad"
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="nombre"
            control={control}
            rules={rulesFor('nombre')}
            render={({ field, fieldState }) => (
              <Field
                icon="🏪"
                placeholder="Nombre o razón social"
                autoCapitalize="words"
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="tlf"
            control={control}
            rules={rulesFor('tlf')}
            render={({ field, fieldState }) => (
              <Field
                icon="📞"
                placeholder="Teléfono"
                keyboardType="phone-pad"
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="direccion"
            control={control}
            rules={rulesFor('direccion')}
            render={({ field, fieldState }) => (
              <Field
                icon="📍"
                placeholder="Dirección"
                autoCapitalize="sentences"
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
          <Text style={s.groupLabel}>Sector</Text>
          <Controller
            name="sector"
            control={control}
            rules={rulesFor('sector')}
            render={({ field, fieldState }) => (
              <Choice
                options={['Norte', 'Sur', 'Este', 'Oeste']}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </>
      )}

      {mode === 'login' && (
        <TouchableOpacity onPress={() => go('reset')} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
          <Text style={s.link}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      )}

      {!!globalError && <Text style={s.error}>{globalError}</Text>}
      {!!info && <Text style={s.info}>{info}</Text>}

      <TouchableOpacity style={s.btn} onPress={submitForm} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>{m.cta}</Text>}
      </TouchableOpacity>

      <View style={s.switchRow}>
        {mode === 'login' ? (
          <Text style={s.muted}>
            ¿No tienes cuenta? <Text style={s.link} onPress={() => go('signup')}>Regístrate</Text>
          </Text>
        ) : (
          <Text style={s.muted}>
            ¿Ya tienes cuenta? <Text style={s.link} onPress={() => go('login')}>Inicia sesión</Text>
          </Text>
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
          <Animated.View
            style={[s.panel, s.art, { left: 0, transform: [{ translateX: Animated.multiply(slide, panelW) }] }]}
          >
            {art}
          </Animated.View>
          <Animated.View
            style={[s.panel, { left: panelW, transform: [{ translateX: Animated.multiply(slide, -panelW) }] }]}
          >
            <ScrollView contentContainerStyle={s.formWide} showsVerticalScrollIndicator={false}>
              {formView}
            </ScrollView>
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
  fieldWrap: { marginBottom: 2 },
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
  fieldError: { color: '#f87171', fontSize: 11, marginTop: -8, marginBottom: 6 },
  fieldErrorChoice: { color: '#f87171', fontSize: 11, marginTop: -8, marginBottom: 6 },
  error: { color: '#f87171', marginBottom: 10, textAlign: 'center', fontSize: 13 },
  info: { color: '#4ade80', marginBottom: 10, textAlign: 'center', fontSize: 13 },
  btn: { backgroundColor: colors.red, borderRadius: 12, padding: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  switchRow: { alignItems: 'center', marginVertical: 14 },
  btnOutline: { borderColor: colors.red, borderWidth: 1.5, borderRadius: 12, padding: 12, alignItems: 'center' },
  btnOutlineText: { color: colors.red, fontWeight: '800' },
});
