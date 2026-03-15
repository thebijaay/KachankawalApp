import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/theme';
import { useDeepLink } from '@/contexts/DeepLinkContext';

export default function IndexScreen() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setPendingParams } = useDeepLink();

  useEffect(() => {
    if (!isLoading) {
      // Capture parameters into context as early as possible
      if (Object.keys(params).length > 0) {
        setPendingParams(params);
      }

      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          searchParams.append(key, Array.isArray(value) ? value[0] : value);
        }
      });

      const queryString = searchParams.toString();
      const suffix = queryString ? `?${queryString}` : '';

      if (user?.isLoggedIn) {
        // If we have an ID, we might be trying to go to a detail page
        if (params.id) {
          if (['birth', 'death', 'marriage', 'migration', 'recommendation', 'business'].includes(params.id as string)) {
            router.replace(`/service-detail${suffix}`);
            return;
          }
          router.replace(`/notice-detail${suffix}`);
          return;
        } else if (params.ward) {
          router.replace(`/ward-detail${suffix}`);
          return;
        }
        router.replace('/(tabs)');
      } else {
        router.replace(`/onboarding${suffix}`);
      }
    }
  }, [isLoading, user, params, setPendingParams]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
