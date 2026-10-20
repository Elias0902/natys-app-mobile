import { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import EcommerceScreen from './src/screens/EcommerceScreen';
import CartScreen from './src/screens/CartScreen';
import ListScreen from './src/screens/ListScreen';
import InfoScreen from './src/screens/InfoScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserMenu from './src/components/UserMenu';
import Drawer from './src/components/Drawer';
import Header from './src/components/Header';
import { FLAT } from './src/menu';
import { getList } from './src/api';
import { colors } from './src/theme';

const CART = { key: 'carrito', label: 'Carrito' };
const byKey = (k) => FLAT.find((i) => i.key === k);

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState(byKey('dashboard'));
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState({});
  const [tasas, setTasas] = useState([]);
  const [userMenu, setUserMenu] = useState(false);
  const [lastAccess, setLastAccess] = useState('');

  useEffect(() => {
    if (!user) return;
    // Shown in "Mi Perfil" -> Último acceso (TODO: use the real value from the backend)
    const d = new Date(), p2 = (n) => String(n).padStart(2, '0');
    const h = d.getHours() % 12 || 12;
    setLastAccess(`${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(h)}:${p2(d.getMinutes())}:${p2(d.getSeconds())} ${d.getHours() >= 12 ? 'PM' : 'AM'}`);
    // Same landing as the web system: role "Usuario" -> Ecommerce, everyone else -> Dashboard
    setScreen(byKey(user.rol_usuario === 'Usuario' ? 'ecommerce' : 'dashboard'));
    getList('tasa')
      .then((l) => setTasas(l.filter((t) => t.nombre && t.valor)))
      .catch(() => setTasas([]));
  }, [user]);

  const cartCount = Object.values(cart).reduce((a, i) => a + i.qty, 0);

  const change = (p, d) =>
    setCart((c) => {
      const qty = (c[p.id_producto]?.qty || 0) + d;
      const next = { ...c };
      if (qty <= 0) delete next[p.id_producto];
      else next[p.id_producto] = { p, qty };
      return next;
    });

  const checkout = () => {
    // TODO: send the order to the backend (PedidoController)
    Alert.alert('Pedido registrado', 'Tu pedido fue enviado (modo demo).');
    setCart({});
    setScreen(byKey('ecommerce'));
  };

  if (!user) {
    return (
      <>
        <StatusBar style="light" />
        <LoginScreen onLogin={setUser} />
      </>
    );
  }

  let content;
  if (screen.key === 'dashboard') content = <DashboardScreen user={user} />;
  else if (screen.key === 'ecommerce') content = <EcommerceScreen cart={cart} onAdd={(p) => change(p, 1)} />;
  else if (screen.key === 'carrito')
    content = <CartScreen cart={cart} onChange={change} onCheckout={checkout} onShop={() => setScreen(byKey('ecommerce'))} />;
  else if (screen.key === 'perfil') content = <ProfileScreen user={user} lastAccess={lastAccess} initialTab={screen.tab} />;
  else if (screen.modulo) content = <ListScreen item={screen} />;
  else content = <InfoScreen title={screen.label} text={screen.info} />;

  return (
    <SafeAreaView style={s.container}>
      <StatusBar style="light" />
      <Header user={user} tasas={tasas} cartCount={cartCount} onMenu={() => setMenuOpen(true)} onCart={() => setScreen(CART)} onUser={() => setUserMenu(true)} />
      <View style={s.body}>{content}</View>
      <UserMenu
        visible={userMenu}
        onClose={() => setUserMenu(false)}
        onTab={(tab) => { setUserMenu(false); setScreen({ key: 'perfil', label: 'Mi Perfil', tab }); }}
        onSoon={(l) => { setUserMenu(false); Alert.alert(l, 'Próximamente'); }}
        onLogout={() => { setUserMenu(false); setUser(null); setCart({}); }}
      />
      <Drawer
        user={user}
        visible={menuOpen}
        current={screen.key}
        onSelect={(item) => { setScreen(item); setMenuOpen(false); }}
        onClose={() => setMenuOpen(false)}
        onLogout={() => { setMenuOpen(false); setUser(null); setCart({}); }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  // On wide screens (web) keep the content centered instead of using the whole page
  body: { flex: 1, width: '100%', maxWidth: 1000, alignSelf: 'center' },
});
