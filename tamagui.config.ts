import { createAnimations } from '@tamagui/animations-react-native';
import { createFont, createTamagui } from 'tamagui';

const animations = createAnimations({
  fast: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    type: 'spring',
    damping: 15,
    mass: 1,
    stiffness: 150,
  },
  slow: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
});

// Heading font — SemiBold/Bold for titles, like Alan
const headingFont = createFont({
  family: 'InterBold',
  size: {
    1: 12,
    2: 14,
    3: 15,
    4: 16,
    5: 18,
    6: 20,
    7: 24,
    8: 28,
    9: 32,
    10: 36,
    11: 40,
    12: 48,
    true: 16,
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 21,
    4: 22,
    5: 24,
    6: 28,
    7: 32,
    8: 36,
    9: 40,
    10: 44,
    11: 48,
    12: 56,
    true: 22,
  },
  weight: {
    1: '300', // Light
    2: '400', // Regular
    3: '500', // Medium
    4: '600', // SemiBold (default for headings)
    5: '700', // Bold
    6: '800', // ExtraBold
    true: '700',
  },
  letterSpacing: {
    1: 0,
    2: 0,
    3: 0,
    4: -0.2,
    5: -0.3,
    6: -0.3,
    7: -0.4,
    8: -0.5,
    9: -0.6,
    10: -0.7,
    11: -0.8,
    12: -1,
    true: -0.3,
  },
  face: {
    300: { normal: 'InterLight' },
    400: { normal: 'Inter' },
    500: { normal: 'InterMedium' },
    600: { normal: 'InterSemiBold' },
    700: { normal: 'InterBold' },
    800: { normal: 'InterExtraBold' },
  },
});

// Body font — Regular/Medium for content
const bodyFont = createFont({
  family: 'Inter',
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 15,
    6: 16,
    7: 18,
    8: 20,
    9: 22,
    10: 24,
    true: 14,
  },
  lineHeight: {
    1: 16,
    2: 18,
    3: 19,
    4: 20,
    5: 22,
    6: 24,
    7: 26,
    8: 28,
    9: 30,
    10: 32,
    true: 20,
  },
  weight: {
    1: '300', // Light
    2: '400', // Regular (default for body)
    3: '500', // Medium
    4: '600', // SemiBold
    5: '700', // Bold
    true: '400',
  },
  letterSpacing: {
    1: 0.2,
    2: 0.1,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: -0.1,
    8: -0.2,
    9: -0.2,
    10: -0.3,
    true: 0,
  },
  face: {
    300: { normal: 'InterLight' },
    400: { normal: 'Inter' },
    500: { normal: 'InterMedium' },
    600: { normal: 'InterSemiBold' },
    700: { normal: 'InterBold' },
    800: { normal: 'InterExtraBold' },
  },
});

const config = createTamagui({
  animations,
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,

  fonts: {
    heading: headingFont,
    body: bodyFont,
  },

  tokens: {
    size: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
      11: 48,
      12: 56,
      13: 64,
      14: 80,
      true: 16,
    },
    space: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
      11: 48,
      12: 56,
      true: 16,
    },
    radius: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 40,
      10: 999,
      true: 12,
    },
    zIndex: {
      0: 0,
      1: 100,
      2: 200,
      3: 300,
      4: 400,
      5: 500,
    },
    color: {
      // Immeo Primary - Teal
      primary50: '#E6F5F2',
      primary100: '#C2E8E1',
      primary200: '#99D9CE',
      primary300: '#6ECABB',
      primary400: '#4DBDAB',
      primary500: '#0A7968',
      primary600: '#096B5C',
      primary700: '#085D50',
      primary800: '#064F44',
      primary900: '#043D35',
      // Immeo Secondary - Blue-gray
      secondary50: '#EEF3F7',
      secondary100: '#D5E0EA',
      secondary200: '#B9CCDC',
      secondary300: '#9DB8CE',
      secondary400: '#84A4C0',
      secondary500: '#6A8EAE',
      secondary600: '#587A9A',
      secondary700: '#466586',
      secondary800: '#355172',
      secondary900: '#233D5E',
      // Neutrals
      gray50: '#F8F9FA',
      gray100: '#F1F3F5',
      gray200: '#E9ECEF',
      gray300: '#DEE2E6',
      gray400: '#CED4DA',
      gray500: '#ADB5BD',
      gray600: '#868E96',
      gray700: '#495057',
      gray800: '#343A40',
      gray900: '#212529',
      // Status
      success: '#22C55E',
      successBg: '#DCFCE7',
      warning: '#F97316',
      warningBg: '#FFEDD5',
      danger: '#EF4444',
      dangerBg: '#FEE2E2',
      info: '#3B82F6',
      infoBg: '#DBEAFE',
      // Base
      white: '#FFFFFF',
      black: '#111111',
    },
  },

  themes: {
    light: {
      background: '#FFFFFF',
      backgroundHover: '#F5F6F8',
      backgroundPress: '#F0F2F1',
      backgroundFocus: '#F5F6F8',
      color: '#0B0F0E',
      colorHover: '#0B0F0E',
      colorPress: '#3C4440',
      colorFocus: '#0B0F0E',
      borderColor: '#F0F2F1',
      borderColorHover: '#E8EAEC',
      borderColorFocus: '#C4CBC8',
      borderColorPress: '#C4CBC8',
      placeholderColor: '#C4CBC8',
      // Immeo teal scale
      teal1: '#E6F5F2',
      teal2: '#C2E8E1',
      teal3: '#99D9CE',
      teal4: '#6ECABB',
      teal5: '#4DBDAB',
      teal6: '#0A7968',
      teal7: '#096B5C',
      teal8: '#085D50',
      teal9: '#064F44',
      teal10: '#043D35',
      // Secondary scale
      secondary1: '#EEF3F7',
      secondary2: '#D5E0EA',
      secondary3: '#B9CCDC',
      secondary4: '#9DB8CE',
      secondary5: '#6A8EAE',
    },
    dark: {
      background: '#0F172A',
      backgroundHover: '#1E293B',
      backgroundPress: '#334155',
      backgroundFocus: '#1E293B',
      color: '#F1F5F9',
      colorHover: '#FFFFFF',
      colorPress: '#E2E8F0',
      colorFocus: '#F1F5F9',
      borderColor: '#2D3748',
      borderColorHover: '#4A5568',
      borderColorFocus: '#4A5568',
      borderColorPress: '#4A5568',
      placeholderColor: '#64748B',
      // Immeo teal scale (inverted)
      teal1: '#043D35',
      teal2: '#064F44',
      teal3: '#085D50',
      teal4: '#096B5C',
      teal5: '#0A7968',
      teal6: '#4DBDAB',
      teal7: '#6ECABB',
      teal8: '#99D9CE',
      teal9: '#C2E8E1',
      teal10: '#E6F5F2',
      // Secondary scale (inverted)
      secondary1: '#233D5E',
      secondary2: '#355172',
      secondary3: '#466586',
      secondary4: '#587A9A',
      secondary5: '#6A8EAE',
    },
  },
});

export default config;

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
