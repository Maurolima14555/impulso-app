/**
 * IMPULSO Design System
 * Inspired by Opal, Headspace, Linear, Arc Browser
 * Dark-first design with selective color accents
 */

// ===== COLORS =====
export const colors = {
  // Base surfaces (dark-first, 4 elevation levels)
  bg: {
    base: '#0a0a0a',        // App background
    elevated: '#141414',     // Cards
    elevatedHigh: '#1c1c1c', // Modals, raised cards
    overlay: '#242424',      // Hover, pressed states
  },

  // Borders
  border: {
    subtle: '#1f1f1f',
    default: '#2a2a2a',
    strong: '#3a3a3a',
  },

  // Text
  text: {
    primary: '#ffffff',
    secondary: '#a1a1aa',
    tertiary: '#71717a',
    disabled: '#52525b',
    inverse: '#0a0a0a',
  },

  // Brand accents
  brand: {
    primary: '#22c55e',      // Green - success, completed, primary CTA
    primaryDim: '#16a34a',
    primaryGlow: '#052e16',  // Background tint for green elements
  },

  // Semantic colors with significance
  focus: {
    high: '#22c55e',    // Score 80-100
    medium: '#f59e0b',  // Score 50-79
    low: '#ef4444',     // Score 0-49
  },

  // Pro / Premium
  pro: {
    primary: '#a855f7',
    glow: '#2e1065',
  },

  // Category colors (for activity cards - subtle gradients)
  category: {
    reading: {
      primary: '#3b82f6',     // Blue
      glow: '#0c1e3d',
      gradient: ['#1e3a8a', '#3b82f6'] as const,
    },
    meditation: {
      primary: '#a855f7',     // Purple
      glow: '#2e1065',
      gradient: ['#581c87', '#a855f7'] as const,
    },
    exercise: {
      primary: '#f97316',     // Orange
      glow: '#3a1208',
      gradient: ['#9a3412', '#f97316'] as const,
    },
    journaling: {
      primary: '#10b981',     // Emerald
      glow: '#022c1f',
      gradient: ['#065f46', '#10b981'] as const,
    },
    learning: {
      primary: '#ec4899',     // Pink
      glow: '#3a0820',
      gradient: ['#831843', '#ec4899'] as const,
    },
    other: {
      primary: '#6b7280',
      glow: '#1f2937',
      gradient: ['#374151', '#6b7280'] as const,
    },
  },

  // System
  danger: '#ef4444',
  warning: '#f59e0b',
  success: '#22c55e',
  info: '#3b82f6',
} as const;

// ===== TYPOGRAPHY =====
// Hierarchy of 5 weights (inspired by Opal's SF Pro system)
export const typography = {
  // Font weights
  weight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
    black: '900' as const,
  },

  // Font sizes with semantic names
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 32,
    hero: 48,
    display: 64,
    giant: 96,  // For Focus Score
  },

  // Line heights
  lineHeight: {
    tight: 1.1,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 4,
  },
} as const;

// ===== SPACING =====
// 4px base grid (8px scale)
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

// ===== RADIUS =====
export const radius = {
  none: 0,
  sm: 6,
  md: 10,
  base: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  full: 9999,
} as const;

// ===== SHADOWS (using border + glow on dark) =====
export const elevation = {
  glow: (color: string, opacity: number = 0.3) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: opacity,
    shadowRadius: 20,
    elevation: 8,
  }),
} as const;

// ===== HELPER: Get category color =====
export function getCategoryColor(category: string) {
  const cat = category as keyof typeof colors.category;
  return colors.category[cat] || colors.category.other;
}

// ===== HELPER: Calculate focus score color =====
export function getFocusScoreColor(score: number): string {
  if (score >= 80) return colors.focus.high;
  if (score >= 50) return colors.focus.medium;
  return colors.focus.low;
}
