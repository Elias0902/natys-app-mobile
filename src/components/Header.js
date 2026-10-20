import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { initials } from '../ui';

export default function Header({ user, tasas, cartCount, onMenu, onCart, onUser }) {
  return (
    <View style={s.wrap}>
     <View style={s.inner}>
      <View style={s.row}>
        <TouchableOpacity onPress={onMenu} hitSlop={10}><Text style={s.burger}>☰</Text></TouchableOpacity>
        <Image source={require('../../assets/logo.png')} style={s.logo} resizeMode="contain" />
        <View style={s.right}>
          <TouchableOpacity onPress={onCart} style={s.cart}>
            <Text style={s.cartIcon}>🛒</Text>
            {cartCount > 0 && <View style={s.badge}><Text style={s.badgeText}>{cartCount}</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity onPress={onUser} style={s.avatar}><Text style={s.avatarText}>{initials(user?.nombre_usuario)}</Text></TouchableOpacity>
        </View>
      </View>
      {tasas.length > 0 && (
        <View style={s.tasa}>
          <Text style={s.tasaText}>{tasas.map((t) => `${t.nombre} ${t.valor}`).join('  |  ')}</Text>
        </View>
      )}
     </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { backgroundColor: '#000', paddingTop: 36, paddingBottom: 10, paddingHorizontal: 14 },
  inner: { width: '100%', maxWidth: 1000, alignSelf: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  burger: { color: colors.text, fontSize: 24 },
  logo: { width: 64, height: 36 },
  right: { flexDirection: 'row', alignItems: 'center' },
  cart: { marginRight: 14 },
  cartIcon: { fontSize: 20 },
  badge: { position: 'absolute', top: -6, right: -8, backgroundColor: colors.red, borderRadius: 9, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  tasa: { alignSelf: 'center', marginTop: 8, borderColor: colors.green, borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 3 },
  tasaText: { color: colors.text, fontSize: 11, fontWeight: '600' },
});
