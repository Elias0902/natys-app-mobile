import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors } from '../theme';
import AppModal from './AppModal';
import ActionButton from './ActionButton';

// "Eliminar": asks before deleting
export default function ConfirmDeleteModal({ record, title, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  if (!record) return null;

  const confirm = async () => {
    setDeleting(true);
    setError('');
    try {
      await onConfirm(record);
    } catch (e) {
      setError(e.message);
      setDeleting(false);
    }
  };

  return (
    <AppModal
      visible
      title="Eliminar registro"
      onClose={onClose}
      footer={
        <>
          <ActionButton label="Cancelar" variant="outline" onPress={onClose} />
          <ActionButton label={deleting ? 'Eliminando...' : 'Sí, eliminar'} variant="danger" onPress={confirm} disabled={deleting} />
        </>
      }>
      <Text style={styles.text}>¿Seguro que deseas eliminar <Text style={styles.bold}>{String(title)}</Text>?</Text>
      <Text style={styles.muted}>Esta acción no se puede deshacer.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </AppModal>
  );
}

const styles = StyleSheet.create({
  text: { color: colors.text, fontSize: 15, marginBottom: 6 },
  bold: { fontWeight: 'bold' },
  muted: { color: colors.muted, fontSize: 12 },
  error: { color: '#f87171', marginTop: 8 },
});
