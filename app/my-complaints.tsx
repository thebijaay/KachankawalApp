import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { municipalService, ComplaintRecord } from '@/services/municipalService';
import { COMPLAINTS } from '@/constants/mockData';

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  submitted: { color: Colors.info, bg: Colors.infoSurface },
  processing: { color: Colors.warning, bg: Colors.warningSurface },
  resolved: { color: Colors.success, bg: Colors.successSurface },
  rejected: { color: Colors.error, bg: Colors.errorSurface },
};

export default function MyComplaintsScreen() {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      municipalService.getComplaints().then(c => {
        setComplaints([...c, ...COMPLAINTS as ComplaintRecord[]]);
        setLoading(false);
      });
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.screen}
      data={complaints}
      keyExtractor={c => c.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => router.push('/submit-complaint')}
          activeOpacity={0.85}
        >
          <MaterialIcons name="add" size={20} color={Colors.textOnPrimary} />
          <Text style={styles.newBtnText}>New Complaint</Text>
        </TouchableOpacity>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <MaterialIcons name="report-problem" size={56} color={Colors.border} />
          <Text style={styles.emptyTitle}>No Complaints</Text>
          <Text style={styles.emptySubtitle}>Submit a complaint to report issues in your ward</Text>
        </View>
      }
      renderItem={({ item: c }) => {
        const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.submitted;
        return (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={[styles.catTag, { backgroundColor: Colors.primarySurface }]}>
                <Text style={[styles.catText, { color: Colors.primary }]}>{c.category}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                <Text style={[styles.statusText, { color: cfg.color }]}>{c.statusLabel}</Text>
              </View>
            </View>
            <Text style={styles.title}>{c.title}</Text>
            <Text style={styles.desc} numberOfLines={2}>{c.description}</Text>
            <View style={styles.cardBottom}>
              <Text style={styles.id}>#{c.id}</Text>
              <Text style={styles.date}>{c.date} · {c.ward}</Text>
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.md, paddingBottom: 40 },
  newBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  newBtnText: {
    color: Colors.textOnPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  catTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  catText: {
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
  title: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  desc: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  id: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontFamily: 'monospace',
    fontWeight: Typography.medium,
  },
  date: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
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
  },
});
