import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';
import { firstError, isBlank, isDate, isDateRange, inList, isInteger, isNonNegative, lengthBetween } from '../../../utils/validation';
import { getProductosSelect } from '../../productos/services/ProductoServices';
import { getTiposPromocion, getEstadosPromocion } from '../services/PromocionServices';

export default function PromocionCreateModal({ visible, onClose, onSubmit }) {
  const [form, setForm] = useState({
    nombre_promocion: '',
    descripcion_promocion: '',
    tipo_descuento: 'porcentaje',
    valor_descuento: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: '1',
    productos: [],
  });
  const [productos, setProductos] = useState([]);
  const [tiposPromocion, setTiposPromocion] = useState([]);
  const [estadosPromocion, setEstadosPromocion] = useState([]);

  useEffect(() => {
    if (!visible) return;

    Promise.all([getProductosSelect(), getTiposPromocion(), getEstadosPromocion()])
      .then(([productosData, tiposData, estadosData]) => {
        setProductos(productosData);
        setTiposPromocion(tiposData);
        setEstadosPromocion(estadosData);

        setForm((prev) => ({
          ...prev,
          tipo_descuento: String(tiposData[0]?.tipo ?? prev.tipo_descuento),
          estado: String(estadosData.find((e) => Number(e.id_estado) === 1)?.id_estado ?? estadosData[0]?.id_estado ?? 1),
        }));
      })
      .catch(() => {});
  }, [visible]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const toggleProducto = (idProducto) => {
    setForm((prev) => {
      const seleccionados = prev.productos.map(String);
      const id = String(idProducto);
      return {
        ...prev,
        productos: seleccionados.includes(id)
          ? seleccionados.filter((p) => p !== id)
          : [...seleccionados, id],
      };
    });
  };

  const handleSave = () => {
    const error = firstError([
      [isBlank(form.nombre_promocion), 'El nombre de la promoción es obligatorio (*).'],
      [!isBlank(form.nombre_promocion) && !lengthBetween(form.nombre_promocion, 5, 70), 'El nombre debe tener entre 5 y 70 caracteres.'],
      [!inList(form.tipo_descuento, ['porcentaje', '2x1', 'monto_fijo']), 'Selecciona un tipo de descuento válido.'],
      [isBlank(form.valor_descuento), 'El valor del descuento es obligatorio (*).'],
      [!isBlank(form.valor_descuento) && !isNonNegative(form.valor_descuento), 'El valor del descuento debe ser un número mayor o igual a cero.'],
      [form.tipo_descuento === 'porcentaje' && Number(form.valor_descuento) > 100, 'El porcentaje no puede ser mayor a 100.'],
      [!isDate(form.fecha_inicio), 'Selecciona la fecha de inicio (AAAA-MM-DD).'],
      [!isDate(form.fecha_fin), 'Selecciona la fecha de fin (AAAA-MM-DD).'],
      [!isDateRange(form.fecha_inicio, form.fecha_fin), 'La fecha de fin debe ser igual o posterior a la de inicio.'],
      [!isInteger(form.estado), 'Selecciona un estado válido.'],
      [form.productos.some((p) => !isInteger(p)), 'Los productos seleccionados no son válidos.'],
    ]);
    if (error) { alert(error); return; }

    onSubmit({
      nombre_promocion: form.nombre_promocion,
      descripcion_promocion: form.descripcion_promocion,
      tipo_descuento: form.tipo_descuento,
      valor_descuento: form.valor_descuento,
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin,
      estado: form.estado,
      productos: form.productos,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Registrar Nueva Promoción</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre de la Promoción *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 10% en galletas"
                placeholderTextColor={colors.muted}
                value={form.nombre_promocion}
                onChangeText={(v) => handleChange('nombre_promocion', v)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Detalles de la promoción..."
                placeholderTextColor={colors.muted}
                value={form.descripcion_promocion}
                onChangeText={(v) => handleChange('descripcion_promocion', v)}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de Promoción *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {tiposPromocion.map((tipo) => (
                  <TouchableOpacity
                    key={tipo.tipo}
                    style={[styles.optionBtn, form.tipo_descuento === tipo.tipo && styles.optionSelected]}
                    onPress={() => handleChange('tipo_descuento', tipo.tipo)}
                  >
                    <Text style={[styles.optionText, form.tipo_descuento === tipo.tipo && styles.optionTextSelected]}>
                      {tipo.etiqueta}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estado</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {estadosPromocion.map((estado) => (
                  <TouchableOpacity
                    key={estado.id_estado}
                    style={[styles.optionBtn, String(form.estado) === String(estado.id_estado) && styles.optionSelected]}
                    onPress={() => handleChange('estado', String(estado.id_estado))}
                  >
                    <Text style={[styles.optionText, String(form.estado) === String(estado.id_estado) && styles.optionTextSelected]}>
                      {estado.nombre_estado}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Valor *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10"
                  placeholderTextColor={colors.muted}
                  value={form.valor_descuento}
                  onChangeText={(v) => handleChange('valor_descuento', v)}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Fecha Inicio</Text>
                <TextInput
                  style={styles.input}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor={colors.muted}
                  value={form.fecha_inicio}
                  onChangeText={(v) => handleChange('fecha_inicio', v)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fecha Fin</Text>
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={colors.muted}
                value={form.fecha_fin}
                onChangeText={(v) => handleChange('fecha_fin', v)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Productos incluidos (opcional)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {productos.map((producto) => {
                  const seleccionado = form.productos.map(String).includes(String(producto.id_producto));
                  return (
                    <TouchableOpacity
                      key={producto.id_producto}
                      style={[styles.optionBtnLarge, seleccionado && styles.optionSelected]}
                      onPress={() => toggleProducto(producto.id_producto)}
                    >
                      <Text numberOfLines={1} style={[styles.optionText, seleccionado && styles.optionTextSelected]}>
                        {producto.nombre_producto}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSave}>
              <Text style={styles.btnSubmitText}>Guardar Promoción</Text>
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
  textArea: { height: 60, textAlignVertical: 'top' },
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
