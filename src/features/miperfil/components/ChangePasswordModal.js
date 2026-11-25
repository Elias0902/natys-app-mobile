import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { colors } from '../../../utils/theme';
import { isBlank, isPassword } from '../../../utils/validation';

const DEFAULT_VALUES = {
  password_actual: '',
  password_nueva: '',
  password_repetir: '',
};

const RULES = {
  password_actual: { required: 'Ingresa tu contraseña actual.' },
  password_nueva: {
    required: 'Ingresa la contraseña nueva.',
    validate: (v) =>
      isBlank(v) ||
      isPassword(v) ||
      'La contraseña debe tener de 6 a 11 caracteres, una mayúscula y un punto. Ej: Natys12.',
  },
  password_repetir: {
    required: 'Repite la contraseña nueva.',
    validate: (v, values) =>
      isBlank(v) || v === values.password_nueva || 'Las contraseñas nuevas no coinciden.',
  },
};

export default function ChangePasswordModal({ visible, onClose, onSubmit }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (visible) reset(DEFAULT_VALUES);
  }, [visible, reset]);

  const handleSave = (values) => {
    onSubmit(values);
    onClose();
  };

  const renderInput = (placeholder) => function PasswordField({ field, fieldState }) {
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{placeholder}</Text>
        <TextInput
          style={[styles.input, !!fieldState.error && styles.inputError]}
          secureTextEntry
          placeholder="********"
          placeholderTextColor={colors.muted}
          {...field}
        />
        {!!fieldState.error && <Text style={styles.error}>{fieldState.error.message}</Text>}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Controller
              name="password_actual"
              control={control}
              rules={RULES.password_actual}
              render={renderInput('Contraseña Actual *')}
            />
            <Controller
              name="password_nueva"
              control={control}
              rules={RULES.password_nueva}
              render={renderInput('Nueva Contraseña *')}
            />
            <Controller
              name="password_repetir"
              control={control}
              rules={RULES.password_repetir}
              render={renderInput('Repetir Nueva Contraseña *')}
            />
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit(handleSave)}>
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
  inputError: { borderColor: '#f87171' },
  error: { color: '#f87171', fontSize: 11, marginTop: 3 },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 20, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});
