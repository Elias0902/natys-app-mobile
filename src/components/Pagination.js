import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';

// Up to 5 page numbers around the current page
const pageNumbers = (page, pages) => {
  const start = Math.max(1, Math.min(page - 2, pages - 4));
  return Array.from({ length: Math.min(5, pages) }, (_, i) => start + i);
};

// Anterior · 1 2 3 · Siguiente (same as the tables of the web system)
export default function Pagination({ page, pages, onPage }) {
  return (
    <View style={styles.row}>
      <PageButton label="Anterior" disabled={page <= 1} onPress={() => onPage(page - 1)} />
      {pageNumbers(page, pages).map((n) => (
        <PageButton key={n} label={String(n)} active={n === page} onPress={() => onPage(n)} />
      ))}
      <PageButton label="Siguiente" disabled={page >= pages} onPress={() => onPage(page + 1)} />
    </View>
  );
}

function PageButton({ label, active, disabled, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || active}
      style={[styles.btn, active && styles.active, disabled && styles.disabled]}>
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btn: { minWidth: 34, height: 32, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: colors.red, borderColor: colors.red },
  disabled: { opacity: 0.4 },
  text: { color: colors.text, fontSize: 12, fontWeight: '700' },
  textActive: { color: '#fff' },
});
