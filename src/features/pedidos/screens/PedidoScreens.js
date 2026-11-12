import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Page, PageHeader } from '../../../components/Page';
import SearchBar from '../../../components/SearchBar';
import Pagination from '../../../components/Pagination';
import { getPedidos } from '../services/PedidoServices';
import PedidoTable from '../components/PedidoTable';
import PedidoViewModal from '../components/PedidoViewModal';
import PedidoCreateModal from '../components/PedidoCreateModal';
import PedidoEditModal from '../components/PedidoEditModal';
import { colors } from '../../../utils/theme';
import { useLayout } from '../../../utils/layout';

export default function PedidoScreens() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [textoFiltrado, setTextoFiltrado] = useState('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Modales
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const { isPhone } = useLayout();

  useEffect(() => {
    getPedidos().then(setPedidos).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  // Filtrado
  const q = textoFiltrado.trim().toLowerCase();
  const filtered = pedidos.filter(p => 
    String(p.id_pedido).includes(q) || 
    p.nombre_cliente.toLowerCase().includes(q) || 
    p.productos.toLowerCase().includes(q) || 
    p.nombre_estado.toLowerCase().includes(q)
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
      <PageHeader icon="briefcase" title="Gestión de Pedidos" crumb="Inicio  ›  Pedidos" />
      
      <View style={[styles.toolbar, isPhone && styles.toolbarPhone]}>
        <View style={styles.leftTools}>
          <TouchableOpacity style={styles.btnNuevo} onPress={() => setCreateModalVisible(true)}>
            <Text style={styles.btnNuevoText}>+ Registrar</Text>
          </TouchableOpacity>
        </View>
        <SearchBar filterText={textoFiltrado} onChangeText={handleSearchChange} placeholder="Buscar por ID, cliente, producto o estado..." style={isPhone ? styles.searchPhone : styles.searchWide} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.red} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
            {paginatedData.length > 0 ? (
              <PedidoTable 
                pedidos={paginatedData}
                onView={(p) => { setSelectedPedido(p); setViewModalVisible(true); }}
                onEdit={(p) => { setSelectedPedido(p); setEditModalVisible(true); }}
                onDelete={(p) => alert(`Eliminar pedido #${p.id_pedido}`)}
              />
            ) : <Text style={styles.noResults}>No se encontraron pedidos.</Text>}
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
      <PedidoViewModal visible={viewModalVisible} pedido={selectedPedido} onClose={() => setViewModalVisible(false)} />
      <PedidoCreateModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} onSubmit={(data) => console.log('Crear:', data)} />
      <PedidoEditModal visible={editModalVisible} pedido={selectedPedido} onClose={() => setEditModalVisible(false)} onSubmit={(data) => console.log('Editar:', data)} />
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