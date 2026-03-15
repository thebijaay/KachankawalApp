import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { HEALTH_FACILITIES, SCHOOLS } from '@/constants/mockData';

type Tab = 'health' | 'schools';

export default function HealthScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('health');

  return (
    <View style={styles.screen}>
      {/* Tab Toggle */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'health' && styles.tabActive]}
          onPress={() => setActiveTab('health')}
        >
          <MaterialIcons name="local-hospital" size={18} color={activeTab === 'health' ? Colors.textOnPrimary : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'health' && styles.tabTextActive]}>Health Facilities</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'schools' && styles.tabActive]}
          onPress={() => setActiveTab('schools')}
        >
          <MaterialIcons name="school" size={18} color={activeTab === 'schools' ? Colors.textOnPrimary : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'schools' && styles.tabTextActive]}>Schools</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.md, paddingBottom: 40 }}>
        {activeTab === 'health' ? (
          <>
            {HEALTH_FACILITIES.map(facility => (
              <View key={facility.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.facilityIcon}>
                    <MaterialIcons name="local-hospital" size={24} color={Colors.error} />
                  </View>
                  <View style={styles.headerInfo}>
                    <Text style={styles.facilityName}>{facility.name}</Text>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeText}>{facility.type}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <MaterialIcons name="location-on" size={14} color={Colors.textMuted} />
                  <Text style={styles.detailText}>{facility.address} · {facility.ward}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="access-time" size={14} color={Colors.textMuted} />
                  <Text style={styles.detailText}>{facility.openHours}</Text>
                </View>

                <View style={styles.servicesRow}>
                  {facility.services.map(svc => (
                    <View key={svc} style={styles.servicePill}>
                      <Text style={styles.servicePillText}>{svc}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => Linking.openURL('tel:' + facility.phone)}
                >
                  <MaterialIcons name="phone" size={16} color={Colors.textOnPrimary} />
                  <Text style={styles.callBtnText}>Call {facility.phone}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        ) : (
          <>
            {SCHOOLS.map(school => (
              <View key={school.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.facilityIcon, { backgroundColor: Colors.infoSurface }]}>
                    <MaterialIcons name="school" size={24} color={Colors.info} />
                  </View>
                  <View style={styles.headerInfo}>
                    <Text style={styles.facilityName}>{school.name}</Text>
                    <View style={[styles.typeBadge, { backgroundColor: Colors.infoSurface }]}>
                      <Text style={[styles.typeText, { color: Colors.info }]}>{school.type}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="location-on" size={14} color={Colors.textMuted} />
                  <Text style={styles.detailText}>{school.ward}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="grade" size={14} color={Colors.textMuted} />
                  <Text style={styles.detailText}>{school.grade}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.callBtn, { backgroundColor: Colors.info }]}
                  onPress={() => Linking.openURL('tel:' + school.phone)}
                >
                  <MaterialIcons name="phone" size={16} color={Colors.textOnPrimary} />
                  <Text style={styles.callBtnText}>Call {school.phone}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textOnPrimary,
    fontWeight: Typography.semiBold,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  facilityIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    backgroundColor: Colors.errorSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  headerInfo: { flex: 1 },
  facilityName: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.errorSurface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  typeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semiBold,
    color: Colors.error,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  detailText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  servicePill: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  servicePillText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  callBtn: {
    backgroundColor: Colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
  },
  callBtnText: {
    color: Colors.textOnPrimary,
    fontWeight: Typography.semiBold,
    fontSize: Typography.sm,
  },
});
