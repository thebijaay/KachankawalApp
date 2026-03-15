import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { EMERGENCY_CONTACTS } from '@/constants/mockData';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

const CONTACT_COLORS: Record<string, string> = {
  police: '#1A5276',
  ambulance: Colors.error,
  fire: '#D35400',
  municipality: Colors.primary,
  disaster: Colors.warning,
};

export default function EmergencyScreen() {
  const handleCall = (number: string) => {
    Linking.openURL('tel:' + number);
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Alert Banner */}
      <View style={styles.alertBanner}>
        <MaterialIcons name="emergency" size={24} color={Colors.textOnPrimary} />
        <Text style={styles.alertText}>In a life-threatening emergency, call 100 immediately</Text>
      </View>

      <Text style={styles.sectionTitle}>Emergency Numbers</Text>

      {EMERGENCY_CONTACTS.map(contact => (
        <TouchableOpacity
          key={contact.id}
          style={styles.contactCard}
          onPress={() => handleCall(contact.number)}
          activeOpacity={0.85}
        >
          <View style={[styles.contactIcon, { backgroundColor: (CONTACT_COLORS[contact.type] || Colors.primary) + '15' }]}>
            <MaterialIcons
              name={contact.icon as IconName}
              size={28}
              color={CONTACT_COLORS[contact.type] || Colors.primary}
            />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactDesc}>{contact.description}</Text>
          </View>
          <View style={styles.callBadge}>
            <Text style={styles.callNumber}>{contact.number}</Text>
            <MaterialIcons name="phone" size={16} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      ))}

      {/* Safety Tips */}
      <Text style={styles.sectionTitle}>Emergency Tips</Text>
      <View style={styles.tipsCard}>
        {[
          'Stay calm and assess the situation',
          'Call the appropriate emergency number',
          'Provide your exact location clearly',
          'Follow instructions from emergency personnel',
          'Keep this app bookmarked for quick access',
        ].map((tip, i) => (
          <View key={i} style={styles.tip}>
            <View style={styles.tipNumber}>
              <Text style={styles.tipNumberText}>{i + 1}</Text>
            </View>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  alertBanner: {
    backgroundColor: Colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: 10,
  },
  alertText: {
    flex: 1,
    color: Colors.textOnPrimary,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  contactCard: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.md,
    ...Shadow.sm,
  },
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  contactInfo: { flex: 1 },
  contactName: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  contactDesc: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  callBadge: {
    alignItems: 'flex-end',
    gap: 4,
  },
  callNumber: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  tipsCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadow.sm,
    gap: Spacing.md,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipNumberText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  tipText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
