export const Colors = {
  // Background
  background: '#0D1117',
  surface: '#161B22',
  surfaceVariant: '#1C2128',
  
  // Primary colors
  primary: '#58A6FF',
  primaryDark: '#1F6FEB',
  primaryLight: '#79C0FF',
  
  // Accent colors
  accent: '#F0883E',
  accentLight: '#FB8500',
  
  // Status colors
  success: '#3FB950',
  warning: '#F0883E',
  error: '#F85149',
  
  // Text colors
  text: '#E6EDF3',
  textSecondary: '#8D96A0',
  textTertiary: '#6E7781',
  
  // UI elements
  border: '#30363D',
  divider: '#21262D',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Chart colors
  chartLine: '#58A6FF',
  chartGradientStart: '#58A6FF',
  chartGradientEnd: '#1F6FEB',
} as const;

export type ColorKey = keyof typeof Colors;
