import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../theme';

// Status filter buttons (Todos / Pagado / Pendiente ...)
export default function StatusChips({ statuses, selected, onSelect }) {
  if (statuses.length <= 2) return null;

  return (
    <View style={styles.chips}>
      {statuses.map((st) => (
        <TouchableOpacity key={st} onPress={() => onSelect(st)} style={[styles.chip, selected === st && styles.chipOn]}>
          <Text style={[styles.chipText, selected === st && { color: '#000' }]}>{st}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  chip: { borderColor: colors.border, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5, marginRight: 6, marginBottom: 6 },
  chipOn: { backgroundColor: '#fff', borderColor: '#fff' },
  chipText: { color: colors.muted, fontSize: 12, fontWeight: '600' },
});
