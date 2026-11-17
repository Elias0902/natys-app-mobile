import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Page, PageHeader } from '../../../components/Page';
import SearchBar from '../../../components/SearchBar';
import Pagination from '../../../components/Pagination';
import { getPagos } from '../services/PagoServices';
import PagoTable from '../components/PagoTable';
import PagoViewModal from '../components/PagoViewModal';
import { colors } from '../../../utils/theme';
import { useLayout } from '../../../utils/layout';

const TABS = [
  { key: 'clientes', label: 'Pagos de Clientes' },
  { key: 'proveedores', label: 'Pagos de Proveedores' },
];

export default function PagoScreens() {
  const [pagosData, setPagosData] = useState({ clientes: [], proveedores: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subTab, setSubTab] = useState('clientes');
  const [textoFiltrado, setTextoFiltrado] = useState('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Modal Ver
  const [selectedPago, setSelectedPago] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const { isPhone } = useLayout();

  useEffect(() => {
    getPagos()
      .then(setPagosData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const currentList = subTab === 'clientes' ? pagosData.clientes : pagosData.proveedores;
  const q = textoFiltrado.trim().toLowerCase();
  const filtered = currentList.filter(item => 
    item.nombre.toLowerCase().includes(q) || 
    String(item.nro_referencia).includes(q) ||
    item.concepto.toLowerCase().includes(q)
  );

  const totalPages = Math.ceil(filtered.length / recordsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const handleTabChange = (tabKey) => {
    setSubTab(tabKey);
    setCurrentPage(1);
    setTextoFiltrado('');
  };

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
      <PageHeader icon="credit-card" title="Gestión de Pagos" crumb="Inicio  ›  Pagos" />
      
      {/* Pestañas internas para Clientes y Proveedores */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs} contentContainerStyle={styles.tabsInner}>
        {TABS.map((t) => (
          <TouchableOpacity key={t.key} onPress={() => handleTabChange(t.key)} style={[styles.tab, subTab === t.key && styles.tabOn]}>
            <Text style={[styles.tabText, subTab === t.key && { color: '#fff' }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={[styles.toolbar, isPhone && styles.toolbarPhone]}>
        <SearchBar filterText={textoFiltrado} onChangeText={handleSearchChange} placeholder="Buscar por nombre, referencia o concepto..." style={isPhone ? styles.searchPhone : styles.searchWide} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.red} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
            {paginatedData.length > 0 ? (
              <PagoTable 
                pagos={paginatedData}
                onView={(item) => { setSelectedPago(item); setViewModalVisible(true); }}
              />
            ) : <Text style={styles.noResults}>No se encontraron registros de pago.</Text>}
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

      {/* Modal Componentizado */}
      <PagoViewModal 
        visible={viewModalVisible} 
        pago={selectedPago} 
        onClose={() => setViewModalVisible(false)} 
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  tabs: { marginBottom: 12, flexGrow: 0 },
  tabsInner: { gap: 8 },
  tab: { borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#0f172a' },
  tabOn: { backgroundColor: colors.red, borderColor: colors.red },
  tabText: { color: colors.muted, fontWeight: '700', fontSize: 13 },
  toolbar: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 },
  toolbarPhone: { marginBottom: 12 },
  searchWide: { width: 300, maxWidth: '100%', backgroundColor: colors.card },
  searchPhone: { flex: 1, backgroundColor: colors.card },
  tableScroll: { width: '100%' },
  loading: { marginVertical: 40 },
  error: { color: '#f87171', textAlign: 'center', padding: 24 },
  noResults: { padding: 24, textAlign: 'center', color: colors.muted },
});