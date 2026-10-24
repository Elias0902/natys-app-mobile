import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { colors } from '../theme';
import Icon from './Icon';

// Controlled search input: the text lives in the parent (FilterableProductTable / FilterableRecordTable)
export default function SearchBar({ filterText, onChangeText, placeholder = 'Buscar...', style }) {
  return (
    <View style={[styles.box, style]}>
      <Icon name="search" size={16} color={colors.muted} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        value={filterText}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 42,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.bg,
  },
  input: {
    flex: 1,
    minWidth: 0,
    alignSelf: 'stretch',
    fontSize: 14,
    color: colors.text,
    outlineStyle: 'none',
  },
});
