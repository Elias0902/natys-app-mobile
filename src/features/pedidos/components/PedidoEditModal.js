import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';
import { digitsOnly, firstError, isBlank, isDate, isInteger, isNonNegative, isPhone, lengthBetween } from '../../../utils/validation';
import { getClientesSelect } from '../../clientes/services/ClienteServices';
import { getEstadosPedidoSelect } from '../services/PedidoServices';

// El estado se inicializa desde la fila seleccionada; la pantalla remonta el
// modal con `key` cada vez que se abre, para reflejar los datos recién cargados.
const formInicial = (pedido) => ({
  id_pedido: String(pedido?.id_pedido ?? pedido?.id ?? ''),
  id_cliente: String(pedido?.id_cliente ?? pedido?.cliente_id ?? ''),
  fecha: String(pedido?.fecha_pedido ?? pedido?.fecha ?? ''),
  estado: String(pedido?.id_estado_pedido ?? pedido?.estado ?? ''),
  tlf_contacto: String(pedido?.tlf_contacto ?? pedido?.telefono ?? ''),
  direccion_entrega: String(pedido?.direccion_entrega ?? ''),
  monto_total_pedido: String(pedido?.monto_total_pedido ?? pedido?.total ?? ''),
  observaciones: String(pedido?.observaciones ?? ''),
});

export default function PedidoEditModal({ visible, pedido, onClose, onSubmit }) {
  const [form, setForm] = useState(() => formInicial(pedido));
  const [clientes, setClientes] = useState([]);
  const [estadosPedido, setEstadosPedido] = useState([]);

  // Los catálogos se cargan al abrir; el formulario ya viene de `formInicial`.
  useEffect(() => {
    if (!visible) return;

    Promise.all([getClientesSelect(), getEstadosPedidoSelect()])
      .then(([clientesData, estadosData]) => {
        setClientes(clientesData);
        setEstadosPedido(estadosData);
      })
      .catch(() => {});
  }, [visible]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleClienteChange = (clienteId) => {
    const seleccionado = clientes.find((c) => String(c.id_cliente) === String(clienteId));
    setForm((prev) => ({
      ...prev,
      id_cliente: String(clienteId),
      direccion_entrega: seleccionado?.direccion_cliente || prev.direccion_entrega,
      tlf_contacto: seleccionado?.tlf_cliente || prev.tlf_contacto,
    }));
  };

  const handleUpdate = () => {
    const error = firstError([
      [!isInteger(form.id_pedido), 'El pedido seleccionado no es válido.'],
      [!isInteger(form.id_cliente), 'Selecciona un cliente válido.'],
      [isBlank(form.direccion_entrega), 'La dirección de entrega es obligatoria (*).'],
      [!isBlank(form.direccion_entrega) && !lengthBetween(form.direccion_entrega, 5, 200), 'La dirección debe tener entre 5 y 200 caracteres.'],
      [!isPhone(form.tlf_contacto), 'Ingresa un teléfono válido de 11 dígitos (ej: 04163213495).'],
      [!isBlank(form.fecha) && !isDate(form.fecha), 'La fecha del pedido no tiene un formato válido.'],
      [!isNonNegative(form.monto_total_pedido), 'El monto total debe ser un número mayor o igual a cero.'],
      [form.observaciones.length > 250, 'Las observaciones no pueden superar los 250 caracteres.'],
    ]);
    if (error) { alert(error); return; }
    onSubmit({ ...form, tlf_contacto: digitsOnly(form.tlf_contacto) });
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Pedido</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cliente</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {clientes.map((cliente) => (
                  <TouchableOpacity
                    key={cliente.id_cliente}
                    style={[styles.optionBtnLarge, String(form.id_cliente) === String(cliente.id_cliente) && styles.optionSelected]}
                    onPress={() => handleClienteChange(cliente.id_cliente)}
                  >
                    <Text
                      numberOfLines={1}
                      style={[styles.optionText, String(form.id_cliente) === String(cliente.id_cliente) && styles.optionTextSelected]}
                    >
                      {cliente.nombre_cliente}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estado del Pedido</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {estadosPedido.map((estado) => (
                  <TouchableOpacity
                    key={estado.id_estado_pedido}
                    style={[styles.optionBtn, String(form.estado) === String(estado.id_estado_pedido) && styles.optionSelected]}
                    onPress={() => handleChange('estado', String(estado.id_estado_pedido))}
                  >
                    <Text style={[styles.optionText, String(form.estado) === String(estado.id_estado_pedido) && styles.optionTextSelected]}>
                      {estado.nombre_estado}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Teléfono de Contacto</Text>
                <TextInput
                  style={styles.input}
                  value={form.tlf_contacto}
                  onChangeText={(v) => handleChange('tlf_contacto', v)}
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.muted}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Fecha</Text>
                <TextInput
                  style={styles.input}
                  value={form.fecha}
                  onChangeText={(v) => handleChange('fecha', v)}
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección de Entrega</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={form.direccion_entrega}
                onChangeText={(v) => handleChange('direccion_entrega', v)}
                multiline
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monto Total</Text>
              <TextInput
                style={styles.input}
                value={form.monto_total_pedido}
                onChangeText={(v) => handleChange('monto_total_pedido', v)}
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observaciones</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={form.observaciones}
                onChangeText={(v) => handleChange('observaciones', v)}
                multiline
                placeholderTextColor={colors.muted}
              />
            </View>
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleUpdate}>
              <Text style={styles.btnSubmitText}>Actualizar Pedido</Text>
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
