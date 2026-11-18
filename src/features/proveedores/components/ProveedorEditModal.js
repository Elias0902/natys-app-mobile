import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';
import { digitsOnly, firstError, isBlank, isEmail, isPhone, isRif, inList, lengthBetween } from '../../../utils/validation';

const TIPOS_RIF = ['J', 'G', 'C'];

// El estado se inicializa desde la fila seleccionada; la pantalla remonta el
// modal con `key` cada vez que se abre para reflejar el proveedor correcto.
const formInicial = (proveedor) => ({
  id_proveedor: String(proveedor?.id_proveedor ?? proveedor?.id ?? ''),
  tipo_id: String(proveedor?.tipo_id ?? ''),
  nombre_proveedor: String(proveedor?.nombre_proveedor ?? ''),
  tlf_proveedor: String(proveedor?.tlf_proveedor ?? ''),
  email_proveedor: String(proveedor?.email_proveedor ?? ''),
  direccion_proveedor: String(proveedor?.direccion_proveedor ?? ''),
});

export default function ProveedorEditModal({ visible, proveedor, onClose, onSubmit }) {
  const [form, setForm] = useState(() => formInicial(proveedor));

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // Conserva valores heredados (por ejemplo "J-") para no cambiar el RIF sin querer.
  const opcionesTipo = TIPOS_RIF.includes(form.tipo_id) || !form.tipo_id
    ? TIPOS_RIF
    : [form.tipo_id, ...TIPOS_RIF];

  const handleUpdate = () => {
    const error = firstError([
      [isBlank(form.id_proveedor) || !isRif(digitsOnly(form.id_proveedor)), 'El RIF debe tener solo números.'],
      [!inList(String(form.tipo_id ?? '').trim().charAt(0), TIPOS_RIF), 'Selecciona un tipo de RIF válido.'],
      [isBlank(form.nombre_proveedor), 'El nombre del proveedor es obligatorio (*).'],
      [!isBlank(form.nombre_proveedor) && !lengthBetween(form.nombre_proveedor, 2, 100), 'El nombre debe tener entre 2 y 100 caracteres.'],
      [isBlank(form.tlf_proveedor), 'El teléfono es obligatorio (*).'],
      [!isBlank(form.tlf_proveedor) && !isPhone(form.tlf_proveedor), 'Ingresa un teléfono válido de 11 dígitos (ej: 04163213495).'],
      [isBlank(form.email_proveedor), 'El correo electrónico es obligatorio (*).'],
      [!isBlank(form.email_proveedor) && !isEmail(form.email_proveedor), 'Ingresa un correo electrónico válido.'],
      [isBlank(form.direccion_proveedor), 'La dirección es obligatoria (*).'],
      [!isBlank(form.direccion_proveedor) && !lengthBetween(form.direccion_proveedor, 5, 200), 'La dirección debe tener entre 5 y 200 caracteres.'],
    ]);
    if (error) { alert(error); return; }
    onSubmit({
      ...form,
      id_proveedor: digitsOnly(form.id_proveedor),
      tlf_proveedor: digitsOnly(form.tlf_proveedor),
      tipo_id: String(form.tipo_id ?? '').trim().charAt(0),
    });
    onClose();
  };

  if (!proveedor) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Proveedor #{form.id_proveedor}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de Documento *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {opcionesTipo.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.optionBtn, form.tipo_id === item && styles.optionSelected]}
                    onPress={() => handleChange('tipo_id', item)}
                  >
                    <Text style={[styles.optionText, form.tipo_id === item && styles.optionTextSelected]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del Proveedor *</Text>
              <TextInput style={styles.input} placeholderTextColor={colors.muted} value={form.nombre_proveedor} onChangeText={(v) => handleChange('nombre_proveedor', v)} />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Teléfono *</Text>
                <TextInput style={styles.input} placeholderTextColor={colors.muted} value={form.tlf_proveedor} onChangeText={(v) => handleChange('tlf_proveedor', v)} keyboardType="phone-pad" />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Correo Electrónico *</Text>
                <TextInput style={styles.input} placeholderTextColor={colors.muted} value={form.email_proveedor} onChangeText={(v) => handleChange('email_proveedor', v)} keyboardType="email-address" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección *</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholderTextColor={colors.muted} value={form.direccion_proveedor} onChangeText={(v) => handleChange('direccion_proveedor', v)} multiline />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleUpdate}>
              <Text style={styles.btnSubmitText}>Actualizar Proveedor</Text>
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
  optionsRow: { flexDirection: 'row', gap: 6, marginVertical: 4 },
  optionBtn: { paddingVertical: 6, paddingHorizontal: 14, backgroundColor: '#0f172a', borderWidth: 1, borderColor: colors.border, borderRadius: 6, alignItems: 'center' },
  optionSelected: { backgroundColor: colors.red, borderColor: colors.red },
  optionText: { color: colors.muted, fontSize: 12, fontWeight: 'bold' },
  optionTextSelected: { color: '#ffffff' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});
