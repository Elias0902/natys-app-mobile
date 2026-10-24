import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import ActionButton from './ActionButton';
import { CellValue } from './RecordRow';

const LABEL_WIDTH = 96;

// Phone view of one record (like the responsive tables of the web system):
// red header with the ID, one "label · value" row per field and the three actions at the bottom
export default function RecordCard({ record, columns, onView, onEdit, onDelete }) {
  const [idCol, ...fields] = columns;

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.headLabel}>{idCol.label}</Text>
        <View style={styles.idBox}>
          <Text style={styles.idText} numberOfLines={1}>{String(record[idCol.key] ?? '')}</Text>
        </View>
      </View>

      {fields.map((c) => (
        <View key={c.key} style={styles.row}>
          <Text style={styles.label}>{c.label}</Text>
          <View style={styles.value}>
            <CellValue kind={c.kind} value={record[c.key]} block />
          </View>
        </View>
      ))}

      <View style={styles.row}>
        <Text style={styles.label}>Acciones</Text>
        <View style={styles.buttons}>
          <ActionButton icon="eye" label="Consultar" iconOnly block onPress={() => onView(record)} />
          <ActionButton icon="edit" label="Modificar" iconOnly block onPress={() => onEdit(record)} />
          <ActionButton icon="trash" label="Eliminar" iconOnly block variant="danger" onPress={() => onDelete(record)} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.red, paddingHorizontal: 14, paddingVertical: 12 },
  headLabel: { width: LABEL_WIDTH, color: '#fff', fontWeight: '800', fontSize: 13 },
  idBox: { flex: 1, alignItems: 'flex-end', borderColor: 'rgba(255,255,255,0.85)', borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  idText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 11, borderTopColor: colors.border, borderTopWidth: 1 },
  label: { width: LABEL_WIDTH, color: colors.redSoft, fontWeight: '700', fontSize: 13 },
  value: { flex: 1, alignItems: 'flex-end' },
  buttons: { flex: 1, flexDirection: 'row', gap: 8 },
});
