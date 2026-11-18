import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';
import { firstError, isBlank, isDate, isInteger, isNonNegative, isPositive } from '../../../utils/validation';
import { getProveedoresSelect } from '../../proveedores/services/ProveedorServices';
import { getMateriasPrimasSelect, getEstadosPagoSelect } from '../services/CompraServices';

const filaVacia = () => ({ materia: '', cantidad: '', precio: '' });

export default function CompraCreateModal({ visible, onClose, onSubmit }) {
  const [form, setForm] = useState({
    id_proveedor: '',
    dias_credito: '0',
    fecha: '',
    id_estado_pago: '1',
    observaciones: '',
    monto_total_compra: '',
  });
  const [detalle, setDetalle] = useState([filaVacia()]);
  const [proveedores, setProveedores] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [estadosPago, setEstadosPago] = useState([]);

  useEffect(() => {
    if (!visible) return;

    Promise.all([getProveedoresSelect(), getMateriasPrimasSelect(), getEstadosPagoSelect()])
      .then(([proveedoresData, materiasData, estadosData]) => {
        setProveedores(proveedoresData);
        setMateriasPrimas(materiasData);
        setEstadosPago(estadosData);

        setForm((prev) => ({
          ...prev,
          id_proveedor: String(proveedoresData[0]?.id_proveedor ?? prev.id_proveedor),
          dias_credito: String(proveedoresData[0]?.dias_credito ?? prev.dias_credito),
          id_estado_pago: String(estadosData[0]?.id_estado_pago ?? prev.id_estado_pago),
          fecha: prev.fecha || new Date().toISOString().slice(0, 10),
        }));
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
      id_proveedor: String(proveedorId),
      dias_credito: String(seleccionado?.dias_credito ?? prev.dias_credito),
    }));
  };

  const handleDetalleChange = (index, key, value) => {
    setDetalle((filas) => filas.map((fila, i) => (i === index ? { ...fila, [key]: value } : fila)));
  };

  const handleMateriaSeleccionada = (index, materia) => {
    setDetalle((filas) => filas.map((fila, i) => (
      i === index ? { ...fila, materia: String(materia.id_materia_prima) } : fila
    )));
  };

  const handleSave = () => {
    const filas = detalle.filter((f) => !isBlank(f.materia) || !isBlank(f.cantidad) || !isBlank(f.precio));
    const materias = filas.map((f) => f.materia);
    const cantidades = filas.map((f) => f.cantidad);
    const precios = filas.map((f) => f.precio);

    const error = firstError([
      [!isInteger(form.id_proveedor), 'Selecciona un proveedor válido.'],
      [!isDate(form.fecha), 'Selecciona una fecha válida en formato AAAA-MM-DD.'],
      [isBlank(form.monto_total_compra), 'El monto total de la compra es obligatorio (*).'],
      [!isBlank(form.monto_total_compra) && !isNonNegative(form.monto_total_compra), 'El monto total debe ser un número mayor o igual a cero.'],
      [!isInteger(form.dias_credito), 'Los días de crédito deben ser un número entero mayor o igual a cero.'],
      [!isInteger(form.id_estado_pago), 'Selecciona un estado de pago válido.'],
      [filas.length === 0, 'Agrega al menos una materia prima al detalle de la compra.'],
      [filas.some((f) => isBlank(f.materia) || isBlank(f.cantidad) || isBlank(f.precio)), 'Completa la materia prima, la cantidad y el precio de cada fila del detalle.'],
      [filas.some((f) => !isPositive(f.cantidad)), 'La cantidad de cada materia prima debe ser mayor a cero.'],
      [filas.some((f) => !isPositive(f.precio)), 'El precio de cada materia prima debe ser mayor a cero.'],
    ]);
    if (error) { alert(error); return; }

    onSubmit({
      id_proveedor: form.id_proveedor,
      dias_credito: form.dias_credito,
      fecha: form.fecha,
      id_estado_pago: form.id_estado_pago,
      observaciones: form.observaciones,
      monto_total_compra: form.monto_total_compra,
      materiasPrimas: materias,
      cantidades,
      precios,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Registrar Nueva Compra</Text>
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
                    style={[styles.optionBtnLarge, String(form.id_proveedor) === String(proveedor.id_proveedor) && styles.optionSelected]}
                    onPress={() => handleProveedorChange(proveedor.id_proveedor)}
                  >
                    <Text
                      numberOfLines={1}
                      style={[styles.optionText, String(form.id_proveedor) === String(proveedor.id_proveedor) && styles.optionTextSelected]}
                    >
                      {proveedor.nombre_proveedor || proveedor.nombre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estado de Pago</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {estadosPago.map((estado) => (
                  <TouchableOpacity
                    key={estado.id_estado_pago}
                    style={[styles.optionBtn, String(form.id_estado_pago) === String(estado.id_estado_pago) && styles.optionSelected]}
                    onPress={() => handleChange('id_estado_pago', String(estado.id_estado_pago))}
                  >
                    <Text style={[styles.optionText, String(form.id_estado_pago) === String(estado.id_estado_pago) && styles.optionTextSelected]}>
                      {estado.nombre_estado}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Días de Crédito</Text>
                <TextInput
                  style={styles.input}
                  value={form.dias_credito}
                  onChangeText={(v) => handleChange('dias_credito', v)}
                  keyboardType="numeric"
                  placeholderTextColor={colors.muted}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Fecha</Text>
                <TextInput
                  style={styles.input}
                  value={form.fecha}
                  onChangeText={(v) => handleChange('fecha', v)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monto Total ($) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 250.00"
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
                placeholder="Notas adicionales..."
                placeholderTextColor={colors.muted}
                value={form.observaciones}
                onChangeText={(v) => handleChange('observaciones', v)}
                multiline
              />
            </View>

            <Text style={styles.sectionTitle}>Detalle de la compra</Text>
            {detalle.map((fila, index) => (
              <View key={index} style={styles.detailBlock}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                  {materiasPrimas.map((materia) => {
                    const seleccionado = String(fila.materia) === String(materia.id_materia_prima);
                    return (
                      <TouchableOpacity
                        key={materia.id_materia_prima}
                        style={[styles.optionBtnLarge, seleccionado && styles.optionSelected]}
                        onPress={() => handleMateriaSeleccionada(index, materia)}
                      >
                        <Text numberOfLines={1} style={[styles.optionText, seleccionado && styles.optionTextSelected]}>
                          {materia.nombre_materia_prima}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                <View style={styles.detailRow}>
                  <TextInput
                    style={[styles.input, styles.detalleCorto]}
                    placeholder="Cantidad"
                    placeholderTextColor={colors.muted}
                    value={fila.cantidad}
                    onChangeText={(v) => handleDetalleChange(index, 'cantidad', v)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.input, styles.detalleCorto]}
                    placeholder="Precio"
                    placeholderTextColor={colors.muted}
                    value={fila.precio}
                    onChangeText={(v) => handleDetalleChange(index, 'precio', v)}
                    keyboardType="numeric"
                  />
                  {detalle.length > 1 && (
                    <TouchableOpacity onPress={() => setDetalle((filas) => filas.filter((_, i) => i !== index))}>
                      <Text style={styles.removeRow}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.btnAgregar} onPress={() => setDetalle((filas) => [...filas, filaVacia()])}>
              <Text style={styles.btnAgregarText}>+ Agregar materia prima</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSave}>
              <Text style={styles.btnSubmitText}>Guardar Compra</Text>
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
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: colors.text, marginTop: 8 },
  optionsRow: { flexDirection: 'row', gap: 6, marginVertical: 4 },
  optionBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#0f172a', borderWidth: 1, borderColor: colors.border, borderRadius: 6, alignItems: 'center' },
  optionBtnLarge: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#0f172a', borderWidth: 1, borderColor: colors.border, borderRadius: 6, alignItems: 'center', maxWidth: 190 },
  optionSelected: { backgroundColor: colors.red, borderColor: colors.red },
  optionText: { color: colors.muted, fontSize: 12, fontWeight: 'bold' },
  optionTextSelected: { color: '#ffffff' },
  detailBlock: { gap: 4, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detalleCorto: { flex: 1 },
  removeRow: { color: '#f87171', fontSize: 16, fontWeight: 'bold' },
  btnAgregar: { alignSelf: 'flex-start', paddingVertical: 6 },
  btnAgregarText: { color: '#fca5a5', fontSize: 12, fontWeight: '700' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});
