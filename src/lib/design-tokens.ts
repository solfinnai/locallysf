export const colors = {
  primary: '#0A1628',
  accent: '#E8A838',
  cream: '#FAF7F2',
  background: '#F2F0ED',
  textDark: '#1A1A1A',
  textMuted: '#6B7280',
  success: '#22C55E',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const;

export const spacing = {
  section: '5rem',
  sectionLg: '6.25rem',
  hero: {
    minHeight: '520px',
    height: '65vh',
  },
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const radius = {
  none: '0',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  card: '1rem',
  button: '0.75rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  card: '0 2px 12px rgba(0, 0, 0, 0.06)',
  cardHover: '0 10px 40px rgba(0, 0, 0, 0.12)',
} as const;

export const typography = {
  fontFamily: {
    sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
    display: ['var(--font-playfair)', 'serif'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const transitions = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

export const zIndex = {
  dropdown: '50',
  sticky: '100',
  modal: '200',
  popover: '300',
  tooltip: '400',
  toast: '500',
  overlay: '9999',
} as const;

export const tokens = {
  colors,
  spacing,
  breakpoints,
  radius,
  shadows,
  typography,
  transitions,
  zIndex,
} as const;

export type DesignTokens = typeof tokens;
