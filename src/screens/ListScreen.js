import { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { getList } from '../api';
import { colors } from '../theme';
import { statusStyle, initials } from '../ui';

const HIDDEN = /pass|img|avatar|foto|token/i;
const entriesOf = (row) =>
  Object.entries(row).filter(([k, v]) => !HIDDEN.test(k) && v !== null && v !== '' && typeof v !== 'object');
const find = (entries, re) => entries.find(([k]) => re.test(k));
const label = (k) => k.replace(/_/g, ' ');

export default function ListScreen({ item }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setRows(await getList(item.modulo));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setQuery(''); setFilter('Todos'); setExpanded(null); load(); }, [item.key]);

  if (error) return <View style={s.center}><Text style={s.error}>{error}</Text></View>;

  // Status filters are built from the data itself (Todos / Activo / Pendiente ...)
  const statusOf = (r) => find(entriesOf(r), /estado/)?.[1];
  const statuses = ['Todos', ...new Set(rows.map(statusOf).filter(Boolean))];
  const q = query.toLowerCase();
  const filtered = rows
    .filter((r) => filter === 'Todos' || statusOf(r) === filter)
    .filter((r) => !q || entriesOf(r).some(([, v]) => String(v).toLowerCase().includes(q)))
    .slice(0, 100);

  return (
    <View style={s.container}>
      <View style={s.band}>
        <Text style={s.bandTitle}>Consulta de {item.label}</Text>
        <Text style={s.bandCount}>{filtered.length}</Text>
      </View>
      {statuses.length > 2 && (
        <View style={s.chips}>
          {statuses.map((st) => (
            <TouchableOpacity key={st} onPress={() => setFilter(st)} style={[s.chip, filter === st && s.chipOn]}>
              <Text style={[s.chipText, filter === st && { color: '#000' }]}>{st}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TextInput style={s.search} placeholder="Buscar..." placeholderTextColor={colors.muted}
        value={query} onChangeText={setQuery} />
      <FlatList
        contentContainerStyle={{ padding: 12, paddingTop: 0 }}
        data={filtered}
        keyExtractor={(_, i) => String(i)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.red} />}
        ListEmptyComponent={loading ? <ActivityIndicator color={colors.red} /> : <Text style={s.muted}>Sin registros.</Text>}
        renderItem={({ item: row, index }) => {
          const e = entriesOf(row);
          const title = find(e, /^nombre|^name|^placa|^accion|^mensaje|^producto|^cliente/)?.[1] ?? e[1]?.[1] ?? e[0]?.[1];
          const id = find(e, /^id/)?.[1];
          const status = find(e, /estado/)?.[1];
          const tipo = find(e, /tipo/)?.[1];
          const used = new Set([find(e, /^id/)?.[0], find(e, /estado/)?.[0], find(e, /tipo/)?.[0]]);
          const rest = e.filter(([k, v]) => v !== title && !used.has(k));
          const open = expanded === index;
          const st = status ? statusStyle(status) : null;
          return (
            <TouchableOpacity style={s.card} onPress={() => setExpanded(open ? null : index)} activeOpacity={0.8}>
              <View style={s.top}>
                <View style={s.avatar}><Text style={s.avatarText}>{initials(title)}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.title} numberOfLines={open ? 3 : 1}>{String(title)}</Text>
                  <View style={s.tags}>
                    {id && <Text style={s.idTag}>{String(id)}</Text>}
                    {tipo && <Text style={s.tipoTag}>{String(tipo)}</Text>}
                  </View>
                </View>
                {st && <View style={[s.pill, { backgroundColor: st.bg }]}><Text style={[s.pillText, { color: st.fg }]}>{String(status)}</Text></View>}
              </View>
              {rest.length > 0 && (
                <View style={s.grid}>
                  {(open ? rest : rest.slice(0, 3)).map(([k, v]) => (
                    <View key={k} style={s.cell}>
                      <Text style={s.cellKey}>{label(k)}</Text>
                      <Text style={s.cellVal} numberOfLines={open ? 4 : 1}>{String(v)}</Text>
                    </View>
                  ))}
                </View>
              )}
              {rest.length > 3 && <Text style={s.more}>{open ? 'Ver menos' : `+${rest.length - 3} más`}</Text>}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 },
  band: { backgroundColor: colors.red, margin: 12, marginBottom: 8, borderRadius: 10, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bandTitle: { color: '#fff', fontWeight: '800', fontSize: 15 },
  bandCount: { color: '#fff', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 2, fontWeight: '700', overflow: 'hidden' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  chip: { borderColor: colors.border, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5, marginRight: 6, marginBottom: 6 },
  chipOn: { backgroundColor: '#fff', borderColor: '#fff' },
  chipText: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  search: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10, color: colors.text, padding: 10, marginHorizontal: 12, marginBottom: 10 },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 8 },
  top: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1e293b', borderColor: colors.red, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarText: { color: colors.text, fontWeight: '800', fontSize: 13 },
  title: { color: colors.text, fontWeight: '700', fontSize: 14 },
  tags: { flexDirection: 'row', marginTop: 4 },
  idTag: { color: colors.muted, borderColor: colors.border, borderWidth: 1, borderRadius: 4, fontSize: 10, paddingHorizontal: 5, marginRight: 6 },
  tipoTag: { color: '#c4b5fd', borderColor: '#4c1d95', borderWidth: 1, borderRadius: 4, fontSize: 10, paddingHorizontal: 5 },
  pill: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, marginLeft: 6 },
  pillText: { fontSize: 11, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, borderTopColor: colors.border, borderTopWidth: 1, paddingTop: 8 },
  cell: { width: '50%', paddingRight: 8, marginBottom: 6 },
  cellKey: { color: colors.muted, fontSize: 10, textTransform: 'uppercase' },
  cellVal: { color: colors.text, fontSize: 12 },
  more: { color: colors.red, fontSize: 11, marginTop: 2 },
  muted: { color: colors.muted, textAlign: 'center' },
  error: { color: '#f87171', textAlign: 'center' },
});
