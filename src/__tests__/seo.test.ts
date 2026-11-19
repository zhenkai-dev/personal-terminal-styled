import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@vercel/analytics/next', () => ({
  Analytics: () => null,
}))

import RootLayout, { metadata, viewport } from '@/app/layout'
import robots, { dynamic as robotsDynamic } from '@/app/robots'
import sitemap, { dynamic as sitemapDynamic } from '@/app/sitemap'
import {
  GOOGLE_SITE_VERIFICATION,
  RESUME_DATA,
  SITE_DESCRIPTION,
  SITE_LAST_MODIFIED,
  SITE_TITLE,
  SITE_URL,
} from '@/data/resume'

describe('SEO metadata, viewport, JSON-LD, robots, and sitemap', () => {
  it('robots allows all user agents on root and references absolute sitemap URL', () => {
    expect(robotsDynamic).toBe('force-static')

    const result = robots()
    expect(result).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: `${SITE_URL}/sitemap.xml`,
    })
    expect(typeof result.sitemap).toBe('string')
    expect(result.sitemap).toBe('https://personal-terminal-styled.vercel.app/sitemap.xml')
    if (typeof result.sitemap === 'string') {
      expect(result.sitemap).not.toMatch(/\.xml\/$/)
      expect(result.sitemap.replace('https://', '')).not.toContain('//')
    }
  })

  it('sitemap lists canonical root URL with trailing slash and fixed lastModified constant identical across repeated calls', () => {
    expect(sitemapDynamic).toBe('force-static')

    const first = sitemap()
    const second = sitemap()

    expect(first).toEqual([
      {
        url: `${SITE_URL}/`,
        lastModified: SITE_LAST_MODIFIED,
      },
    ])
    expect(first[0].url).toBe('https://personal-terminal-styled.vercel.app/')
    expect(first[0].lastModified).toBe('2025-08-16')
    expect(second).toEqual(first)
  })

  it('layout metadata configures metadataBase, canonical, openGraph, twitter, title, and preserves google verification', () => {
    expect(metadata.title).toBe(SITE_TITLE)
    expect(metadata.description).toBe(SITE_DESCRIPTION)
    expect(metadata.icons).toEqual({ icon: '/favicon.ico' })
    expect(metadata.verification).toEqual({
      google: GOOGLE_SITE_VERIFICATION,
    })

    expect(metadata.metadataBase).toBeInstanceOf(URL)
    expect(metadata.metadataBase?.href).toBe(`${SITE_URL}/`)
    expect(metadata.alternates).toEqual({
      canonical: '/',
    })

    expect(metadata.openGraph).toEqual({
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: `${SITE_URL}/`,
      siteName: RESUME_DATA.name,
      type: 'website',
      locale: 'en_US',
    })
    expect(metadata.openGraph).not.toHaveProperty('images')

    expect(metadata.twitter).toEqual({
      card: 'summary',
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      creator: RESUME_DATA.links.xHandle,
    })
    expect(metadata.twitter).not.toHaveProperty('images')
  })

  it('layout viewport sets device-width and initialScale 1 without maximumScale or userScalable', () => {
    expect(viewport).toEqual({
      width: 'device-width',
      initialScale: 1,
    })
    expect(viewport).not.toHaveProperty('maximumScale')
    expect(viewport).not.toHaveProperty('userScalable')
  })

  it('layout renders parseable Person JSON-LD script tag with exact sameAs list', () => {
    const html = renderToStaticMarkup(
      createElement(
        RootLayout,
        null,
        createElement('div', { id: 'test-child' }, 'Hello')
      )
    )

    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
    expect(match).not.toBeNull()

    const parsed = JSON.parse(match![1])
    expect(parsed).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Wong Zhen Kai',
      jobTitle: 'Full Stack Developer',
      url: 'https://personal-terminal-styled.vercel.app/',
      sameAs: [
        'https://github.com/zhenkai-dev',
        'https://x.com/0x_wzhenkai',
      ],
    })
    expect(parsed.sameAs).toHaveLength(2)
    expect(JSON.stringify(parsed).toLowerCase()).not.toContain('linkedin')

    // Ensure JSON-LD is inside <body> before children
    const bodyStart = html.indexOf('<body>')
    const scriptStart = html.indexOf('<script type="application/ld+json">')
    const childStart = html.indexOf('<div id="test-child">')
    expect(bodyStart).toBeGreaterThan(-1)
    expect(scriptStart).toBeGreaterThan(bodyStart)
    expect(childStart).toBeGreaterThan(scriptStart)
  })
})
