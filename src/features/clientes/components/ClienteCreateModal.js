import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../../utils/theme';
import { digitsOnly, firstError, isBlank, isEmail, isInteger, isPhone, isRif, inList, lengthBetween } from '../../../utils/validation';
import { getTiposCliente } from '../services/ClienteServices';

export default function ClienteCreateModal({ visible, onClose, onSubmit }) {
  const [form, setForm] = useState({
    id_cliente: '',
    tipo_id: 'V',
    nombre_cliente: '',
    direccion_cliente: '',
    sector: 'Norte',
    tlf_cliente: '',
    email_cliente: '',
    tipo_cliente: '',
    dias_credito: '7',
    estado_cliente: 'Pendiente',
    imagen_base64: null,
  });

  const [tiposCliente, setTiposCliente] = useState([]);

  useEffect(() => {
    if (visible) {
      getTiposCliente()
        .then((data) => {
          setTiposCliente(data);
          if (data.length > 0) {
            setForm((prev) => ({ ...prev, tipo_cliente: String(data[0].id_tipo_cliente), dias_credito: String(data[0].dias_credito) }));
          }
        })
        .catch(() => {});
    }
  }, [visible]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // Manejador para seleccionar tipo de cliente y asignar días de crédito automáticamente
  const handleTipoClienteChange = (idTipo) => {
    const selected = tiposCliente.find((t) => String(t.id_tipo_cliente) === String(idTipo));
    setForm({
      ...form,
      tipo_cliente: idTipo,
      dias_credito: selected ? String(selected.dias_credito) : form.dias_credito,
    });
  };

  // Selector de imagen y conversión a Base64
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setForm({ ...form, imagen_base64: `data:image/png;base64,${result.assets[0].base64}` });
    }
  };

  const handleSave = () => {
    const error = firstError([
      [isBlank(form.id_cliente), 'La cédula o RIF es obligatoria (*).'],
      [!isBlank(form.id_cliente) && !isRif(digitsOnly(form.id_cliente)), 'La cédula o RIF solo debe tener números.'],
      [isBlank(form.nombre_cliente), 'El nombre del cliente es obligatorio (*).'],
      [!isBlank(form.nombre_cliente) && !lengthBetween(form.nombre_cliente, 2, 100), 'El nombre debe tener entre 2 y 100 caracteres.'],
      [isBlank(form.tlf_cliente), 'El teléfono es obligatorio (*).'],
      [!isBlank(form.tlf_cliente) && !isPhone(form.tlf_cliente), 'Ingresa un teléfono válido de 11 dígitos (ej: 04163213495).'],
      [!isBlank(form.email_cliente) && !isEmail(form.email_cliente), 'Ingresa un correo electrónico válido.'],
      [!isBlank(form.direccion_cliente) && !lengthBetween(form.direccion_cliente, 5, 200), 'La dirección debe tener entre 5 y 200 caracteres.'],
      [!inList(String(form.tipo_id ?? '').trim().charAt(0), ['V', 'E', 'J', 'G', 'C']), 'Selecciona un tipo de documento válido.'],
      [isBlank(form.sector), 'Selecciona un sector.'],
      [!isInteger(form.dias_credito), 'Los días de crédito deben ser un número entero mayor o igual a cero.'],
    ]);
    if (error) { alert(error); return; }
    onSubmit({
      ...form,
      id_cliente: digitsOnly(form.id_cliente),
      tlf_cliente: digitsOnly(form.tlf_cliente),
      tipo_id: String(form.tipo_id ?? '').trim().charAt(0),
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Registrar Nuevo Cliente</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            {/* Tipo de Documento y Cédula/RIF */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1.2 }]}>
                <Text style={styles.label}>Tipo Doc *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                  {['V', 'E', 'J', 'G', 'C'].map((item) => (
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
              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={styles.label}>Cédula / RIF *</Text>
                <TextInput style={styles.input} placeholder="Ej. 33220449" placeholderTextColor={colors.muted} value={form.id_cliente} onChangeText={(v) => handleChange('id_cliente', v)} keyboardType="numeric" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del Cliente *</Text>
              <TextInput style={styles.input} placeholder="Nombre completo o razón social" placeholderTextColor={colors.muted} value={form.nombre_cliente} onChangeText={(v) => handleChange('nombre_cliente', v)} />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Teléfono *</Text>
                <TextInput style={styles.input} placeholder="04120000000" placeholderTextColor={colors.muted} value={form.tlf_cliente} onChangeText={(v) => handleChange('tlf_cliente', v)} keyboardType="phone-pad" />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Correo Electrónico</Text>
                <TextInput style={styles.input} placeholder="correo@gmail.com" placeholderTextColor={colors.muted} value={form.email_cliente} onChangeText={(v) => handleChange('email_cliente', v)} keyboardType="email-address" />
              </View>
            </View>

            {/* Sector (Select: Norte, Sur, Este, Oeste) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sector *</Text>
              <View style={styles.optionsRow}>
                {['Norte', 'Sur', 'Este', 'Oeste'].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.optionBtnLarge, form.sector === item && styles.optionSelected]}
                    onPress={() => handleChange('sector', item)}
                  >
                    <Text style={[styles.optionText, form.sector === item && styles.optionTextSelected]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tipo de Cliente (Cargado de la API) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de Cliente</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {tiposCliente.map((t) => (
                  <TouchableOpacity
                    key={t.id_tipo_cliente}
                    style={[styles.optionBtnLarge, String(form.tipo_cliente) === String(t.id_tipo_cliente) && styles.optionSelected]}
                    onPress={() => handleTipoClienteChange(t.id_tipo_cliente)}
                  >
                    <Text style={[styles.optionText, String(form.tipo_cliente) === String(t.id_tipo_cliente) && styles.optionTextSelected]}>
                      {t.nombre_tipo_cliente}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Días de Crédito</Text>
                <TextInput style={styles.input} value={form.dias_credito} onChangeText={(v) => handleChange('dias_credito', v)} keyboardType="numeric" />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Estado</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                  {['Pendiente', 'Activo', 'Anulado'].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.optionBtn, form.estado_cliente === item && styles.optionSelected]}
                      onPress={() => handleChange('estado_cliente', item)}
                    >
                      <Text style={[styles.optionText, form.estado_cliente === item && styles.optionTextSelected]}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Subir Imagen */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Imagen del Cliente</Text>
              <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
                <Text style={styles.imagePickerText}>{form.imagen_base64 ? 'Imagen seleccionada ✓' : 'Seleccionar Imagen de Perfil'}</Text>
              </TouchableOpacity>
              {form.imagen_base64 && <Image source={{ uri: form.imagen_base64 }} style={styles.previewImg} />}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder="Dirección exacta..." placeholderTextColor={colors.muted} value={form.direccion_cliente} onChangeText={(v) => handleChange('direccion_cliente', v)} multiline />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSave}>
              <Text style={styles.btnSubmitText}>Guardar Cliente</Text>
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
  textArea: { height: 60, textAlignVertical: 'top' },
  optionsRow: { flexDirection: 'row', gap: 6, marginVertical: 4 },
  optionBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#0f172a', borderWidth: 1, borderColor: colors.border, borderRadius: 6, alignItems: 'center' },
  optionBtnLarge: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#0f172a', borderWidth: 1, borderColor: colors.border, borderRadius: 6, alignItems: 'center' },
  optionSelected: { backgroundColor: colors.red, borderColor: colors.red },
  optionText: { color: colors.muted, fontSize: 12, fontWeight: 'bold' },
  optionTextSelected: { color: '#ffffff' },
  imagePickerBtn: { backgroundColor: '#334155', padding: 10, borderRadius: 6, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: colors.border },
  imagePickerText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  previewImg: { width: 50, height: 50, borderRadius: 25, alignSelf: 'center', marginTop: 6 },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});