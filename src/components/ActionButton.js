import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme';

// Small button used in cards and modals. variant: 'primary' | 'outline' | 'danger'
export default function ActionButton({ label, onPress, variant = 'primary', disabled, style, textStyle }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, styles[variant], disabled && { opacity: 0.5 }, style]}>
      <Text style={[styles.text, variant === 'outline' && { color: colors.text }, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  primary: { backgroundColor: colors.red },
  danger: { backgroundColor: '#7f1d1d', borderColor: '#f87171', borderWidth: 1 },
  outline: { backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1 },
  text: { color: '#fff', fontWeight: '700', fontSize: 12 },
});
