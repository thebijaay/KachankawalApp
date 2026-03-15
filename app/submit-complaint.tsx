import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { COMPLAINT_CATEGORIES, WARDS } from '@/constants/mockData';
import { municipalService } from '@/services/municipalService';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';

export default function SubmitComplaintScreen() {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const router = useRouter();

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ward, setWard] = useState(user?.ward || '');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState('');

  const handleSubmit = async () => {
    if (!category) {
      showAlert('Category Required', 'Please select a complaint category.');
      return;
    }
    if (!title.trim() || title.trim().length < 5) {
      showAlert('Title Required', 'Please enter a descriptive title (min 5 characters).');
      return;
    }
    if (!description.trim() || description.trim().length < 20) {
      showAlert('Description Required', 'Please describe the issue in detail (min 20 characters).');
      return;
    }
    setLoading(true);
    const complaint = await municipalService.submitComplaint(category, title.trim(), description.trim(), ward);
    setLoading(false);
    setComplaintId(complaint.id);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.successScreen}>
        <View style={styles.successIconBox}>
          <MaterialIcons name="check-circle" size={64} color={Colors.success} />
        </View>
        <Text style={styles.successTitle}>Complaint Submitted</Text>
        <Text style={styles.successSubtitle}>Your complaint has been registered. Municipality staff will review it shortly.</Text>
        <View style={styles.idBox}>
          <Text style={styles.idLabel}>Complaint ID</Text>
          <Text style={styles.idValue}>{complaintId}</Text>
        </View>
        <TouchableOpacity style={styles.trackBtn} onPress={() => router.push('/my-complaints')}>
          <Text style={styles.trackBtnText}>Track Complaint</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.md, paddingBottom: 40 }}>
        {/* Category Selection */}
        <Text style={styles.sectionTitle}>Select Category *</Text>
        <View style={styles.categoryGrid}>
          {COMPLAINT_CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, category === cat && styles.categoryChipSelected]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextSelected]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Title */}
        <Text style={styles.label}>Complaint Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Brief title of the issue"
          placeholderTextColor={Colors.textMuted}
          maxLength={100}
          accessibilityLabel="Complaint title"
        />

        {/* Description */}
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the issue in detail — location, severity, duration..."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          maxLength={500}
          accessibilityLabel="Complaint description"
        />
        <Text style={styles.charCount}>{description.length}/500</Text>

        {/* Ward */}
        <Text style={styles.label}>Affected Ward *</Text>
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

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : (
              <>
                <MaterialIcons name="send" size={18} color={Colors.textOnPrimary} />
                <Text style={styles.submitBtnText}>Submit Complaint</Text>
              </>
            )}
        </TouchableOpacity>

        <View style={styles.disclaimer}>
          <MaterialIcons name="info-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.disclaimerText}>
            False complaints may result in account suspension. Please provide accurate information.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  categoryChipSelected: {
    borderColor: Colors.warning,
    backgroundColor: Colors.warningSurface,
  },
  categoryChipText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  categoryChipTextSelected: {
    color: Colors.warning,
    fontWeight: Typography.semiBold,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  charCount: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
  wardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  wardChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
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
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  wardChipTextSelected: {
    color: Colors.primary,
    fontWeight: Typography.semiBold,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  btnDisabled: { opacity: 0.7 },
  submitBtnText: {
    color: Colors.textOnPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
  },
  disclaimer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    flex: 1,
    lineHeight: 18,
  },
  // Success
  successScreen: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  successIconBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.successSurface,
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
  idBox: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  idLabel: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  idValue: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.primary,
    fontFamily: 'monospace',
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
  backBtn: {
    width: '100%',
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backBtnText: {
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
    fontSize: Typography.base,
  },
});
