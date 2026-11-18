import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Page, PageHeader } from '../../../components/Page';
import SearchBar from '../../../components/SearchBar';
import Pagination from '../../../components/Pagination';
import { getProductos, registrarProducto, modificarProducto, eliminarProducto } from '../services/ProductoServices';
import ProductoTable from '../components/ProductoTable';
import ProductoViewModal from '../components/ProductoViewModal';
import ProductoCreateModal from '../components/ProductoCreateModal';
import ProductoEditModal from '../components/ProductoEditModal';
import CustomAlert from '../../../components/CustomAlert';
import { colors } from '../../../utils/theme';
import { useLayout } from '../../../utils/layout';

export default function ProductoScreens({ onAdd }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [textoFiltrado, setTextoFiltrado] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Modales
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Estados para la alerta personalizada
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: 'success', title: '', message: '' });

  const { isPhone } = useLayout();

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await getProductos();
      setProductos(data.productos);
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
    cargarProductos();
  }, []);

  const showAlertBox = (type, title, message) => {
    setAlertConfig({ type, title, message });
    setAlertVisible(true);
  };

  // Manejador de Registro
  const handleCreateSubmit = async (formData) => {
    try {
      const response = await registrarProducto(formData);

      if (response.status || response.success) {
        setCreateModalVisible(false);
        cargarProductos();
        showAlertBox('success', '¡Éxito!', response.msj || 'Producto registrado correctamente.');
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo registrar el producto.');
      }
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    }
  };

  // Manejador de Modificación
  const handleEditSubmit = async (formData) => {
    try {
      const response = await modificarProducto(formData);

      if (response.status || response.success) {
        setEditModalVisible(false);
        cargarProductos();
        showAlertBox('success', '¡Actualizado!', response.msj || 'Producto actualizado correctamente.');
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo actualizar el producto.');
      }
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    }
  };

  // Manejador de Eliminación
  const handleDelete = async (producto) => {
    const productoId = producto.id_producto || producto.id;
    const nombreProducto = producto.nombre_producto || 'Producto';

    if (!productoId) {
      showAlertBox('error', 'Error', 'No se pudo identificar el ID del producto a eliminar.');
      return;
    }

    const confirmado = window.confirm(`¿Estás seguro de eliminar el producto ${nombreProducto}?`);
    if (!confirmado) return;

    try {
      const response = await eliminarProducto(productoId);

      if (response.status || response.success) {
        cargarProductos();
        showAlertBox('success', '¡Eliminado!', response.msj || `Producto ${nombreProducto} eliminado correctamente.`);
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo eliminar el producto.');
      }
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    }
  };

  // Filtrado
  const q = textoFiltrado.trim().toLowerCase();
  const filtered = productos.filter(p =>
    String(p.nombre_producto ?? '').toLowerCase().includes(q) ||
    String(p.nombre_categoria ?? '').toLowerCase().includes(q)
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
      <PageHeader icon="tag" title="Gestión de Productos" crumb="Inicio  ›  Productos" />

      <View style={[styles.toolbar, isPhone && styles.toolbarPhone]}>
        <View style={styles.leftTools}>
          <TouchableOpacity style={styles.btnNuevo} onPress={() => setCreateModalVisible(true)}>
            <Text style={styles.btnNuevoText}>+ Registrar</Text>
          </TouchableOpacity>
        </View>
        <SearchBar filterText={textoFiltrado} onChangeText={handleSearchChange} placeholder="Buscar por nombre o categoría..." style={isPhone ? styles.searchPhone : styles.searchWide} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.red} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
            {paginatedData.length > 0 ? (
              <ProductoTable
                productos={paginatedData}
                onAdd={onAdd}
                onView={(p) => { setSelectedProducto(p); setViewModalVisible(true); }}
                onEdit={(p) => { setSelectedProducto(p); setEditModalVisible(true); }}
                onDelete={handleDelete}
              />
            ) : <Text style={styles.noResults}>No se encontraron productos.</Text>}
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
      <ProductoViewModal visible={viewModalVisible} producto={selectedProducto} onClose={() => setViewModalVisible(false)} />
      <ProductoCreateModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} onSubmit={handleCreateSubmit} />
      <ProductoEditModal visible={editModalVisible} producto={selectedProducto} onClose={() => setEditModalVisible(false)} onSubmit={handleEditSubmit} />

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