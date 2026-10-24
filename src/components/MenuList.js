import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MENU } from '../menu';
import { colors } from '../theme';
import Icon from './Icon';

const groupOf = (key) => MENU.find((m) => m.children?.some((c) => c.key === key))?.label;

// Menu items, shared by the phone drawer and the desktop sidebar
export default function MenuList({ current, onSelect, onLogout }) {
  const [open, setOpen] = useState(() => ({ [groupOf(current)]: true }));

  // Keep the group of the current screen open
  useEffect(() => {
    const g = groupOf(current);
    if (g) setOpen((p) => (p[g] ? p : { ...p, [g]: true }));
  }, [current]);

  return (
    <View style={s.list}>
      {MENU.map((m) => {
        if (!m.children) {
          const active = current === m.key;
          return (
            <TouchableOpacity key={m.key} style={[s.row, active && s.rowActive]} onPress={() => onSelect(m)}>
              <Icon name={m.icon} size={17} color={active ? colors.red : colors.muted} />
              <Text style={[s.label, active && s.labelActive]}>{m.label}</Text>
            </TouchableOpacity>
          );
        }

        const isOpen = !!open[m.label];
        const hasCurrent = m.children.some((c) => c.key === current);
        return (
          <View key={m.label}>
            <TouchableOpacity style={s.row} onPress={() => setOpen((p) => ({ ...p, [m.label]: !p[m.label] }))}>
              <Icon name={m.icon} size={17} color={hasCurrent ? colors.red : colors.muted} />
              <Text style={[s.label, hasCurrent && s.labelGroup]}>{m.label}</Text>
              <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} size={15} color={colors.muted} />
            </TouchableOpacity>
            {isOpen &&
              m.children.map((c) => {
                const active = current === c.key;
                return (
                  <TouchableOpacity key={c.key} style={[s.sub, active && s.rowActive]} onPress={() => onSelect(c)}>
                    <View style={[s.bullet, active && { backgroundColor: colors.red }]} />
                    <Text style={[s.subLabel, active && s.labelActive]}>{c.label}</Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        );
      })}

      <View style={s.sep} />
      <TouchableOpacity style={s.row} onPress={onLogout}>
        <Icon name="logout" size={17} color={colors.red} />
        <Text style={[s.label, { color: colors.red }]}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  list: { gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 12, borderRadius: 8 },
  rowActive: { backgroundColor: 'rgba(220,38,38,0.14)' },
  label: { flex: 1, color: colors.text, fontWeight: '600', fontSize: 14 },
  labelGroup: { fontWeight: '800' },
  labelActive: { color: colors.red, fontWeight: '800' },
  sub: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, paddingLeft: 20, paddingRight: 12, marginLeft: 12, borderRadius: 8 },
  bullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.muted },
  subLabel: { flex: 1, color: colors.muted, fontSize: 13, fontWeight: '600' },
  sep: { height: 1, backgroundColor: colors.border, marginVertical: 8, marginHorizontal: 12 },
});
