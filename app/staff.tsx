import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { STAFF_DIRECTORY } from '@/constants/mockData';

export default function StaffScreen() {
  return (
    <FlatList
      style={styles.screen}
      data={STAFF_DIRECTORY}
      keyExtractor={s => s.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: Spacing.md, paddingBottom: 40 }}
      renderItem={({ item: staff }) => (
        <View style={styles.card}>
          <View style={styles.avatarPlaceholder}>
            <MaterialIcons name="person" size={28} color={Colors.primary} />
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{staff.name}</Text>
            <Text style={styles.position}>{staff.position}</Text>
            <Text style={styles.department}>{staff.department}</Text>
            <View style={styles.contactRow}>
              <TouchableOpacity
                style={styles.contactBtn}
                onPress={() => Linking.openURL('tel:' + staff.phone)}
              >
                <MaterialIcons name="phone" size={14} color={Colors.primary} />
                <Text style={styles.contactText}>{staff.phone}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...Shadow.sm,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: { flex: 1 },
  name: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  position: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.medium,
    marginTop: 2,
  },
  department: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  contactText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
});
