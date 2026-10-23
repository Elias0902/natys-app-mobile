import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../theme';
import { statusStyle, initials, entriesOf, findEntry, fieldLabel } from '../ui';

// One record of a module (pedido, pago, proveedor...). Tap to see all its fields.
export default function RecordCard({ record }) {
  const [open, setOpen] = useState(false);

  const e = entriesOf(record);
  const title = findEntry(e, /^nombre|^name|^placa|^accion|^mensaje|^producto|^cliente/)?.[1] ?? e[1]?.[1] ?? e[0]?.[1];
  const id = findEntry(e, /^id/)?.[1];
  const status = findEntry(e, /estado/)?.[1];
  const tipo = findEntry(e, /tipo/)?.[1];
  const used = new Set([findEntry(e, /^id/)?.[0], findEntry(e, /estado/)?.[0], findEntry(e, /tipo/)?.[0]]);
  const rest = e.filter(([k, v]) => v !== title && !used.has(k));
  const st = status ? statusStyle(status) : null;

  return (
    <TouchableOpacity style={styles.card} onPress={() => setOpen(!open)} activeOpacity={0.8}>
      <View style={styles.top}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials(title)}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={open ? 3 : 1}>{String(title)}</Text>
          <View style={styles.tags}>
            {id ? <Text style={styles.idTag}>{String(id)}</Text> : null}
            {tipo ? <Text style={styles.tipoTag}>{String(tipo)}</Text> : null}
          </View>
        </View>
        {st && <View style={[styles.pill, { backgroundColor: st.bg }]}><Text style={[styles.pillText, { color: st.fg }]}>{String(status)}</Text></View>}
      </View>

      {rest.length > 0 && (
        <View style={styles.grid}>
          {(open ? rest : rest.slice(0, 3)).map(([k, v]) => (
            <View key={k} style={styles.cell}>
              <Text style={styles.cellKey}>{fieldLabel(k)}</Text>
              <Text style={styles.cellVal} numberOfLines={open ? 4 : 1}>{String(v)}</Text>
            </View>
          ))}
        </View>
      )}
      {rest.length > 3 && <Text style={styles.more}>{open ? 'Ver menos' : `+${rest.length - 3} más`}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderLeftWidth: 4, borderLeftColor: colors.red, borderRadius: 12, padding: 12, marginBottom: 10 },
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
});
