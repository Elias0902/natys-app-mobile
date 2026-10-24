import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';
import { entriesOf, statusOf } from '../ui';
import { useLayout } from '../layout';
import Icon from './Icon';
import SearchBar from './SearchBar';
import StatusChips from './StatusChips';
import RecordTable, { tableMode } from './RecordTable';
import RecordCard from './RecordCard';
import Pagination from './Pagination';

const PAGE_SIZES = [10, 25, 50];

// "Consulta de ...": red band with the status filters, "Mostrar N registros", search,
// the records (table on desktop/tablet, cards on phones) and the pagination.
export default function FilterableRecordTable({ title, records, columns, idKey, moduleKey, loading, onView, onEdit, onDelete }) {
  const layout = useLayout();
  const [textoFiltrado, setTextoFiltrado] = useState('');
  const [estado, setEstado] = useState('Todos');
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  // Clear the filters when switching to another module
  useEffect(() => { setTextoFiltrado(''); setEstado('Todos'); setPage(1); }, [moduleKey]);
  // Back to the first page when the filters change
  useEffect(() => { setPage(1); }, [textoFiltrado, estado, pageSize]);

  const statuses = ['Todos', ...new Set(records.map(statusOf).filter(Boolean))];
  const q = textoFiltrado.trim().toLowerCase();
  const filtered = records.filter((record) => {
    if (estado !== 'Todos' && statusOf(record) !== estado) return false;
    return !q || entriesOf(record).some(([, v]) => String(v).toLowerCase().includes(q));
  });

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages);
  const from = (current - 1) * pageSize;
  const visible = filtered.slice(from, from + pageSize);

  const phone = layout.isPhone;
  const mode = tableMode(columns, layout);
  const firstLoad = loading && records.length === 0;
  const actions = { onView, onEdit, onDelete };

  let body;
  if (mode !== 'cards') {
    body = <RecordTable rows={visible} columns={columns} idKey={idKey} compact={mode === 'compact'} loading={firstLoad} {...actions} />;
  } else if (firstLoad) {
    body = <ActivityIndicator color={colors.red} style={styles.loading} />;
  } else if (visible.length === 0) {
    body = <Text style={styles.emptyCard}>No se encontraron registros.</Text>;
  } else {
    body = visible.map((record, i) => <RecordCard key={String(record[idKey] ?? i)} record={record} columns={columns} {...actions} />);
  }

  const summary = filtered.length
    ? `Mostrando registros del ${from + 1} al ${from + visible.length} de un total de ${filtered.length} registros`
    : 'Mostrando 0 registros';
  const filteredNote = filtered.length !== records.length ? ` (filtrado de ${records.length})` : '';

  return (
    <View style={phone ? null : styles.panel}>
      <View style={[styles.band, phone && styles.bandPhone]}>
        <View style={styles.bandTitleRow}>
          <Icon name="list" size={18} color="#fff" />
          <Text style={styles.bandTitle}>{title}</Text>
        </View>
        <StatusChips statuses={statuses} selected={estado} onSelect={setEstado} />
      </View>

      <View style={phone ? styles.contentPhone : styles.content}>
        {phone ? (
          <SearchBar filterText={textoFiltrado} onChangeText={setTextoFiltrado} style={styles.searchPhone} />
        ) : (
          <View style={styles.toolbar}>
            <View style={styles.sizeRow}>
              <Text style={styles.muted}>Mostrar</Text>
              <View style={styles.sizes}>
                {PAGE_SIZES.map((n, i) => (
                  <TouchableOpacity key={n} onPress={() => setPageSize(n)} style={[styles.size, i > 0 && styles.sizeDivider, n === pageSize && styles.sizeOn]}>
                    <Text style={[styles.sizeText, n === pageSize && styles.sizeTextOn]}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.muted}>registros</Text>
            </View>
            <SearchBar filterText={textoFiltrado} onChangeText={setTextoFiltrado} style={styles.searchWide} />
          </View>
        )}

        {body}

        {!firstLoad && (
          <View style={[styles.footer, phone && styles.footerPhone]}>
            <Text style={[styles.muted, phone && styles.center]}>{summary}{filteredNote}</Text>
            <Pagination page={current} pages={pages} onPage={setPage} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  band: { backgroundColor: colors.red, paddingHorizontal: 18, paddingVertical: 13, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  bandPhone: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
  bandTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  bandTitle: { color: '#fff', fontSize: 16, fontWeight: '800', flexShrink: 1 },
  content: { padding: 16, gap: 14 },
  contentPhone: { gap: 12 },
  toolbar: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  sizeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sizes: { flexDirection: 'row', borderColor: colors.border, borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
  size: { paddingHorizontal: 11, paddingVertical: 6 },
  sizeDivider: { borderLeftColor: colors.border, borderLeftWidth: 1 },
  sizeOn: { backgroundColor: colors.red },
  sizeText: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  sizeTextOn: { color: '#fff' },
  searchWide: { width: 300, maxWidth: '100%' },
  searchPhone: { backgroundColor: colors.card },
  footer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  footerPhone: { flexDirection: 'column', marginTop: 4 },
  muted: { color: colors.muted, fontSize: 12 },
  center: { textAlign: 'center' },
  loading: { marginVertical: 30 },
  emptyCard: { color: colors.muted, textAlign: 'center', fontSize: 14, paddingVertical: 28, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
});
