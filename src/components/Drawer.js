import { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { MENU } from '../menu';
import { colors } from '../theme';
import { initials } from '../ui';

export default function Drawer({ user, visible, current, onSelect, onClose, onLogout }) {
  const [open, setOpen] = useState({});

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.panel}>
          <Image source={require('../../assets/logo-clean.png')} style={s.logo} resizeMode="contain" />
          <View style={s.userBox}>
            <View style={s.avatar}><Text style={s.avatarText}>{initials(user?.nombre_usuario)}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={s.userName} numberOfLines={1}>@{user?.nombre_usuario}</Text>
              <Text style={s.userMail} numberOfLines={1}>{user?.email_usuario}</Text>
              <Text style={s.userRole}>{user?.rol_usuario}</Text>
            </View>
          </View>
          <ScrollView>
            {MENU.map((m) =>
              m.children ? (
                <View key={m.label}>
                  <TouchableOpacity style={s.row} onPress={() => setOpen((p) => ({ ...p, [m.label]: !p[m.label] }))}>
                    <Text style={s.group}>{m.label}</Text>
                    <Text style={s.group}>{open[m.label] ? '–' : '+'}</Text>
                  </TouchableOpacity>
                  {open[m.label] && m.children.map((c) => (
                    <TouchableOpacity key={c.key} style={s.sub} onPress={() => onSelect(c)}>
                      <Text style={[s.item, current === c.key && s.active]}>· {c.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <TouchableOpacity key={m.key} style={s.row} onPress={() => onSelect(m)}>
                  <Text style={[s.item, current === m.key && s.active]}>{m.label}</Text>
                </TouchableOpacity>
              )
            )}
            <TouchableOpacity style={s.row} onPress={onLogout}>
              <Text style={[s.item, { color: colors.red }]}>Cerrar sesión</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)' },
  panel: { width: 270, backgroundColor: '#000', paddingTop: 50, paddingHorizontal: 12 },
  logo: { width: 79, height: 46, marginBottom: 10, marginLeft: 8 },
  userBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, padding: 10, marginBottom: 10 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarText: { color: '#fff', fontWeight: '800' },
  userName: { color: colors.text, fontWeight: '700' },
  userMail: { color: colors.muted, fontSize: 11 },
  userRole: { color: colors.red, fontSize: 11, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 8 },
  sub: { paddingVertical: 9, paddingLeft: 24 },
  group: { color: colors.text, fontWeight: '700' },
  item: { color: colors.muted },
  active: { color: colors.red, fontWeight: '700' },
});
