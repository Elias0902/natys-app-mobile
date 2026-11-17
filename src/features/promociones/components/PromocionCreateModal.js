import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';

export default function PromocionCreateModal({ visible, onClose, onSubmit }) {
  const [form, setForm] = useState({
    nombre_promocion: '',
    descripcion_promocion: '',
    tipo_descuento: 'porcentaje',
    valor_descuento: '',
    fecha_inicio: '',
    fecha_fin: '',
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = () => {
    if (!form.nombre_promocion || !form.tipo_descuento || !form.valor_descuento) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }
    onSubmit(form);
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
              <TextInput style={styles.input} placeholder="Ej. 10% en galletas" placeholderTextColor={colors.muted} value={form.nombre_promocion} onChangeText={(v) => handleChange('nombre_promocion', v)} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder="Detalles de la promoción..." placeholderTextColor={colors.muted} value={form.descripcion_promocion} onChangeText={(v) => handleChange('descripcion_promocion', v)} multiline />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Tipo (ej. porcentaje, 2x1) *</Text>
                <TextInput style={styles.input} placeholder="porcentaje" placeholderTextColor={colors.muted} value={form.tipo_descuento} onChangeText={(v) => handleChange('tipo_descuento', v)} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Valor *</Text>
                <TextInput style={styles.input} placeholder="10" placeholderTextColor={colors.muted} value={form.valor_descuento} onChangeText={(v) => handleChange('valor_descuento', v)} keyboardType="numeric" />
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Fecha Inicio</Text>
                <TextInput style={styles.input} placeholder="AAAA-MM-DD" placeholderTextColor={colors.muted} value={form.fecha_inicio} onChangeText={(v) => handleChange('fecha_inicio', v)} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Fecha Fin</Text>
                <TextInput style={styles.input} placeholder="AAAA-MM-DD" placeholderTextColor={colors.muted} value={form.fecha_fin} onChangeText={(v) => handleChange('fecha_fin', v)} />
              </View>
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
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});