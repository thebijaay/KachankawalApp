import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity,
  ScrollView, StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Welcome to\nKachankawal',
    subtitle: 'कचनकवल गाउँपालिका',
    description: 'Your digital gateway to municipality services, notices, and ward information — all in one place.',
    image: require('@/assets/images/hero-onboarding.png'),
    bgColor: Colors.primary,
  },
  {
    id: '2',
    title: 'Digital Services\nat Your Fingertips',
    subtitle: 'Apply, track, and receive',
    description: 'Request birth, death, marriage certificates and more. Track your application status in real time.',
    image: require('@/assets/images/municipality-seal.png'),
    bgColor: Colors.primaryDark,
  },
  {
    id: '3',
    title: 'Report & Get\nThings Fixed',
    subtitle: 'Citizen grievance portal',
    description: 'Submit complaints, report infrastructure issues, and track resolution from your mobile.',
    image: require('@/assets/images/empty-complaints.png'),
    bgColor: '#1A252F',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const params = useLocalSearchParams();

  const getAuthPath = () => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, Array.isArray(value) ? value[0] : value);
      }
    });

    const queryString = searchParams.toString();
    return `/auth${queryString ? `?${queryString}` : ''}`;
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setCurrentIndex(next);
    } else {
      router.replace(getAuthPath());
    }
  };

  const handleSkip = () => router.replace(getAuthPath());

  const handleScroll = (event: any) => {
    const idx = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(idx);
  };

  const slide = SLIDES[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((s) => (
          <View key={s.id} style={[styles.slide, { backgroundColor: s.bgColor, width }]}>
            <View style={styles.imageContainer}>
              <Image
                source={s.image}
                style={styles.slideImage}
                contentFit="contain"
                transition={300}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.slideSubtitle}>{s.subtitle}</Text>
              <Text style={styles.slideTitle}>{s.title}</Text>
              <Text style={styles.slideDescription}>{s.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Controls */}
      <View style={[styles.controls, { backgroundColor: slide.bgColor }]}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          {currentIndex < SLIDES.length - 1 ? (
            <>
              <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
                <Text style={styles.nextText}>Next</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={handleNext} style={styles.getStartedBtn}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  slide: {
    flex: 1,
    height,
    paddingTop: 60,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  slideImage: {
    width: width * 0.75,
    height: width * 0.75,
  },
  textContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 140,
  },
  slideSubtitle: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: Typography.medium,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  slideTitle: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textOnPrimary,
    lineHeight: 40,
    marginBottom: 16,
  },
  slideDescription: {
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 26,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
    paddingTop: 20,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: Radius.full,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.textOnPrimary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipBtn: {
    padding: 14,
  },
  skipText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  nextBtn: {
    backgroundColor: Colors.textOnPrimary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: Radius.full,
  },
  nextText: {
    color: Colors.primary,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
  },
  getStartedBtn: {
    flex: 1,
    backgroundColor: Colors.textOnPrimary,
    paddingVertical: 16,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  getStartedText: {
    color: Colors.primary,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
});
