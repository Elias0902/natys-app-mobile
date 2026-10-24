import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme';

const ITEMS = [
  { icon: '👤', label: 'Mi Perfil', tab: 'perfil' },
  { icon: '🪪', label: 'Datos Personales', tab: 'datos' },
  { icon: '💳', label: 'Crédito y Balance', tab: 'credito' },
  { sep: true },
  { icon: '🌐', label: 'Idioma', soon: true },
  { sep: true },
  { icon: '⎋', label: 'Cerrar Sesión', logout: true },
];

// Dropdown opened from the avatar (same options as the web system).
// `top` = height of the header, so the menu opens right under it.
export default function UserMenu({ visible, top = 72, onClose, onTab, onLogout, onSoon }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        <View style={[s.wrap, { paddingTop: top + 4 }]}>
          <View style={s.menu}>
            {ITEMS.map((it, i) =>
              it.sep ? (
                <View key={i} style={s.sep} />
              ) : (
                <TouchableOpacity key={it.label} style={s.item}
                  onPress={() => (it.logout ? onLogout() : it.soon ? onSoon(it.label) : onTab(it.tab))}>
                  <Text style={s.icon}>{it.icon}</Text>
                  <Text style={[s.label, it.logout && { color: colors.red }]}>{it.label}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1 },
  wrap: { width: '100%', alignItems: 'flex-end', paddingHorizontal: 12 },
  menu: { width: 230, backgroundColor: '#0f1424', borderColor: colors.border, borderWidth: 1, borderRadius: 12, paddingVertical: 6 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 14 },
  icon: { width: 24, fontSize: 14 },
  label: { color: colors.text, fontWeight: '600', fontSize: 13 },
  sep: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
});
