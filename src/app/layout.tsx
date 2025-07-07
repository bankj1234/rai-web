'use client'

import React from 'react'
// import type { Metadata } from 'next'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Toaster } from '@/components/ui/toaster'
import AntdConfigProvider from '@/providers/AntdConfigProvider'
import NextAuthProvider from '@/providers/NextAuthProvider'
import '../styles/globals.css'
import { MindFont, SCGFont, THSarabunFont } from './fonts'

// export const metadata: Metadata = {
//   title: 'NextJS Ant Design Template',
//   icons: { icon: [{ media: '(prefers-color-scheme: light)', url: '/images/logo.svg' }] },
// }

type Props = Readonly<{ children: React.ReactNode }>

const RootLayout = ({ children }: Props) => {
  return (
    <html
      lang="en"
      className={`${MindFont.variable} ${SCGFont.variable} ${THSarabunFont.variable} scroll-smooth`}
    >
      <body className="antialiased">
        <NextAuthProvider>
          <AntdRegistry>
            <AntdConfigProvider>{children}</AntdConfigProvider>
          </AntdRegistry>
        </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  )
}

export default RootLayout
