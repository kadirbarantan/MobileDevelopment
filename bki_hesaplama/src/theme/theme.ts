// ==================== Theme System ====================

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  card: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  disabled: string;
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
  gradientStart: string;
  gradientEnd: string;
  inputBackground: string;
  shadow: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    hero: number;
  };
  fontWeight: {
    regular: '400';
    medium: '500';
    semibold: '600';
    bold: '700';
    extrabold: '800';
  };
}

export const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#6C63FF',
    primaryLight: '#8B83FF',
    primaryDark: '#4A42CC',
    secondary: '#00D9FF',
    accent: '#FF6584',
    background: '#0A0E21',
    surface: '#1A1F3A',
    surfaceElevated: '#242B4A',
    card: '#1E2444',
    text: '#FFFFFF',
    textSecondary: '#A0A8C8',
    textTertiary: '#6B7294',
    border: '#2A3155',
    success: '#00E676',
    warning: '#FFAB40',
    error: '#FF5252',
    disabled: '#3A4068',
    tabBar: '#0F1328',
    tabBarActive: '#6C63FF',
    tabBarInactive: '#6B7294',
    gradientStart: '#6C63FF',
    gradientEnd: '#00D9FF',
    inputBackground: '#1A1F3A',
    shadow: '#000000',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  borderRadius: { sm: 8, md: 12, lg: 16, xl: 24, full: 999 },
  fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, xxl: 28, hero: 48 },
  fontWeight: { regular: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800' },
};

export const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#6C63FF',
    primaryLight: '#8B83FF',
    primaryDark: '#4A42CC',
    secondary: '#00BCD4',
    accent: '#FF6584',
    background: '#F5F7FF',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    card: '#FFFFFF',
    text: '#1A1F3A',
    textSecondary: '#6B7294',
    textTertiary: '#A0A8C8',
    border: '#E0E4F0',
    success: '#00C853',
    warning: '#FF9800',
    error: '#F44336',
    disabled: '#D0D4E0',
    tabBar: '#FFFFFF',
    tabBarActive: '#6C63FF',
    tabBarInactive: '#A0A8C8',
    gradientStart: '#6C63FF',
    gradientEnd: '#00BCD4',
    inputBackground: '#F0F2FA',
    shadow: '#00000020',
  },
  spacing: darkTheme.spacing,
  borderRadius: darkTheme.borderRadius,
  fontSize: darkTheme.fontSize,
  fontWeight: darkTheme.fontWeight,
};
