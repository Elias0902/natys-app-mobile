import { colors } from './theme';

// Status text -> pill colors
export function statusStyle(text) {
  const t = String(text).toLowerCase();
  if (/activ|pagad|complet|recib|dispon|entregad/.test(t)) return { bg: '#14532d', fg: '#4ade80' };
  if (/pend|por |proceso/.test(t)) return { bg: '#713f12', fg: '#fbbf24' };
  if (/anul|inactiv|cancel|rechaz/.test(t)) return { bg: '#7f1d1d', fg: '#f87171' };
  return { bg: colors.border, fg: colors.muted };
}

export const money = (n) => '$' + Number(n || 0).toFixed(2);

export const initials = (name) =>
  String(name || '?').replace('@', '').split(/[\s_]+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

// Helpers to show any record of the system as a card (used by RecordCard / RecordTable)
const HIDDEN = /pass|img|avatar|foto|token/i;
export const entriesOf = (row) =>
  Object.entries(row).filter(([k, v]) => !HIDDEN.test(k) && v !== null && v !== '' && typeof v !== 'object');
export const findEntry = (entries, re) => entries.find(([k]) => re.test(k));
export const fieldLabel = (k) => k.replace(/_/g, ' ');
export const statusOf = (row) => findEntry(entriesOf(row), /estado/)?.[1];
export const recordTitle = (row) => {
  const e = entriesOf(row);
  return findEntry(e, /^nombre|^name|^placa|^accion|^mensaje|^producto|^cliente|^proveedor|^fecha/)?.[1] ?? e[1]?.[1] ?? e[0]?.[1];
};
