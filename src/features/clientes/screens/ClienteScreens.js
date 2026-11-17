import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Page, PageHeader } from '../../../components/Page';
import SearchBar from '../../../components/SearchBar';
import Pagination from '../../../components/Pagination';
import { getClientes, registrarCliente, modificarCliente, eliminarCliente } from '../services/ClienteServices';
import ClienteTable from '../components/ClienteTable';
import ClienteViewModal from '../components/ClienteViewModal';
import ClienteCreateModal from '../components/ClienteCreateModal';
import ClienteEditModal from '../components/ClienteEditModal';
import CustomAlert from '../../../components/CustomAlert'; // <--- 1. Importa tu alerta personalizada
import { colors } from '../../../utils/theme';
import { useLayout } from '../../../utils/layout';

export default function ClienteScreens() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [textoFiltrado, setTextoFiltrado] = useState('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Modales
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Estados para la alerta personalizada (CustomAlert)
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: 'success', title: '', message: '' });

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  const { isPhone } = useLayout();

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      setClientes(data);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // Función auxiliar para disparar la alerta personalizada fácilmente
  const showAlertBox = (type, title, message) => {
    setAlertConfig({ type, title, message });
    setAlertVisible(true);
  };

  // Manejador de Registro
  const handleCreateSubmit = async (formData) => {
    try {
      const response = await registrarCliente(formData);

      if (response.status || response.success) {
      showAlertBox('success', '¡Éxito!', 'Cliente registrado correctamente.');
      setCreateModalVisible(false);
      cargarClientes();
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo registrar el cliente.');
        setCreateModalVisible(true);
      }
    } catch (e) {
      showAlertBox('error', 'Error', e.message);
      setCreateModalVisible(true);
    }
  };

  // Manejador de Modificación
  const handleEditSubmit = async (formData) => {
    try {
      const response = await modificarCliente(formData);
      
      if (response.status || response.success) {
        showAlertBox('success', '¡Actualizado!', response.msj || 'Cliente actualizado correctamente en el sistema.');
        setEditModalVisible(false); 
        cargarClientes(); 
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo actualizar el cliente.');
      }
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    }
  };

// Manejador de Eliminación con confirmación nativa y feedback con CustomAlert
  const handleDelete = async (cliente) => {
    const clienteId = cliente.id_cliente || cliente.id || cliente.rif;
    const nombreCliente = cliente.nombre_cliente || cliente.nombre || 'Cliente';

    if (!clienteId) {
      showAlertBox('error', 'Error', 'No se pudo identificar el ID del cliente a eliminar.');
      return;
    }

    // 1. Pide confirmación directamente antes de proceder
    const confirmado = window.confirm(`¿Estás seguro de eliminar a ${nombreCliente}?`);
    if (!confirmado) return;

    try {
      // 2. Ejecuta la petición de eliminación a la API
      const response = await eliminarCliente(clienteId);

      // 3. Muestra tu alerta personalizada de éxito o error según la respuesta
      if (response.status || response.success) {
        showAlertBox('success', '¡Eliminado!', response.msj || `Cliente ${nombreCliente} eliminado correctamente.`);
        cargarClientes(); // Recarga la tabla de inmediato
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo eliminar el cliente.');
      }
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    }
  };

  // Filtrado
  const q = textoFiltrado.trim().toLowerCase();
  const filtered = clientes.filter(c => 
    c.nombre_cliente.toLowerCase().includes(q) || 
    String(c.id_cliente).includes(q) || 
    c.sector.toLowerCase().includes(q)
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
      <PageHeader icon="users" title="Gestión de Clientes" crumb="Inicio  ›  Clientes" />
      
      <View style={[styles.toolbar, isPhone && styles.toolbarPhone]}>
        <View style={styles.leftTools}>
          <TouchableOpacity style={styles.btnNuevo} onPress={() => setCreateModalVisible(true)}>
            <Text style={styles.btnNuevoText}>+ Registrar</Text>
          </TouchableOpacity>
        </View>
        <SearchBar filterText={textoFiltrado} onChangeText={handleSearchChange} placeholder="Buscar por nombre, cédula o sector..." style={isPhone ? styles.searchPhone : styles.searchWide} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.red} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
            {paginatedData.length > 0 ? (
              <ClienteTable 
                clientes={paginatedData} 
                onView={(c) => { setSelectedCliente(c); setViewModalVisible(true); }}
                onEdit={(c) => { setSelectedCliente(c); setEditModalVisible(true); }}
                onDelete={handleDelete}
              />
            ) : <Text style={styles.noResults}>No se encontraron clientes.</Text>}
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

      {/* Modales del Módulo */}
      <ClienteViewModal visible={viewModalVisible} cliente={selectedCliente} onClose={() => setViewModalVisible(false)} />
      <ClienteCreateModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} onSubmit={handleCreateSubmit} />
      <ClienteEditModal visible={editModalVisible} cliente={selectedCliente} onClose={() => setEditModalVisible(false)} onSubmit={handleEditSubmit} />

      {/* 2. Componente de Alerta Estilo SweetAlert */}
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