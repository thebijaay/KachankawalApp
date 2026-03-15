import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { EVENTS } from '@/constants/mockData';

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Agriculture: { bg: Colors.successSurface, text: Colors.success },
  Social: { bg: Colors.infoSurface, text: Colors.info },
  Health: { bg: Colors.errorSurface, text: Colors.error },
  Education: { bg: Colors.warningSurface, text: Colors.warning },
};

export default function EventsScreen() {
  return (
    <FlatList
      style={styles.screen}
      data={EVENTS}
      keyExtractor={e => e.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: Spacing.md, paddingBottom: 40 }}
      ListHeaderComponent={
        <View style={styles.banner}>
          <MaterialIcons name="event" size={20} color={Colors.primary} />
          <Text style={styles.bannerText}>Municipality Events & Programs 2081/82</Text>
        </View>
      }
      renderItem={({ item: event }) => {
        const catCfg = CATEGORY_COLORS[event.category] || { bg: Colors.primarySurface, text: Colors.primary };
        return (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={[styles.catBadge, { backgroundColor: catCfg.bg }]}>
                <Text style={[styles.catText, { color: catCfg.text }]}>{event.category}</Text>
              </View>
              <Text style={styles.ward}>{event.ward}</Text>
            </View>

            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.desc}>{event.description}</Text>

            <View style={styles.detailsRow}>
              <View style={styles.detail}>
                <MaterialIcons name="event" size={14} color={Colors.primary} />
                <Text style={styles.detailText}>{event.date}</Text>
              </View>
              <View style={styles.detail}>
                <MaterialIcons name="access-time" size={14} color={Colors.primary} />
                <Text style={styles.detailText}>{event.time}</Text>
              </View>
            </View>
            <View style={styles.detail}>
              <MaterialIcons name="location-on" size={14} color={Colors.primary} />
              <Text style={styles.detailText}>{event.venue}</Text>
            </View>

            <View style={styles.footer}>
              <MaterialIcons name="account-balance" size={14} color={Colors.textMuted} />
              <Text style={styles.footerText}>{event.organizer}</Text>
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  banner: {
    backgroundColor: Colors.primarySurface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bannerText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.primary,
    flex: 1,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    ...Shadow.sm,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  catBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  catText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semiBold,
  },
  ward: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: 6,
    lineHeight: 24,
  },
  desc: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: 6,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  detailText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  footerText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
});
