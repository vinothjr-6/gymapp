// ─────────────────────────────────────────────────────────────────────────────
// src/constants/theme.js
// Design tokens – mirrors SLAM Lifestyle & Fitness Studio brand palette
// ─────────────────────────────────────────────────────────────────────────────

export const COLORS = {
  // Primary Brand
  primary: '#D31027',       // Vivid crimson red – header, icons, accents
  primaryDark: '#A00D1C',   // Deeper red – pressed states, gradients
  primaryLight: '#FF3A50',  // Bright red – glows, highlights

  // Backgrounds
  bgDark: '#0A0A0A',        // Near-black – main app background
  bgCard: '#1A1A1A',        // Dark card surface
  bgCardGlass: 'rgba(20,20,20,0.78)', // Glass tile overlay on dashboard
  bgDrawer: '#111111',      // Side drawer background
  bgHeader: '#D31027',      // Header bar background

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textMuted: '#888888',
  textOnPrimary: '#FFFFFF', // Text placed on primary-red background

  // Borders / Dividers
  border: '#D31027',        // Red tile border on dashboard cards
  borderSubtle: '#2A2A2A',  // Subtle dark border

  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',

  // Roles
  adminBadge: '#D31027',
  userBadge: '#374151',
};

export const FONTS = {
  // Family
  regular: 'System',
  bold: 'System',

  // Sizes
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 36,

  // Weights (React Native string values)
  weightLight: '300',
  weightNormal: '400',
  weightMedium: '500',
  weightSemiBold: '600',
  weightBold: '700',
  weightExtraBold: '800',
  weightBlack: '900',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const SHADOWS = {
  card: {
    shadowColor: '#D31027',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: {
    shadowColor: '#D31027',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
};
