import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import RecordRow, { ACTIONS_WIDTH, COL, cellStyle } from './RecordRow';

const PANEL_CHROME = 34; // border + padding of the "Consulta de ..." panel

// How the records fit in the available width:
//   'full'    table with Consultar / Modificar / Eliminar buttons (desktop)
//   'compact' table with icon-only buttons (tablet, small laptops)
//   'cards'   one card per record (phones)
export function tableMode(columns, { isPhone, contentWidth }) {
  if (isPhone) return 'cards';
  const room = contentWidth - PANEL_CHROME;
  const base = columns.reduce((a, c) => a + (COL[c.kind] || COL.field), 0);
  if (room >= base + ACTIONS_WIDTH.full + 60) return 'full';
  if (room >= base + ACTIONS_WIDTH.compact) return 'compact';
  return 'cards';
}

// Table of the module (desktop / tablet): header + one RecordRow per record of the current page
export default function RecordTable({ rows, columns, idKey, compact, loading, onView, onEdit, onDelete }) {
  const actionsWidth = compact ? ACTIONS_WIDTH.compact : ACTIONS_WIDTH.full;

  return (
    <View style={styles.table}>
      <View style={styles.headRow}>
        {columns.map((c) => (
          <View key={c.key} style={[styles.headCell, cellStyle(c)]}>
            <Text style={styles.headText} numberOfLines={1}>{c.label}</Text>
          </View>
        ))}
        <View style={[styles.headCell, styles.headActions, { width: actionsWidth }]}>
          <Text style={styles.headText}>Acciones</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.red} style={styles.loading} />
      ) : rows.length > 0 ? (
        rows.map((record, i) => (
          <RecordRow
            key={String(record[idKey] ?? i)}
            record={record}
            columns={columns}
            compact={compact}
            striped={i % 2 === 1}
            last={i === rows.length - 1}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <Text style={styles.noResults}>No se encontraron registros.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  table: { borderColor: colors.border, borderWidth: 1, borderRadius: 10, overflow: 'hidden' },
  headRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.head, borderBottomColor: colors.border, borderBottomWidth: 1 },
  headCell: { paddingHorizontal: 12, paddingVertical: 13, justifyContent: 'center' },
  headActions: { alignItems: 'flex-end', flexShrink: 0 },
  headText: { color: colors.text, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  loading: { marginVertical: 28 },
  noResults: { textAlign: 'center', marginVertical: 28, fontSize: 14, color: colors.muted },
});
