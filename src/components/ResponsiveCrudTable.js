import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import ActionButton from './ActionButton';
import { money, statusStyle } from '../utils/format';
import { useLayout } from '../utils/layout';
import { colors } from '../utils/theme';

// Minimum width of each kind of column. Used both to pick the render mode and to
// size the cells, so a table never needs its own minWidth / horizontal ScrollView.
const KIND_WIDTH = {
  avatar: 48,
  id: 76,
  money: 118,
  status: 130,
  date: 110,
  image: 52,
  field: 130,
  text: 130,
};

// Compact tables (tablet / narrow desktop) may shrink to these minimums.
const COMPACT_WIDTH = {
  avatar: 40,
  id: 52,
  money: 84,
  status: 88,
  date: 76,
  image: 44,
  field: 76,
  text: 76,
};

const PANEL_CHROME = 34; // border + padding of the "Consulta de ..." panel (same as RecordTable)
const ACTION_GAP = 8;
const FULL_ACTION_WIDTH = 38; // icon-only (same as compact)
const COMPACT_ACTION_WIDTH = 38; // icon-only
const CARD_LABEL_WIDTH = 104;

const widthOf = (column) => column.minWidth ?? column.width ?? KIND_WIDTH[column.kind] ?? KIND_WIDTH.field;
const compactWidthOf = (column) => column.compactMinWidth ?? COMPACT_WIDTH[column.kind] ?? COMPACT_WIDTH.field;
const actionsWidth = (count, mode) =>
  count * (mode === 'full' ? FULL_ACTION_WIDTH : COMPACT_ACTION_WIDTH) + Math.max(count - 1, 0) * ACTION_GAP;

// cards: phones. compact: tablet / desktop without room. full: wide desktop.
// `secondary` columns are hidden in compact mode; everything is shown in full mode.
export function crudTableMode(columns, actionCount, layout) {
  const count = Math.max(actionCount, 1);
  if (layout.isPhone) return 'cards';

  const fullColumns = columns.reduce((sum, column) => sum + widthOf(column), 0);
  if (layout.isDesktop && layout.contentWidth >= fullColumns + actionsWidth(count, 'full') + PANEL_CHROME) {
    return 'full';
  }

  const compactColumns = columns
    .filter((column) => !column.secondary)
    .reduce((sum, column) => sum + compactWidthOf(column), 0);
  if (layout.contentWidth >= compactColumns + actionsWidth(count, 'compact') + PANEL_CHROME) {
    return 'compact';
  }
  // Extremely narrow (but non-phone) window: cards are still better than scrolling sideways.
  return 'cards';
}

const cellStyle = (column, mode) => ({
  flexBasis: widthOf(column),
  flexGrow: column.flex ?? (column.kind === 'field' || column.kind === 'text' ? 1 : 0.35),
  flexShrink: mode === 'full' ? 0 : 1,
  minWidth: mode === 'full' ? widthOf(column) : compactWidthOf(column),
  maxWidth: column.maxWidth,
});

// Long text (descriptions, observations) breaks the proportions of a table.
// `words: 3` shows only the first words in the cell; the view modal receives
// the whole row, so the complete value is still available there.
const shortText = (value, words) => {
  const limit = Number(words) || 0;
  if (!limit) return String(value);
  const parts = String(value).trim().split(/\s+/).filter((part) => /[\wÁÉÍÓÚáéíóúÑñ]/.test(part));
  if (parts.length <= limit) return parts.join(' ');
  return `${parts.slice(0, limit).join(' ')}…`;
};

// Value of one cell. Tables describe their data with `value(row)` and may use
// `render(row)` for anything special (avatar, custom badge, etc.).
export function CrudCell({ column, row, block = false }) {
  if (column.render) {
    return <View style={block ? styles.blockRender : styles.inlineRender}>{column.render(row)}</View>;
  }

  const raw = column.value ? column.value(row) : row[column.key];
  const kind = column.kind || 'text';
  const textStyle = typeof column.textStyle === 'function' ? column.textStyle(row) : column.textStyle;

  if (kind === 'avatar' || kind === 'image') {
    if (!raw) {
      return <Text style={styles.fallback}>{column.fallback || '📷'}</Text>;
    }
    return <Image source={{ uri: String(raw) }} style={styles.image} resizeMode={kind === 'image' ? 'contain' : 'cover'} />;
  }

  if (raw === undefined || raw === null || raw === '') {
    return <Text style={styles.muted}>—</Text>;
  }

  if (kind === 'id') {
    const value = String(raw);
    const text = column.prefix === '' ? value : `${column.prefix || '#'}${value}`;
    return <Text style={[styles.idTag, block && styles.rightText, textStyle]} numberOfLines={1}>{text}</Text>;
  }

  if (kind === 'money') {
    return <Text style={[styles.money, block && styles.rightText, textStyle]} numberOfLines={1}>{money(raw)}</Text>;
  }

  if (kind === 'status') {
    const text = String(raw);
    const tone = typeof column.tone === 'function' ? column.tone(row) : column.tone || statusStyle(text);
    return (
      <View style={[styles.pill, block && styles.pillBlock, { backgroundColor: tone.bg }]}>
        <View style={[styles.dot, { backgroundColor: tone.fg }]} />
        <Text style={[styles.pillText, { color: tone.fg }]} numberOfLines={block ? 2 : 1}>{text}</Text>
      </View>
    );
  }

  return (
    <Text
      style={[styles.text, block && styles.rightText, textStyle]}
      numberOfLines={column.numberOfLines ?? (block ? 3 : 2)}
      ellipsizeMode="tail">
      {shortText(raw, column.words)}
    </Text>
  );
}

// Every action is icon-only in all modes (eye / pencil / trash / check).
// The text label is kept as accessibilityLabel so screen readers still announce it.
function RowActions({ row, actions, mode }) {
  const list = typeof actions === 'function' ? actions(row) : actions || [];
  return (
    <View style={styles.actionsRow}>
      {list.map((action) => (
        <ActionButton
          key={action.key || action.label}
          label={action.label}
          icon={action.icon}
          variant={action.variant || 'outline'}
          iconOnly
          block={mode === 'cards'}
          disabled={action.disabled}
          onPress={action.onPress}
        />
      ))}
    </View>
  );
}

// One record on a phone: label + value per field, actions at the bottom.
function RecordCard({ row, columns, titleColumn, actions }) {
  const fields = columns.filter((column) => column !== titleColumn && !column.cardHidden);
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Text style={styles.cardHeadLabel} numberOfLines={1}>{titleColumn.label}</Text>
        <View style={styles.cardHeadValue}><CrudCell column={titleColumn} row={row} block /></View>
      </View>
      {fields.map((column) => (
        <View key={column.key} style={styles.cardRow}>
          <Text style={styles.cardLabel} numberOfLines={2}>{column.label}</Text>
          <View style={styles.cardValue}><CrudCell column={column} row={row} block /></View>
        </View>
      ))}
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Acciones</Text>
        <View style={styles.cardActions}><RowActions row={row} actions={actions} mode="cards" /></View>
      </View>
    </View>
  );
}

// Shared CRUD table. Public props:
//   rows, columns, rowKey, actions(row), actionCount, emptyMessage
// A column is { key, label, value(row), render(row), kind, width, minWidth, flex,
//               primary, secondary, title, cardHidden, tone, textStyle, numberOfLines,
//               words }  // `words` limits the text shown in the cell; the modal shows it all.
export default function ResponsiveCrudTable({
  rows = [],
  columns,
  rowKey,
  actions,
  actionCount = 3,
  emptyMessage = 'No se encontraron registros.',
}) {
  const layout = useLayout();
  const mode = crudTableMode(columns, actionCount, layout);
  const shown = mode === 'compact' ? columns.filter((column) => !column.secondary) : columns;
  const titleColumn = columns.find((column) => column.title) || columns[0];
  const actionsWidthValue = actionsWidth(actionCount, mode);

  if (rows.length === 0) {
    return <View style={styles.table}><Text style={styles.empty}>{emptyMessage}</Text></View>;
  }

  if (mode === 'cards') {
    return (
      <View style={styles.cards}>
        {rows.map((row, index) => (
          <RecordCard
            key={rowKey ? String(rowKey(row, index)) : String(row.id ?? index)}
            row={row}
            columns={columns}
            titleColumn={titleColumn}
            actions={actions}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.table}>
      <View style={styles.headRow}>
        {shown.map((column) => (
          <View key={column.key} style={[styles.headCell, cellStyle(column, mode)]}>
            <Text style={styles.headText} numberOfLines={1}>{column.label}</Text>
          </View>
        ))}
        <View style={[styles.headCell, styles.headActions, { width: actionsWidthValue }]}>
          <Text style={styles.headText} numberOfLines={1}>Acciones</Text>
        </View>
      </View>

      {rows.map((row, index) => (
        <View
          key={rowKey ? String(rowKey(row, index)) : String(row.id ?? index)}
          style={[styles.row, index % 2 === 1 && styles.striped]}>
          {shown.map((column) => (
            <View key={column.key} style={[styles.cell, cellStyle(column, mode)]}>
              <CrudCell column={column} row={row} />
            </View>
          ))}
          <View style={[styles.cell, styles.actionsCell, { width: actionsWidthValue }]}>
            <RowActions row={row} actions={actions} mode={mode} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: { width: '100%', maxWidth: '100%', backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  headRow: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.head, borderBottomWidth: 1, borderBottomColor: colors.border },
  headCell: { paddingHorizontal: 8, paddingVertical: 10, justifyContent: 'center' },
  headActions: { flexShrink: 0, alignItems: 'center' },
  headText: { color: colors.muted, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  row: { width: '100%', minWidth: 0, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, minHeight: 52 },
  striped: { backgroundColor: 'rgba(255,255,255,0.025)' },
  cell: { minWidth: 0, paddingHorizontal: 8, paddingVertical: 8, justifyContent: 'center', alignItems: 'flex-start' },
  actionsCell: { flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  actionsRow: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: ACTION_GAP },
  text: { color: colors.text, fontSize: 13 },
  rightText: { textAlign: 'right', fontWeight: '700' },
  muted: { color: colors.muted, fontSize: 13 },
  idTag: { color: colors.text, borderColor: colors.border, borderWidth: 1, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, fontSize: 11, fontWeight: '800' },
  money: { color: '#facc15', fontSize: 12, fontWeight: '800' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3 },
  pillBlock: { alignSelf: 'flex-end', borderRadius: 8, paddingVertical: 6 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  pillText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  image: { width: 32, height: 32, borderRadius: 4 },
  fallback: { fontSize: 16 },
  inlineRender: { minWidth: 0 },
  blockRender: { minWidth: 0, alignItems: 'flex-end' },
  cards: { width: '100%', maxWidth: '100%', gap: 12 },
  card: { width: '100%', maxWidth: '100%', backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.red, paddingHorizontal: 14, paddingVertical: 12 },
  cardHeadLabel: { width: CARD_LABEL_WIDTH, color: '#fff', fontWeight: '800', fontSize: 13 },
  cardHeadValue: { flex: 1, minWidth: 0, alignItems: 'flex-end' },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 14, paddingVertical: 11, borderTopColor: colors.border, borderTopWidth: 1 },
  cardLabel: { width: CARD_LABEL_WIDTH, color: colors.redSoft, fontWeight: '700', fontSize: 13 },
  cardValue: { flex: 1, minWidth: 0, alignItems: 'flex-end' },
  cardActions: { flex: 1, minWidth: 0 },
  empty: { color: colors.muted, textAlign: 'center', fontSize: 14, paddingVertical: 28 },
});
