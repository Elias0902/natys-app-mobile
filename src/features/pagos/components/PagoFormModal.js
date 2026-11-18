import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';
import { firstError, isBlank, isDate, isInteger, isPositive } from '../../../utils/validation';

// El estado se inicializa desde las props; la pantalla remonta el modal con
// `key` cuando cambia el pago o la pestaña que se está editando.
const formInicial = (pago, esProveedor) => ({
  id_pago: String(pago?.id_pago ?? ''),
  id_pago_proveedor: String(pago?.id_pago_proveedor ?? ''),
  fecha_pago: String(pago?.fecha_pago ?? ''),
  monto: String(pago?.monto_pago ?? pago?.monto ?? ''),
  id_cliente: esProveedor ? '' : String(pago?.id_cliente ?? pago?.id ?? ''),
  id_proveedor: esProveedor ? String(pago?.id_proveedor ?? pago?.id ?? '') : '',
  id_pedido: String(pago?.id_pedido ?? ''),
  id_cuenta_x_cobrar: String(pago?.id_cuenta_x_cobrar ?? ''),
  id_cuenta_x_pagar: String(pago?.id_cuenta_x_pagar ?? ''),
  concepto: String(pago?.concepto ?? ''),
  nro_referencia: String(pago?.nro_referencia ?? ''),
  nombre_metodo: String(pago?.nombre_metodo ?? ''),
  tipo: esProveedor ? 'proveedores' : 'clientes',
});

// Modal reutilizable para registrar, editar y abonar pagos de clientes o proveedores.
// `title`, `submitLabel` y `showIdField` permiten usarlo como formulario de abono
// desde los módulos de cuentas por cobrar/pagar.
export default function PagoFormModal({ visible, pago, tipo = 'clientes', title, submitLabel, showIdField = true, onClose, onSubmit }) {
  const esProveedor = tipo === 'proveedores';

  const [form, setForm] = useState(() => formInicial(pago, esProveedor));

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const idEntidad = esProveedor ? form.id_proveedor : form.id_cliente;
    const error = firstError([
      [pago && !isBlank(idPago) && !isInteger(idPago), 'El ID del pago no es válido.'],
      [!isInteger(idEntidad), esProveedor ? 'Selecciona un proveedor válido (*).' : 'Selecciona un cliente válido (*).'],
      [isBlank(form.monto), 'El monto del pago es obligatorio (*).'],
      [!isBlank(form.monto) && !isPositive(form.monto), 'El monto del pago debe ser mayor a cero.'],
      [!isBlank(form.fecha_pago) && !isDate(form.fecha_pago), 'La fecha de pago no tiene un formato válido.'],
      [!isBlank(form.id_pedido) && !isInteger(form.id_pedido), 'El ID del pedido debe ser un número entero.'],
      [!isBlank(form.id_cuenta_x_cobrar) && !isInteger(form.id_cuenta_x_cobrar), 'El ID de la cuenta por cobrar debe ser un número entero.'],
      [!isBlank(form.id_cuenta_x_pagar) && !isInteger(form.id_cuenta_x_pagar), 'El ID de la cuenta por pagar debe ser un número entero.'],
      [isBlank(form.nombre_metodo), 'Indica el método de pago (*).'],
      [isBlank(form.nro_referencia), 'Indica el número de referencia (*).'],
    ]);
    if (error) { alert(error); return; }
    onSubmit(form);
    onClose();
  };

  const idPago = form.id_pago || form.id_pago_proveedor;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {title || (pago ? `Editar Pago #${idPago}` : 'Registrar Nuevo Pago')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.rowInputs}>
              {showIdField ? (
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>ID Pago</Text>
                  <TextInput
                    style={[styles.input, pago && { opacity: 0.7 }]}
                    placeholder="Se genera automáticamente"
                    placeholderTextColor={colors.muted}
                    value={String(idPago)}
                    onChangeText={(v) => handleChange(esProveedor ? 'id_pago_proveedor' : 'id_pago', v)}
                    editable={!pago}
                    keyboardType="numeric"
                  />
                </View>
              ) : null}
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Fecha de Pago</Text>
                <TextInput
                  style={styles.input}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor={colors.muted}
                  value={form.fecha_pago}
                  onChangeText={(v) => handleChange('fecha_pago', v)}
                />
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Monto *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={colors.muted}
                  value={form.monto}
                  onChangeText={(v) => handleChange('monto', v)}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>
                  {esProveedor ? 'ID Proveedor *' : 'ID Cliente *'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={esProveedor ? 'Ej. 31039811' : 'Ej. 33220449'}
                  placeholderTextColor={colors.muted}
                  value={esProveedor ? form.id_proveedor : form.id_cliente}
                  onChangeText={(v) => handleChange(esProveedor ? 'id_proveedor' : 'id_cliente', v)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>
                  {esProveedor ? 'ID Cuenta por Pagar' : 'ID Pedido'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Opcional"
                  placeholderTextColor={colors.muted}
                  value={
                    esProveedor ? form.id_cuenta_x_pagar : form.id_pedido
                  }
                  onChangeText={(v) =>
                    handleChange(
                      esProveedor ? 'id_cuenta_x_pagar' : 'id_pedido',
                      v,
                    )
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Método de Pago</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Efectivo"
                  placeholderTextColor={colors.muted}
                  value={form.nombre_metodo}
                  onChangeText={(v) => handleChange('nombre_metodo', v)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Concepto</Text>
              <TextInput
                style={styles.input}
                placeholder="Detalle del pago"
                placeholderTextColor={colors.muted}
                value={form.concepto}
                onChangeText={(v) => handleChange('concepto', v)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nro. Referencia</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 000123"
                placeholderTextColor={colors.muted}
                value={form.nro_referencia}
                onChangeText={(v) => handleChange('nro_referencia', v)}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSave}>
              <Text style={styles.btnSubmitText}>
                {submitLabel || (pago ? 'Actualizar Pago' : 'Guardar Pago')}
              </Text>
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
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});
