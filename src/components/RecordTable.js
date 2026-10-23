import React from 'react';
import { StyleSheet, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { colors } from '../theme';
import { entriesOf, statusOf } from '../ui';
import RecordCard from './RecordCard';

// Filters the records with the search text and the selected status, one RecordCard per match
export default function RecordTable({ records, filterText, status, loading, onRefresh }) {
  const rows = [];
  const q = filterText.toLowerCase();

  records.forEach((record, i) => {
    if (status !== 'Todos' && statusOf(record) !== status) {
      return;
    }
    if (q && !entriesOf(record).some(([, v]) => String(v).toLowerCase().indexOf(q) !== -1)) {
      return;
    }

    rows.push(<RecordCard key={i} record={record} />);
  });

  return (
    <ScrollView
      style={styles.tableContainer}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={colors.red} />}>
      {loading && records.length === 0 ? (
        <ActivityIndicator color={colors.red} />
      ) : rows.length > 0 ? (
        rows
      ) : (
        <Text style={styles.noResults}>No se encontraron registros.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
    color: colors.muted,
  },
});
