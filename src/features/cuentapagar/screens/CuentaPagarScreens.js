import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Page, PageHeader } from '../../../components/Page';
import SearchBar from '../../../components/SearchBar';
import Pagination from '../../../components/Pagination';
import { getCuentasPagar } from '../services/CuentaPagarServices';
import CuentaPagarTable from '../components/CuentaPagarTable';
import CuentaPagarViewModal from '../components/CuentaPagarViewModal';
import CuentaPagarCreateModal from '../components/CuentaPagarCreateModal';
import CuentaPagarEditModal from '../components/CuentaPagarEditModal';
import { colors } from '../../../utils/theme';
import { useLayout } from '../../../utils/layout';

export default function CuentaPagarScreens() {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [textoFiltrado, setTextoFiltrado] = useState('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Modales
  const [selectedCuenta, setSelectedCuenta] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const { isPhone } = useLayout();

  useEffect(() => {
    getCuentasPagar().then(setCuentas).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  // Filtrado por proveedor, estado de pago o ID
  const q = textoFiltrado.trim().toLowerCase();
  const filtered = cuentas.filter(c => 
    c.nombre_proveedor.toLowerCase().includes(q) || 
    c.estado_pago.toLowerCase().includes(q) ||
    String(c.id_cuenta_x_pagar).includes(q) ||
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
      <PageHeader icon="file-text" title="Cuentas por Pagar" crumb="Inicio  ›  Cuentas por Pagar" />
      
      <View style={[styles.toolbar, isPhone && styles.toolbarPhone]}>
        <View style={styles.leftTools}>
          <TouchableOpacity style={styles.btnNuevo} onPress={() => setCreateModalVisible(true)}>
            <Text style={styles.btnNuevoText}>+ Registrar</Text>
          </TouchableOpacity>
        </View>
        <SearchBar filterText={textoFiltrado} onChangeText={handleSearchChange} placeholder="Buscar por proveedor, estado o ID..." style={isPhone ? styles.searchPhone : styles.searchWide} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.red} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
            {paginatedData.length > 0 ? (
              <CuentaPagarTable 
                cuentas={paginatedData} 
                onView={(c) => { setSelectedCuenta(c); setViewModalVisible(true); }}
                onEdit={(c) => { setSelectedCuenta(c); setEditModalVisible(true); }}
                onDelete={(c) => alert(`Eliminar cuenta: #${c.id_cuenta_x_pagar}`)}
              />
            ) : <Text style={styles.noResults}>No se encontraron cuentas por pagar.</Text>}
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
      <CuentaPagarViewModal visible={viewModalVisible} cuenta={selectedCuenta} onClose={() => setViewModalVisible(false)} />
      <CuentaPagarCreateModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} onSubmit={(data) => console.log('Crear Cuenta Pagar:', data)} />
      <CuentaPagarEditModal visible={editModalVisible} cuenta={selectedCuenta} onClose={() => setEditModalVisible(false)} onSubmit={(data) => console.log('Editar Cuenta Pagar:', data)} />
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