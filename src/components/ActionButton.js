import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme';
import Icon from './Icon';

// Button used in tables, cards, page headers and modals.
//   variant: 'primary' | 'outline' | 'danger'      size: 'md' | 'lg' (pill, for page headers)
//   icon: name from Icon.js                         iconOnly: square button (label kept for accessibility)
//   block: grows to share the row with its siblings (same width for all)
// Spacing between buttons is set by the parent with `gap`, so every row lines up the same way.
export default function ActionButton({ label, onPress, variant = 'primary', icon, iconOnly, block, size = 'md', disabled, style, textStyle }) {
  const color = variant === 'outline' ? colors.text : '#fff';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.btn,
        styles[size],
        styles[variant],
        iconOnly && styles.iconOnly,
        iconOnly && !block && styles[`${size}Square`],
        block && styles.block,
        disabled && styles.disabled,
        style,
      ]}>
      {icon ? <Icon name={icon} size={size === 'lg' ? 16 : 15} color={color} /> : null}
      {!iconOnly ? (
        <Text style={[styles.text, size === 'lg' && styles.textLg, { color }, textStyle]} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 8, borderWidth: 1, borderColor: 'transparent' },
  md: { height: 34, paddingHorizontal: 12 },
  lg: { height: 42, paddingHorizontal: 18, borderRadius: 21 },
  iconOnly: { paddingHorizontal: 0 },
  mdSquare: { width: 34 },
  lgSquare: { width: 42 },
  block: { flex: 1 },
  primary: { backgroundColor: colors.red, borderColor: colors.red },
  danger: { backgroundColor: colors.danger, borderColor: colors.redSoft },
  outline: { backgroundColor: 'transparent', borderColor: colors.border },
  disabled: { opacity: 0.5 },
  text: { fontWeight: '700', fontSize: 12 },
  textLg: { fontSize: 13 },
});
