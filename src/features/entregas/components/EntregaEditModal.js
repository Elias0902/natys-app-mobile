import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';
import { digitsOnly, firstError, isBlank, isDate, isInteger, isPhone, lengthBetween } from '../../../utils/validation';
import { getEstadosEntregaSelect, getSectoresSelect, getCamionesSelect } from '../services/EntregaServices';

// El estado se inicializa desde la fila seleccionada; la pantalla remonta el
// modal con `key` cada vez que se abre, para reflejar los datos recién cargados.
const formInicial = (entrega) => ({
  id: String(entrega?.id ?? entrega?.id_entregas ?? ''),
  id_entregas: String(entrega?.id_entregas ?? entrega?.id ?? ''),
  pedido_id: String(entrega?.pedido_id ?? entrega?.id_pedido ?? ''),
  cliente_id: String(entrega?.cliente_id ?? ''),
  direccion: String(entrega?.direccion ?? ''),
  telefono: String(entrega?.telefono_contacto ?? entrega?.tlf_cliente ?? ''),
  fecha_programada: String(entrega?.fecha_programada ?? ''),
  repartidor: String(entrega?.repartidor ?? ''),
  observaciones: String(entrega?.observaciones ?? ''),
  sector: String(entrega?.sector ?? ''),
  num_cajas: String(entrega?.num_cajas ?? ''),
  estado: String(entrega?.estado_id ?? entrega?.estado ?? ''),
  id_camion: String(entrega?.id_camion ?? ''),
});

export default function EntregaEditModal({ visible, entrega, onClose, onSubmit }) {
  const [form, setForm] = useState(() => formInicial(entrega));
  const [sectores, setSectores] = useState([]);
  const [camiones, setCamiones] = useState([]);
  const [estadosEntrega, setEstadosEntrega] = useState([]);

  // Los catálogos se cargan al abrir; el formulario ya viene de `formInicial`.
  useEffect(() => {
    if (!visible) return;

    Promise.all([getSectoresSelect(), getCamionesSelect(), getEstadosEntregaSelect()])
      .then(([sectoresData, camionesData, estadosData]) => {
        setSectores(sectoresData);
        setCamiones(camionesData);
        setEstadosEntrega(estadosData);
      })
      .catch(() => {});
  }, [visible]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleUpdate = () => {
    const camion = camiones.find((c) => String(c.id_camion) === String(form.id_camion));
    const error = firstError([
      [!isInteger(form.id), 'La entrega seleccionada no es válida.'],
      [!isInteger(form.pedido_id), 'Selecciona un pedido válido.'],
      [!isBlank(form.cliente_id) && !isInteger(form.cliente_id), 'El cliente seleccionado no es válido.'],
      [isBlank(form.direccion), 'La dirección de entrega es obligatoria (*).'],
      [!isBlank(form.direccion) && !lengthBetween(form.direccion, 1, 300), 'La dirección no puede superar los 300 caracteres.'],
      [!isBlank(form.telefono) && !isPhone(form.telefono), 'Ingresa un teléfono válido de 11 dígitos (ej: 04163213495).'],
      [!isDate(form.fecha_programada), 'Selecciona una fecha programada válida (AAAA-MM-DD).'],
      [isBlank(form.repartidor), 'El nombre del repartidor es obligatorio (*).'],
      [!isBlank(form.repartidor) && !lengthBetween(form.repartidor, 2, 100), 'El repartidor debe tener entre 2 y 100 caracteres.'],
      [isBlank(form.sector), 'Selecciona el sector de la entrega (*).'],
      [!isInteger(form.num_cajas) || Number(form.num_cajas) <= 0, 'El número de cajas debe ser un entero mayor a cero.'],
      [isBlank(form.estado), 'Selecciona un estado de entrega (*).'],
      [!isInteger(form.id_camion), 'Selecciona un camión válido.'],
      [form.observaciones.length > 299, 'Las observaciones no pueden superar los 299 caracteres.'],
      [camion && Number(form.num_cajas) > Number(camion.capacidad_cajas || 0), `El camión ${camion.placa} solo admite ${camion.capacidad_cajas} cajas.`],
    ]);
    if (error) { alert(error); return; }

    onSubmit({
      id: form.id,
      pedido_id: form.pedido_id,
      cliente_id: form.cliente_id,
      direccion: form.direccion,
      telefono: digitsOnly(form.telefono),
      fecha_programada: form.fecha_programada,
      repartidor: form.repartidor,
      observaciones: form.observaciones,
      sector: form.sector,
      num_cajas: form.num_cajas,
      estado: form.estado,
      id_camion: form.id_camion,
    });
    onClose();
  };

  if (!entrega) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Entrega #{form.id_entregas}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sector</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {sectores.map((sector) => (
                  <TouchableOpacity
                    key={sector.id_sector}
                    style={[styles.optionBtn, form.sector === sector.nombre_sector && styles.optionSelected]}
                    onPress={() => handleChange('sector', sector.nombre_sector)}
                  >
                    <Text style={[styles.optionText, form.sector === sector.nombre_sector && styles.optionTextSelected]}>
                      {sector.nombre_sector}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Camión</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {camiones.map((camion) => (
                  <TouchableOpacity
                    key={camion.id_camion}
                    style={[styles.optionBtnLarge, String(form.id_camion) === String(camion.id_camion) && styles.optionSelected]}
                    onPress={() => handleChange('id_camion', String(camion.id_camion))}
                  >
                    <Text
                      numberOfLines={1}
                      style={[styles.optionText, String(form.id_camion) === String(camion.id_camion) && styles.optionTextSelected]}
                    >
                      {camion.placa} · {camion.capacidad_cajas} cajas
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estado de la Entrega</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {estadosEntrega.map((estado) => (
                  <TouchableOpacity
                    key={estado.id_estado_entrega}
                    style={[styles.optionBtn, String(form.estado) === String(estado.id_estado_entrega) && styles.optionSelected]}
                    onPress={() => handleChange('estado', String(estado.id_estado_entrega))}
                  >
                    <Text style={[styles.optionText, String(form.estado) === String(estado.id_estado_entrega) && styles.optionTextSelected]}>
                      {estado.nombre_estado}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Repartidor *</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor={colors.muted}
                value={form.repartidor}
                onChangeText={(v) => handleChange('repartidor', v)}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Fecha Programada</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={colors.muted}
                  value={form.fecha_programada}
                  onChangeText={(v) => handleChange('fecha_programada', v)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Número de Cajas</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={colors.muted}
                  value={form.num_cajas}
                  onChangeText={(v) => handleChange('num_cajas', v)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección de Entrega</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholderTextColor={colors.muted}
                value={form.direccion}
                onChangeText={(v) => handleChange('direccion', v)}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono de Contacto</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor={colors.muted}
                value={form.telefono}
                onChangeText={(v) => handleChange('telefono', v)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observaciones</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholderTextColor={colors.muted}
                value={form.observaciones}
                onChangeText={(v) => handleChange('observaciones', v)}
                multiline
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleUpdate}>
              <Text style={styles.btnSubmitText}>Actualizar Entrega</Text>
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
  optionBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#0f172a', borderWidth: 1, borderColor: colors.border, borderRadius: 6, alignItems: 'center' },
  optionBtnLarge: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#0f172a', borderWidth: 1, borderColor: colors.border, borderRadius: 6, alignItems: 'center', maxWidth: 190 },
  optionSelected: { backgroundColor: colors.red, borderColor: colors.red },
  optionText: { color: colors.muted, fontSize: 12, fontWeight: 'bold' },
  optionTextSelected: { color: '#ffffff' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});
