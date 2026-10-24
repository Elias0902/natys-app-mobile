import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { statusStyle, money } from '../ui';
import ActionButton from './ActionButton';

export const COL = { id: 90, field: 160, money: 120, estado: 130, acciones: 300 };
export const colWidth = (c) => COL[c.kind] || COL.field;
// Each column has a minimum width and grows to fill the table on wide screens
export const cellSize = (w) => ({ minWidth: w, flexBasis: w, flexGrow: 1 });

// One row of the table: values of each column + Consultar / Modificar / Eliminar
export default function RecordRow({ record, columns, striped, onView, onEdit, onDelete }) {
  return (
    <View style={[styles.row, striped && styles.striped]}>
      {columns.map((c) => {
        const v = record[c.key];
        let content;
        if (c.kind === 'id') {
          content = <Text style={styles.idTag}>{String(v ?? '')}</Text>;
        } else if (c.kind === 'estado' && v) {
          const st = statusStyle(v);
          content = <View style={[styles.pill, { backgroundColor: st.bg }]}><Text style={[styles.pillText, { color: st.fg }]}>{String(v)}</Text></View>;
        } else if (c.kind === 'money' && v !== undefined && v !== '') {
          content = <Text style={styles.money}>{money(v)}</Text>;
        } else {
          content = <Text style={styles.text} numberOfLines={2}>{v === undefined || v === null ? '' : String(v)}</Text>;
        }
        return <View key={c.key} style={[styles.cell, cellSize(colWidth(c))]}>{content}</View>;
      })}

      <View style={[styles.cell, styles.actions, cellSize(COL.acciones)]}>
        <ActionButton label="Consultar" variant="outline" onPress={() => onView(record)} style={styles.btn} />
        <ActionButton label="Modificar" variant="outline" onPress={() => onEdit(record)} style={styles.btn} />
        <ActionButton label="Eliminar" variant="danger" onPress={() => onDelete(record)} style={styles.btn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, minHeight: 58 },
  striped: { backgroundColor: 'rgba(255,255,255,0.02)' },
  cell: { paddingHorizontal: 10, paddingVertical: 8, justifyContent: 'center' },
  text: { color: colors.text, fontSize: 13 },
  idTag: { alignSelf: 'flex-start', color: colors.text, borderColor: colors.text, borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, fontSize: 11, fontWeight: '800' },
  money: { alignSelf: 'flex-start', color: colors.text, borderColor: colors.text, borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2, fontSize: 12, fontWeight: '800' },
  pill: { alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontSize: 11, fontWeight: '800' },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  btn: { marginLeft: 0, marginRight: 6, paddingHorizontal: 10 },
});
