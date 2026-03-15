import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { NOTICES } from '@/constants/mockData';

type NoticeType = 'all' | 'notice' | 'tender' | 'emergency' | 'meeting';
type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

const FILTERS: { key: NoticeType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'emergency', label: 'Emergency' },
  { key: 'notice', label: 'Notices' },
  { key: 'tender', label: 'Tenders' },
  { key: 'meeting', label: 'Meetings' },
];

const TYPE_CONFIG: Record<string, { icon: IconName; color: string; label: string }> = {
  notice: { icon: 'campaign', color: Colors.info, label: 'Notice' },
  tender: { icon: 'gavel', color: Colors.warning, label: 'Tender' },
  emergency: { icon: 'warning', color: Colors.error, label: 'Emergency' },
  meeting: { icon: 'groups', color: Colors.success, label: 'Meeting' },
};

export default function NoticesScreen() {
  const [activeFilter, setActiveFilter] = useState<NoticeType>('all');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const filtered = activeFilter === 'all'
    ? NOTICES
    : NOTICES.filter(n => n.type === activeFilter);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Notices & Announcements</Text>
        <Text style={styles.headerSubtitle}>Stay updated with official notices</Text>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <FlatList
          horizontal
          data={FILTERS}
          showsHorizontalScrollIndicator={false}
          keyExtractor={f => f.key}
          contentContainerStyle={styles.filterContent}
          renderItem={({ item: f }) => (
            <TouchableOpacity
              style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.key)}
            >
              <Text style={[styles.filterChipText, activeFilter === f.key && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={n => n.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: notice }) => {
          const cfg = TYPE_CONFIG[notice.type] || TYPE_CONFIG.notice;
          return (
            <TouchableOpacity
              style={[styles.noticeCard, notice.isUrgent && styles.urgentCard]}
              onPress={() => router.push({ pathname: '/notice-detail', params: { id: notice.id } })}
              activeOpacity={0.85}
            >
              <View style={[styles.typeTag, { backgroundColor: cfg.color + '18' }]}>
                <MaterialIcons name={cfg.icon} size={18} color={cfg.color} />
                <Text style={[styles.typeTagText, { color: cfg.color }]}>{cfg.label}</Text>
              </View>
              <Text style={styles.noticeTitle}>{notice.title}</Text>
              <Text style={styles.noticeBody} numberOfLines={2}>{notice.body}</Text>
              <View style={styles.noticeMeta}>
                <MaterialIcons name="access-time" size={14} color={Colors.textMuted} />
                <Text style={styles.noticeDate}>{notice.date}</Text>
                <Text style={styles.noticeWard}>· {notice.ward}</Text>
                {notice.isUrgent ? (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentText}>URGENT</Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="notifications-off" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>No notices found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textOnPrimary,
  },
  headerSubtitle: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  filterBar: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.textOnPrimary,
    fontWeight: Typography.semiBold,
  },
  listContent: { padding: Spacing.md, paddingBottom: 80 },
  noticeCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  urgentCard: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 4,
    marginBottom: Spacing.sm,
  },
  typeTagText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noticeTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: 6,
    lineHeight: 22,
  },
  noticeBody: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  noticeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noticeDate: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  noticeWard: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    flex: 1,
  },
  urgentBadge: {
    backgroundColor: Colors.errorSurface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: Colors.error,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: Typography.base,
    color: Colors.textMuted,
  },
});
