import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { municipalService, ComplaintRecord } from '@/services/municipalService';
import { COMPLAINTS } from '@/constants/mockData';

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  submitted: { color: Colors.info, bg: Colors.infoSurface, label: 'Submitted' },
  processing: { color: Colors.warning, bg: Colors.warningSurface, label: 'In Review' },
  resolved: { color: Colors.success, bg: Colors.successSurface, label: 'Resolved' },
  rejected: { color: Colors.error, bg: Colors.errorSurface, label: 'Rejected' },
};

export default function ComplaintsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [myComplaints, setMyComplaints] = useState<ComplaintRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      municipalService.getComplaints().then(setMyComplaints);
    }, [])
  );

  const allComplaints = [...myComplaints, ...COMPLAINTS];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Grievance Portal</Text>
        <Text style={styles.headerSubtitle}>Submit and track your complaints</Text>
      </View>

      {/* Submit Button */}
      <View style={styles.actionArea}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => router.push('/submit-complaint')}
          activeOpacity={0.85}
        >
          <MaterialIcons name="add-circle" size={20} color={Colors.textOnPrimary} />
          <Text style={styles.submitBtnText}>Submit New Complaint</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {[
          { label: 'Total', count: allComplaints.length, color: Colors.primary },
          { label: 'In Review', count: allComplaints.filter(c => c.status === 'processing').length, color: Colors.warning },
          { label: 'Resolved', count: allComplaints.filter(c => c.status === 'resolved').length, color: Colors.success },
        ].map(stat => (
          <View key={stat.label} style={styles.statItem}>
            <Text style={[styles.statCount, { color: stat.color }]}>{stat.count}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={allComplaints}
        keyExtractor={c => c.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.listHeader}>All Complaints</Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Image
              source={require('@/assets/images/empty-complaints.png')}
              style={styles.emptyImage}
              contentFit="contain"
            />
            <Text style={styles.emptyTitle}>No Complaints Yet</Text>
            <Text style={styles.emptySubtitle}>Use the button above to report an issue in your ward</Text>
          </View>
        }
        renderItem={({ item: complaint }) => {
          const cfg = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.submitted;
          return (
            <View style={styles.complaintCard}>
              <View style={styles.complaintTop}>
                <View style={[styles.categoryTag, { backgroundColor: Colors.primarySurface }]}>
                  <Text style={[styles.categoryText, { color: Colors.primary }]}>{complaint.category}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
              </View>
              <Text style={styles.complaintTitle}>{complaint.title}</Text>
              <Text style={styles.complaintDesc} numberOfLines={2}>{complaint.description}</Text>
              <View style={styles.complaintMeta}>
                <MaterialIcons name="location-on" size={14} color={Colors.textMuted} />
                <Text style={styles.metaText}>{complaint.ward}</Text>
                <Text style={styles.metaDot}>·</Text>
                <MaterialIcons name="access-time" size={14} color={Colors.textMuted} />
                <Text style={styles.metaText}>{complaint.date}</Text>
                <Text style={styles.complaintId}>#{complaint.id}</Text>
              </View>
            </View>
          );
        }}
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
  actionArea: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: Colors.textOnPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  statCount: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  list: { padding: Spacing.md, paddingBottom: 80 },
  listHeader: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  complaintCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  complaintTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  categoryText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semiBold,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semiBold,
  },
  complaintTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  complaintDesc: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  complaintMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  metaDot: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
  },
  complaintId: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginLeft: 'auto',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyImage: {
    width: 160,
    height: 120,
  },
  emptyTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    lineHeight: 22,
  },
});
