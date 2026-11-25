import { useEffect } from 'react';

import EcommerceScreen from '../features/ecommerce/screens/EcommerceScreen';
import CartScreen from '../features/ecommerce/screens/CartScreen';
import ProfileScreen from '../features/miperfil/screens/ProfileScreen';
import HelpCenterScreen from '../features/ayuda/screens/HelpCenterScreen';

import ClienteScreens from '../features/clientes/screens/ClienteScreens';
import ProveedorScreens from '../features/proveedores/screens/ProveedorScreens';
import PedidoScreens from '../features/pedidos/screens/PedidoScreens';
import ProductoScreens from '../features/productos/screens/ProductoScreens';
import CompraScreens from '../features/compras/screens/CompraScreens';
import EntregaScreens from '../features/entregas/screens/EntregaScreens';
import PromocionScreens from '../features/promociones/screens/PromocionScreens';
import PagoScreens from '../features/pagos/screens/PagoScreens';
import NotificacionScreens from '../features/notificaciones/screens/NotificacionScreens';
import CuentaCobrarScreens from '../features/cuentacobrar/screens/CuentaCobrarScreens';
import CuentaPagarScreens from '../features/cuentapagar/screens/CuentaPagarScreens';

import InfoScreen from '../screens/InfoScreen';
import NotFoundScreen from '../screens/NotFoundScreen';

function InfoRoute({ route }) {
  const { title = 'Información', text = '', icon = 'help' } = route?.params || {};
  return <InfoScreen title={title} text={text} icon={icon} />;
}

// Cada pantalla avisa al Shell cuál está activa para resaltar el menú lateral/drawer.
// Los nombres de las rutas son las mismas keys de src/navigation/menu.js.
export function createAppRoutes(onRouteChange) {
  const tracked = (name, Component, activeKey = name) => {
    function TrackedScreen(props) {
      useEffect(() => {
        onRouteChange(activeKey);
      }, []);
      return <Component {...props} />;
    }
    return TrackedScreen;
  };

  return [
    { name: 'ecommerce', component: tracked('ecommerce', EcommerceScreen) },
    { name: 'carrito', component: tracked('carrito', CartScreen) },
    { name: 'perfil', component: tracked('perfil', ProfileScreen) },
    { name: 'clientes', component: tracked('clientes', ClienteScreens) },
    { name: 'proveedores', component: tracked('proveedores', ProveedorScreens) },
    { name: 'pedidos', component: tracked('pedidos', PedidoScreens) },
    { name: 'productos_lista', component: tracked('productos_lista', ProductoScreens) },
    { name: 'compras', component: tracked('compras', CompraScreens) },
    { name: 'entregas', component: tracked('entregas', EntregaScreens) },
    { name: 'promociones', component: tracked('promociones', PromocionScreens) },
    { name: 'notificaciones', component: tracked('notificaciones', NotificacionScreens) },
    { name: 'pagos', component: tracked('pagos', PagoScreens) },
    {
      name: 'cuentaporcobrar',
      component: tracked('cuentaporcobrar', CuentaCobrarScreens),
    },
    {
      name: 'cuentas_por_cobrar',
      component: tracked('cuentas_por_cobrar', CuentaCobrarScreens, 'cuentaporcobrar'),
    },
    {
      name: 'cuentaporpagar',
      component: tracked('cuentaporpagar', CuentaPagarScreens),
    },
    {
      name: 'cuentas_por_pagar',
      component: tracked('cuentas_por_pagar', CuentaPagarScreens, 'cuentaporpagar'),
    },
    { name: 'ayuda', component: tracked('ayuda', HelpCenterScreen) },
    { name: 'info', component: tracked('info', InfoRoute) },
    { name: 'NotFound', component: tracked('NotFound', NotFoundScreen) },
  ];
}

export const stackScreenOptions = {
  headerShown: false,
  animation: 'fade',
};
