import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';

export default function ClienteEditModal({ visible, cliente, onClose, onSubmit }) {
  const [form, setForm] = useState({
    id_cliente: '',
    nombre_cliente: '',
    direccion_cliente: '',
    sector: '',
    tlf_cliente: '',
    email_cliente: '',
    dias_credito: '',
  });

  useEffect(() => {
    if (cliente) {
      setForm({
        id_cliente: cliente.id_cliente || '',
        nombre_cliente: cliente.nombre_cliente || '',
        direccion_cliente: cliente.direccion_cliente || '',
        sector: cliente.sector || '',
        tlf_cliente: cliente.tlf_cliente || '',
        email_cliente: cliente.email_cliente || '',
        dias_credito: String(cliente.dias_credito || ''),
      });
    }
  }, [cliente]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleUpdate = () => {
    if (!form.nombre_cliente || !form.tlf_cliente) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }
    onSubmit(form);
    onClose();
  };

  if (!cliente) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Cliente: {form.nombre_cliente}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del Cliente *</Text>
              <TextInput style={styles.input} placeholderTextColor={colors.muted} value={form.nombre_cliente} onChangeText={(v) => handleChange('nombre_cliente', v)} />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Teléfono *</Text>
                <TextInput style={styles.input} placeholderTextColor={colors.muted} value={form.tlf_cliente} onChangeText={(v) => handleChange('tlf_cliente', v)} keyboardType="phone-pad" />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Sector</Text>
                <TextInput style={styles.input} placeholderTextColor={colors.muted} value={form.sector} onChangeText={(v) => handleChange('sector', v)} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput style={styles.input} placeholderTextColor={colors.muted} value={form.email_cliente} onChangeText={(v) => handleChange('email_cliente', v)} keyboardType="email-address" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Días de Crédito</Text>
              <TextInput style={styles.input} placeholderTextColor={colors.muted} value={form.dias_credito} onChangeText={(v) => handleChange('dias_credito', v)} keyboardType="numeric" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholderTextColor={colors.muted} value={form.direccion_cliente} onChangeText={(v) => handleChange('direccion_cliente', v)} multiline />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleUpdate}>
              <Text style={styles.btnSubmitText}>Actualizar Cliente</Text>
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
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});