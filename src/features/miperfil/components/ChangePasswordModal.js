import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';

export default function ChangePasswordModal({ visible, onClose, onSubmit }) {
  const [form, setForm] = useState({
    password_actual: '',
    password_nueva: '',
    password_repetir: '',
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = () => {
    if (!form.password_actual || !form.password_nueva || !form.password_repetir) {
      alert('Por favor completa todos los campos.');
      return;
    }
    if (form.password_nueva !== form.password_repetir) {
      alert('Las contraseñas nuevas no coinciden.');
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
            <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña Actual *</Text>
              <TextInput 
                style={styles.input} 
                secureTextEntry 
                placeholder="********" 
                placeholderTextColor={colors.muted}
                value={form.password_actual}
                onChangeText={(v) => handleChange('password_actual', v)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nueva Contraseña *</Text>
              <TextInput 
                style={styles.input} 
                secureTextEntry 
                placeholder="********" 
                placeholderTextColor={colors.muted}
                value={form.password_nueva}
                onChangeText={(v) => handleChange('password_nueva', v)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Repetir Nueva Contraseña *</Text>
              <TextInput 
                style={styles.input} 
                secureTextEntry 
                placeholder="********" 
                placeholderTextColor={colors.muted}
                value={form.password_repetir}
                onChangeText={(v) => handleChange('password_repetir', v)}
              />
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSave}>
              <Text style={styles.btnSubmitText}>Actualizar Contraseña</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { backgroundColor: colors.card, width: '100%', maxWidth: 450, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 12, marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  closeButton: { fontSize: 18, color: colors.muted, fontWeight: 'bold' },
  modalBody: { gap: 12 },
  inputGroup: { gap: 4 },
  label: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: colors.border, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, color: colors.text, fontSize: 14 },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 20, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});