import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/data/resume'

export const dynamic = 'force-static'

/** Generates static robots.txt allowing crawlers and linking sitemap.xml. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
