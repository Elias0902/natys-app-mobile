import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Page, PageHeader } from '../../../components/Page';
import SearchBar from '../../../components/SearchBar';
import Pagination from '../../../components/Pagination';
import { getCompras } from '../services/CompraServices';
import CompraTable from '../components/CompraTable';
import CompraViewModal from '../components/CompraViewModal';
import CompraCreateModal from '../components/CompraCreateModal';
import CompraEditModal from '../components/CompraEditModal';
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

  const { isPhone } = useLayout();

  useEffect(() => {
    getCompras().then(setCompras).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  // Filtrado por proveedor, materia prima o estado de pago
  const q = textoFiltrado.trim().toLowerCase();
  const filtered = compras.filter(c => 
    c.nombre_proveedor.toLowerCase().includes(q) || 
    (c.materiaPrima && c.materiaPrima.toLowerCase().includes(q)) ||
    c.pago.toLowerCase().includes(q) ||
    String(c.id_compra).includes(q)
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
                onDelete={(c) => alert(`Eliminar compra: #${c.id_compra}`)}
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
      <CompraCreateModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} onSubmit={(data) => console.log('Crear Compra:', data)} />
      <CompraEditModal visible={editModalVisible} compra={selectedCompra} onClose={() => setEditModalVisible(false)} onSubmit={(data) => console.log('Editar Compra:', data)} />
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