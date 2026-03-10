import { Platform } from 'react-native';

const tintColorLight = '#4A90D9';
const tintColorDark = '#7AB8F5';

export const Colors = {
  light: {
    text: '#2C3E50',
    secondaryText: '#7F8C8D',
    background: '#F8F9FA',
    cardBackground: '#FFFFFF',
    tint: tintColorLight,
    icon: '#7F8C8D',
    tabIconDefault: '#95A5A6',
    tabIconSelected: tintColorLight,
    border: '#E8ECF0',
    accent: '#4A90D9',
  },
  dark: {
    text: '#ECF0F1',
    secondaryText: '#95A5A6',
    background: '#1A1A2E',
    cardBackground: '#16213E',
    tint: tintColorDark,
    icon: '#95A5A6',
    tabIconDefault: '#95A5A6',
    tabIconSelected: tintColorDark,
    border: '#2C3E6B',
    accent: '#7AB8F5',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
