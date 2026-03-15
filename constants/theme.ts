// Kachankawal Rural Municipality — Design Tokens

export const Colors = {
  // Brand
  primary: '#C0392B',
  primaryDark: '#922B21',
  primaryLight: '#E74C3C',
  primarySurface: '#FDEDEC',

  // Surfaces
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F2F3F4',
  border: '#E8EAEC',
  borderLight: '#F2F3F4',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#5D6D7E',
  textMuted: '#99A3A4',
  textOnPrimary: '#FFFFFF',

  // Semantic
  success: '#27AE60',
  successSurface: '#EAFAF1',
  warning: '#F39C12',
  warningSurface: '#FEF9E7',
  error: '#E74C3C',
  errorSurface: '#FDEDEC',
  info: '#2980B9',
  infoSurface: '#EBF5FB',

  // Misc
  shadow: 'rgba(0,0,0,0.08)',
  overlay: 'rgba(0,0,0,0.5)',
};

export const Typography = {
  // Sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 22,
  xxxl: 28,
  display: 34,

  // Weights
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Shadow = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
};
