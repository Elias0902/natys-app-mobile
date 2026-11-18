import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Page, PageHeader } from '../../../components/Page';
import SearchBar from '../../../components/SearchBar';
import Pagination from '../../../components/Pagination';
import {
  getNotificaciones,
  registrarNotificacion,
  modificarNotificacion,
  eliminarNotificacion,
  marcarLeidaNotificacion,
  marcarTodasLeidasNotificacion,
  limpiarLeidasNotificacion,
} from '../services/NotificacionServices';
import NotificacionTable from '../components/NotificacionTable';
import NotificacionViewModal from '../components/NotificacionViewModal';
import NotificacionFormModal from '../components/NotificacionFormModal';
import CustomAlert from '../../../components/CustomAlert';
import { colors } from '../../../utils/theme';
import { useLayout } from '../../../utils/layout';

export default function NotificacionScreens() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [textoFiltrado, setTextoFiltrado] = useState('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Modal Ver
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  // Modal Crear / Editar
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingNotif, setEditingNotif] = useState(null);

  // Alerta personalizada
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: 'success', title: '', message: '' });

  const { isPhone } = useLayout();

  const cargarNotificaciones = async () => {
    try {
      const data = await getNotificaciones();
      setNotificaciones(data);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotificaciones()
      .then((data) => {
        setNotificaciones(data);
        setError('');
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const showAlertBox = (type, title, message) => {
    setAlertConfig({ type, title, message });
    setAlertVisible(true);
  };

  // Ejecuta una acción, muestra el feedback y recarga la lista cuando termina.
  const ejecutarAccion = async (accion, mensajeExito, alSuccess) => {
    try {
      const response = await accion();

      if (response && (response.status || response.success)) {
        showAlertBox('success', '¡Éxito!', response.msj || mensajeExito);
        if (alSuccess) alSuccess();
        cargarNotificaciones();
        return true;
      }

      showAlertBox('error', 'Error', response?.message || response?.msj || 'No se pudo completar la acción.');
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado.');
    }
    return false;
  };

  const handleCreateSubmit = async (formData) => {
    const ok = await ejecutarAccion(
      () => registrarNotificacion(formData),
      'Notificación registrada correctamente.'
    );
    if (ok) {
      setFormModalVisible(false);
      setEditingNotif(null);
    }
  };

  const handleEditSubmit = async (formData) => {
    const ok = await ejecutarAccion(
      () => modificarNotificacion(formData),
      'Notificación actualizada correctamente.'
    );
    if (ok) {
      setFormModalVisible(false);
      setEditingNotif(null);
    }
  };

  const handleDelete = async (notificacion) => {
    const id = notificacion?.id_notificaciones;
    if (!id) {
      showAlertBox('error', 'Error', 'No se pudo identificar la notificación a eliminar.');
      return;
    }

    const confirmado = window.confirm(`¿Estás seguro de eliminar la notificación "${notificacion.titulo || ''}"?`);
    if (!confirmado) return;

    await ejecutarAccion(
      () => eliminarNotificacion(id),
      'Notificación eliminada correctamente.',
      () => setViewModalVisible(false)
    );
  };

  const handleMarcarLeida = async (notificacion) => {
    const id = notificacion?.id_notificaciones;
    if (!id) {
      showAlertBox('error', 'Error', 'No se pudo identificar la notificación.');
      return;
    }

    await ejecutarAccion(
      () => marcarLeidaNotificacion(id),
      'Notificación marcada como leída.',
      () => setViewModalVisible(false)
    );
  };

  const handleMarcarTodas = async () => {
    await ejecutarAccion(
      () => marcarTodasLeidasNotificacion(),
      'Notificaciones marcadas como leídas.'
    );
  };

  const handleLimpiarLeidas = async () => {
    await ejecutarAccion(
      () => limpiarLeidasNotificacion(),
      'Notificaciones leídas eliminadas.'
    );
  };

  const openCreate = () => {
    setEditingNotif(null);
    setFormModalVisible(true);
  };

  const openEdit = (notificacion) => {
    setEditingNotif(notificacion);
    setFormModalVisible(true);
  };

  const q = textoFiltrado.trim().toLowerCase();
  const filtered = notificaciones.filter(n =>
    String(n.titulo ?? '').toLowerCase().includes(q) ||
    String(n.descripcion_notificacion ?? '').toLowerCase().includes(q)
  );

  const totalPages = Math.ceil(filtered.length / recordsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const handleSearchChange = (text) => {
    setTextoFiltrado(text);
    setCurrentPage(1);
  };

  const handleRecordsChange = (num) => {
    setRecordsPerPage(num);
    setCurrentPage(1);
  };

  return (
    <Page>
      <PageHeader icon="bell" title="Gestión de Notificaciones" crumb="Inicio  ›  Notificaciones" />
      
      <View style={[styles.toolbar, isPhone && styles.toolbarPhone]}>
        <View style={styles.leftTools}>
          <TouchableOpacity style={styles.btnNuevo} onPress={openCreate}>
            <Text style={styles.btnNuevoText}>+ Registrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnAccion} onPress={handleMarcarTodas}>
            <Text style={styles.btnAccionText}>Marcar todas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnAccion, styles.btnLimpiar]} onPress={handleLimpiarLeidas}>
            <Text style={styles.btnAccionText}>Limpiar leídas</Text>
          </TouchableOpacity>
        </View>
        <SearchBar filterText={textoFiltrado} onChangeText={handleSearchChange} placeholder="Buscar notificación..." style={isPhone ? styles.searchPhone : styles.searchWide} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.red} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
            {paginatedData.length > 0 ? (
              <NotificacionTable 
                notificaciones={paginatedData}
                onView={(n) => { setSelectedNotif(n); setViewModalVisible(true); }}
                onEdit={openEdit}
                onDelete={handleDelete}
                onMarcarLeida={handleMarcarLeida}
              />
            ) : <Text style={styles.noResults}>No se encontraron notificaciones.</Text>}
          </ScrollView>

          <Pagination 
            page={currentPage}
            pages={totalPages}
            onPage={(p) => setCurrentPage(p)}
            totalRecords={filtered.length}
            recordsPerPage={recordsPerPage}
            onRecordsPerPageChange={handleRecordsChange}
          />
        </>
      )}

      <NotificacionViewModal 
        visible={viewModalVisible} 
        notificacion={selectedNotif} 
        onClose={() => setViewModalVisible(false)}
        onEdit={(n) => { setViewModalVisible(false); openEdit(n); }}
        onMarcarLeida={handleMarcarLeida}
        onDelete={handleDelete}
      />

      <NotificacionFormModal
        key={editingNotif ? `edit-${editingNotif.id_notificaciones}` : 'create'}
        visible={formModalVisible}
        notificacion={editingNotif}
        onClose={() => { setFormModalVisible(false); setEditingNotif(null); }}
        onSubmit={editingNotif ? handleEditSubmit : handleCreateSubmit}
      />

      <CustomAlert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  toolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  toolbarPhone: { marginBottom: 12 },
  leftTools: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  btnNuevo: { backgroundColor: colors.red, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  btnNuevoText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  btnAccion: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  btnLimpiar: { backgroundColor: '#b91c1c' },
  btnAccionText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  searchWide: { width: 300, maxWidth: '100%', backgroundColor: colors.card },
  searchPhone: { flex: 1, backgroundColor: colors.card },
  tableScroll: { width: '100%' },
  loading: { marginVertical: 40 },
  error: { color: '#f87171', textAlign: 'center', padding: 24 },
  noResults: { padding: 24, textAlign: 'center', color: colors.muted },
});
