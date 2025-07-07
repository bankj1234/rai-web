import type { Config } from 'tailwindcss'

export const extendedColors = {
  primary: '#181826',
  secondary: '#1E94FF',
  error: '#F42A23',
  success: '#00B058',
  warning: '#FB8C00',

  neutral: {
    950: '#181826',
    900: '#393D40',
    800: '#414649',
    700: '#4A5154',
    600: '#565F64',
    500: '#657175',
    400: '#808C90',
    300: '#AAB3B6',
    200: '#CDD2D4',
    100: '#E5E8E8',
    50: '#F5F6F6',
    DEFAULT: '#F5F5F5',
  },

  orange: {
    DEFAULT: '#FF9600',
    50: '#FFF3E0',
    100: '#FFF5ED',
    200: '#FFE9D4',
    300: '#FFCEA8',
    400: '#FFAC71',
    500: '#FF7327',
    700: '#F57A01',
    900: '#E64F01',
  },
  green: {
    DEFAULT: '#00B058',
    50: '#E4F5EA',
    100: '#BEE7CC',
    300: '#61C88A',
    700: '#008F42',
    900: '#005E23',
  },
  red: {
    DEFAULT: '#F42A23',
    50: '#FFE9ED',
    100: '#FEF3F2',
    200: '#FFE2E1',
    300: '#FFA6A2',
    400: '#FD736C',
    500: '#E0251C',
    700: '#D4091F',
    900: '#B70009',
  },
  grey: {
    DEFAULT: '#9E9E9E',
    50: '#FAFAFA',
    100: '#F5F5F5',
    300: '#E0E0E0',
    400: '#BDBDBD',
    700: '#616161',
    900: '#212121',
  },
  navy: {
    DEFAULT: '#37474F',
    50: '#ECEFF1',
    100: '#99A1C2',
    200: '#6672A3',
    300: '#334385',
    400: '#001466',
    500: '#020F35',
    600: '#546E7A',
    900: '#393D40',
  },
  blue: {
    DEFAULT: '#008FFF',
    50: '#E2F1FF',
    100: '#EDF8FF',
    200: '#D6EEFF',
    300: '#83D2FF',
    400: '#1E94FF',
    500: '#0361FF',
    700: '#1370DD',
    900: '#153FAB',
  },
  blueGrey: {
    DEFAULT: '#37474F',
    50: '#ECEFF1',
    200: '#B0BEC5',
    400: '#78909C',
    600: '#546E7A',
    900: '#263238',
  },
  yellow: {
    DEFAULT: '#FFA10A',
    50: '#FFF8E1',
  },

  darkBlue: {
    500: '#00239C',
    400: '#0849C5',
    300: '#396DD1',
    200: '#6B92DC',
    100: '#CEDBF3',
  },

  lime: {
    500: '#C2D500',
    400: '#CEDD33',
    300: '#DAE666',
    200: '#E7EE99',
    100: '#F3F7CC',
  },

  pink: {
    500: '#F82772',
    400: '#FFA2BE',
    300: '#FFCCDC',
    200: '#FFE3EA',
    100: '#FFF1F5',
  },
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      scg: ['var(--font-scg)'],
      sarabun: ['var(--font-th-sarabun)'],
      mindSans: ['var(--font-mind-sans)'],
    },
    extend: {
      colors: extendedColors,
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'custom-gradient-dark':
          'radial-gradient(circle at 70% 40%, #005bb5 0%, #001f4d 60%, #00081a 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
