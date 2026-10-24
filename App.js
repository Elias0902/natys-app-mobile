import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Alert, SafeAreaView, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import EcommerceScreen from './src/screens/EcommerceScreen';
import CartScreen from './src/screens/CartScreen';
import ListScreen from './src/screens/ListScreen';
import InfoScreen from './src/screens/InfoScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserMenu from './src/components/UserMenu';
import Drawer from './src/components/Drawer';
import Sidebar from './src/components/Sidebar';
import Header from './src/components/Header';
import { FLAT } from './src/menu';
import { getList } from './src/api';
import { colors } from './src/theme';
import { LayoutContext, computeLayout } from './src/layout';

const CART = { key: 'carrito', label: 'Carrito', icon: 'cart' };
const byKey = (k) => FLAT.find((i) => i.key === k);

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState(byKey('ecommerce'));
  const [menuOpen, setMenuOpen] = useState(false); // drawer (phone / tablet)
  const [sidebarOpen, setSidebarOpen] = useState(true); // fixed sidebar (desktop)
  const [cart, setCart] = useState({});
  const [tasas, setTasas] = useState([]);
  const [userMenu, setUserMenu] = useState(false);
  const [lastAccess, setLastAccess] = useState('');
  const [headerHeight, setHeaderHeight] = useState(64);

  // Phone / tablet / desktop, shared with every screen through LayoutContext
  const { width } = useWindowDimensions();
  const layout = useMemo(() => computeLayout(width, sidebarOpen), [width, sidebarOpen]);

  useEffect(() => {
    if (!user) return;
    // Shown in "Mi Perfil" -> Último acceso (TODO: use the real value from the backend)
    const d = new Date(), p2 = (n) => String(n).padStart(2, '0');
    const h = d.getHours() % 12 || 12;
    setLastAccess(`${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(h)}:${p2(d.getMinutes())}:${p2(d.getSeconds())} ${d.getHours() >= 12 ? 'PM' : 'AM'}`);
    // Dashboard was removed from the mobile app: every role lands on Ecommerce
    setScreen(byKey('ecommerce'));
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

  const go = (item) => { setScreen(item); setMenuOpen(false); };
  const logout = () => { setMenuOpen(false); setUserMenu(false); setUser(null); setCart({}); };
  const toggleMenu = () => (layout.isDesktop ? setSidebarOpen((v) => !v) : setMenuOpen(true));

  if (!user) {
    return (
      <>
        <StatusBar style="light" />
        <LoginScreen onLogin={setUser} />
      </>
    );
  }

  let content;
  if (screen.key === 'ecommerce')
    content = <EcommerceScreen cart={cart} cartCount={cartCount} onAdd={(p) => change(p, 1)} onCart={() => setScreen(CART)} />;
  else if (screen.key === 'carrito')
    content = <CartScreen cart={cart} onChange={change} onCheckout={checkout} onShop={() => setScreen(byKey('ecommerce'))} />;
  else if (screen.key === 'perfil') content = <ProfileScreen user={user} lastAccess={lastAccess} initialTab={screen.tab} />;
  else if (screen.modulo) content = <ListScreen item={screen} />;
  else content = <InfoScreen title={screen.label} text={screen.info} icon={screen.icon} />;

  return (
    <LayoutContext.Provider value={layout}>
      <SafeAreaView style={s.container}>
        <StatusBar style="light" />
        <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
          <Header user={user} tasas={tasas} cartCount={cartCount} onMenu={toggleMenu} onCart={() => setScreen(CART)} onUser={() => setUserMenu(true)} />
        </View>
        <View style={s.main}>
          {layout.isDesktop && sidebarOpen && <Sidebar current={screen.key} onSelect={go} onLogout={logout} />}
          <View style={s.body}>{content}</View>
        </View>
        <UserMenu
          visible={userMenu}
          top={headerHeight}
          onClose={() => setUserMenu(false)}
          onTab={(tab) => { setUserMenu(false); setScreen({ key: 'perfil', label: 'Mi Perfil', icon: 'user', tab }); }}
          onSoon={(l) => { setUserMenu(false); Alert.alert(l, 'Próximamente'); }}
          onLogout={logout}
        />
        <Drawer
          user={user}
          visible={menuOpen && !layout.isDesktop}
          current={screen.key}
          onSelect={go}
          onClose={() => setMenuOpen(false)}
          onLogout={logout}
        />
      </SafeAreaView>
    </LayoutContext.Provider>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  main: { flex: 1, flexDirection: 'row' },
  body: { flex: 1 },
});
