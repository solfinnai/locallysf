import type { Config } from 'tailwindcss';
import { colors, spacing, radius, shadows, zIndex } from './design-tokens';

export function createTailwindConfig(): Config {
  return {
    theme: {
      extend: {
        colors: {
          primary: colors.primary,
          accent: colors.accent,
          cream: colors.cream,
          background: colors.background,
          'text-dark': colors.textDark,
          'text-muted': colors.textMuted,
          success: colors.success,
          ...colors.gray,
        },
        spacing: {
          section: spacing.section,
          'section-lg': spacing.sectionLg,
        },
        borderRadius: {
          card: radius.card,
          button: radius.button,
        },
        boxShadow: {
          card: shadows.card,
          'card-hover': shadows.cardHover,
        },
        fontFamily: {
          sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
          display: ['var(--font-playfair)', 'serif'],
        },
        animation: {
          shimmer: 'shimmer 1.5s infinite',
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'slide-up': 'slideUp 0.5s ease-out',
        },
        keyframes: {
          shimmer: {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
        },
        aspectRatio: {
          photo: '4/3',
          card: '3/4',
        },
        zIndex: {
          dropdown: zIndex.dropdown,
          sticky: zIndex.sticky,
          modal: zIndex.modal,
          popover: zIndex.popover,
          tooltip: zIndex.tooltip,
          toast: zIndex.toast,
          overlay: zIndex.overlay,
        },
      },
    },
  };
}
