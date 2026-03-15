import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useDeepLinkParams } from '@/hooks/useDeepLinkParams';
import { WARDS } from '@/constants/mockData';

export default function WardDetailScreen() {
  const { ward: wardNum } = useDeepLinkParams<{ ward: string }>();
  const ward = WARDS.find(w => w.number === parseInt(wardNum || '1'));

  if (!ward) {
    if (wardNum === undefined) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    return (
      <View style={styles.center}>
        <Text>Ward not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Ward Banner */}
      <View style={styles.wardBanner}>
        <View style={styles.wardCircle}>
          <Text style={styles.wardNumber}>{ward.number}</Text>
        </View>
        <Text style={styles.wardName}>{ward.name}</Text>
        <Text style={styles.wardArea}>{ward.area}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <MaterialIcons name="people" size={20} color={Colors.primary} />
          <Text style={styles.statValue}>{ward.population}</Text>
          <Text style={styles.statLabel}>Population</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <MaterialIcons name="location-on" size={20} color={Colors.primary} />
          <Text style={styles.statValue}>{ward.area.split(' ')[0]}</Text>
          <Text style={styles.statLabel}>Area</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <MaterialIcons name="account-balance" size={20} color={Colors.primary} />
          <Text style={styles.statValue}>Ward {ward.number}</Text>
          <Text style={styles.statLabel}>Ward No.</Text>
        </View>
      </View>

      {/* Ward Secretary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ward Secretary</Text>
        <View style={styles.secretaryCard}>
          <View style={styles.secretaryAvatar}>
            <MaterialIcons name="person" size={28} color={Colors.primary} />
          </View>
          <View style={styles.secretaryInfo}>
            <Text style={styles.secretaryName}>{ward.secretary}</Text>
            <Text style={styles.secretaryRole}>Ward Secretary — Ward {ward.number}</Text>
          </View>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL('tel:' + ward.phone)}
          >
            <MaterialIcons name="phone" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Ward Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Services</Text>
        {[
          { icon: 'child-care' as const, label: 'Birth Registration' },
          { icon: 'assignment' as const, label: 'Death Registration' },
          { icon: 'favorite' as const, label: 'Marriage Registration' },
          { icon: 'description' as const, label: 'Recommendation Letters' },
          { icon: 'swap-horiz' as const, label: 'Migration Certificate' },
        ].map(svc => (
          <View key={svc.label} style={styles.serviceRow}>
            <MaterialIcons name={svc.icon} size={18} color={Colors.primary} />
            <Text style={styles.serviceText}>{svc.label}</Text>
            <MaterialIcons name="check-circle" size={16} color={Colors.success} />
          </View>
        ))}
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.contactBtn}
          onPress={() => Linking.openURL('tel:' + ward.phone)}
          activeOpacity={0.85}
        >
          <MaterialIcons name="phone" size={20} color={Colors.textOnPrimary} />
          <Text style={styles.contactBtnText}>Call Ward Office: {ward.phone}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  wardBanner: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    padding: Spacing.xl,
  },
  wardCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: Colors.textOnPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  wardNumber: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textOnPrimary,
  },
  wardName: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textOnPrimary,
    marginBottom: 4,
  },
  wardArea: {
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.8)',
  },
  statsRow: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    gap: 4,
  },
  statValue: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  section: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  secretaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.sm,
  },
  secretaryAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  secretaryInfo: { flex: 1 },
  secretaryName: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  secretaryRole: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  serviceText: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  contactBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  contactBtnText: {
    color: Colors.textOnPrimary,
    fontWeight: Typography.semiBold,
    fontSize: Typography.sm,
  },
});
