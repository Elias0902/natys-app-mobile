import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Page, PageHeader } from '../../../components/Page';
import SearchBar from '../../../components/SearchBar';
import Pagination from '../../../components/Pagination';
import { getPromociones, registrarPromocion, modificarPromocion, eliminarPromocion } from '../services/PromocionServices';
import PromocionTable from '../components/PromocionTable';
import PromocionViewModal from '../components/PromocionViewModal';
import PromocionCreateModal from '../components/PromocionCreateModal';
import PromocionEditModal from '../components/PromocionEditModal';
import CustomAlert from '../../../components/CustomAlert';
import { colors } from '../../../utils/theme';
import { useLayout } from '../../../utils/layout';

export default function PromocionScreens() {
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [textoFiltrado, setTextoFiltrado] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Modales
  const [selectedPromocion, setSelectedPromocion] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Estados para la alerta personalizada
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: 'success', title: '', message: '' });

  const { isPhone } = useLayout();

  const cargarPromociones = async () => {
    try {
      setLoading(true);
      const data = await getPromociones();
      setPromociones(data);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // La carga inicial es una sincronización con la API; el estado se actualiza al resolver la petición.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarPromociones();
  }, []);

  const showAlertBox = (type, title, message) => {
    setAlertConfig({ type, title, message });
    setAlertVisible(true);
  };

  // Manejador de Registro
  const handleCreateSubmit = async (formData) => {
    try {
      const response = await registrarPromocion(formData);

      if (response.status || response.success) {
        setCreateModalVisible(false);
        cargarPromociones();
        showAlertBox('success', '¡Éxito!', response.msj || 'Promoción registrada correctamente.');
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo registrar la promoción.');
      }
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    }
  };

  // Manejador de Modificación
  const handleEditSubmit = async (formData) => {
    try {
      const response = await modificarPromocion(formData);

      if (response.status || response.success) {
        setEditModalVisible(false);
        cargarPromociones();
        showAlertBox('success', '¡Actualizado!', response.msj || 'Promoción actualizada correctamente.');
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo actualizar la promoción.');
      }
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    }
  };

  // Manejador de Eliminación
  const handleDelete = async (promocion) => {
    const promocionId = promocion.id_promocion || promocion.id;
    const nombrePromocion = promocion.nombre_promocion || 'Promoción';

    if (!promocionId) {
      showAlertBox('error', 'Error', 'No se pudo identificar el ID de la promoción a eliminar.');
      return;
    }

    const confirmado = window.confirm(`¿Estás seguro de eliminar la promoción ${nombrePromocion}?`);
    if (!confirmado) return;

    try {
      const response = await eliminarPromocion(promocionId);

      if (response.status || response.success) {
        cargarPromociones();
        showAlertBox('success', '¡Eliminado!', response.msj || `Promoción ${nombrePromocion} eliminada correctamente.`);
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo eliminar la promoción.');
      }
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    }
  };

  const q = textoFiltrado.trim().toLowerCase();
  const filtered = promociones.filter(p =>
    String(p.nombre_promocion ?? '').toLowerCase().includes(q) ||
    String(p.descripcion_promocion ?? '').toLowerCase().includes(q)
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
      <PageHeader icon="tag" title="Gestión de Promociones" crumb="Inicio  ›  Promociones" />

      <View style={[styles.toolbar, isPhone && styles.toolbarPhone]}>
        <View style={styles.leftTools}>
          <TouchableOpacity style={styles.btnNuevo} onPress={() => setCreateModalVisible(true)}>
            <Text style={styles.btnNuevoText}>+ Registrar</Text>
          </TouchableOpacity>
        </View>
        <SearchBar filterText={textoFiltrado} onChangeText={handleSearchChange} placeholder="Buscar promoción..." style={isPhone ? styles.searchPhone : styles.searchWide} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.red} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
            {paginatedData.length > 0 ? (
              <PromocionTable
                promociones={paginatedData}
                onView={(p) => { setSelectedPromocion(p); setViewModalVisible(true); }}
                onEdit={(p) => { setSelectedPromocion(p); setEditModalVisible(true); }}
                onDelete={handleDelete}
              />
            ) : <Text style={styles.noResults}>No se encontraron promociones.</Text>}
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

      {/* Modales Componentizados */}
      <PromocionViewModal visible={viewModalVisible} promocion={selectedPromocion} onClose={() => setViewModalVisible(false)} />
      <PromocionCreateModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} onSubmit={handleCreateSubmit} />
      <PromocionEditModal
        key={editModalVisible ? selectedPromocion?.id_promocion ?? 'nuevo' : 'cerrado'}
        visible={editModalVisible}
        promocion={selectedPromocion}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleEditSubmit}
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
  leftTools: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  btnNuevo: { backgroundColor: colors.red, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  btnNuevoText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  searchWide: { width: 300, maxWidth: '100%', backgroundColor: colors.card },
  searchPhone: { flex: 1, backgroundColor: colors.card },
  tableScroll: { width: '100%' },
  loading: { marginVertical: 40 },
  error: { color: '#f87171', textAlign: 'center', padding: 24 },
  noResults: { padding: 24, textAlign: 'center', color: colors.muted },
});