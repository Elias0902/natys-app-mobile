import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { Page, PageHeader } from '../components/Page';
import Icon from '../components/Icon';

// Static screens of the menu (e.g. Centro de Ayuda)
export default function InfoScreen({ title, text, icon = 'help' }) {
  return (
    <Page>
      <PageHeader icon={icon} title={title} crumb={`Inicio  ›  ${title}`} />
      <View style={s.card}>
        <Icon name={icon} size={36} color={colors.red} />
        <Text style={s.title}>{title}</Text>
        <Text style={s.text}>{text}</Text>
      </View>
    </Page>
  );
}

const s = StyleSheet.create({
  card: { alignItems: 'center', gap: 8, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 14, paddingVertical: 32, paddingHorizontal: 20 },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  text: { color: colors.muted, textAlign: 'center', lineHeight: 20 },
});
