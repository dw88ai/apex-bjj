import { MD3DarkTheme } from 'react-native-paper';
import { Colors } from './colors';

export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.primary,
    primaryContainer: Colors.primaryDark,
    secondary: Colors.accent,
    secondaryContainer: Colors.accentLight,
    background: Colors.background,
    surface: Colors.surface,
    surfaceVariant: Colors.surfaceVariant,
    error: Colors.error,
    onPrimary: Colors.text,
    onSecondary: Colors.text,
    onBackground: Colors.text,
    onSurface: Colors.text,
    outline: Colors.border,
  },
  fonts: {
    regular: {
      fontFamily: 'DMSans_400Regular',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'DMSans_500Medium',
      fontWeight: '500' as const,
    },
    bold: {
      fontFamily: 'DMSans_700Bold',
      fontWeight: '700' as const,
    },
    // Label variants
    labelSmall: {
      fontFamily: 'DMSans_500Medium',
      fontWeight: '500' as const,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    labelMedium: {
      fontFamily: 'DMSans_500Medium',
      fontWeight: '500' as const,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    labelLarge: {
      fontFamily: 'DMSans_500Medium',
      fontWeight: '500' as const,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    // Body variants
    bodySmall: {
      fontFamily: 'DMSans_400Regular',
      fontWeight: '400' as const,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.4,
    },
    bodyMedium: {
      fontFamily: 'DMSans_400Regular',
      fontWeight: '400' as const,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    bodyLarge: {
      fontFamily: 'DMSans_400Regular',
      fontWeight: '400' as const,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
    // Title variants
    titleSmall: {
      fontFamily: 'DMSans_500Medium',
      fontWeight: '500' as const,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    titleMedium: {
      fontFamily: 'DMSans_500Medium',
      fontWeight: '500' as const,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    titleLarge: {
      fontFamily: 'DMSans_500Medium',
      fontWeight: '500' as const,
      fontSize: 22,
      lineHeight: 28,
    },
    // Headline variants
    headlineSmall: {
      fontFamily: 'DMSans_700Bold',
      fontWeight: '700' as const,
      fontSize: 24,
      lineHeight: 32,
    },
    headlineMedium: {
      fontFamily: 'DMSans_700Bold',
      fontWeight: '700' as const,
      fontSize: 28,
      lineHeight: 36,
    },
    headlineLarge: {
      fontFamily: 'DMSans_700Bold',
      fontWeight: '700' as const,
      fontSize: 32,
      lineHeight: 40,
    },
    // Display variants
    displaySmall: {
      fontFamily: 'DMSans_700Bold',
      fontWeight: '700' as const,
      fontSize: 36,
      lineHeight: 44,
    },
    displayMedium: {
      fontFamily: 'DMSans_700Bold',
      fontWeight: '700' as const,
      fontSize: 45,
      lineHeight: 52,
    },
    displayLarge: {
      fontFamily: 'DMSans_700Bold',
      fontWeight: '700' as const,
      fontSize: 57,
      lineHeight: 64,
    },
  },
  roundness: 12,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  fontFamily: {
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
    bold: 'DMSans_700Bold',
    heading: 'DMSans_700Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },
} as const;

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 8,
  },
} as const;
