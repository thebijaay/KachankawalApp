import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator,
} from 'react-native';
import { useDeepLinkParams } from '@/hooks/useDeepLinkParams';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { NOTICES } from '@/constants/mockData';

const TYPE_CONFIG: Record<string, { icon: React.ComponentProps<typeof MaterialIcons>['name']; color: string; label: string }> = {
  notice: { icon: 'campaign', color: Colors.info, label: 'Official Notice' },
  tender: { icon: 'gavel', color: Colors.warning, label: 'Tender Notice' },
  emergency: { icon: 'warning', color: Colors.error, label: 'Emergency Alert' },
  meeting: { icon: 'groups', color: Colors.success, label: 'Meeting Notice' },
};

export default function NoticeDetailScreen() {
  const { id } = useDeepLinkParams<{ id: string }>();
  const notice = NOTICES.find(n => n.id === id);

  if (!notice) {
    if (id === undefined) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Notice not found</Text>
      </View>
    );
  }

  const cfg = TYPE_CONFIG[notice.type] || TYPE_CONFIG.notice;

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Type Header */}
      <View style={[styles.typeHeader, { backgroundColor: cfg.color }]}>
        <MaterialIcons name={cfg.icon} size={32} color={Colors.textOnPrimary} />
        <Text style={styles.typeLabel}>{cfg.label}</Text>
        {notice.isUrgent ? (
          <View style={styles.urgentPill}>
            <Text style={styles.urgentPillText}>URGENT NOTICE</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{notice.title}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialIcons name="access-time" size={16} color={Colors.textMuted} />
            <Text style={styles.metaText}>{notice.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="location-on" size={16} color={Colors.textMuted} />
            <Text style={styles.metaText}>{notice.ward}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.body}>{notice.body}</Text>

        {notice.type === 'emergency' ? (
          <TouchableOpacity
            style={styles.emergencyAction}
            onPress={() => Linking.openURL('tel:100')}
          >
            <MaterialIcons name="phone" size={20} color={Colors.textOnPrimary} />
            <Text style={styles.emergencyActionText}>Call Emergency (100)</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Published by Kachankawal Rural Municipality</Text>
          <Text style={styles.footerSub}>Government of Nepal — Province No. 1</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { fontSize: Typography.base, color: Colors.textMuted },
  typeHeader: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: 8,
  },
  typeLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textOnPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  urgentPill: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  urgentPillText: {
    color: Colors.textOnPrimary,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    letterSpacing: 1,
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    lineHeight: 30,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  body: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: 28,
    marginBottom: Spacing.xl,
  },
  emergencyAction: {
    backgroundColor: Colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.lg,
  },
  emergencyActionText: {
    color: Colors.textOnPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
  },
  footer: {
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  footerSub: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
});
