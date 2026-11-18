import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Page, PageHeader } from '../../../components/Page';
import SearchBar from '../../../components/SearchBar';
import Pagination from '../../../components/Pagination';
import { getCompras, registrarCompra, modificarCompra, eliminarCompra } from '../services/CompraServices';
import CompraTable from '../components/CompraTable';
import CompraViewModal from '../components/CompraViewModal';
import CompraCreateModal from '../components/CompraCreateModal';
import CompraEditModal from '../components/CompraEditModal';
import CustomAlert from '../../../components/CustomAlert';
import { colors } from '../../../utils/theme';
import { useLayout } from '../../../utils/layout';

export default function CompraScreens() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [textoFiltrado, setTextoFiltrado] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Modales
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Estados para la alerta personalizada
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: 'success', title: '', message: '' });

  const { isPhone } = useLayout();

  const cargarCompras = async () => {
    try {
      setLoading(true);
      const data = await getCompras();
      setCompras(data);
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
    cargarCompras();
  }, []);

  const showAlertBox = (type, title, message) => {
    setAlertConfig({ type, title, message });
    setAlertVisible(true);
  };

  // Manejador de Registro
  const handleCreateSubmit = async (formData) => {
    try {
      const response = await registrarCompra(formData);

      if (response.status || response.success) {
        setCreateModalVisible(false);
        cargarCompras();
        showAlertBox('success', '¡Éxito!', response.msj || 'Compra registrada correctamente.');
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo registrar la compra.');
      }
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    }
  };

  // Manejador de Modificación
  const handleEditSubmit = async (formData) => {
    try {
      const response = await modificarCompra(formData);

      if (response.status || response.success) {
        setEditModalVisible(false);
        cargarCompras();
        showAlertBox('success', '¡Actualizado!', response.msj || 'Compra actualizada correctamente.');
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo actualizar la compra.');
      }
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    }
  };

  // Manejador de Eliminación
  const handleDelete = async (compra) => {
    const compraId = compra.id_compra || compra.id;

    if (!compraId) {
      showAlertBox('error', 'Error', 'No se pudo identificar el ID de la compra a eliminar.');
      return;
    }

    const confirmado = window.confirm(`¿Estás seguro de eliminar la compra #${compraId}?`);
    if (!confirmado) return;

    try {
      const response = await eliminarCompra(compraId);

      if (response.status || response.success) {
        cargarCompras();
        showAlertBox('success', '¡Eliminado!', response.msj || `Compra #${compraId} eliminada correctamente.`);
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo eliminar la compra.');
      }
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    }
  };

  // Filtrado por proveedor, materia prima o estado de pago
  const q = textoFiltrado.trim().toLowerCase();
  const filtered = compras.filter(c =>
    String(c.nombre_proveedor ?? '').toLowerCase().includes(q) ||
    String(c.materiaPrima ?? '').toLowerCase().includes(q) ||
    String(c.pago ?? '').toLowerCase().includes(q) ||
    String(c.id_compra ?? '').includes(q)
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
      <PageHeader icon="shopping-cart" title="Gestión de Compras" crumb="Inicio  ›  Compras" />

      <View style={[styles.toolbar, isPhone && styles.toolbarPhone]}>
        <View style={styles.leftTools}>
          <TouchableOpacity style={styles.btnNuevo} onPress={() => setCreateModalVisible(true)}>
            <Text style={styles.btnNuevoText}>+ Registrar</Text>
          </TouchableOpacity>
        </View>
        <SearchBar filterText={textoFiltrado} onChangeText={handleSearchChange} placeholder="Buscar por proveedor, materia prima o estado..." style={isPhone ? styles.searchPhone : styles.searchWide} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.red} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
            {paginatedData.length > 0 ? (
              <CompraTable
                compras={paginatedData}
                onView={(c) => { setSelectedCompra(c); setViewModalVisible(true); }}
                onEdit={(c) => { setSelectedCompra(c); setEditModalVisible(true); }}
                onDelete={handleDelete}
              />
            ) : <Text style={styles.noResults}>No se encontraron compras.</Text>}
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
      <CompraViewModal visible={viewModalVisible} compra={selectedCompra} onClose={() => setViewModalVisible(false)} />
      <CompraCreateModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} onSubmit={handleCreateSubmit} />
      <CompraEditModal
        key={editModalVisible ? selectedCompra?.id_compra ?? 'nuevo' : 'cerrado'}
        visible={editModalVisible}
        compra={selectedCompra}
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
  searchWide: { width: 320, maxWidth: '100%', backgroundColor: colors.card },
  searchPhone: { flex: 1, backgroundColor: colors.card },
  tableScroll: { width: '100%' },
  loading: { marginVertical: 40 },
  error: { color: '#f87171', textAlign: 'center', padding: 24 },
  noResults: { padding: 24, textAlign: 'center', color: colors.muted },
});