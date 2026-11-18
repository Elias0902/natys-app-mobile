import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { Page, PageHeader } from '../../../components/Page';
import SearchBar from '../../../components/SearchBar';
import Pagination from '../../../components/Pagination';
import { getCuentaPagar } from '../services/CuentaPagarServices';
import { registrarPago } from '../../pagos/services/PagoServices';
import CuentaPagarTable from '../components/CuentaPagarTable';
import CuentaPagarViewModal from '../components/CuentaPagarViewModal';
import PagoFormModal from '../../pagos/components/PagoFormModal';
import CustomAlert from '../../../components/CustomAlert';
import { colors } from '../../../utils/theme';
import { useLayout } from '../../../utils/layout';

const hoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// El abono es un pago a proveedor asociado a la cuenta y a su compra.
const pagoInicialAbono = (cuenta) => ({
  id_proveedor: String(cuenta?.id_proveedor ?? ''),
  id_cuenta_x_pagar: String(cuenta?.id_cuenta_x_pagar ?? ''),
  monto: String(cuenta?.saldo_pendiente ?? ''),
  fecha_pago: hoy(),
  concepto: `Abono a cuenta por pagar #${cuenta?.id_cuenta_x_pagar ?? ''}`,
});

export default function CuentaPagarScreens() {
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
      const data = await getCuentaPagar();
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

  // Filtrado por proveedor, estado de pago o ID
  const q = textoFiltrado.trim().toLowerCase();
  const filtered = cuentas.filter(c =>
    String(c.nombre_proveedor ?? '').toLowerCase().includes(q) ||
    String(c.estado_pago ?? '').toLowerCase().includes(q) ||
    String(c.id_cuenta_x_pagar ?? '').includes(q) ||
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
      <PageHeader icon="file-text" title="Cuentas por Pagar" crumb="Inicio  ›  Cuentas por Pagar" />

      <View style={[styles.toolbar, isPhone && styles.toolbarPhone]}>
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
                onAbonar={(c) => { setSelectedCuenta(c); setAbonoModalVisible(true); }}
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
      <PagoFormModal
        key={abonoModalVisible ? `abono-${selectedCuenta?.id_cuenta_x_pagar ?? 'nuevo'}` : 'cerrado'}
        visible={abonoModalVisible}
        pago={pagoInicialAbono(selectedCuenta)}
        tipo="proveedores"
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
