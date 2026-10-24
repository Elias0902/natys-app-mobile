import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { statusOf } from '../ui';
import SearchBar from './SearchBar';
import StatusChips from './StatusChips';
import RecordTable from './RecordTable';

// "Consulta de ...": red band with status filters, search bar and the table (same idea as FilterableProductTable)
export default function FilterableRecordTable({ title, records, columns, idKey, moduleKey, loading, onRefresh, onView, onEdit, onDelete }) {
  const [textoFiltrado, setTextoFiltrado] = useState('');
  const [estado, setEstado] = useState('Todos');

  // Clear the filters when switching to another module
  useEffect(() => { setTextoFiltrado(''); setEstado('Todos'); }, [moduleKey]);

  const statuses = ['Todos', ...new Set(records.map(statusOf).filter(Boolean))];

  return (
    <View style={styles.panel}>
      <View style={styles.band}>
        <Text style={styles.bandTitle}>☰  {title}</Text>
        <StatusChips statuses={statuses} selected={estado} onSelect={setEstado} />
      </View>
      <View style={styles.search}>
        <SearchBar filterText={textoFiltrado} onChangeText={setTextoFiltrado} />
      </View>
      <RecordTable
        records={records}
        columns={columns}
        idKey={idKey}
        filterText={textoFiltrado}
        status={estado}
        loading={loading}
        onRefresh={onRefresh}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { flex: 1, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, overflow: 'hidden', margin: 12, marginTop: 0 },
  band: { backgroundColor: colors.red, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' },
  bandTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginRight: 10, marginVertical: 4 },
  search: { paddingHorizontal: 12, paddingTop: 12 },
});
