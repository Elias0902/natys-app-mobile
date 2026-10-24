import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { CONTENT_MAX_WIDTH, useLayout } from '../layout';
import Icon from './Icon';

// Scrollable screen. The content is centered and never wider than CONTENT_MAX_WIDTH,
// so nothing stretches across a big monitor. Same side padding on every screen.
export function Page({ children, refreshing, onRefresh }) {
  const { gutter, isPhone } = useLayout();
  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
      refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.red} /> : undefined}>
      <View style={[styles.inner, { paddingHorizontal: gutter, paddingTop: isPhone ? 14 : 24 }]}>{children}</View>
    </ScrollView>
  );
}

// Title of a screen: icon + title + breadcrumb on the left, buttons on the right.
// On phones the buttons go under the title and take the full width.
export function PageHeader({ icon = 'list', title, crumb, children }) {
  const { isPhone } = useLayout();
  return (
    <View style={[styles.header, isPhone && styles.headerPhone]}>
      <View style={styles.titleRow}>
        <View style={[styles.iconCircle, isPhone && styles.iconCirclePhone]}>
          <Icon name={icon} size={isPhone ? 18 : 20} color="#fff" />
        </View>
        <View style={styles.titleText}>
          <Text style={[styles.title, isPhone && styles.titlePhone]}>{title}</Text>
          {crumb ? <Text style={styles.crumb} numberOfLines={1}>{crumb}</Text> : null}
        </View>
      </View>
      {children ? <View style={[styles.actions, isPhone && styles.actionsPhone]}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1 },
  inner: { width: '100%', maxWidth: CONTENT_MAX_WIDTH, alignSelf: 'center', paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 },
  headerPhone: { flexDirection: 'column', alignItems: 'stretch', gap: 12, marginBottom: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  iconCircle: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  iconCirclePhone: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  titleText: { flexShrink: 1 },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  titlePhone: { fontSize: 19 },
  crumb: { color: colors.muted, fontSize: 12, marginTop: 3 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionsPhone: { flexDirection: 'column', alignItems: 'stretch' },
});
