import { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import LoginScreen from '../features/auth/screens/LoginScreen';
import UserMenu from '../components/UserMenu';
import Drawer from '../components/Drawer';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getTasas } from '../api/tasaApi';
import { setSessionExpiredHandler } from '../utils/http';
import { colors } from '../utils/theme';
import { LayoutContext, computeLayout } from '../utils/layout';

import { createAppRoutes, stackScreenOptions } from './routes';
import {
  restoreSession,
  signIn,
  signOut,
  sessionExpired,
  clearLoginNotice,
  selectUser,
  selectCheckingSession,
  selectLoginNotice,
} from '../store/authSlice';
import { selectCartCount } from '../store/cartSlice';

const Stack = createNativeStackNavigator();
const CART = { key: 'carrito', label: 'Carrito', icon: 'cart' };

function LoginRoute() {
  const dispatch = useDispatch();
  const notice = useSelector(selectLoginNotice);
  const handleLogin = (username, password) =>
    dispatch(signIn({ username, password })).unwrap();

  return (
    <>
      <StatusBar style="light" />
      <LoginScreen
        notice={notice}
        onLogin={handleLogin}
        onClearNotice={() => dispatch(clearLoginNotice())}
      />
    </>
  );
}

function MainShell() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const cartCount = useSelector(selectCartCount);
  const navigation = useNavigation();

  const [current, setCurrent] = useState('ecommerce');
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenu, setUserMenu] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(64);
  const [tasas, setTasas] = useState([]);

  const { width } = useWindowDimensions();
  const layout = useMemo(() => computeLayout(width, sidebarOpen), [width, sidebarOpen]);
  const routes = useMemo(() => createAppRoutes(setCurrent), []);

  useEffect(() => {
    const cargarTasas = () => {
      getTasas().then(setTasas).catch(() => {});
    };
    cargarTasas();
    const temporizador = setInterval(cargarTasas, 5 * 60 * 1000);
    return () => clearInterval(temporizador);
  }, []);

  // MainShell vive en el stack raíz; las pantallas están en el stack anidado "Main".
  // Por esohay que indicar `screen` al navegar, si no el raíz no encuentra la ruta.
  const goToScreen = (screen, params) =>
    navigation.navigate('Main', params ? { screen, params } : { screen });

  const go = (item) => {
    if (!item?.key) return;
    setMenuOpen(false);

    if (item.info) {
      goToScreen('info', {
        title: item.label,
        text: item.info,
        icon: item.icon,
      });
      return;
    }

    // Las keys del menú son también los nombres de las rutas del stack anidado.
    goToScreen(item.key);
  };

  const logout = () => {
    dispatch(signOut());
    setMenuOpen(false);
    setUserMenu(false);
  };

  const toggleMenu = () =>
    layout.isDesktop ? setSidebarOpen((v) => !v) : setMenuOpen(true);

  const openCart = () => goToScreen(CART.key);

  return (
    <LayoutContext.Provider value={layout}>
      <SafeAreaView style={s.container}>
        <StatusBar style="light" />

        <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
          <Header
            user={user}
            tasas={tasas}
            cartCount={cartCount}
            onMenu={toggleMenu}
            onCart={openCart}
            onUser={() => setUserMenu(true)}
          />
        </View>

        <View style={s.main}>
          {layout.isDesktop && sidebarOpen && (
            <Sidebar user={user} current={current} onSelect={go} onLogout={logout} />
          )}
          <View style={s.body}>
            <Stack.Navigator key="main-stack" screenOptions={stackScreenOptions}>
              {routes.map(({ name, component }) => (
                <Stack.Screen key={name} name={name} component={component} />
              ))}
            </Stack.Navigator>
          </View>
        </View>

        <UserMenu
          visible={userMenu}
          top={headerHeight}
          onClose={() => setUserMenu(false)}
          onTab={(tab) => {
            setUserMenu(false);
            goToScreen('perfil', { tab });
          }}
          onSoon={(label) => {
            setUserMenu(false);
            Alert.alert(label, 'Próximamente');
          }}
          onLogout={logout}
        />

        <Drawer
          user={user}
          visible={menuOpen && !layout.isDesktop}
          current={current}
          onSelect={go}
          onClose={() => setMenuOpen(false)}
          onLogout={logout}
        />
      </SafeAreaView>
    </LayoutContext.Provider>
  );
}

export default function AppNavigator() {
  const dispatch = useDispatch();
  const checkingSession = useSelector(selectCheckingSession);
  const user = useSelector(selectUser);

  useEffect(() => {
    setSessionExpiredHandler(() => dispatch(sessionExpired()));
    dispatch(restoreSession());
    return () => setSessionExpiredHandler(null);
  }, [dispatch]);

  if (checkingSession) {
    return (
      <View style={[s.container, s.center]}>
        <StatusBar style="light" />
        <ActivityIndicator color={colors.red} size="large" />
      </View>
    );
  }

  // La key fuerza un stack limpio al entrar/salir de sesión.
  return (
    <Stack.Navigator
      key={user ? 'authenticated' : 'anonymous'}
      screenOptions={stackScreenOptions}
    >
      {user ? (
        <Stack.Screen name="Main" component={MainShell} />
      ) : (
        <Stack.Screen name="Login" component={LoginRoute} />
      )}
    </Stack.Navigator>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  main: { flex: 1, flexDirection: 'row' },
  body: { flex: 1 },
});
