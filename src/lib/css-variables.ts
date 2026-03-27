import { colors, spacing, radius, shadows, transitions, breakpoints } from './design-tokens';

export const cssVariables = {
  '--color-primary': colors.primary,
  '--color-accent': colors.accent,
  '--color-cream': colors.cream,
  '--color-background': colors.background,
  '--color-text-dark': colors.textDark,
  '--color-text-muted': colors.textMuted,
  '--color-success': colors.success,
  '--color-white': colors.white,

  '--spacing-section': spacing.section,
  '--spacing-section-lg': spacing.sectionLg,

  '--radius-card': radius.card,
  '--radius-button': radius.button,

  '--shadow-card': shadows.card,
  '--shadow-card-hover': shadows.cardHover,

  '--transition-fast': transitions.fast,
  '--transition-normal': transitions.normal,
  '--transition-slow': transitions.slow,
  '--transition-slower': transitions.slower,

  '--breakpoint-sm': breakpoints.sm,
  '--breakpoint-md': breakpoints.md,
  '--breakpoint-lg': breakpoints.lg,
  '--breakpoint-xl': breakpoints.xl,
} as const;

export type CssVariables = typeof cssVariables;

export function getCssVariable(name: keyof CssVariables): string {
  return cssVariables[name];
}

export function createInlineStyles(overrides?: Partial<CssVariables>): React.CSSProperties {
  return {
    ...cssVariables,
    ...overrides,
  } as React.CSSProperties;
}
