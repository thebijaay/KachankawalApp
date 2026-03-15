import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { municipalService, ServiceApplication } from '@/services/municipalService';
import { MY_APPLICATIONS } from '@/constants/mockData';

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  pending: { color: Colors.textMuted, bg: Colors.surfaceSecondary },
  processing: { color: Colors.warning, bg: Colors.warningSurface },
  approved: { color: Colors.success, bg: Colors.successSurface },
  rejected: { color: Colors.error, bg: Colors.errorSurface },
};

export default function MyApplicationsScreen() {
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      municipalService.getApplications().then(apps => {
        setApplications([...apps, ...MY_APPLICATIONS as ServiceApplication[]]);
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
      data={applications}
      keyExtractor={a => a.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.empty}>
          <MaterialIcons name="inbox" size={56} color={Colors.border} />
          <Text style={styles.emptyTitle}>No Applications Yet</Text>
          <Text style={styles.emptySubtitle}>Your service requests will appear here</Text>
        </View>
      }
      renderItem={({ item: app }) => {
        const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
        return (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.serviceName}>{app.service}</Text>
              <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                <Text style={[styles.statusText, { color: cfg.color }]}>{app.statusLabel}</Text>
              </View>
            </View>
            <View style={styles.cardMeta}>
              <MaterialIcons name="person" size={14} color={Colors.textMuted} />
              <Text style={styles.metaText}>{app.applicant}</Text>
              <Text style={styles.metaDot}>·</Text>
              <MaterialIcons name="location-on" size={14} color={Colors.textMuted} />
              <Text style={styles.metaText}>{app.ward}</Text>
            </View>
            <View style={styles.cardBottom}>
              <Text style={styles.appId}>#{app.id}</Text>
              <Text style={styles.appDate}>{app.date}</Text>
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
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
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  metaText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  metaDot: {
    color: Colors.textMuted,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appId: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontFamily: 'monospace',
    fontWeight: Typography.medium,
  },
  appDate: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
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
  },
});
