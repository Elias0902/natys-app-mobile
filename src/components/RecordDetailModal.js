import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { entriesOf, fieldLabel, statusStyle } from '../ui';
import AppModal from './AppModal';
import ActionButton from './ActionButton';

// "Ver detalle": every field of one record
export default function RecordDetailModal({ record, moduleLabel, onClose, onEdit }) {
  if (!record) return null;
  const entries = entriesOf(record);

  return (
    <AppModal
      visible
      title={`Consultar · ${moduleLabel}`}
      onClose={onClose}
      footer={
        <>
          <ActionButton label="Cerrar" variant="outline" onPress={onClose} />
          <ActionButton label="Modificar" onPress={() => onEdit(record)} />
        </>
      }>
      {entries.map(([k, v]) => {
        const st = /estado/.test(k) ? statusStyle(v) : null;
        return (
          <View key={k} style={styles.row}>
            <Text style={styles.key}>{fieldLabel(k)}</Text>
            {st ? (
              <View style={[styles.pill, { backgroundColor: st.bg }]}><Text style={[styles.pillText, { color: st.fg }]}>{String(v)}</Text></View>
            ) : (
              <Text style={styles.val}>{String(v)}</Text>
            )}
          </View>
        );
      })}
    </AppModal>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomColor: colors.border, borderBottomWidth: 1 },
  key: { color: colors.muted, fontSize: 12, textTransform: 'uppercase', flex: 1 },
  val: { color: colors.text, fontSize: 14, fontWeight: '600', flex: 1.4, textAlign: 'right' },
  pill: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontSize: 12, fontWeight: '800' },
});
