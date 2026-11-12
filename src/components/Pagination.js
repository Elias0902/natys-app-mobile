import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../utils/theme';

// Calcula hasta 5 números de página alrededor de la actual
const pageNumbers = (page, pages) => {
  const start = Math.max(1, Math.min(page - 2, pages - 4));
  return Array.from({ length: Math.min(5, pages) }, (_, i) => start + i);
};

export default function Pagination({ 
  page, 
  pages, 
  onPage, 
  totalRecords = 0, 
  recordsPerPage = 10, 
  onRecordsPerPageChange 
}) {
  const startRecord = totalRecords === 0 ? 0 : (page - 1) * recordsPerPage + 1;
  const endRecord = Math.min(page * recordsPerPage, totalRecords);

  return (
    <View style={styles.container}>
      {/* 1. Selector de registros por página y texto de conteo */}
      <View style={styles.topInfoRow}>
        {onRecordsPerPageChange ? (
          <View style={styles.rowsSelector}>
            <Text style={styles.textMuted}>Mostrar</Text>
            {[10, 25, 50].map((num) => (
              <TouchableOpacity 
                key={num} 
                style={[styles.rowsBtn, recordsPerPage === num && styles.rowsBtnActive]}
                onPress={() => onRecordsPerPageChange(num)}
              >
                <Text style={[styles.rowsBtnText, recordsPerPage === num && styles.rowsBtnTextActive]}>{num}</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.textMuted}>registros</Text>
          </View>
        ) : <View />}

        <Text style={styles.infoText}>
          Mostrando registros del {startRecord} al {endRecord} de un total de {totalRecords} registros
        </Text>
      </View>

      {/* 2. Botones de Paginación Numérica (Anterior, 1 2 3, Siguiente) */}
      <View style={styles.paginationNav}>
        <PageButton label="Anterior" disabled={page <= 1} onPress={() => onPage(page - 1)} />
        {pageNumbers(page, pages).map((n) => (
          <PageButton key={n} label={String(n)} active={n === page} onPress={() => onPage(n)} />
        ))}
        <PageButton label="Siguiente" disabled={page >= pages || pages === 0} onPress={() => onPage(page + 1)} />
      </View>
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
  container: { marginTop: 16, gap: 12 },
  topInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 },
  rowsSelector: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  textMuted: { color: colors.muted, fontSize: 13 },
  rowsBtn: { backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: colors.border },
  rowsBtnActive: { backgroundColor: colors.red, borderColor: colors.red },
  rowsBtnText: { color: colors.text, fontSize: 12, fontWeight: 'bold' },
  rowsBtnTextActive: { color: '#ffffff' },
  infoText: { color: colors.muted, fontSize: 13 },
  paginationNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  btn: { minWidth: 34, height: 32, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b' },
  active: { backgroundColor: colors.red, borderColor: colors.red },
  disabled: { opacity: 0.4 },
  text: { color: colors.text, fontSize: 12, fontWeight: '700' },
  textActive: { color: '#fff' },
});