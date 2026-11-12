import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, SafeAreaView, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from '../features/auth/screens/LoginScreen';
import EcommerceScreen from '../features/ecommerce/screens/EcommerceScreen';
import CartScreen from '../features/ecommerce/screens/CartScreen';
import ProfileScreen from '../features/miperfil/screens/ProfileScreen';
import InfoScreen from '../screens/InfoScreen';
import NotFoundScreen from '../screens/NotFoundScreen';

// 📌 IMPORTAMOS LAS PANTALLAS REALES CONECTADAS A TUS APIS
import ClienteScreens from '../features/clientes/screens/ClienteScreens';
import ProveedorScreens from '../features/proveedores/screens/ProveedorScreens';
import PedidoScreens from '../features/pedidos/screens/PedidoScreens';
import ProductoScreens from '../features/productos/screens/ProductoScreens';

import UserMenu from '../components/UserMenu';
import Drawer from '../components/Drawer';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FLAT } from './menu';
import { getTasas } from '../api/tasaApi';
import { restoreSession, logout as endSession } from '../features/auth/services/authApi';
import { createOrder } from '../features/ecommerce/services/ecommerceApi';
import { setSessionExpiredHandler, request } from '../utils/http';
import { colors } from '../utils/theme';
import { LayoutContext, computeLayout } from '../utils/layout';

const CART = { key: 'carrito', label: 'Carrito', icon: 'cart' };
const byKey = (k) => FLAT.find((i) => i.key === k);

async function obtenerModulosPermitidos(idRol) {
  try {
    const data = await request(`permisos&action=obtener_modulo&ID=${idRol}`, { method: 'GET' });
    if (Array.isArray(data)) {
      const permitidas = data
        .filter(p => Number(p.status) === 1 && p.nombre_permiso === 'Consultar' && p.ruta)
        .map(p => p.ruta);
      return [...new Set(permitidas)];
    }
    return [];
  } catch (e) {
    console.error('Error cargando permisos de módulos:', e);
    return [];
  }
}

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loginNotice, setLoginNotice] = useState('');
  const [screen, setScreen] = useState(byKey('ecommerce'));
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cart, setCart] = useState({});
  const [tasas, setTasas] = useState([]);
  const [userMenu, setUserMenu] = useState(false);
  const [lastAccess, setLastAccess] = useState('');
  const [headerHeight, setHeaderHeight] = useState(64);

  const { width } = useWindowDimensions();
  const layout = useMemo(() => computeLayout(width, sidebarOpen), [width, sidebarOpen]);

  const closeSession = () => { setMenuOpen(false); setUserMenu(false); setUser(null); setCart({}); };

  useEffect(() => {
    setSessionExpiredHandler(() => {
      setLoginNotice('Tu sesión venció. Inicia sesión de nuevo.');
      closeSession();
    });

    restoreSession()
      .then(async (u) => {
        if (u) {
          const rolId = u.id_rol_usuario || u.id_rol;
          if (rolId) {
            u.modulos = await obtenerModulosPermitidos(rolId);
          }
        }
        setUser(u);
      })
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  const handleLoginSuccess = async (u) => {
    setLoginNotice('');
    if (u) {
      const rolId = u.id_rol_usuario || u.id_rol;
      if (rolId) {
        u.modulos = await obtenerModulosPermitidos(rolId);
      }
    }
    setUser(u);
  };

  useEffect(() => {
    if (!user) return;
    const d = new Date(), p2 = (n) => String(n).padStart(2, '0');
    const h = d.getHours() % 12 || 12;
    setLastAccess(`${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(h)}:${p2(d.getMinutes())}:${p2(d.getSeconds())} ${d.getHours() >= 12 ? 'PM' : 'AM'}`);
    setScreen(byKey('ecommerce'));
    getTasas().then(setTasas).catch(() => setTasas([]));
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

  const checkout = async (contact) => {
    const items = Object.values(cart).map((i) => ({ id_producto: i.p.id_producto, cantidad: i.qty }));
    const r = await createOrder({ ...contact, items });
    Alert.alert('Pedido registrado', r.message);
    setCart({});
    setScreen(byKey('ecommerce'));
  };

  const go = (item) => { setScreen(item); setMenuOpen(false); };
  const logout = () => { endSession().catch(() => {}); setLoginNotice(''); closeSession(); };
  const toggleMenu = () => (layout.isDesktop ? setSidebarOpen((v) => !v) : setMenuOpen(true));

  if (checkingSession) {
    return <View style={[s.container, s.center]}><ActivityIndicator color={colors.red} size="large" /></View>;
  }

  if (!user) {
    return (
      <>
        <StatusBar style="light" />
        <LoginScreen notice={loginNotice} onLogin={handleLoginSuccess} />
      </>
    );
  }

  // 📌 RENDERIZADO DE PANTALLAS CONECTADAS DIRECTAMENTE A LAS APIS
  let content;
  if (screen.key === 'ecommerce') {
    content = <EcommerceScreen cart={cart} cartCount={cartCount} onAdd={(p) => change(p, 1)} onCart={() => setScreen(CART)} />;
  } else if (screen.key === 'carrito') {
    content = <CartScreen cart={cart} onChange={change} onCheckout={checkout} onShop={() => setScreen(byKey('ecommerce'))} />;
  } else if (screen.key === 'perfil') {
    content = <ProfileScreen user={user} lastAccess={lastAccess} initialTab={screen.tab} />;
  } else if (screen.key === 'clientes') {
    content = <ClienteScreens />; // <--- Pantalla real de Clientes
  } else if (screen.key === 'proveedores') {
    content = <ProveedorScreens />; // <--- Pantalla real de Proveedores
  } else if (screen.key === 'pedidos') {
    content = <PedidoScreens />; // <--- Pantalla real de Pedidos
  } else if (screen.key === 'productos_lista') {
    content = <ProductoScreens onAdd={(p) => change(p, 1)} />; // <--- Pantalla real de Productos
  } else if (screen.modulo) {
    content = <ListScreen item={screen} />;
  } else if (screen.info) {
    content = <InfoScreen title={screen.label} text={screen.info} icon={screen.icon} />;
  } else {
    content = <NotFoundScreen />;
  }

  return (
    <LayoutContext.Provider value={layout}>
      <SafeAreaView style={s.container}>
        <StatusBar style="light" />
        <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
          <Header user={user} tasas={tasas} cartCount={cartCount} onMenu={toggleMenu} onCart={() => setScreen(CART)} onUser={() => setUserMenu(true)} />
        </View>
        <View style={s.main}>
          {layout.isDesktop && sidebarOpen && <Sidebar user={user} current={screen.key} onSelect={go} onLogout={logout} />}
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
  center: { alignItems: 'center', justifyContent: 'center' },
  main: { flex: 1, flexDirection: 'row' },
  body: { flex: 1 },
});