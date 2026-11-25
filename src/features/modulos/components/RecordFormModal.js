import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import AppModal from '../../../components/AppModal';
import FormField from '../../../components/FormField';
import ActionButton from '../../../components/ActionButton';
import { isDate, isEmail, isNonNegative, isPhone, isRif } from '../../../utils/validation';

// "Registrar" (record = null) y "Modificar" (record = fila a editar).
export default function RecordFormModal({ visible, config, record, moduleLabel, onClose, onSave }) {
  const isEdit = !!record;
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  const idField = useMemo(
    () =>
      config.idEditable
        ? { key: config.id, label: config.idLabel || 'Código', required: true }
        : null,
    [config.idEditable, config.id, config.idLabel],
  );
  const fields = useMemo(
    () => (idField ? [idField, ...config.fields] : config.fields),
    [idField, config.fields],
  );

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {},
    mode: 'onSubmit',
    shouldUnregister: true,
  });

  // Llena el formulario cada vez que se abre.
  useEffect(() => {
    if (!visible) return;

    const start = {};
    fields.forEach((f) => {
      start[f.key] = record ? record[f.key] ?? '' : f.type === 'select' ? f.options[0] : '';
    });
    reset(start);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setServerError('');
  }, [visible, record, fields, reset]);

  const rulesFor = (f) => ({
    required: f.required ? 'Campo obligatorio' : false,
    validate: (value) => {
      const v = String(value ?? '').trim();
      if (!v) return true; // required ya produce el mensaje cuando aplica.

      if (f.type === 'number' && !isNonNegative(v)) return 'Debe ser un número mayor o igual a cero';
      if (f.type === 'date' && !isDate(v) && !(isEdit && v === String(record[f.key]))) return 'Formato AAAA-MM-DD';
      if (/email|correo/i.test(f.key) && !isEmail(v)) return 'Correo electrónico inválido';
      if (/tlf|telefono/i.test(f.key) && !isPhone(v)) return 'Teléfono inválido (ej: 04163213495)';
      if (/rif|cedula/i.test(f.key) && !isRif(v)) return 'Solo se permiten números';
      return true;
    },
  });

  const onSubmit = async (values) => {
    const data = {};
    fields.forEach((f) => {
      const v = String(values[f.key] ?? '').trim();
      data[f.key] = f.type === 'number' && v !== '' ? Number(v) : v;
    });

    setSaving(true);
    setServerError('');
    try {
      await onSave(data);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppModal
      visible={visible}
      title={`${isEdit ? 'Modificar' : 'Registrar'} · ${moduleLabel}`}
      onClose={onClose}
      footer={
        <>
          <ActionButton label="Cancelar" variant="outline" onPress={onClose} />
          <ActionButton
            label={saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Registrar'}
            onPress={handleSubmit(onSubmit)}
            disabled={saving}
          />
        </>
      }
    >
      {fields.map((f) => (
        <Controller
          key={f.key}
          name={f.key}
          control={control}
          rules={rulesFor(f)}
          render={({ field, fieldState }) => (
            <FormField
              field={f}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              editable={!(isEdit && f.key === config.id)}
            />
          )}
        />
      ))}
      {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}
    </AppModal>
  );
}

const styles = StyleSheet.create({
  serverError: { color: '#f87171', textAlign: 'center', marginTop: 4 },
});
