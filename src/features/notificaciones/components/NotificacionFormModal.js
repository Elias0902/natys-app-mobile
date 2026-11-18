import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';
import { firstError, inList, isBlank, isInteger, lengthBetween } from '../../../utils/validation';

const fechaActual = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

const formVacio = () => ({
  titulo: '',
  descripcion_notificacion: '',
  tipo_notificacion: 'general',
  alcance: 'especifica',
  enlace: '',
  fecha: fechaActual(),
  id_usuario: '',
});

// El estado se inicializa desde las props; la pantalla usa `key` para remontar
// el modal cuando cambia la notificación que se está creando/editando.
const formInicial = (notificacion) => {
  if (!notificacion) return formVacio();

  return {
    titulo: notificacion.titulo || '',
    descripcion_notificacion: notificacion.descripcion_notificacion || '',
    tipo_notificacion: notificacion.tipo_notificacion || 'general',
    alcance: notificacion.alcance || 'especifica',
    enlace: notificacion.enlace || '',
    fecha: notificacion.fecha_notificacion || fechaActual(),
    id_usuario: notificacion.id_usuario ? String(notificacion.id_usuario) : '',
  };
};

export default function NotificacionFormModal({ visible, notificacion, onClose, onSubmit }) {
  const [form, setForm] = useState(() => formInicial(notificacion));

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = () => {
    const error = firstError([
      [isBlank(form.titulo), 'El título es obligatorio (*).'],
      [!isBlank(form.titulo) && !lengthBetween(form.titulo, 5, 100), 'El título debe tener entre 5 y 100 caracteres.'],
      [isBlank(form.descripcion_notificacion), 'La descripción es obligatoria (*).'],
      [!isBlank(form.descripcion_notificacion) && !lengthBetween(form.descripcion_notificacion, 5, 400), 'La descripción debe tener entre 5 y 400 caracteres.'],
      [!inList(form.alcance, ['global', 'especifica']), 'Selecciona un alcance válido.'],
      [form.enlace.length > 100, 'El enlace no puede superar los 100 caracteres.'],
      [!form.fecha || !/^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?)?$/.test(String(form.fecha).trim()), 'La fecha no tiene un formato válido.'],
      [!isBlank(form.id_usuario) && !isInteger(form.id_usuario), 'El ID de usuario debe ser un número entero.'],
      [notificacion && !isInteger(notificacion.id_notificaciones), 'La notificación seleccionada no es válida.'],
    ]);
    if (error) { alert(error); return; }

    const payload = { ...form };
    if (!payload.id_usuario) {
      delete payload.id_usuario;
    }
    if (notificacion) {
      payload.id = notificacion.id_notificaciones;
    }

    onSubmit(payload);
    onClose();
  };

  const esEdicion = Boolean(notificacion);

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {esEdicion
                ? `Editar Notificación #${notificacion.id_notificaciones}`
                : 'Registrar Nueva Notificación'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Mantenimiento programado"
                placeholderTextColor={colors.muted}
                value={form.titulo}
                onChangeText={(v) => handleChange('titulo', v)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Detalle de la notificación..."
                placeholderTextColor={colors.muted}
                value={form.descripcion_notificacion}
                onChangeText={(v) => handleChange('descripcion_notificacion', v)}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo</Text>
              <View style={styles.optionsRow}>
                {['general', 'alerta'].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.optionBtn, form.tipo_notificacion === item && styles.optionSelected]}
                    onPress={() => handleChange('tipo_notificacion', item)}
                  >
                    <Text style={[styles.optionText, form.tipo_notificacion === item && styles.optionTextSelected]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alcance</Text>
              <View style={styles.optionsRow}>
                {['especifica', 'global'].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.optionBtn, form.alcance === item && styles.optionSelected]}
                    onPress={() => handleChange('alcance', item)}
                  >
                    <Text style={[styles.optionText, form.alcance === item && styles.optionTextSelected]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={styles.label}>Enlace</Text>
                <TextInput
                  style={styles.input}
                  placeholder="index.php?url=pedidos"
                  placeholderTextColor={colors.muted}
                  value={form.enlace}
                  onChangeText={(v) => handleChange('enlace', v)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Id usuario (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Automático"
                  placeholderTextColor={colors.muted}
                  value={form.id_usuario}
                  onChangeText={(v) => handleChange('id_usuario', v)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fecha (AAAA-MM-DD HH:MM:SS)</Text>
              <TextInput
                style={styles.input}
                placeholder="2026-11-17 12:00:00"
                placeholderTextColor={colors.muted}
                value={form.fecha}
                onChangeText={(v) => handleChange('fecha', v)}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSave}>
              <Text style={styles.btnSubmitText}>{esEdicion ? 'Actualizar' : 'Guardar Notificación'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { backgroundColor: colors.card, width: '100%', maxWidth: 520, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', padding: 20, maxHeight: '90%' },
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
  optionBtn: { paddingVertical: 6, paddingHorizontal: 14, backgroundColor: '#0f172a', borderWidth: 1, borderColor: colors.border, borderRadius: 6, alignItems: 'center' },
  optionSelected: { backgroundColor: colors.red, borderColor: colors.red },
  optionText: { color: colors.muted, fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' },
  optionTextSelected: { color: '#ffffff' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});
