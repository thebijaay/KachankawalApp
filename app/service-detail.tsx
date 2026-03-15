import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { DIGITAL_SERVICES } from '@/constants/mockData';
import { municipalService } from '@/services/municipalService';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

const SERVICE_COLORS: Record<string, string> = {
  birth: Colors.success,
  death: Colors.textSecondary,
  marriage: Colors.error,
  migration: Colors.info,
  recommendation: Colors.warning,
  business: Colors.primary,
};

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const service = DIGITAL_SERVICES.find(s => s.id === id);
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const router = useRouter();

  const [applicantName, setApplicantName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [ward, setWard] = useState(user?.ward || '');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState('');

  if (!service) {
    if (id === undefined) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    return (
      <View style={styles.center}>
        <Text>Service not found: {JSON.stringify(id)}</Text>
      </View>
    );
  }

  const color = SERVICE_COLORS[service.id] || Colors.primary;

  const handleSubmit = async () => {
    if (!applicantName.trim() || !phone.trim()) {
      showAlert('Required Fields', 'Please fill in your name and phone number.');
      return;
    }
    setLoading(true);
    const app = await municipalService.submitApplication(
      service.id, service.title, applicantName.trim(), phone.trim(), ward
    );
    setLoading(false);
    setAppId(app.id);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.successScreen}>
        <View style={[styles.successIcon, { backgroundColor: Colors.successSurface }]}>
          <MaterialIcons name="check-circle" size={64} color={Colors.success} />
        </View>
        <Text style={styles.successTitle}>Application Submitted!</Text>
        <Text style={styles.successSubtitle}>Your request for {service.title} has been received.</Text>
        <View style={styles.appIdBox}>
          <Text style={styles.appIdLabel}>Application ID</Text>
          <Text style={styles.appIdValue}>{appId}</Text>
        </View>
        <Text style={styles.successNote}>Processing time: {service.processingDays}</Text>
        <TouchableOpacity style={styles.trackBtn} onPress={() => router.push('/my-applications')}>
          <Text style={styles.trackBtnText}>Track Application</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.back()}>
          <Text style={styles.homeBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Service Info */}
        <View style={[styles.serviceHeader, { backgroundColor: color + '10' }]}>
          <View style={[styles.headerIcon, { backgroundColor: color + '20' }]}>
            <MaterialIcons name={service.icon as IconName} size={36} color={color} />
          </View>
          <Text style={styles.serviceName}>{service.title}</Text>
          <Text style={styles.serviceDesc}>{service.description}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialIcons name="access-time" size={16} color={color} />
              <Text style={styles.infoText}>{service.processingDays}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="attach-money" size={16} color={color} />
              <Text style={styles.infoText}>{service.fee}</Text>
            </View>
          </View>
        </View>

        {/* Required Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          <View style={styles.docsCard}>
            {service.requiredDocs.map((doc, i) => (
              <View key={i} style={styles.docItem}>
                <MaterialIcons name="check-box" size={18} color={color} />
                <Text style={styles.docText}>{doc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Application Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Form</Text>
          <View style={styles.formCard}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={applicantName}
              onChangeText={setApplicantName}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.textMuted}
              accessibilityLabel="Applicant full name"
            />

            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="98XXXXXXXX"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
              accessibilityLabel="Phone number"
            />

            <Text style={styles.label}>Ward</Text>
            <TextInput
              style={styles.input}
              value={ward}
              onChangeText={setWard}
              placeholder="e.g. Ward 3"
              placeholderTextColor={Colors.textMuted}
              accessibilityLabel="Ward"
            />

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: color }, loading && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : (
                  <>
                    <MaterialIcons name="send" size={18} color={Colors.textOnPrimary} />
                    <Text style={styles.submitBtnText}>Submit Application</Text>
                  </>
                )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <MaterialIcons name="info-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.disclaimerText}>
            By submitting, you confirm all information provided is accurate. You may be contacted for physical document verification.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  serviceHeader: {
    padding: Spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  serviceDesc: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  section: {
    padding: Spacing.md,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  docsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadow.sm,
    gap: 10,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  docText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  submitBtn: {
    borderRadius: Radius.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.sm,
  },
  btnDisabled: { opacity: 0.7 },
  submitBtnText: {
    color: Colors.textOnPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  disclaimerText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    flex: 1,
    lineHeight: 18,
  },
  // Success state
  successScreen: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  appIdBox: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  appIdLabel: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  appIdValue: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.primary,
    fontFamily: 'monospace',
  },
  successNote: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  trackBtn: {
    backgroundColor: Colors.primary,
    width: '100%',
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  trackBtnText: {
    color: Colors.textOnPrimary,
    fontWeight: Typography.semiBold,
    fontSize: Typography.base,
  },
  homeBtn: {
    width: '100%',
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  homeBtnText: {
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
    fontSize: Typography.base,
  },
});
