import { useLocalSearchParams } from 'expo-router';
import { useDeepLink } from '@/contexts/DeepLinkContext';
import { useMemo, useEffect } from 'react';
import { Platform } from 'react-native';

export function useDeepLinkParams<T extends Record<string, string | string[] | undefined>>() {
  const localParams = useLocalSearchParams<T>();
  const { pendingParams, clearPendingParams } = useDeepLink();

  const resolvedParams = useMemo(() => {
    console.log('[useDeepLinkParams] Attempting resolution. Local:', localParams, 'Pending:', pendingParams);
    // 1. Try local search params first
    if (Object.keys(localParams).length > 0) {
      console.log('[useDeepLinkParams] Resolved from local params:', localParams);
      return localParams;
    }

    // 2. Try pending params from context
    if (pendingParams && Object.keys(pendingParams).length > 0) {
      console.log('[useDeepLinkParams] Resolved from pending params:', pendingParams);
      return pendingParams as T;
    }

    // 3. Fallback for Web: Parse URL directly if others fail
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(url.search);
      const urlParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        urlParams[key] = value;
      });

      if (Object.keys(urlParams).length > 0) {
        console.log('[useDeepLinkParams] Resolved from URL parsing:', urlParams);
        return urlParams as T;
      }
    }

    console.log('[useDeepLinkParams] No params resolved');
    return {} as T;
  }, [localParams, pendingParams]);

  // Clear pending params after they have been resolved and component has mounted/updated
  useEffect(() => {
    if (pendingParams && Object.keys(pendingParams).length > 0) {
      // Small delay to ensure they are consumed
      const timer = setTimeout(() => {
        clearPendingParams();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pendingParams, clearPendingParams]);

  return resolvedParams;
}
