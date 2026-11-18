import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Page, PageHeader } from '../../../components/Page';
import SearchBar from '../../../components/SearchBar';
import Pagination from '../../../components/Pagination';
import { getProveedores, registrarProveedor, modificarProveedor, eliminarProveedor } from '../services/ProveedorServices';
import ProveedorTable from '../components/ProveedorTable';
import ProveedorViewModal from '../components/ProveedorViewModal';
import ProveedorCreateModal from '../components/ProveedorCreateModal';
import ProveedorEditModal from '../components/ProveedorEditModal';
import CustomAlert from '../../../components/CustomAlert';
import { colors } from '../../../utils/theme';
import { useLayout } from '../../../utils/layout';

export default function ProveedorScreens() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [textoFiltrado, setTextoFiltrado] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Modales
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Estados para la alerta personalizada
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: 'success', title: '', message: '' });

  const { isPhone } = useLayout();

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      const data = await getProveedores();
      setProveedores(data);
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
    cargarProveedores();
  }, []);

  const showAlertBox = (type, title, message) => {
    setAlertConfig({ type, title, message });
    setAlertVisible(true);
  };

  // Manejador de Registro
  const handleCreateSubmit = async (formData) => {
    try {
      const response = await registrarProveedor(formData);

      if (response.status || response.success) {
        setCreateModalVisible(false);
        cargarProveedores();
        showAlertBox('success', '¡Éxito!', response.msj || 'Proveedor registrado correctamente.');
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo registrar el proveedor.');
      }
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    }
  };

  // Manejador de Modificación
  const handleEditSubmit = async (formData) => {
    try {
      const response = await modificarProveedor(formData);

      if (response.status || response.success) {
        setEditModalVisible(false);
        cargarProveedores();
        showAlertBox('success', '¡Actualizado!', response.msj || 'Proveedor actualizado correctamente.');
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo actualizar el proveedor.');
      }
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    }
  };

  // Manejador de Eliminación
  const handleDelete = async (proveedor) => {
    const proveedorId = proveedor.id_proveedor || proveedor.id;
    const nombreProveedor = proveedor.nombre_proveedor || 'Proveedor';

    if (!proveedorId) {
      showAlertBox('error', 'Error', 'No se pudo identificar el ID del proveedor a eliminar.');
      return;
    }

    const confirmado = window.confirm(`¿Estás seguro de eliminar a ${nombreProveedor}?`);
    if (!confirmado) return;

    try {
      const response = await eliminarProveedor(proveedorId);

      if (response.status || response.success) {
        cargarProveedores();
        showAlertBox('success', '¡Eliminado!', response.msj || `Proveedor ${nombreProveedor} eliminado correctamente.`);
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo eliminar el proveedor.');
      }
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    }
  };

  // Filtrado
  const q = textoFiltrado.trim().toLowerCase();
  const filtered = proveedores.filter(p =>
    String(p.nombre_proveedor ?? '').toLowerCase().includes(q) ||
    String(p.id_proveedor ?? '').includes(q) ||
    String(p.direccion_proveedor ?? '').toLowerCase().includes(q)
  );

  // Paginación dinámica
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
      <PageHeader icon="users" title="Gestión de Proveedores" crumb="Inicio  ›  Proveedores" />

      <View style={[styles.toolbar, isPhone && styles.toolbarPhone]}>
        <View style={styles.leftTools}>
          <TouchableOpacity style={styles.btnNuevo} onPress={() => setCreateModalVisible(true)}>
            <Text style={styles.btnNuevoText}>+ Registrar</Text>
          </TouchableOpacity>
        </View>
        <SearchBar filterText={textoFiltrado} onChangeText={handleSearchChange} placeholder="Buscar por nombre, RIF o dirección..." style={isPhone ? styles.searchPhone : styles.searchWide} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.red} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
            {paginatedData.length > 0 ? (
              <ProveedorTable
                proveedores={paginatedData}
                onView={(p) => { setSelectedProveedor(p); setViewModalVisible(true); }}
                onEdit={(p) => { setSelectedProveedor(p); setEditModalVisible(true); }}
                onDelete={handleDelete}
              />
            ) : <Text style={styles.noResults}>No se encontraron proveedores.</Text>}
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

      {/* Modales */}
      <ProveedorViewModal visible={viewModalVisible} proveedor={selectedProveedor} onClose={() => setViewModalVisible(false)} />
      <ProveedorCreateModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} onSubmit={handleCreateSubmit} />
      <ProveedorEditModal
        key={editModalVisible ? selectedProveedor?.id_proveedor ?? 'nuevo' : 'cerrado'}
        visible={editModalVisible}
        proveedor={selectedProveedor}
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