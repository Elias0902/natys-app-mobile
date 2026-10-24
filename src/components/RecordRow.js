import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { statusStyle, money } from '../ui';
import ActionButton from './ActionButton';

// Minimum width of each kind of column. Text columns ('field') take most of the extra space,
// the others grow a little, and the actions column keeps a fixed width on the right.
export const COL = { id: 90, money: 130, estado: 140, field: 130 };
export const ACTIONS_WIDTH = { full: 350, compact: 144 };

export const cellStyle = (c) => {
  const w = COL[c.kind] || COL.field;
  return c.kind === 'field' || !COL[c.kind]
    ? { flexBasis: w, flexGrow: 1, flexShrink: 1, minWidth: w }
    : { flexBasis: w, flexGrow: 0.35, flexShrink: 0, minWidth: w };
};

// Value of one field, used by the table rows and by the phone cards (block = card layout)
export function CellValue({ kind, value, block }) {
  if (value === undefined || value === null || value === '') return <Text style={styles.muted}>—</Text>;
  const text = String(value);

  if (kind === 'id') return <Text style={styles.idTag}>{text}</Text>;
  if (kind === 'money') return <Text style={styles.money}>{money(value)}</Text>;
  if (kind === 'estado') {
    const st = statusStyle(text);
    return (
      <View style={[styles.pill, block && styles.pillBlock, { backgroundColor: st.bg }]}>
        <View style={[styles.dot, { backgroundColor: st.fg }]} />
        <Text style={[styles.pillText, { color: st.fg }]} numberOfLines={1}>{text}</Text>
      </View>
    );
  }
  return <Text style={[styles.text, block && styles.textBlock]} numberOfLines={block ? 3 : 2}>{text}</Text>;
}

// One row of the table: values of each column + Consultar / Modificar / Eliminar aligned to the right
export default function RecordRow({ record, columns, compact, striped, last, onView, onEdit, onDelete }) {
  return (
    <View style={[styles.row, striped && styles.striped, last && styles.last]}>
      {columns.map((c) => (
        <View key={c.key} style={[styles.cell, cellStyle(c)]}>
          <CellValue kind={c.kind} value={record[c.key]} />
        </View>
      ))}

      <View style={[styles.cell, styles.actions, { width: compact ? ACTIONS_WIDTH.compact : ACTIONS_WIDTH.full }]}>
        <ActionButton icon="eye" label="Consultar" iconOnly={compact} variant="outline" onPress={() => onView(record)} />
        <ActionButton icon="edit" label="Modificar" iconOnly={compact} variant="outline" onPress={() => onEdit(record)} />
        <ActionButton icon="trash" label="Eliminar" iconOnly={compact} variant="danger" onPress={() => onDelete(record)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, minHeight: 56 },
  striped: { backgroundColor: 'rgba(255,255,255,0.025)' },
  last: { borderBottomWidth: 0 },
  cell: { paddingHorizontal: 12, paddingVertical: 10, justifyContent: 'center', alignItems: 'flex-start' },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flexShrink: 0 },
  text: { color: colors.text, fontSize: 13 },
  textBlock: { textAlign: 'right', fontWeight: '600' },
  muted: { color: colors.muted, fontSize: 13 },
  idTag: { color: colors.text, borderColor: colors.text, borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, fontSize: 11, fontWeight: '800' },
  money: { color: colors.text, borderColor: colors.text, borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2, fontSize: 12, fontWeight: '800' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  pillBlock: { alignSelf: 'stretch', borderRadius: 8, paddingVertical: 7 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  pillText: { fontSize: 11, fontWeight: '800' },
});
