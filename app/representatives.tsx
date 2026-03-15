import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { ELECTED_REPRESENTATIVES } from '@/constants/mockData';

export default function RepresentativesScreen() {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.headerBanner}>
        <Text style={styles.bannerText}>Elected Representatives 2079–2084</Text>
        <Text style={styles.bannerSub}>Kachankawal Rural Municipality</Text>
      </View>

      {ELECTED_REPRESENTATIVES.map(rep => (
        <View key={rep.id} style={styles.card}>
          <Image
            source={{ uri: rep.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View style={styles.info}>
            <Text style={styles.name}>{rep.name}</Text>
            <Text style={styles.position}>{rep.position}</Text>
            <Text style={styles.ward}>{rep.ward}</Text>
          </View>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL('tel:' + rep.phone)}
          >
            <MaterialIcons name="phone" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  headerBanner: {
    backgroundColor: Colors.primarySurface,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.primary,
  },
  bannerSub: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: Radius.md,
    ...Shadow.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: Spacing.md,
    backgroundColor: Colors.border,
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
  ward: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
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
});
