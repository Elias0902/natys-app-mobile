import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { colors } from '../theme';

// One input of the form: text / number / date, or option buttons for 'select'
export default function FormField({ field, value, onChange, error, editable = true }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {field.label}
        {field.required ? <Text style={{ color: colors.red }}> *</Text> : null}
      </Text>

      {field.type === 'select' ? (
        <View style={styles.options}>
          {field.options.map((op) => (
            <TouchableOpacity key={op} onPress={() => onChange(op)} style={[styles.option, value === op && styles.optionOn]}>
              <Text style={[styles.optionText, value === op && { color: '#fff' }]}>{op}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <TextInput
          style={[styles.input, error && { borderColor: '#f87171' }, !editable && { opacity: 0.6 }]}
          value={value === undefined || value === null ? '' : String(value)}
          onChangeText={onChange}
          editable={editable}
          keyboardType={field.type === 'number' ? 'decimal-pad' : 'default'}
          placeholder={field.type === 'date' ? 'AAAA-MM-DD' : field.label}
          placeholderTextColor={colors.muted}
        />
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 14 },
  label: { color: colors.text, fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: { height: 44, borderColor: colors.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, backgroundColor: colors.bg, color: colors.text, fontSize: 15, outlineStyle: 'none' },
  options: { flexDirection: 'row', flexWrap: 'wrap' },
  option: { borderColor: colors.border, borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 6, marginBottom: 6 },
  optionOn: { backgroundColor: colors.red, borderColor: colors.red },
  optionText: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  error: { color: '#f87171', fontSize: 11, marginTop: 4 },
});
