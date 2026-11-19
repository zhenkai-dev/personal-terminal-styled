import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next';
import {
  GOOGLE_SITE_VERIFICATION,
  RESUME_DATA,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  buildPersonJsonLd,
} from '@/data/resume'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/`,
    siteName: RESUME_DATA.name,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: RESUME_DATA.links.xHandle,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const personJsonLd = JSON.stringify(buildPersonJsonLd()).replace(/</g, '\\u003c')

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: personJsonLd }}
        />
        {children}
      </body>
      <Analytics />
    </html>
  )
}