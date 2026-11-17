import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { Page, PageHeader } from '../../../components/Page';
import SearchBar from '../../../components/SearchBar';
import Pagination from '../../../components/Pagination';
import { getNotificaciones } from '../services/NotificacionServices';
import NotificacionTable from '../components/NotificacionTable';
import NotificacionViewModal from '../components/NotificacionViewModal';
import { colors } from '../../../utils/theme';
import { useLayout } from '../../../utils/layout';

export default function NotificacionScreens() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [textoFiltrado, setTextoFiltrado] = useState('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Modal Ver
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const { isPhone } = useLayout();

  useEffect(() => {
    getNotificaciones()
      .then(setNotificaciones)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const q = textoFiltrado.trim().toLowerCase();
  const filtered = notificaciones.filter(n => 
    n.titulo.toLowerCase().includes(q) || 
    n.descripcion_notificacion.toLowerCase().includes(q)
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
      <PageHeader icon="bell" title="Gestión de Notificaciones" crumb="Inicio  ›  Notificaciones" />
      
      <View style={[styles.toolbar, isPhone && styles.toolbarPhone]}>
        <SearchBar filterText={textoFiltrado} onChangeText={handleSearchChange} placeholder="Buscar notificación..." style={isPhone ? styles.searchPhone : styles.searchWide} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.red} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
            {paginatedData.length > 0 ? (
              <NotificacionTable 
                notificaciones={paginatedData}
                onView={(n) => { setSelectedNotif(n); setViewModalVisible(true); }}
              />
            ) : <Text style={styles.noResults}>No se encontraron notificaciones.</Text>}
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

      <NotificacionViewModal 
        visible={viewModalVisible} 
        notificacion={selectedNotif} 
        onClose={() => setViewModalVisible(false)} 
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  toolbar: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 },
  toolbarPhone: { marginBottom: 12 },
  searchWide: { width: 300, maxWidth: '100%', backgroundColor: colors.card },
  searchPhone: { flex: 1, backgroundColor: colors.card },
  tableScroll: { width: '100%' },
  loading: { marginVertical: 40 },
  error: { color: '#f87171', textAlign: 'center', padding: 24 },
  noResults: { padding: 24, textAlign: 'center', color: colors.muted },
});