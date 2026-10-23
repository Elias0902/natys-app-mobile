import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { statusOf } from '../ui';
import SearchBar from './SearchBar';
import StatusChips from './StatusChips';
import RecordTable from './RecordTable';

// Joins search bar, status filters and the record table (same idea as FilterableProductTable)
export default function FilterableRecordTable({ records, moduleKey, loading, onRefresh }) {
  const [textoFiltrado, setTextoFiltrado] = useState('');
  const [estado, setEstado] = useState('Todos');

  // Clear the filters when switching to another module
  useEffect(() => { setTextoFiltrado(''); setEstado('Todos'); }, [moduleKey]);

  const statuses = ['Todos', ...new Set(records.map(statusOf).filter(Boolean))];

  return (
    <View style={styles.container}>
      <StatusChips statuses={statuses} selected={estado} onSelect={setEstado} />
      <SearchBar filterText={textoFiltrado} onChangeText={setTextoFiltrado} />
      <RecordTable
        records={records}
        filterText={textoFiltrado}
        status={estado}
        loading={loading}
        onRefresh={onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
