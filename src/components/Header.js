import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme';
import { initials } from '../ui';
import { useLayout } from '../layout';
import Icon from './Icon';

// Top bar.
//   phone: menu · logo (centered) · cart + avatar, exchange rates on a second line
//   tablet / desktop: one row like the web system (menu + logo · rates · cart · user)
export default function Header({ user, tasas, cartCount, onMenu, onCart, onUser }) {
  const { isPhone, isDesktop } = useLayout();

  const tasa = tasas.length > 0 ? (
    <View style={[s.tasa, isPhone && s.tasaPhone]}>
      <Text style={s.tasaText} numberOfLines={1}>{tasas.map((t) => `${t.nombre} ${t.valor}`).join('  |  ')}</Text>
    </View>
  ) : null;

  const logo = <Image source={require('../../assets/logo-clean.png')} style={isPhone ? s.logo : s.logoWide} resizeMode="contain" />;

  return (
    <View style={[s.wrap, isPhone ? s.wrapPhone : s.wrapWide]}>
      <View style={s.row}>
        <View style={[s.left, isPhone && s.side]}>
          <TouchableOpacity onPress={onMenu} hitSlop={10} style={s.iconBtn} accessibilityLabel="Menú">
            <Icon name="menu" size={22} color={colors.text} />
          </TouchableOpacity>
          {!isPhone && logo}
        </View>

        {isPhone && logo}

        <View style={[s.right, isPhone && s.side]}>
          {!isPhone && tasa}
          <TouchableOpacity onPress={onCart} style={s.iconBtn} accessibilityLabel="Carrito">
            <Icon name="cart" size={20} color={colors.text} />
            {cartCount > 0 && <View style={s.badge}><Text style={s.badgeText}>{cartCount}</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity onPress={onUser} style={s.user} accessibilityLabel="Menú de usuario">
            <View style={s.avatar}><Text style={s.avatarText}>{initials(user?.nombre_usuario)}</Text></View>
            {isDesktop && (
              <View style={s.userText}>
                <Text style={s.userName} numberOfLines={1}>@{user?.nombre_usuario}</Text>
                <Text style={s.userMail} numberOfLines={1}>{user?.email_usuario}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {isPhone && tasa}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { backgroundColor: '#000', borderBottomColor: colors.border, borderBottomWidth: 1 },
  wrapPhone: { paddingTop: Platform.OS === 'web' ? 10 : 36, paddingBottom: 10, paddingHorizontal: 12 },
  wrapWide: { paddingHorizontal: 20, paddingVertical: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  side: { flex: 1 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  right: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 12 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 62, height: 36 },
  logoWide: { width: 70, height: 40 },
  badge: { position: 'absolute', top: 0, right: -2, backgroundColor: colors.red, borderRadius: 9, minWidth: 18, height: 18, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  user: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  userText: { maxWidth: 180 },
  userName: { color: colors.text, fontWeight: '700', fontSize: 13 },
  userMail: { color: colors.muted, fontSize: 11 },
  tasa: { borderColor: colors.green, borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4, flexShrink: 1 },
  tasaPhone: { alignSelf: 'center', marginTop: 8, paddingVertical: 3 },
  tasaText: { color: colors.text, fontSize: 11, fontWeight: '600' },
});
