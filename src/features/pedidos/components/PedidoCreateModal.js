import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';
import { digitsOnly, firstError, isBlank, isInteger, isNonNegative, isPhone, isPositive, lengthBetween } from '../../../utils/validation';
import { getClientesSelect } from '../../clientes/services/ClienteServices';
import { getProductosSelect } from '../../productos/services/ProductoServices';
import { getEstadosPedidoSelect } from '../services/PedidoServices';

const filaVacia = () => ({ producto: '', cantidad: '', precio: '' });

export default function PedidoCreateModal({ visible, onClose, onSubmit }) {
  const [form, setForm] = useState({
    id_cliente: '',
    dias_credito: '0',
    estado: '1',
    direccion_entrega: '',
    tlf_contacto: '',
    observaciones: '',
    monto_total_pedido: '',
  });
  const [detalle, setDetalle] = useState([filaVacia()]);
  const [clientes, setClientes] = useState([]);
  const [productosCatalogo, setProductosCatalogo] = useState([]);
  const [estadosPedido, setEstadosPedido] = useState([]);

  useEffect(() => {
    if (!visible) return;

    Promise.all([getClientesSelect(), getProductosSelect(), getEstadosPedidoSelect()])
      .then(([clientesData, productosData, estadosData]) => {
        setClientes(clientesData);
        setProductosCatalogo(productosData);
        setEstadosPedido(estadosData);

        const primerCliente = clientesData[0];
        if (primerCliente) {
          setForm((prev) => ({
            ...prev,
            id_cliente: String(primerCliente.id_cliente),
            direccion_entrega: primerCliente.direccion_cliente || prev.direccion_entrega,
            tlf_contacto: primerCliente.tlf_cliente || prev.tlf_contacto,
            dias_credito: String(primerCliente.dias_credito ?? prev.dias_credito),
          }));
        }

        const primerEstado = estadosData[0];
        if (primerEstado) {
          setForm((prev) => ({ ...prev, estado: String(primerEstado.id_estado_pedido) }));
        }
      })
      .catch(() => {});
  }, [visible]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleClienteChange = (clienteId) => {
    const seleccionado = clientes.find((c) => String(c.id_cliente) === String(clienteId));
    setForm((prev) => ({
      ...prev,
      id_cliente: String(clienteId),
      direccion_entrega: seleccionado?.direccion_cliente || prev.direccion_entrega,
      tlf_contacto: seleccionado?.tlf_cliente || prev.tlf_contacto,
      dias_credito: String(seleccionado?.dias_credito ?? prev.dias_credito),
    }));
  };

  const handleDetalleChange = (index, key, value) => {
    setDetalle((filas) => filas.map((fila, i) => (i === index ? { ...fila, [key]: value } : fila)));
  };

  const handleProductoSeleccionado = (index, producto) => {
    setDetalle((filas) => filas.map((fila, i) => (
      i === index
        ? { ...fila, producto: String(producto.id_producto), precio: String(producto.precio_venta ?? '') }
        : fila
    )));
  };

  const handleSave = () => {
    const filas = detalle.filter((f) => !isBlank(f.producto) || !isBlank(f.cantidad) || !isBlank(f.precio));
    const productosDetalle = filas.map((f) => f.producto);
    const cantidades = filas.map((f) => f.cantidad);
    const precios = filas.map((f) => f.precio);
    const totalCajas = cantidades.reduce((sum, c) => sum + (isInteger(c) ? Number(c) : 0), 0);

    const error = firstError([
      [!isInteger(form.id_cliente), 'Selecciona un cliente válido.'],
      [isBlank(form.direccion_entrega), 'La dirección de entrega es obligatoria (*).'],
      [!isBlank(form.direccion_entrega) && !lengthBetween(form.direccion_entrega, 5, 200), 'La dirección debe tener entre 5 y 200 caracteres.'],
      [!isPhone(form.tlf_contacto), 'Ingresa un teléfono válido de 11 dígitos (ej: 04163213495).'],
      [!isNonNegative(form.monto_total_pedido), 'El monto total debe ser un número mayor o igual a cero.'],
      [!isInteger(form.dias_credito), 'Los días de crédito deben ser un número entero mayor o igual a cero.'],
      [form.observaciones.length > 250, 'Las observaciones no pueden superar los 250 caracteres.'],
      [filas.length === 0, 'Agrega al menos un producto al detalle del pedido.'],
      [filas.some((f) => isBlank(f.producto) || isBlank(f.cantidad) || isBlank(f.precio)), 'Completa el producto, la cantidad y el precio de cada fila del detalle.'],
      [filas.some((f) => !isInteger(f.cantidad) || Number(f.cantidad) <= 0), 'La cantidad de cada producto debe ser un entero mayor a cero.'],
      [filas.some((f) => !isPositive(f.precio)), 'El precio de cada producto debe ser mayor a cero.'],
      [totalCajas < 100 || totalCajas > 300, 'El total de cajas del pedido debe estar entre 100 y 300.'],
    ]);
    if (error) { alert(error); return; }

    onSubmit({
      ...form,
      tlf_contacto: digitsOnly(form.tlf_contacto),
      productos: productosDetalle,
      cantidades,
      precios,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Registrar Nuevo Pedido</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cliente *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {clientes.map((cliente) => (
                  <TouchableOpacity
                    key={cliente.id_cliente}
                    style={[styles.optionBtnLarge, String(form.id_cliente) === String(cliente.id_cliente) && styles.optionSelected]}
                    onPress={() => handleClienteChange(cliente.id_cliente)}
                  >
                    <Text
                      numberOfLines={1}
                      style={[styles.optionText, String(form.id_cliente) === String(cliente.id_cliente) && styles.optionTextSelected]}
                    >
                      {cliente.nombre_cliente}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estado del Pedido</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {estadosPedido.map((estado) => (
                  <TouchableOpacity
                    key={estado.id_estado_pedido}
                    style={[styles.optionBtn, String(form.estado) === String(estado.id_estado_pedido) && styles.optionSelected]}
                    onPress={() => handleChange('estado', String(estado.id_estado_pedido))}
                  >
                    <Text style={[styles.optionText, String(form.estado) === String(estado.id_estado_pedido) && styles.optionTextSelected]}>
                      {estado.nombre_estado}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Teléfono de Contacto *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. 04121234567"
                  placeholderTextColor={colors.muted}
                  value={form.tlf_contacto}
                  onChangeText={(v) => handleChange('tlf_contacto', v)}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Días de Crédito</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={colors.muted}
                  value={form.dias_credito}
                  onChangeText={(v) => handleChange('dias_credito', v)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección de Entrega *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Dirección completa..."
                placeholderTextColor={colors.muted}
                value={form.direccion_entrega}
                onChangeText={(v) => handleChange('direccion_entrega', v)}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monto Total ($) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 165.00"
                placeholderTextColor={colors.muted}
                value={form.monto_total_pedido}
                onChangeText={(v) => handleChange('monto_total_pedido', v)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observaciones</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Notas adicionales..."
                placeholderTextColor={colors.muted}
                value={form.observaciones}
                onChangeText={(v) => handleChange('observaciones', v)}
                multiline
              />
            </View>

            <Text style={styles.sectionTitle}>Detalle del pedido (100 a 300 cajas)</Text>
            {detalle.map((fila, index) => (
              <View key={index} style={styles.detailBlock}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                  {productosCatalogo.map((producto) => {
                    const seleccionado = String(fila.producto) === String(producto.id_producto);
                    return (
                      <TouchableOpacity
                        key={producto.id_producto}
                        style={[styles.optionBtnLarge, seleccionado && styles.optionSelected]}
                        onPress={() => handleProductoSeleccionado(index, producto)}
                      >
                        <Text numberOfLines={1} style={[styles.optionText, seleccionado && styles.optionTextSelected]}>
                          #{producto.id_producto} {producto.nombre_producto}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                <View style={styles.detailRow}>
                  <TextInput
                    style={[styles.input, styles.detalleCorto]}
                    placeholder="Cajas"
                    placeholderTextColor={colors.muted}
                    value={fila.cantidad}
                    onChangeText={(v) => handleDetalleChange(index, 'cantidad', v)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.input, styles.detalleCorto]}
                    placeholder="Precio"
                    placeholderTextColor={colors.muted}
                    value={fila.precio}
                    onChangeText={(v) => handleDetalleChange(index, 'precio', v)}
                    keyboardType="numeric"
                  />
                  {detalle.length > 1 && (
                    <TouchableOpacity onPress={() => setDetalle((filas) => filas.filter((_, i) => i !== index))}>
                      <Text style={styles.removeRow}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.btnAgregar} onPress={() => setDetalle((filas) => [...filas, filaVacia()])}>
              <Text style={styles.btnAgregarText}>+ Agregar producto</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSave}>
              <Text style={styles.btnSubmitText}>Guardar Pedido</Text>
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
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: colors.text, marginTop: 8 },
  optionsRow: { flexDirection: 'row', gap: 6, marginVertical: 4 },
  optionBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#0f172a', borderWidth: 1, borderColor: colors.border, borderRadius: 6, alignItems: 'center' },
  optionBtnLarge: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#0f172a', borderWidth: 1, borderColor: colors.border, borderRadius: 6, alignItems: 'center', maxWidth: 190 },
  optionSelected: { backgroundColor: colors.red, borderColor: colors.red },
  optionText: { color: colors.muted, fontSize: 12, fontWeight: 'bold' },
  optionTextSelected: { color: '#ffffff' },
  detailBlock: { gap: 4, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detalleCorto: { flex: 1 },
  removeRow: { color: '#f87171', fontSize: 16, fontWeight: 'bold' },
  btnAgregar: { alignSelf: 'flex-start', paddingVertical: 6 },
  btnAgregarText: { color: '#fca5a5', fontSize: 12, fontWeight: '700' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});
