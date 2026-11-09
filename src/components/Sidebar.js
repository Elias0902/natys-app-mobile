import { View, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../utils/theme';
import { SIDEBAR_WIDTH } from '../utils/layout';
import MenuList from './MenuList';

// Fixed menu on the left for desktop screens (same idea as the web system)
export default function Sidebar({ user, current, onSelect, onLogout }) {
  return (
    <View style={s.sidebar}>
      <ScrollView contentContainerStyle={s.inner} showsVerticalScrollIndicator={false}>
        <MenuList user={user} current={current} onSelect={onSelect} onLogout={onLogout} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  sidebar: { width: SIDEBAR_WIDTH, backgroundColor: colors.sidebar, borderRightColor: colors.border, borderRightWidth: 1 },
  inner: { paddingVertical: 16, paddingHorizontal: 10 },
});
