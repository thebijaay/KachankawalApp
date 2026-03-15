import React, { memo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import {
  NOTICES, DIGITAL_SERVICES, EMERGENCY_CONTACTS, EVENTS, MUNICIPALITY_INFO,
} from '@/constants/mockData';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface QuickActionProps {
  icon: IconName;
  label: string;
  color: string;
  onPress: () => void;
}

const QuickAction = memo(({ icon, label, color, onPress }: QuickActionProps) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.quickActionIcon, { backgroundColor: color + '18' }]}>
      <MaterialIcons name={icon} size={26} color={color} />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
));

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const recentNotices = NOTICES.slice(0, 3);
  const urgentNotice = NOTICES.find(n => n.isUrgent);

  const getNoticeIcon = (type: string): IconName => {
    const map: Record<string, IconName> = {
      notice: 'campaign',
      tender: 'gavel',
      emergency: 'warning',
      meeting: 'groups',
    };
    return map[type] || 'info';
  };

  const getNoticeColor = (type: string) => {
    const map: Record<string, string> = {
      notice: Colors.info,
      tender: Colors.warning,
      emergency: Colors.error,
      meeting: Colors.success,
    };
    return map[type] || Colors.info;
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Image
                source={require('@/assets/images/municipality-seal.png')}
                style={styles.headerSeal}
                contentFit="contain"
              />
              <View>
                <Text style={styles.headerTitle}>Kachankawal</Text>
                <Text style={styles.headerSubtitle}>Rural Municipality</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/emergency')}
              style={styles.emergencyBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="emergency" size={20} color={Colors.textOnPrimary} />
            </TouchableOpacity>
          </View>
          <View style={styles.welcomeBox}>
            <Text style={styles.welcomeText}>
              Welcome, {user?.name || 'Citizen'}
            </Text>
            <Text style={styles.wardTag}>{user?.ward || 'Kachankawal'}</Text>
          </View>
        </View>

        {/* Urgent Alert */}
        {urgentNotice ? (
          <TouchableOpacity
            style={styles.alertBanner}
            onPress={() => router.push({ pathname: '/notice-detail', params: { id: urgentNotice.id } })}
            activeOpacity={0.85}
          >
            <MaterialIcons name="warning" size={20} color={Colors.textOnPrimary} />
            <Text style={styles.alertText} numberOfLines={1}>{urgentNotice.title}</Text>
            <MaterialIcons name="chevron-right" size={20} color={Colors.textOnPrimary} />
          </TouchableOpacity>
        ) : null}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Services</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction icon="child-care" label="Birth Reg." color={Colors.success} onPress={() => router.push({ pathname: '/service-detail', params: { id: 'birth' } })} />
            <QuickAction icon="assignment" label="Death Reg." color={Colors.textSecondary} onPress={() => router.push({ pathname: '/service-detail', params: { id: 'death' } })} />
            <QuickAction icon="favorite" label="Marriage" color={Colors.error} onPress={() => router.push({ pathname: '/service-detail', params: { id: 'marriage' } })} />
            <QuickAction icon="description" label="Recommendation" color={Colors.warning} onPress={() => router.push({ pathname: '/service-detail', params: { id: 'recommendation' } })} />
            <QuickAction icon="swap-horiz" label="Migration" color={Colors.info} onPress={() => router.push({ pathname: '/service-detail', params: { id: 'migration' } })} />
            <QuickAction icon="store" label="Business" color={Colors.primary} onPress={() => router.push({ pathname: '/service-detail', params: { id: 'business' } })} />
            <QuickAction icon="report-problem" label="Complaint" color={Colors.warning} onPress={() => router.push('/submit-complaint')} />
            <QuickAction icon="track-changes" label="My Status" color={Colors.primaryDark} onPress={() => router.push('/my-applications')} />
          </View>
        </View>

        {/* Notices */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Latest Notices</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/notices')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentNotices.map(notice => (
          <TouchableOpacity
            key={notice.id}
            style={styles.noticeCard}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/notice-detail', params: { id: notice.id } })}
          >
            <View style={[styles.noticeIconBox, { backgroundColor: getNoticeColor(notice.type) + '15' }]}>
              <MaterialIcons name={getNoticeIcon(notice.type)} size={22} color={getNoticeColor(notice.type)} />
            </View>
            <View style={styles.noticeContent}>
              <Text style={styles.noticeTitle} numberOfLines={2}>{notice.title}</Text>
              <View style={styles.noticeMeta}>
                <Text style={styles.noticeDate}>{notice.date}</Text>
                {notice.isUrgent ? (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentBadgeText}>URGENT</Text>
                  </View>
                ) : null}
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}

        {/* Wards Overview */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Ward Services</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/more')}>
            <Text style={styles.seeAll}>All Wards</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wardScroll}>
          {[1, 2, 3, 4, 5, 6, 7].map(w => (
            <TouchableOpacity
              key={w}
              style={styles.wardCard}
              onPress={() => router.push({ pathname: '/ward-detail', params: { ward: String(w) } })}
              activeOpacity={0.8}
            >
              <View style={styles.wardNumber}>
                <Text style={styles.wardNumberText}>{w}</Text>
              </View>
              <Text style={styles.wardLabel}>Ward {w}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Upcoming Events */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity onPress={() => router.push('/events')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {EVENTS.slice(0, 2).map(event => (
          <View key={event.id} style={styles.eventCard}>
            <View style={styles.eventDateBox}>
              <MaterialIcons name="event" size={20} color={Colors.primary} />
              <Text style={styles.eventDate}>{event.date}</Text>
            </View>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventVenue} numberOfLines={1}>{event.venue} · {event.time}</Text>
          </View>
        ))}

        {/* Municipality Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Municipality Information</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={16} color={Colors.primary} />
            <Text style={styles.infoText}>{MUNICIPALITY_INFO.district}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="people" size={16} color={Colors.primary} />
            <Text style={styles.infoText}>Population: {MUNICIPALITY_INFO.population}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="place" size={16} color={Colors.primary} />
            <Text style={styles.infoText}>Area: {MUNICIPALITY_INFO.area}</Text>
          </View>
          <TouchableOpacity
            style={styles.emergencyContact}
            onPress={() => router.push('/emergency')}
          >
            <MaterialIcons name="emergency" size={16} color={Colors.textOnPrimary} />
            <Text style={styles.emergencyContactText}>Emergency Contacts</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerSeal: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textOnPrimary,
  },
  headerSubtitle: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: Typography.medium,
  },
  emergencyBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: Radius.full,
  },
  welcomeBox: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textOnPrimary,
  },
  wardTag: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  alertBanner: {
    backgroundColor: Colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  alertText: {
    flex: 1,
    color: Colors.textOnPrimary,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  section: {
    padding: Spacing.md,
    paddingBottom: 0,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  seeAll: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  quickAction: {
    width: '22%',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  quickActionLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: Typography.medium,
  },
  noticeCard: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.md,
    ...Shadow.sm,
  },
  noticeIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  noticeContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  noticeTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 20,
  },
  noticeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noticeDate: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  urgentBadge: {
    backgroundColor: Colors.errorSurface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  urgentBadgeText: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: Colors.error,
  },
  wardScroll: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  wardCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    width: 72,
    ...Shadow.sm,
  },
  wardNumber: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primarySurface,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  wardNumberText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  wardLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  eventCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    ...Shadow.sm,
  },
  eventDateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  eventDate: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.semiBold,
  },
  eventTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  eventVenue: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
    ...Shadow.sm,
  },
  infoTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  infoText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  emergencyContact: {
    backgroundColor: Colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
    gap: 8,
  },
  emergencyContactText: {
    color: Colors.textOnPrimary,
    fontWeight: Typography.semiBold,
    fontSize: Typography.sm,
  },
});
