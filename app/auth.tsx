import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';
import { WARDS } from '@/constants/mockData';

type Step = 'phone' | 'otp' | 'profile';

export default function AuthScreen() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [ward, setWard] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      showAlert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    const res = await authService.sendOTP(phone);
    setLoading(false);
    if (res.success) {
      setStep('otp');
      showAlert('OTP Sent', 'A 6-digit OTP has been sent to +977 ' + phone + '. Use any 6-digit code for demo.');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      showAlert('Invalid OTP', 'Please enter the 6-digit OTP.');
      return;
    }
    setStep('profile');
  };

  const handleCompleteProfile = async () => {
    if (!name.trim()) {
      showAlert('Name Required', 'Please enter your full name.');
      return;
    }
    if (!ward) {
      showAlert('Ward Required', 'Please select your ward.');
      return;
    }
    setLoading(true);
    const res = await authService.verifyOTP(phone, otp, name.trim(), ward);
    setLoading(false);
    if (res.success && res.user) {
      login(res.user);

      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          searchParams.append(key, Array.isArray(value) ? value[0] : value);
        }
      });

      const queryString = searchParams.toString();
      const suffix = queryString ? `?${queryString}` : '';

      if (params.id) {
        if (['birth', 'death', 'marriage', 'migration', 'recommendation', 'business'].includes(params.id as string)) {
          router.replace(`/service-detail${suffix}`);
          return;
        }
        router.replace(`/notice-detail${suffix}`);
      } else if (params.ward) {
        router.replace(`/ward-detail${suffix}`);
      } else {
        router.replace('/(tabs)');
      }
    } else {
      showAlert('Error', res.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/municipality-seal.png')}
            style={styles.seal}
            contentFit="contain"
          />
          <Text style={styles.municipalityName}>Kachankawal</Text>
          <Text style={styles.municipalityNameNepali}>कचनकवल गाउँपालिका</Text>
          <Text style={styles.tagline}>Rural Municipality — Citizen Portal</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          {['phone', 'otp', 'profile'].map((s, i) => (
            <React.Fragment key={s}>
              <View style={[styles.progressDot,
                (['phone', 'otp', 'profile'].indexOf(step) >= i) ? styles.progressDotActive : styles.progressDotInactive
              ]}>
                <Text style={styles.progressDotText}>{i + 1}</Text>
              </View>
              {i < 2 ? (
                <View style={[styles.progressLine,
                  (['phone', 'otp', 'profile'].indexOf(step) > i) ? styles.progressLineActive : styles.progressLineInactive
                ]} />
              ) : null}
            </React.Fragment>
          ))}
        </View>

        {/* Step: Phone */}
        {step === 'phone' && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Enter Mobile Number</Text>
            <Text style={styles.formSubtitle}>We will send an OTP to verify your number</Text>
            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+977</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="98XXXXXXXX"
                placeholderTextColor={Colors.textMuted}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
                accessibilityLabel="Mobile number"
              />
            </View>
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Send OTP</Text>}
            </TouchableOpacity>
          </View>
        )}

        {/* Step: OTP */}
        {step === 'otp' && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Enter OTP</Text>
            <Text style={styles.formSubtitle}>Enter the 6-digit code sent to +977 {phone}</Text>
            <TextInput
              style={styles.otpInput}
              placeholder="_ _ _ _ _ _"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              textAlign="center"
              accessibilityLabel="OTP code"
            />
            <View style={styles.demoHint}>
              <MaterialIcons name="info-outline" size={14} color={Colors.info} />
              <Text style={styles.demoHintText}>Demo: Use any 6-digit code (e.g., 123456)</Text>
            </View>
            <TouchableOpacity style={styles.btn} onPress={handleVerifyOTP}>
              <Text style={styles.btnText}>Verify OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep('phone')} style={styles.backBtn}>
              <Text style={styles.backText}>Change Number</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step: Profile */}
        {step === 'profile' && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Complete Your Profile</Text>
            <Text style={styles.formSubtitle}>Tell us your name and ward to get personalized services</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              accessibilityLabel="Full name"
            />

            <Text style={styles.label}>Select Your Ward</Text>
            <View style={styles.wardGrid}>
              {WARDS.map(w => (
                <TouchableOpacity
                  key={w.id}
                  style={[styles.wardChip, ward === w.name && styles.wardChipSelected]}
                  onPress={() => setWard(w.name)}
                >
                  <Text style={[styles.wardChipText, ward === w.name && styles.wardChipTextSelected]}>
                    Ward {w.number}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleCompleteProfile}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Continue</Text>}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: Spacing.xl,
  },
  seal: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  municipalityName: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textOnPrimary,
  },
  municipalityNameNepali: {
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  tagline: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  progressDotInactive: {
    backgroundColor: Colors.border,
  },
  progressDotText: {
    color: Colors.textOnPrimary,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
  },
  progressLine: {
    width: 48,
    height: 2,
  },
  progressLineActive: {
    backgroundColor: Colors.primary,
  },
  progressLineInactive: {
    backgroundColor: Colors.border,
  },
  form: {
    padding: Spacing.xl,
  },
  formTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  phoneRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  countryCode: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  countryCodeText: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: Typography.lg,
    color: Colors.textPrimary,
  },
  otpInput: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 16,
    fontSize: Typography.display,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    letterSpacing: 16,
    marginBottom: 12,
  },
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.infoSurface,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    marginBottom: Spacing.md,
    gap: 6,
  },
  demoHintText: {
    fontSize: Typography.sm,
    color: Colors.info,
    flex: 1,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  wardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  wardChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  wardChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  wardChipText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  wardChipTextSelected: {
    color: Colors.primary,
    fontWeight: Typography.semiBold,
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: Colors.textOnPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
  },
  backBtn: {
    alignItems: 'center',
    padding: Spacing.sm,
  },
  backText: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
  },
});
