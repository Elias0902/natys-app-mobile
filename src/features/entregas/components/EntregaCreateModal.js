import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';
import { firstError, isBlank, isDate, isInteger, lengthBetween } from '../../../utils/validation';
import {
  getEstadosEntregaSelect,
  getSectoresSelect,
  getCamionesSelect,
  getClientesPorSector,
  getPedidosPorCliente,
} from '../services/EntregaServices';

export default function EntregaCreateModal({ visible, onClose, onSubmit }) {
  const [form, setForm] = useState({
    id_camion: '',
    cliente_id: '',
    id_pedido: '',
    sector: '',
    estado: '2',
    fecha_programada: '',
    repartidor: '',
    num_cajas: '',
    observaciones: '',
  });
  const [sectores, setSectores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [camiones, setCamiones] = useState([]);
  const [estadosEntrega, setEstadosEntrega] = useState([]);

  // Catálogos y cascada inicial sector -> cliente -> pedido al abrir el modal.
  useEffect(() => {
    if (!visible) return;

    let cancelado = false;

    (async () => {
      try {
        const [sectoresData, camionesData, estadosData] = await Promise.all([
          getSectoresSelect(),
          getCamionesSelect(),
          getEstadosEntregaSelect(),
        ]);
        if (cancelado) return;

        setSectores(sectoresData);
        setCamiones(camionesData);
        setEstadosEntrega(estadosData);

        const primerSector = sectoresData[0]?.nombre_sector ?? '';
        const camionDisponible = camionesData.find((c) => c.estado === 'disponible') ?? camionesData[0];
        const estadoInicial = estadosData.find((e) => Number(e.id_estado_entrega) === 2) ?? estadosData[0];

        setForm((prev) => ({
          ...prev,
          sector: primerSector,
          id_camion: String(camionDisponible?.id_camion ?? ''),
          estado: String(estadoInicial?.id_estado_entrega ?? 2),
          fecha_programada: prev.fecha_programada || new Date().toISOString().slice(0, 10),
        }));

        if (!primerSector) return;

        const clientesData = await getClientesPorSector(primerSector);
        if (cancelado) return;
        setClientes(clientesData);

        const primerCliente = clientesData[0];
        if (!primerCliente) return;

        setForm((prev) => ({ ...prev, cliente_id: String(primerCliente.id_cliente) }));

        const pedidosData = await getPedidosPorCliente(primerCliente.id_cliente);
        if (cancelado) return;
        setPedidos(pedidosData);

        const primerPedido = pedidosData[0];
        if (primerPedido) {
          setForm((prev) => ({
            ...prev,
            id_pedido: String(primerPedido.id_pedido),
            num_cajas: String(primerPedido.total_cajas ?? ''),
          }));
        }
      } catch {
        // Los catálogos quedan vacíos; el usuario puede abrir de nuevo el modal.
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [visible]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSectorChange = (sector) => {
    setForm((prev) => ({ ...prev, sector, cliente_id: '', id_pedido: '', num_cajas: '' }));
    setClientes([]);
    setPedidos([]);

    getClientesPorSector(sector)
      .then((clientesData) => {
        setClientes(clientesData);
        const primerCliente = clientesData[0];
        if (!primerCliente) return null;

        setForm((prev) => ({ ...prev, cliente_id: String(primerCliente.id_cliente) }));
        return getPedidosPorCliente(primerCliente.id_cliente);
      })
      .then((pedidosData) => {
        setPedidos(pedidosData || []);
        const primerPedido = pedidosData?.[0];
        if (primerPedido) {
          setForm((prev) => ({
            ...prev,
            id_pedido: String(primerPedido.id_pedido),
            num_cajas: String(primerPedido.total_cajas ?? ''),
          }));
        }
      })
      .catch(() => {
        setClientes([]);
        setPedidos([]);
      });
  };

  const handleClienteChange = (clienteId) => {
    setForm((prev) => ({ ...prev, cliente_id: String(clienteId), id_pedido: '', num_cajas: '' }));
    setPedidos([]);

    getPedidosPorCliente(clienteId)
      .then((pedidosData) => {
        setPedidos(pedidosData);
        const primerPedido = pedidosData[0];
        if (primerPedido) {
          setForm((prev) => ({
            ...prev,
            id_pedido: String(primerPedido.id_pedido),
            num_cajas: String(primerPedido.total_cajas ?? ''),
          }));
        }
      })
      .catch(() => setPedidos([]));
  };

  const handlePedidoChange = (pedido) => {
    setForm((prev) => ({
      ...prev,
      id_pedido: String(pedido.id_pedido),
      num_cajas: String(pedido.total_cajas ?? prev.num_cajas),
    }));
  };

  const handleSave = () => {
    const camion = camiones.find((c) => String(c.id_camion) === String(form.id_camion));
    const error = firstError([
      [!isInteger(form.id_camion), 'Selecciona un camión válido.'],
      [!isInteger(form.id_pedido), 'Selecciona un pedido válido.'],
      [isBlank(form.sector), 'Selecciona el sector de la entrega (*).'],
      [isBlank(form.repartidor), 'El nombre del repartidor es obligatorio (*).'],
      [!isBlank(form.repartidor) && !lengthBetween(form.repartidor, 2, 100), 'El repartidor debe tener entre 2 y 100 caracteres.'],
      [!isDate(form.fecha_programada), 'Selecciona una fecha programada válida (AAAA-MM-DD).'],
      [!isInteger(form.num_cajas) || Number(form.num_cajas) <= 0, 'El número de cajas debe ser un entero mayor a cero.'],
      [isBlank(form.estado), 'Selecciona un estado de entrega (*).'],
      [form.observaciones.length > 299, 'Las observaciones no pueden superar los 299 caracteres.'],
      [camion && Number(form.num_cajas) > Number(camion.capacidad_cajas || 0), `El camión ${camion.placa} solo admite ${camion.capacidad_cajas} cajas.`],
    ]);
    if (error) { alert(error); return; }

    onSubmit({
      id_camion: form.id_camion,
      id_pedido: form.id_pedido,
      sector: form.sector,
      estado: form.estado,
      fecha_programada: form.fecha_programada,
      repartidor: form.repartidor,
      num_cajas: form.num_cajas,
      observaciones: form.observaciones,
    });
    onClose();
  };

  const camionesDisponibles = camiones.filter((c) => c.estado === 'disponible');

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Programar Nueva Entrega</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sector</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {sectores.map((sector) => (
                  <TouchableOpacity
                    key={sector.id_sector}
                    style={[styles.optionBtn, form.sector === sector.nombre_sector && styles.optionSelected]}
                    onPress={() => handleSectorChange(sector.nombre_sector)}
                  >
                    <Text style={[styles.optionText, form.sector === sector.nombre_sector && styles.optionTextSelected]}>
                      {sector.nombre_sector}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cliente</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {clientes.map((cliente) => {
                  const seleccionado = String(form.cliente_id) === String(cliente.id_cliente);
                  return (
                    <TouchableOpacity key={cliente.id_cliente} style={[styles.optionBtnLarge, seleccionado && styles.optionSelected]} onPress={() => handleClienteChange(cliente.id_cliente)}>
                      <Text numberOfLines={1} style={[styles.optionText, seleccionado && styles.optionTextSelected]}>
                        {cliente.nombre_cliente}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pedido disponible *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {pedidos.map((pedido) => (
                  <TouchableOpacity
                    key={pedido.id_pedido}
                    style={[styles.optionBtnLarge, String(form.id_pedido) === String(pedido.id_pedido) && styles.optionSelected]}
                    onPress={() => handlePedidoChange(pedido)}
                  >
                    <Text
                      numberOfLines={1}
                      style={[styles.optionText, String(form.id_pedido) === String(pedido.id_pedido) && styles.optionTextSelected]}
                    >
                      #{pedido.id_pedido} · {pedido.total_cajas} cajas
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Camión *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {(camionesDisponibles.length > 0 ? camionesDisponibles : camiones).map((camion) => (
                  <TouchableOpacity
                    key={camion.id_camion}
                    style={[styles.optionBtnLarge, String(form.id_camion) === String(camion.id_camion) && styles.optionSelected]}
                    onPress={() => handleChange('id_camion', String(camion.id_camion))}
                  >
                    <Text
                      numberOfLines={1}
                      style={[styles.optionText, String(form.id_camion) === String(camion.id_camion) && styles.optionTextSelected]}
                    >
                      {camion.placa} · {camion.capacidad_cajas} cajas
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estado de la Entrega</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {estadosEntrega.map((estado) => (
                  <TouchableOpacity
                    key={estado.id_estado_entrega}
                    style={[styles.optionBtn, String(form.estado) === String(estado.id_estado_entrega) && styles.optionSelected]}
                    onPress={() => handleChange('estado', String(estado.id_estado_entrega))}
                  >
                    <Text style={[styles.optionText, String(form.estado) === String(estado.id_estado_entrega) && styles.optionTextSelected]}>
                      {estado.nombre_estado}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del Repartidor *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                placeholderTextColor={colors.muted}
                value={form.repartidor}
                onChangeText={(v) => handleChange('repartidor', v)}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Fecha Programada *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor={colors.muted}
                  value={form.fecha_programada}
                  onChangeText={(v) => handleChange('fecha_programada', v)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Número de Cajas * (auto)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. 240"
                  placeholderTextColor={colors.muted}
                  value={form.num_cajas}
                  onChangeText={(v) => handleChange('num_cajas', v)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observaciones</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Notas de entrega..."
                placeholderTextColor={colors.muted}
                value={form.observaciones}
                onChangeText={(v) => handleChange('observaciones', v)}
                multiline
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSave}>
              <Text style={styles.btnSubmitText}>Guardar Entrega</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { backgroundColor: colors.card, width: '100%', maxWidth: 500, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 12, marginBottom: 12 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  closeButton: { fontSize: 18, color: colors.muted, fontWeight: 'bold' },
  modalBody: { gap: 12 },
  rowInputs: { flexDirection: 'row', gap: 10 },
  inputGroup: { gap: 4 },
  label: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: colors.border, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, color: colors.text, fontSize: 14 },
  textArea: { height: 70, textAlignVertical: 'top' },
  optionsRow: { flexDirection: 'row', gap: 6, marginVertical: 4 },
  optionBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#0f172a', borderWidth: 1, borderColor: colors.border, borderRadius: 6, alignItems: 'center' },
  optionBtnLarge: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#0f172a', borderWidth: 1, borderColor: colors.border, borderRadius: 6, alignItems: 'center', maxWidth: 190 },
  optionSelected: { backgroundColor: colors.red, borderColor: colors.red },
  optionText: { color: colors.muted, fontSize: 12, fontWeight: 'bold' },
  optionTextSelected: { color: '#ffffff' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});
