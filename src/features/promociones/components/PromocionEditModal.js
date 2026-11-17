import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';

export default function PromocionEditModal({ visible, promocion, onClose, onSubmit }) {
  const [form, setForm] = useState({
    id_promocion: '',
    nombre_promocion: '',
    descripcion_promocion: '',
    tipo_descuento: '',
    valor_descuento: '',
  });

  useEffect(() => {
    if (promocion) {
      setForm({
        id_promocion: promocion.id_promocion || '',
        nombre_promocion: promocion.nombre_promocion || '',
        descripcion_promocion: promocion.descripcion_promocion || '',
        tipo_descuento: promocion.tipo_descuento || '',
        valor_descuento: String(promocion.valor_descuento || ''),
      });
    }
  }, [promocion]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleUpdate = () => {
    if (!form.nombre_promocion || !form.valor_descuento) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }
    onSubmit(form);
    onClose();
  };

  if (!promocion) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Promoción #{form.id_promocion}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre de la Promoción *</Text>
              <TextInput style={styles.input} placeholderTextColor={colors.muted} value={form.nombre_promocion} onChangeText={(v) => handleChange('nombre_promocion', v)} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholderTextColor={colors.muted} value={form.descripcion_promocion} onChangeText={(v) => handleChange('descripcion_promocion', v)} multiline />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Tipo Descuento</Text>
                <TextInput style={styles.input} placeholderTextColor={colors.muted} value={form.tipo_descuento} onChangeText={(v) => handleChange('tipo_descuento', v)} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Valor *</Text>
                <TextInput style={styles.input} placeholderTextColor={colors.muted} value={form.valor_descuento} onChangeText={(v) => handleChange('valor_descuento', v)} keyboardType="numeric" />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleUpdate}>
              <Text style={styles.btnSubmitText}>Actualizar Promoción</Text>
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