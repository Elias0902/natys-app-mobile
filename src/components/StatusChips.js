import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../theme';

// Status filter buttons inside the red band (Todos / Pendientes / Pagados ...)
export default function StatusChips({ statuses, selected, onSelect }) {
  if (statuses.length <= 2) return null;

  return (
    <View style={styles.group}>
      {statuses.map((st, i) => (
        <TouchableOpacity
          key={st}
          onPress={() => onSelect(st)}
          style={[styles.chip, i > 0 && styles.divider, selected === st && styles.chipOn]}>
          <Text style={[styles.chipText, selected === st && { color: colors.red }]}>{st}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', flexWrap: 'wrap', borderColor: 'rgba(255,255,255,0.6)', borderWidth: 1, borderRadius: 4, overflow: 'hidden' },
  chip: { paddingHorizontal: 10, paddingVertical: 5 },
  divider: { borderLeftColor: 'rgba(255,255,255,0.6)', borderLeftWidth: 1 },
  chipOn: { backgroundColor: '#fff' },
  chipText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
