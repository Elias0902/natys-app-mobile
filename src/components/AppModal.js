import React from 'react';
import { StyleSheet, Text, View, Modal, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../theme';

// Base modal used by the detail, form and delete windows
export default function AppModal({ visible, title, onClose, children, footer }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.box} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.body} contentContainerStyle={{ padding: 16 }}>
            {children}
          </ScrollView>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  box: { width: '100%', maxWidth: 480, maxHeight: '90%', backgroundColor: colors.card, borderRadius: 16, borderColor: colors.border, borderWidth: 1, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.red, paddingHorizontal: 16, paddingVertical: 14 },
  title: { color: '#fff', fontSize: 17, fontWeight: 'bold', flex: 1 },
  close: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 12 },
  body: { flexGrow: 0 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, padding: 12, borderTopColor: colors.border, borderTopWidth: 1 },
});
