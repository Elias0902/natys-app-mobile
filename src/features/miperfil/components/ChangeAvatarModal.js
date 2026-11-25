import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { colors } from '../../../utils/theme';
import { isBlank } from '../../../utils/validation';

const DEFAULT_VALUES = { imageUrl: '' };

const RULES = {
  imageUrl: {
    required: 'Por favor ingresa una ruta o URL válida para la imagen.',
    validate: (value) => {
      const v = String(value ?? '').trim();
      if (isBlank(v)) return true; // required muestra el mensaje principal.
      const esImagen =
        /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(v) ||
        /^(https?:\/\/|\.?\/?[\w-]+\/)*[\w-]+\.(png|jpe?g|gif|webp)(\?.*)?$/i.test(v);
      return esImagen || 'La imagen debe ser JPG, PNG, GIF o WEBP (URL, ruta o base64).';
    },
  },
};

export default function ChangeAvatarModal({ visible, onClose, onSubmit }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (visible) reset(DEFAULT_VALUES);
  }, [visible, reset]);

  const handleSave = (values) => {
    onSubmit(values.imageUrl.trim());
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Actualizar Foto de Perfil</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ruta o URL de la Imagen *</Text>
              <Controller
                name="imageUrl"
                control={control}
                rules={RULES.imageUrl}
                render={({ field, fieldState }) => (
                  <>
                    <TextInput
                      style={[styles.input, !!fieldState.error && styles.inputError]}
                      placeholder="Assets/img/perfiles/mi_foto.jpg"
                      placeholderTextColor={colors.muted}
                      {...field}
                    />
                    {!!fieldState.error && <Text style={styles.error}>{fieldState.error.message}</Text>}
                  </>
                )}
              />
              <Text style={styles.hint}>Ingresa la ruta relativa o enlace de la nueva imagen de avatar.</Text>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit(handleSave)}>
              <Text style={styles.btnSubmitText}>Guardar Imagen</Text>
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
  hint: { fontSize: 11, color: colors.muted, marginTop: 4 },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 20, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});
