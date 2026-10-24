import { View, Text, Image, ScrollView, Modal, Pressable, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme';
import { initials } from '../ui';
import MenuList from './MenuList';

// Side menu for phones and tablets (on desktop the Sidebar is always visible instead)
export default function Drawer({ user, visible, current, onSelect, onClose, onLogout }) {
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
          <ScrollView showsVerticalScrollIndicator={false}>
            <MenuList current={current} onSelect={onSelect} onLogout={onLogout} />
          </ScrollView>
        </View>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.55)' },
  panel: { width: 280, maxWidth: '85%', backgroundColor: colors.sidebar, paddingTop: Platform.OS === 'web' ? 18 : 50, paddingHorizontal: 12, paddingBottom: 12, borderRightColor: colors.border, borderRightWidth: 1 },
  logo: { width: 79, height: 46, marginBottom: 12, marginLeft: 8 },
  userBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, padding: 10, marginBottom: 12 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarText: { color: '#fff', fontWeight: '800' },
  userName: { color: colors.text, fontWeight: '700' },
  userMail: { color: colors.muted, fontSize: 11 },
  userRole: { color: colors.red, fontSize: 11, fontWeight: '700' },
});
