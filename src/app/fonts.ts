import { Sarabun } from 'next/font/google'
import localFont from 'next/font/local'

export const THSarabunFont = Sarabun({
  weight: ['400', '700'],
  style: 'normal',
  subsets: ['thai'],
  variable: '--font-th-sarabun',
})

export const SCGFont = localFont({
  src: [
    {
      path: '../../public/fonts/SCG/SCG-Reg.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SCG/SCG-Bol.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SCG/SCG-Lig.otf',
      weight: '300',
      style: 'light',
    },
    {
      path: '../../public/fonts/SCG/SCG-Italic.otf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-scg',
})

export const MindFont = localFont({
  src: [
    {
      path: '../../public/fonts/MindSansVF.ttf',
    },
  ],
  variable: '--font-mind-sans',
})
