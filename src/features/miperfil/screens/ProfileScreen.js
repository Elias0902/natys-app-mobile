import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { colors } from '../../../utils/theme';
import { initials } from '../../../utils/format';
import { useLayout } from '../../../utils/layout';
import { Page, PageHeader } from '../../../components/Page';
import { BASE_URL } from '../../../utils/config';
import { getPerfil } from '../services/ProfileServices';
import ChangePasswordModal from '../components/ChangePasswordModal';
import ChangeAvatarModal from '../components/ChangeAvatarModal';

const TABS = [
  { key: 'perfil', label: 'Mi Perfil' },
  { key: 'datos', label: 'Datos Personales' },
  { key: 'credito', label: 'Crédito y Balance' },
  { key: 'ayuda', label: 'Ayuda' },
];

function Row({ label, value }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value || 'No especificado'}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { isPhone, contentWidth } = useLayout();
  const [tab, setTab] = useState('perfil');
  const [perfilData, setPerfilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados de modales
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  const twoColumns = !isPhone && contentWidth >= 700;
  const serverRoot = BASE_URL.replace('/api', '');

  useEffect(() => {
    getPerfil()
      .then((data) => setPerfilData(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const usuario = perfilData?.usuario;
  const ultimoAcceso = perfilData?.ultimo_acceso;
  const creditoInfo = perfilData?.credito_info;

  const avatarUrl = usuario.avatar ? `${serverRoot}/${usuario.avatar}` : null;

  if (loading) {
    return (
      <Page>
        <PageHeader icon="user" title="Mi Perfil" crumb="Inicio  ›  Mi Perfil" />
        <ActivityIndicator color={colors.red} style={s.loading} />
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <PageHeader icon="user" title="Mi Perfil" crumb="Inicio  ›  Mi Perfil" />
        <Text style={s.error}>{error}</Text>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader icon="user" title="Mi Perfil" crumb="Inicio  ›  Mi Perfil" />

      <View style={[s.layout, twoColumns && s.layoutRow]}>
        {/* Tarjeta Lateral de Usuario con Botones de Acción */}
        <View style={[s.hero, twoColumns && s.heroWide]}>
          <TouchableOpacity onPress={() => setAvatarModalVisible(true)} style={s.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={s.avatarImg} resizeMode="cover" />
            ) : (
              <Text style={s.avatarText}>{initials(usuario?.nombre_usuario)}</Text>
            )}
          </TouchableOpacity>
          <Text style={s.name} numberOfLines={1}>{usuario?.nombre_usuario}</Text>
          <Text style={s.mail} numberOfLines={1}>{usuario?.email_usuario}</Text>
          <Text style={s.role}>{usuario?.nombre_rol}</Text>

          {/* Botones de configuración rápida */}
          <View style={s.actionButtonsContainer}>
            <TouchableOpacity style={s.actionBtn} onPress={() => setAvatarModalVisible(true)}>
              <Text style={s.actionBtnText}>Cambiar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.actionBtnSecundary} onPress={() => setPasswordModalVisible(true)}>
              <Text style={s.actionBtnSecundaryText}>Cambiar Contraseña</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenido Principal con Pestañas */}
        <View style={twoColumns ? s.mainWide : null}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabs} contentContainerStyle={s.tabsInner}>
            {TABS.map((t) => (
              <TouchableOpacity key={t.key} onPress={() => setTab(t.key)} style={[s.tab, tab === t.key && s.tabOn]}>
                <Text style={[s.tabText, tab === t.key && { color: '#fff' }]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={s.card}>
            {tab === 'perfil' && (
              <>
                <Text style={s.title}>Información de la Cuenta</Text>
                <Text style={s.sub}>Detalles generales del usuario activo</Text>
                <Row label="Nombre de Usuario" value={usuario?.nombre_usuario} />
                <Row label="Correo Electrónico" value={usuario?.email_usuario} />
                <Row label="Rol en el Sistema" value={usuario?.nombre_rol} />
                <Row label="Último Acceso" value={ultimoAcceso} />
              </>
            )}

            {tab === 'datos' && (
              <>
                <Text style={s.title}>Datos Personales y Registro</Text>
                <Text style={s.sub}>Identificadores y marcas de tiempo</Text>
                <Row label="ID de Usuario" value={`#${usuario?.id_usuario}`} />
                <Row label="ID de Cliente Asociado" value={usuario?.id_cliente} />
                <Row label="Fecha de Registro / Bitácora" value={usuario?.fecha_bitacora} />
              </>
            )}

            {tab === 'credito' && (
              <>
                <Text style={s.title}>Crédito y Balance</Text>
                <Text style={s.sub}>Información financiera y comercial</Text>
                <Row label="Tipo de Cliente" value={creditoInfo?.tipo} />
                <Row label="Días de Crédito" value={`${creditoInfo?.dias_credito} días`} />
                <Row label="Saldo Pendiente" value={`$${creditoInfo?.saldo_pendiente}`} />
                <Row label="Cuentas Activas" value={creditoInfo?.cuentas_activas} />
                <Row label="Cuentas Vencidas" value={creditoInfo?.cuentas_vencidas} />
              </>
            )}

            {tab === 'ayuda' && (
              <>
                <Text style={s.title}>Centro de Ayuda y Soporte</Text>
                <Text style={s.sub}>Información sobre el sistema Natys</Text>
                <Row label="Versión de la Aplicación" value="v1.0.0 (React Native Mobile)" />
                <Row label="Soporte Técnico" value="soporte@natys.com" />
                <Row label="Entorno" value="Desarrollo / Producción Local" />
              </>
            )}
          </View>
        </View>
      </View>

      {/* Modales integrados */}
      <ChangePasswordModal 
        visible={passwordModalVisible} 
        onClose={() => setPasswordModalVisible(false)} 
        onSubmit={(data) => console.log('Cambiar contraseña:', data)} 
      />
      <ChangeAvatarModal 
        visible={avatarModalVisible} 
        onClose={() => setAvatarModalVisible(false)} 
        onSubmit={(newAvatar) => console.log('Nueva foto de perfil:', newAvatar)} 
      />
    </Page>
  );
}

const s = StyleSheet.create({
  layout: { gap: 16 },
  layoutRow: { flexDirection: 'row', alignItems: 'flex-start' },
  hero: { alignItems: 'center', backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 20 },
  heroWide: { width: 280 },
  mainWide: { flex: 1 },
  avatarContainer: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  avatarImg: { width: '100%', height: '100%' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 24 },
  name: { color: colors.text, fontSize: 18, fontWeight: '800' },
  mail: { color: colors.muted, fontSize: 12, marginTop: 2 },
  role: { color: colors.red, fontWeight: '700', marginTop: 6 },
  actionButtonsContainer: { width: '100%', marginTop: 16, gap: 8, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16 },
  actionBtn: { backgroundColor: colors.red, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  actionBtnText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  actionBtnSecundary: { backgroundColor: '#334155', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  actionBtnSecundaryText: { color: colors.text, fontSize: 12, fontWeight: 'bold' },
  tabs: { marginBottom: 12, flexGrow: 0 },
  tabsInner: { gap: 8 },
  tab: { borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#0f172a' },
  tabOn: { backgroundColor: colors.red, borderColor: colors.red },
  tabText: { color: colors.muted, fontWeight: '700', fontSize: 12 },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 18 },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  sub: { color: colors.muted, fontSize: 12, marginBottom: 12 },
  row: { borderTopColor: colors.border, borderTopWidth: 1, paddingVertical: 10 },
  rowLabel: { color: colors.muted, fontSize: 11, textTransform: 'uppercase' },
  rowValue: { color: colors.text, fontSize: 15, fontWeight: '600', marginTop: 2 },
  loading: { marginVertical: 40 },
  error: { color: '#f87171', textAlign: 'center', padding: 24 },
});