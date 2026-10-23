import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FilterableRecordTable from '../components/FilterableRecordTable';
import { getList } from '../api';
import { colors } from '../theme';

// Generic screen for every module of the menu (Proveedores, Pedidos, Pagos...)
export default function ListScreen({ item }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setRecords(await getList(item.modulo));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setRecords([]); load(); }, [item.key]);

  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.headerBanner}>
        <Text style={styles.title}>{item.label}</Text>
        <Text style={styles.count}>{records.length}</Text>
      </View>

      <FilterableRecordTable records={records} moduleKey={item.key} loading={loading} onRefresh={load} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerBanner: {
    backgroundColor: colors.red,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  count: { color: '#fff', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 2, fontWeight: '700', overflow: 'hidden' },
  center: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 },
  error: { color: '#f87171', textAlign: 'center' },
});
