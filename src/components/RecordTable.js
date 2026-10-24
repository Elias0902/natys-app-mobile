import React from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { colors } from '../theme';
import { entriesOf, statusOf } from '../ui';
import RecordRow, { COL, colWidth } from './RecordRow';

// Table of the module: header + one RecordRow per record that matches the search and status
// Scrolls sideways on small screens, like the table of the web system.
export default function RecordTable({ records, columns, idKey, filterText, status, loading, onRefresh, onView, onEdit, onDelete }) {
  const rows = [];
  const q = filterText.toLowerCase();

  records.forEach((record, i) => {
    if (status !== 'Todos' && statusOf(record) !== status) {
      return;
    }
    if (q && !entriesOf(record).some(([, v]) => String(v).toLowerCase().indexOf(q) !== -1)) {
      return;
    }

    rows.push(
      <RecordRow
        key={String(record[idKey] ?? i)}
        record={record}
        columns={columns}
        striped={rows.length % 2 === 1}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  });

  const width = columns.reduce((a, c) => a + colWidth(c), 0) + COL.acciones;

  return (
    <ScrollView
      style={styles.tableContainer}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={colors.red} />}>
      <ScrollView horizontal>
        <View style={{ minWidth: width, flexGrow: 1 }}>
          <View style={styles.headRow}>
            {columns.map((c) => (
              <Text key={c.key} style={[styles.headCell, { width: colWidth(c) }]}>{c.label}</Text>
            ))}
            <Text style={[styles.headCell, { width: COL.acciones }]}>ACCIONES</Text>
          </View>

          {loading && records.length === 0 ? (
            <ActivityIndicator color={colors.red} style={{ margin: 20 }} />
          ) : rows.length > 0 ? (
            rows
          ) : (
            <Text style={styles.noResults}>No se encontraron registros.</Text>
          )}
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
  },
  headRow: { flexDirection: 'row', backgroundColor: '#1e2538', borderBottomColor: colors.border, borderBottomWidth: 1 },
  headCell: { color: colors.text, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', paddingHorizontal: 10, paddingVertical: 14 },
  noResults: {
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 30,
    fontSize: 15,
    color: colors.muted,
  },
});
