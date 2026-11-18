import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { Page, PageHeader } from '../../../components/Page';
import SearchBar from '../../../components/SearchBar';
import Pagination from '../../../components/Pagination';
import { getCuentaCobrar } from '../services/CuentaCobrarServices';
import { registrarPago } from '../../pagos/services/PagoServices';
import CuentaCobrarTable from '../components/CuentaCobrarTable';
import CuentaCobrarViewModal from '../components/CuentaCobrarViewModal';
import PagoFormModal from '../../pagos/components/PagoFormModal';
import CustomAlert from '../../../components/CustomAlert';
import { colors } from '../../../utils/theme';
import { useLayout } from '../../../utils/layout';

const hoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// El abono es un pago de cliente asociado a la cuenta y a su pedido.
const pagoInicialAbono = (cuenta) => ({
  id_cliente: String(cuenta?.id_cliente ?? ''),
  id_pedido: String(cuenta?.id_pedido ?? ''),
  id_cuenta_x_cobrar: String(cuenta?.id_cuenta_x_cobrar ?? ''),
  monto: String(cuenta?.saldo_pendiente ?? ''),
  fecha_pago: hoy(),
  concepto: `Abono a cuenta por cobrar #${cuenta?.id_cuenta_x_cobrar ?? ''}`,
});

export default function CuentaCobrarScreens() {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [textoFiltrado, setTextoFiltrado] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Solo consulta y abono: no hay alta, edición ni baja de cuentas.
  const [selectedCuenta, setSelectedCuenta] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [abonoModalVisible, setAbonoModalVisible] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: 'success', title: '', message: '' });

  const { isPhone } = useLayout();

  const cargarCuentas = async () => {
    try {
      setLoading(true);
      const data = await getCuentaCobrar();
      setCuentas(data);
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
    cargarCuentas();
  }, []);

  const showAlertBox = (type, title, message) => {
    setAlertConfig({ type, title, message });
    setAlertVisible(true);
  };

  // Abonar usa exactamente el mismo endpoint que el registro de pagos.
  const handleAbonarSubmit = async (formData) => {
    try {
      const response = await registrarPago(formData);
      if (response.status || response.success) {
        setAbonoModalVisible(false);
        setSelectedCuenta(null);
        cargarCuentas();
        showAlertBox('success', '¡Abono registrado!', response.msj || 'Abono registrado correctamente.');
      } else {
        showAlertBox('error', 'Error', response.message || response.msj || 'No se pudo registrar el abono.');
      }
    } catch (e) {
      showAlertBox('error', 'Error de conexión', e.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    }
  };

  // Filtrado por cliente, estado de cuenta o ID
  const q = textoFiltrado.trim().toLowerCase();
  const filtered = cuentas.filter(c =>
    String(c.nombre_cliente ?? '').toLowerCase().includes(q) ||
    String(c.estado_cuenta ?? '').toLowerCase().includes(q) ||
    String(c.id_cuenta_x_cobrar ?? '').includes(q) ||
    String(c.id_pedido ?? '').includes(q)
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
      <PageHeader icon="credit-card" title="Cuentas por Cobrar" crumb="Inicio  ›  Cuentas por Cobrar" />

      <View style={[styles.toolbar, isPhone && styles.toolbarPhone]}>
        <SearchBar filterText={textoFiltrado} onChangeText={handleSearchChange} placeholder="Buscar por cliente, estado o ID..." style={isPhone ? styles.searchPhone : styles.searchWide} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.red} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
            {paginatedData.length > 0 ? (
              <CuentaCobrarTable
                cuentas={paginatedData}
                onView={(c) => { setSelectedCuenta(c); setViewModalVisible(true); }}
                onAbonar={(c) => { setSelectedCuenta(c); setAbonoModalVisible(true); }}
              />
            ) : <Text style={styles.noResults}>No se encontraron cuentas por cobrar.</Text>}
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
      <CuentaCobrarViewModal visible={viewModalVisible} cuenta={selectedCuenta} onClose={() => setViewModalVisible(false)} />
      <PagoFormModal
        key={abonoModalVisible ? `abono-${selectedCuenta?.id_cuenta_x_cobrar ?? 'nuevo'}` : 'cerrado'}
        visible={abonoModalVisible}
        pago={pagoInicialAbono(selectedCuenta)}
        tipo="clientes"
        title="Registrar Abono"
        submitLabel="Guardar Abono"
        showIdField={false}
        onClose={() => { setAbonoModalVisible(false); setSelectedCuenta(null); }}
        onSubmit={handleAbonarSubmit}
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
  toolbar: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  toolbarPhone: { marginBottom: 12 },
  searchWide: { flex: 1, maxWidth: 480, backgroundColor: colors.card },
  searchPhone: { flex: 1, backgroundColor: colors.card },
  tableScroll: { width: '100%' },
  loading: { marginVertical: 40 },
  error: { color: '#f87171', textAlign: 'center', padding: 24 },
  noResults: { padding: 24, textAlign: 'center', color: colors.muted },
});
