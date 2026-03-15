import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="notice-detail" options={{ headerShown: true, title: 'Notice Detail', headerTintColor: '#C0392B' }} />
            <Stack.Screen name="ward-detail" options={{ headerShown: true, title: 'Ward Information', headerTintColor: '#C0392B' }} />
            <Stack.Screen name="service-detail" options={{ headerShown: true, title: 'Service Details', headerTintColor: '#C0392B' }} />
            <Stack.Screen name="submit-complaint" options={{ headerShown: true, title: 'Submit Complaint', headerTintColor: '#C0392B' }} />
            <Stack.Screen name="my-applications" options={{ headerShown: true, title: 'My Applications', headerTintColor: '#C0392B' }} />
            <Stack.Screen name="my-complaints" options={{ headerShown: true, title: 'My Complaints', headerTintColor: '#C0392B' }} />
            <Stack.Screen name="emergency" options={{ headerShown: true, title: 'Emergency Contacts', headerTintColor: '#C0392B' }} />
            <Stack.Screen name="representatives" options={{ headerShown: true, title: 'Elected Representatives', headerTintColor: '#C0392B' }} />
            <Stack.Screen name="staff" options={{ headerShown: true, title: 'Staff Directory', headerTintColor: '#C0392B' }} />
            <Stack.Screen name="health" options={{ headerShown: true, title: 'Health & Education', headerTintColor: '#C0392B' }} />
            <Stack.Screen name="events" options={{ headerShown: true, title: 'Events & Programs', headerTintColor: '#C0392B' }} />
          </Stack>
        </AuthProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
