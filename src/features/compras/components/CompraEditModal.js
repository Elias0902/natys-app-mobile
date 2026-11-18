import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';
import { firstError, isBlank, isDate, isInteger, isNonNegative } from '../../../utils/validation';
import { getProveedoresSelect } from '../../proveedores/services/ProveedorServices';
import { getEstadosPagoSelect } from '../services/CompraServices';

// El estado se inicializa desde la fila seleccionada; la pantalla remonta el
// modal con `key` cada vez que se abre, para reflejar los datos recién cargados.
const formInicial = (compra) => ({
  id_compra: String(compra?.id_compra ?? compra?.id ?? ''),
  proveedor_id: String(compra?.id_proveedor ?? compra?.proveedor_id ?? ''),
  fecha: String(compra?.fecha_compra ?? compra?.fecha ?? ''),
  estado: String(compra?.id_estado_pago ?? compra?.estado ?? ''),
  dias_credito: String(compra?.dias_credito ?? 0),
  monto_total_compra: String(compra?.monto_total_compra ?? compra?.total ?? ''),
  observaciones: String(compra?.observaciones ?? ''),
});

export default function CompraEditModal({ visible, compra, onClose, onSubmit }) {
  const [form, setForm] = useState(() => formInicial(compra));
  const [proveedores, setProveedores] = useState([]);
  const [estadosPago, setEstadosPago] = useState([]);

  // Los catálogos se cargan al abrir; el formulario ya viene de `formInicial`.
  useEffect(() => {
    if (!visible) return;

    Promise.all([getProveedoresSelect(), getEstadosPagoSelect()])
      .then(([proveedoresData, estadosData]) => {
        setProveedores(proveedoresData);
        setEstadosPago(estadosData);
      })
      .catch(() => {});
  }, [visible]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleProveedorChange = (proveedorId) => {
    const seleccionado = proveedores.find((p) => String(p.id_proveedor) === String(proveedorId));
    setForm((prev) => ({
      ...prev,
      proveedor_id: String(proveedorId),
      dias_credito: String(seleccionado?.dias_credito ?? prev.dias_credito),
    }));
  };

  const handleUpdate = () => {
    const error = firstError([
      [!isInteger(form.id_compra), 'La compra seleccionada no es válida.'],
      [!isInteger(form.proveedor_id), 'Selecciona un proveedor válido.'],
      [!isDate(form.fecha), 'Selecciona una fecha válida en formato AAAA-MM-DD.'],
      [isBlank(form.estado), 'Selecciona un estado de pago (*).'],
      [isBlank(form.monto_total_compra), 'El monto total de la compra es obligatorio (*).'],
      [!isBlank(form.monto_total_compra) && !isNonNegative(form.monto_total_compra), 'El monto total debe ser un número mayor o igual a cero.'],
      [!isInteger(form.dias_credito), 'Los días de crédito deben ser un número entero igual o mayor a cero.'],
    ]);
    if (error) { alert(error); return; }
    onSubmit(form);
    onClose();
  };

  if (!compra) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Compra #{form.id_compra}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Proveedor *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {proveedores.map((proveedor) => (
                  <TouchableOpacity
                    key={proveedor.id_proveedor}
                    style={[styles.optionBtnLarge, String(form.proveedor_id) === String(proveedor.id_proveedor) && styles.optionSelected]}
                    onPress={() => handleProveedorChange(proveedor.id_proveedor)}
                  >
                    <Text
                      numberOfLines={1}
                      style={[styles.optionText, String(form.proveedor_id) === String(proveedor.id_proveedor) && styles.optionTextSelected]}
                    >
                      {proveedor.nombre_proveedor || proveedor.nombre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estado de Pago *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {estadosPago.map((estado) => (
                  <TouchableOpacity
                    key={estado.id_estado_pago}
                    style={[styles.optionBtn, String(form.estado) === String(estado.id_estado_pago) && styles.optionSelected]}
                    onPress={() => handleChange('estado', String(estado.id_estado_pago))}
                  >
                    <Text style={[styles.optionText, String(form.estado) === String(estado.id_estado_pago) && styles.optionTextSelected]}>
                      {estado.nombre_estado}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Fecha de la Compra *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor={colors.muted}
                  value={form.fecha}
                  onChangeText={(v) => handleChange('fecha', v)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Días de Crédito</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={colors.muted}
                  value={form.dias_credito}
                  onChangeText={(v) => handleChange('dias_credito', v)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monto Total ($) *</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor={colors.muted}
                value={form.monto_total_compra}
                onChangeText={(v) => handleChange('monto_total_compra', v)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observaciones</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
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
            <TouchableOpacity style={styles.btnSubmit} onPress={handleUpdate}>
              <Text style={styles.btnSubmitText}>Actualizar Compra</Text>
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
