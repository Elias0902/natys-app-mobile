import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { colors } from '../theme';

// Controlled search input: the text lives in the parent (FilterableProductTable / FilterableRecordTable)
export default function SearchBar({ filterText, onChangeText, placeholder = 'Buscar...' }) {
  return (
    <View style={styles.searchContainer}>
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
  searchContainer: {
    marginBottom: 12,
  },
  input: {
    height: 45,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    fontSize: 15,
    color: colors.text,
    outlineStyle: 'none',
  },
});
