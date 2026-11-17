import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Page, PageHeader } from '../../../components/Page';
import SearchBar from '../../../components/SearchBar';
import Pagination from '../../../components/Pagination';
import { getEntregas } from '../services/EntregaServices'; 
import EntregaTable from '../components/EntregaTable';
import EntregaViewModal from '../components/EntregaViewModal';
import EntregaCreateModal from '../components/EntregaCreateModal';
import EntregaEditModal from '../components/EntregaEditModal';
import { colors } from '../../../utils/theme';
import { useLayout } from '../../../utils/layout';

export default function EntregaScreens() {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [textoFiltrado, setTextoFiltrado] = useState('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Modales
  const [selectedEntrega, setSelectedEntrega] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const { isPhone } = useLayout();

  useEffect(() => {
    // Simulando servicio o llamando a tu función de API real
    getEntregas()
      .then((data) => setEntregas(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Filtrado
  const q = textoFiltrado.trim().toLowerCase();
  const filtered = entregas.filter(e => 
    e.cliente_nombre.toLowerCase().includes(q) || 
    e.camion_placa.toLowerCase().includes(q) || 
    e.repartidor.toLowerCase().includes(q) ||
    e.estado.toLowerCase().includes(q)
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
      <PageHeader icon="truck" title="Gestión de Entregas" crumb="Inicio  ›  Entregas" />
      
      <View style={[styles.toolbar, isPhone && styles.toolbarPhone]}>
        <View style={styles.leftTools}>
          <TouchableOpacity style={styles.btnNuevo} onPress={() => setCreateModalVisible(true)}>
            <Text style={styles.btnNuevoText}>+ Registrar</Text>
          </TouchableOpacity>
        </View>
        <SearchBar filterText={textoFiltrado} onChangeText={handleSearchChange} placeholder="Buscar por cliente, placa, repartidor o estado..." style={isPhone ? styles.searchPhone : styles.searchWide} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.red} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
            {paginatedData.length > 0 ? (
              <EntregaTable 
                entregas={paginatedData}
                onView={(e) => { setSelectedEntrega(e); setViewModalVisible(true); }}
                onEdit={(e) => { setSelectedEntrega(e); setEditModalVisible(true); }}
                onDelete={(e) => alert(`Eliminar entrega #${e.id_entregas}`)}
              />
            ) : <Text style={styles.noResults}>No se encontraron entregas.</Text>}
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
      <EntregaViewModal visible={viewModalVisible} entrega={selectedEntrega} onClose={() => setViewModalVisible(false)} />
      <EntregaCreateModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} onSubmit={(data) => console.log('Crear Entrega:', data)} />
      <EntregaEditModal visible={editModalVisible} entrega={selectedEntrega} onClose={() => setEditModalVisible(false)} onSubmit={(data) => console.log('Editar Entrega:', data)} />
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