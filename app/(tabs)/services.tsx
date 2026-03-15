import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { DIGITAL_SERVICES } from '@/constants/mockData';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

const CATEGORIES = ['All', 'Vital Registration', 'Certificate', 'Business'];

const SERVICE_COLORS: Record<string, string> = {
  birth: Colors.success,
  death: Colors.textSecondary,
  marriage: Colors.error,
  migration: Colors.info,
  recommendation: Colors.warning,
  business: Colors.primary,
};

export default function ServicesScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const filtered = activeCategory === 'All'
    ? DIGITAL_SERVICES
    : DIGITAL_SERVICES.filter(s => s.category === activeCategory);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Digital Services</Text>
        <Text style={styles.headerSubtitle}>Apply for official certificates & documents</Text>
      </View>

      {/* Track Status Banner */}
      <TouchableOpacity
        style={styles.trackBanner}
        onPress={() => router.push('/my-applications')}
        activeOpacity={0.85}
      >
        <MaterialIcons name="track-changes" size={20} color={Colors.primary} />
        <Text style={styles.trackText}>Track Your Application Status</Text>
        <MaterialIcons name="arrow-forward" size={18} color={Colors.primary} />
      </TouchableOpacity>

      {/* Category Filter */}
      <View style={styles.filterBar}>
        <FlatList
          horizontal
          data={CATEGORIES}
          showsHorizontalScrollIndicator={false}
          keyExtractor={c => c}
          contentContainerStyle={styles.filterContent}
          renderItem={({ item: cat }) => (
            <TouchableOpacity
              style={[styles.chip, activeCategory === cat && styles.chipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Services List */}
      <FlatList
        data={filtered}
        keyExtractor={s => s.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item: service }) => (
          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => router.push({ pathname: '/service-detail', params: { id: service.id } })}
            activeOpacity={0.85}
          >
            <View style={[styles.serviceIconBox, { backgroundColor: (SERVICE_COLORS[service.id] || Colors.primary) + '15' }]}>
              <MaterialIcons
                name={service.icon as IconName}
                size={28}
                color={SERVICE_COLORS[service.id] || Colors.primary}
              />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.title}</Text>
              <Text style={styles.serviceDesc} numberOfLines={2}>{service.description}</Text>
              <View style={styles.serviceMeta}>
                <View style={styles.metaItem}>
                  <MaterialIcons name="access-time" size={12} color={Colors.textMuted} />
                  <Text style={styles.metaText}>{service.processingDays}</Text>
                </View>
                <View style={styles.metaItem}>
                  <MaterialIcons name="attach-money" size={12} color={Colors.textMuted} />
                  <Text style={styles.metaText}>{service.fee}</Text>
                </View>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Colors.primary} />
          </TouchableOpacity>
        )}
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
  trackBanner: {
    backgroundColor: Colors.primarySurface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  trackText: {
    flex: 1,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.primary,
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
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.textOnPrimary,
    fontWeight: Typography.semiBold,
  },
  list: {
    padding: Spacing.md,
    paddingBottom: 80,
  },
  serviceCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.sm,
  },
  serviceIconBox: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  serviceMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
});
