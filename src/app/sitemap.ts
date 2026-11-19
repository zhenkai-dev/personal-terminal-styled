import type { MetadataRoute } from 'next'
import { SITE_LAST_MODIFIED, SITE_URL } from '@/data/resume'

export const dynamic = 'force-static'

/** Generates deterministic static sitemap.xml with canonical trailing-slash homepage URL. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: SITE_LAST_MODIFIED,
    },
  ]
}
