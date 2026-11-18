import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';
import { firstError, isBlank } from '../../../utils/validation';

export default function ChangeAvatarModal({ visible, onClose, onSubmit }) {
  const [imageUrl, setImageUrl] = useState('');

  const handleSave = () => {
    const value = imageUrl.trim();
    const esImagen = /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(value)
      || /^(https?:\/\/|\.?\/?[\w-]+\/)*[\w-]+\.(png|jpe?g|gif|webp)(\?.*)?$/i.test(value);
    const error = firstError([
      [isBlank(value), 'Por favor ingresa una ruta o URL válida para la imagen.'],
      [!isBlank(value) && !esImagen, 'La imagen debe ser JPG, PNG, GIF o WEBP (URL, ruta o base64).'],
    ]);
    if (error) { alert(error); return; }
    onSubmit(value);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
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
              <TextInput 
                style={styles.input} 
                placeholder="Assets/img/perfiles/mi_foto.jpg" 
                placeholderTextColor={colors.muted}
                value={imageUrl}
                onChangeText={setImageUrl}
              />
              <Text style={styles.hint}>Ingresa la ruta relativa o enlace de la nueva imagen de avatar.</Text>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSave}>
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
  hint: { fontSize: 11, color: colors.muted, marginTop: 4 },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 20, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});