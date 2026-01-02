import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Wong Zhen Kai - Full Stack Developer',
  description: 'Personal terminal-styled website showcasing my skills and experience as a full-stack developer.',
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: 'm-UcC8aSR0OV2U9Hqxdzi0iKFDephELAjzNNIZFi-f8',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics />
    </html>
  )
}