import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { colors } from '../utils/theme';

export default function CustomAlert({ visible, type = 'success', title, message, onClose }) {
  if (!visible) return null;

  const isSuccess = type === 'success';

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Icono circular estilo SweetAlert */}
          <View style={[styles.iconContainer, { backgroundColor: isSuccess ? 'rgba(22, 163, 74, 0.2)' : 'rgba(185, 28, 28, 0.2)' }]}>
            <Text style={styles.iconText}>{isSuccess ? '✓' : '✕'}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: isSuccess ? '#16a34a' : colors.red }]} 
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: colors.card, width: '100%', maxWidth: 360, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 24, alignItems: 'center' },
  iconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  iconText: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 14, color: colors.muted, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  button: { width: '100%', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});