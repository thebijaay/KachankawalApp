import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { MUNICIPALITY_INFO, WARDS } from '@/constants/mockData';
import { useAlert } from '@/template';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface MenuItemProps {
  icon: IconName;
  label: string;
  subtitle?: string;
  onPress: () => void;
  color?: string;
}

const MenuItem = ({ icon, label, subtitle, onPress, color = Colors.primary }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIcon, { backgroundColor: color + '15' }]}>
      <MaterialIcons name={icon} size={22} color={color} />
    </View>
    <View style={styles.menuContent}>
      <Text style={styles.menuLabel}>{label}</Text>
      {subtitle ? <Text style={styles.menuSubtitle}>{subtitle}</Text> : null}
    </View>
    <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
  </TouchableOpacity>
);

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();

  const handleLogout = () => {
    showAlert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive', onPress: async () => {
          await logout();
          router.replace('/auth');
        }
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <MaterialIcons name="account-circle" size={48} color={Colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Citizen'}</Text>
            <Text style={styles.profilePhone}>+977 {user?.phone}</Text>
            <Text style={styles.profileWard}>{user?.ward || 'Kachankawal'}</Text>
          </View>
        </View>

        {/* My Account */}
        <Text style={styles.sectionLabel}>My Account</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="track-changes"
            label="My Applications"
            subtitle="Track service requests"
            onPress={() => router.push('/my-applications')}
          />
          <MenuItem
            icon="report-problem"
            label="My Complaints"
            subtitle="View submitted complaints"
            onPress={() => router.push('/my-complaints')}
            color={Colors.warning}
          />
        </View>

        {/* Municipality */}
        <Text style={styles.sectionLabel}>Municipality</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="account-balance"
            label="About Municipality"
            subtitle={MUNICIPALITY_INFO.nepaliName}
            onPress={() => showAlert('Kachankawal Rural Municipality', `District: ${MUNICIPALITY_INFO.district}\nArea: ${MUNICIPALITY_INFO.area}\nPopulation: ${MUNICIPALITY_INFO.population}\nWards: ${MUNICIPALITY_INFO.wards}\nEstablished: ${MUNICIPALITY_INFO.established}`)}
          />
          <MenuItem
            icon="people"
            label="Elected Representatives"
            onPress={() => router.push('/representatives')}
          />
          <MenuItem
            icon="badge"
            label="Staff Directory"
            onPress={() => router.push('/staff')}
          />
        </View>

        {/* Ward Services */}
        <Text style={styles.sectionLabel}>Ward Information</Text>
        <View style={styles.wardGrid}>
          {WARDS.map(ward => (
            <TouchableOpacity
              key={ward.id}
              style={styles.wardCard}
              onPress={() => router.push({ pathname: '/ward-detail', params: { ward: ward.number.toString() } })}
              activeOpacity={0.8}
            >
              <View style={styles.wardCircle}>
                <Text style={styles.wardNumber}>{ward.number}</Text>
              </View>
              <Text style={styles.wardLabel}>Ward {ward.number}</Text>
              <Text style={styles.wardArea} numberOfLines={2}>{ward.area}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Health & Events */}
        <Text style={styles.sectionLabel}>Information</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="local-hospital"
            label="Health & Education"
            subtitle="Hospitals, schools directory"
            onPress={() => router.push('/health')}
            color={Colors.error}
          />
          <MenuItem
            icon="event"
            label="Events & Programs"
            subtitle="Municipality events calendar"
            onPress={() => router.push('/events')}
            color={Colors.success}
          />
          <MenuItem
            icon="emergency"
            label="Emergency Contacts"
            subtitle="Police, ambulance, fire"
            onPress={() => router.push('/emergency')}
            color={Colors.error}
          />
        </View>

        {/* Support */}
        <Text style={styles.sectionLabel}>Support</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="language"
            label="Official Website"
            subtitle={MUNICIPALITY_INFO.website}
            onPress={() => Linking.openURL('https://' + MUNICIPALITY_INFO.website)}
            color={Colors.info}
          />
          <MenuItem
            icon="phone"
            label="Contact Municipality"
            subtitle={MUNICIPALITY_INFO.phone}
            onPress={() => Linking.openURL('tel:' + MUNICIPALITY_INFO.phone)}
            color={Colors.success}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <MaterialIcons name="logout" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Kachankawal App v1.0.0 · Made for citizens</Text>
      </ScrollView>
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
  profileCard: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  profilePhone: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  profileWard: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.medium,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  menuGroup: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    minHeight: 56,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuContent: { flex: 1 },
  menuLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  wardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  wardCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    width: '30%',
    alignItems: 'center',
    ...Shadow.sm,
  },
  wardCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primarySurface,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  wardNumber: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  wardLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  wardArea: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.error,
    backgroundColor: Colors.errorSurface,
  },
  logoutText: {
    color: Colors.error,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
  },
  version: {
    textAlign: 'center',
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
});
