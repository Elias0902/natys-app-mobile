import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from '../../../utils/theme';
import { useLayout } from '../../../utils/layout';
import { Page, PageHeader } from '../../../components/Page';
import SearchBar from '../../../components/SearchBar';
import Icon from '../../../components/Icon';

// Contenido estático: explica la app completa y el uso de cada módulo.
export const HELP_SECTIONS = [
  {
    id: 'bienvenida',
    icon: 'help',
    title: 'Bienvenida y primeros pasos',
    summary: 'Cómo entrar, qué ves al iniciar y qué significa cada parte de la pantalla.',
    points: [
      'Ingresa con el usuario y contraseña que te dio el administrador. La app guarda un token de acceso para no pedirlos cada vez.',
      'Después de entrar verás el catálogo de Ecommerce. Desde la barra superior puedes abrir el carrito, cambiar de usuario o cerrar sesión.',
      'El menú se filtra automáticamente: solo aparecen los módulos que tu rol tiene permitidos.',
      'En el teléfono el menú se abre con el botón de tres rayas; en tablet también, y en escritorio queda fijo a la izquierda.',
      'Si tu sesión vence, la app te avisa y te devuelve al inicio de sesión. Vuelve a entrar para continuar.',
    ],
    faq: [
      { q: '¿Por qué no veo un módulo en el menú?', a: 'Tu rol no tiene permiso de Consultar para ese módulo. Pide al administrador que te lo habilite.' },
    ],
  },
  {
    id: 'navegacion',
    icon: 'list',
    title: 'Cómo navegar y entender las pantallas',
    summary: 'Buscadores, tablas, tarjetas y los iconos de acción de cada registro.',
    points: [
      'Cada módulo muestra una lista de registros con un buscador arriba. Escribe para filtrar por cualquier texto de la tabla.',
      'En el celular los registros se muestran como tarjetas; en tablet como tabla compacta y en escritorio como tabla completa.',
      'Los botones de acción son iconos: el ojo sirve para ver, el lápiz para editar y la papelera para eliminar.',
      'En Notificaciones, la palomita marca un aviso como leído. El ojo abre el detalle completo.',
      'Los textos muy largos se recortan a unas palabras en la tabla o tarjeta; abre el botón ver para leer toda la información.',
      'La ruta sobre el título (por ejemplo Inicio › Finanzas › Pagos) indica dónde estás dentro de la app.',
    ],
    faq: [
      { q: '¿Cómo elimino un registro?', a: 'Pulsa la papelera y confirma en el cuadro que aparece. Solo puedes hacerlo si tu rol tiene permiso de Eliminar.' },
    ],
  },
  {
    id: 'ecommerce',
    icon: 'bag',
    title: 'Ecommerce: catálogo, carrito y pedidos',
    summary: 'Desde agregar productos hasta finalizar y pagar un pedido real.',
    points: [
      'En Ecommerce ves los productos y categorías. Usa el buscador y los filtros para encontrar lo que necesitas.',
      'Pulsa Agregar para poner un producto en el carrito. Puedes subir o bajar la cantidad con los botones + y −, o escribirla directamente.',
      'Cada pedido debe tener entre 100 y 300 cajas en total. La app te avisa si te pasas o si te falta cantidad.',
      'En el carrito revisa los productos, el subtotal y el total. Pulsa Seguir comprando para volver al catálogo o Pagar ahora para continuar.',
      'En Finalizar pedido completa la dirección de entrega y el teléfono de contacto. Las observaciones son opcionales.',
      'Elige el método de pago: Transferencia, Pago móvil, Efectivo o Crédito. Con transferencia o pago móvil necesitas el número de referencia si vas a pagar ahora.',
      'Puedes adjuntar una foto del comprobante de pago; es opcional y no debe superar los 3 MB.',
      'Pulsa Pagar después para dejar el pedido pendiente o Pagar ahora para registrar el cobro. Si eliges Crédito, el pago siempre queda para después.',
      'Al terminar verás la confirmación con el número de pedido. El carrito se vacía solo cuando el pedido se registró correctamente.',
    ],
    faq: [
      { q: '¿Por qué me dice que el total no coincide?', a: 'Un precio cambió después de agregar el producto. El servidor siempre recalcula el total con los precios vigentes; vuelve a cargar el catálogo y arma el carrito otra vez.' },
      { q: '¿Puedo pagar en efectivo sin referencia?', a: 'Sí. Si no escribes referencia con Efectivo, el sistema usa EFECTIVO automáticamente.' },
      { q: '¿Qué pasa si no hay stock?', a: 'El pedido no se registra y se muestra el aviso. Ajusta la cantidad o consulta con el administrador.' },
    ],
  },
  {
    id: 'gestion',
    icon: 'briefcase',
    title: 'Módulos de gestión: Socios y Comercial',
    summary: 'Clientes, proveedores, productos, pedidos, entregas, compras y promociones.',
    points: [
      'Clientes y Proveedores: consulta el directorio, registra nuevos socios y edita sus datos. Cada ficha tiene sus propios campos obligatorios.',
      'Productos: administra el inventario, precio de venta, categoría, stock e imagen. El precio de venta es el que usa el ecommerce.',
      'Pedidos: consulta los pedidos, revisa su detalle y cambia su estado. El estado inicial es Pendiente y el pago empieza Como Por Pagar.',
      'Entregas: sigue el estado de los despachos (Pendiente, En camino, Entregado).',
      'Compras: registra las adquisiciones a proveedores y controla su recepción.',
      'Promociones: crea ofertas 2x1, porcentaje o monto fijo y asígnale productos.',
      'En los formularios de Registrar y Editar, los campos marcados con * son obligatorios y se validan antes de guardar.',
    ],
    faq: [
      { q: '¿Puedo registrar un pedido desde Pedidos y desde el carrito?', a: 'Sí. Desde Pedidos se registra con cliente, productos, precios y total. Desde el carrito el sistema resuelve esos datos por ti y valida las cajas.' },
    ],
  },
  {
    id: 'finanzas',
    icon: 'dollar',
    title: 'Finanzas: pagos y cuentas',
    summary: 'Cómo consultar pagos y abonar cuentas por cobrar o pagar.',
    points: [
      'En Pagos solo puedes Ver pago: consultas el comprobante y el detalle, sin crear, editar ni eliminar pagos desde ahí.',
      'En Cuentas por Cobrar y Cuentas por Pagar tienes dos acciones: Ver cuenta y Abonar cuenta.',
      'Abonar cuenta registra un pago con el monto, método, referencia y comprobante opcional; el saldo pendiente se descuenta automáticamente.',
      'Cuando una cuenta se salda, el pedido asociado pasa a Pagado.',
      'Los montos se muestran con formato de moneda y los estados con colores: verde para pagado/cobrado, amarillo para pendiente y rojo para anulado.',
      'La barra superior muestra el dólar real: BCV (oficial) y USDT (paralelo/Binance), tomado de dolarapi.com y actualizado cada 5 minutos.',
    ],
    faq: [
      { q: '¿De dónde salen las tasas que aparecen arriba?', a: 'De dolarapi.com: “BCV” es el dólar oficial y “USDT” el paralelo (Binance). Se consultan al abrir la app y se refrescan automáticamente cada 5 minutos.' },
      { q: '¿Por qué no aparece la opción de eliminar un pago?', a: 'Los pagos no se eliminan desde la app: solo se consultan. Para corregir un pago, habla con el administrador del sistema web.' },
    ],
  },
  {
    id: 'configuracion',
    icon: 'sliders',
    title: 'Notificaciones y configuración',
    summary: 'Avisos del sistema, marcado como leído y detalle completo.',
    points: [
      'En Notificaciones ves los avisos de pedidos, stock bajo y eventos del sistema.',
      'Pulsa la palomita para marcar una notificación como leída; desaparece el indicador de nueva.',
      'Pulsa el ojo para abrir el modal con el título, detalle, tipo y fecha completos.',
      'Los textos largos se muestran recortados en la lista para no romper el diseño; el modal siempre muestra la información completa.',
    ],
    faq: [],
  },
  {
    id: 'perfil',
    icon: 'user',
    title: 'Mi Perfil y seguridad',
    summary: 'Tus datos, crédito, soporte y cierre de sesión.',
    points: [
      'Toca tu avatar o nombre arriba a la derecha para abrir Mi Perfil.',
      'En Datos Personales consultas la información de tu cuenta; en Crédito y Balance revisas los días de crédito y tus saldos.',
      'La pestaña Ayuda dentro del perfil muestra la versión y los datos de contacto rápido.',
      'Cerrar sesión borra el token de la app. Tendrás que volver a iniciar sesión para entrar de nuevo.',
      'Los permisos se aplican por acción: consultar, agregar, modificar y eliminar. Si una acción no está permitida, la app lo indica.',
    ],
    faq: [
      { q: '¿Dónde veo mi rol?', a: 'En el menú lateral aparece tu rol debajo de tu nombre, y también en la pantalla Mi Perfil.' },
    ],
  },
  {
    id: 'ayuda',
    icon: 'help',
    title: 'Preguntas frecuentes y soporte',
    summary: 'Soluciones rápidas a los problemas más comunes y datos de contacto.',
    points: [
      'Si aparece “No se encontró una tasa del día activa”, pide al administrador que registre la tasa en el sistema: las tasas de la barra superior son informativas y no reemplazan ese registro.',
      'Si el carrito tiene menos de 100 cajas o más de 300, ajusta las cantidades antes de pagar.',
      'Si el teléfono no es válido, usa 11 dígitos sin guiones, por ejemplo 04121234567.',
      'Si un precio cambió mientras armabas el pedido, actualiza el catálogo y vuelve a agregar los productos.',
      'Soporte: galletasnatys@gmail.com · +58 424 521 7016.',
    ],
    faq: [
      { q: '¿La app funciona sin internet?', a: 'No. El catálogo, los pedidos y los pagos se consultan en la API real; necesitas conexión con el servidor.' },
    ],
  },
];

const searchText = (section) => [
  section.title,
  section.summary,
  ...section.points,
  ...(section.faq || []).flatMap((item) => [item.q, item.a]),
].join(' ').toLowerCase();

export default function HelpCenterScreen() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState({ bienvenida: true });
  const { isPhone } = useLayout();

  const term = query.trim().toLowerCase();
  const sections = term ? HELP_SECTIONS.filter((section) => searchText(section).includes(term)) : HELP_SECTIONS;

  return (
    <Page>
      <PageHeader icon="help" title="Centro de Ayuda" crumb="Inicio  ›  Centro de Ayuda" />

      <View style={[s.hero, isPhone && s.heroPhone]}>
        <Image source={require('../../../../assets/logo-clean.png')} style={s.logo} resizeMode="contain" />
        <View style={s.heroCopy}>
          <Text style={s.heroTitle}>Guía de uso de Natys</Text>
          <Text style={s.heroText}>
            Todo lo que necesitas para usar la app: desde tu primer ingreso hasta registrar pedidos y consultar pagos.
          </Text>
        </View>
      </View>

      <SearchBar filterText={query} onChangeText={setQuery} placeholder="Buscar ayuda: pedidos, pagos, carrito..." style={s.search} />

      {sections.length === 0 ? (
        <View style={s.card}>
          <Text style={s.noResults}>No encontramos temas para “{query}”. Prueba con otra palabra.</Text>
        </View>
      ) : null}

      {sections.map((section) => {
        const expanded = term ? true : !!open[section.id];
        return (
          <View key={section.id} style={s.card}>
            <TouchableOpacity
              style={s.cardHeader}
              onPress={() => setOpen((current) => ({ ...current, [section.id]: !current[section.id] }))}>
              <View style={s.sectionIcon}><Icon name={section.icon} size={16} color="#fff" /></View>
              <View style={s.sectionCopy}>
                <Text style={s.sectionTitle}>{section.title}</Text>
                <Text style={s.sectionSummary} numberOfLines={expanded ? undefined : 1}>{section.summary}</Text>
              </View>
              <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size={18} color={colors.muted} />
            </TouchableOpacity>

            {expanded ? (
              <View style={s.sectionBody}>
                {section.points.map((point, index) => (
                  <View key={`p${index}`} style={s.pointRow}>
                    <Icon name="check" size={13} color={colors.green} />
                    <Text style={s.point}>{point}</Text>
                  </View>
                ))}
                {(section.faq || []).map((item, index) => (
                  <View key={`q${index}`} style={s.faq}>
                    <Text style={s.question}>{item.q}</Text>
                    <Text style={s.answer}>{item.a}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}

      <View style={s.contact}>
        <Text style={s.contactTitle}>¿Necesitas más ayuda?</Text>
        <Text style={s.contactText}>Correo: galletasnatys@gmail.com</Text>
        <Text style={s.contactText}>Teléfono: +58 424 521 7016</Text>
      </View>
    </Page>
  );
}

const s = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 14 },
  heroPhone: { flexDirection: 'column', alignItems: 'flex-start' },
  logo: { width: 96, height: 56 },
  heroCopy: { flex: 1 },
  heroTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  heroText: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 4 },
  search: { marginBottom: 14 },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 14, marginBottom: 12, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  sectionIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  sectionCopy: { flex: 1, minWidth: 0 },
  sectionTitle: { color: colors.text, fontSize: 14, fontWeight: '800' },
  sectionSummary: { color: colors.muted, fontSize: 12, marginTop: 2 },
  sectionBody: { borderTopColor: colors.border, borderTopWidth: 1, padding: 14, gap: 10 },
  pointRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  point: { flex: 1, color: colors.text, fontSize: 13, lineHeight: 19 },
  faq: { backgroundColor: colors.bg, borderColor: colors.border, borderWidth: 1, borderRadius: 10, padding: 12, gap: 4 },
  question: { color: colors.text, fontSize: 13, fontWeight: '800' },
  answer: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  noResults: { color: colors.muted, fontSize: 13, textAlign: 'center', padding: 20 },
  contact: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 16, gap: 4, marginTop: 4 },
  contactTitle: { color: colors.text, fontSize: 15, fontWeight: '800', marginBottom: 4 },
  contactText: { color: colors.muted, fontSize: 13 },
});
