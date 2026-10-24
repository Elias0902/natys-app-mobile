import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import AppModal from './AppModal';
import FormField from './FormField';
import ActionButton from './ActionButton';

// "Registrar" (record = null) and "Modificar" (record = the row to edit)
export default function RecordFormModal({ visible, config, record, moduleLabel, onClose, onSave }) {
  const isEdit = !!record;
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  const idField = config.idEditable ? { key: config.id, label: config.idLabel || 'Código', required: true } : null;
  const fields = idField ? [idField, ...config.fields] : config.fields;

  // Fill the form each time it opens
  useEffect(() => {
    if (!visible) return;
    const start = {};
    fields.forEach((f) => {
      start[f.key] = record ? record[f.key] ?? '' : f.type === 'select' ? f.options[0] : '';
    });
    setValues(start);
    setErrors({});
    setServerError('');
  }, [visible, record]);

  const set = (key) => (v) => setValues((p) => ({ ...p, [key]: v }));

  const validate = () => {
    const e = {};
    fields.forEach((f) => {
      const v = String(values[f.key] ?? '').trim();
      if (f.required && !v) e[f.key] = 'Campo obligatorio';
      else if (v && f.type === 'number' && isNaN(Number(v))) e[f.key] = 'Debe ser un número';
      else if (v && f.type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(v) && !(isEdit && v === String(record[f.key]))) e[f.key] = 'Formato AAAA-MM-DD';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
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
          <ActionButton label={saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Registrar'} onPress={submit} disabled={saving} />
        </>
      }>
      {fields.map((f) => (
        <FormField
          key={f.key}
          field={f}
          value={values[f.key]}
          onChange={set(f.key)}
          error={errors[f.key]}
          editable={!(isEdit && f.key === config.id)}
        />
      ))}
      {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}
    </AppModal>
  );
}

const styles = StyleSheet.create({
  serverError: { color: '#f87171', textAlign: 'center', marginTop: 4 },
});
