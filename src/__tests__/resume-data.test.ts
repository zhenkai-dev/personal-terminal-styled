import { describe, expect, it } from 'vitest'
import {
  GOOGLE_SITE_VERIFICATION,
  RESUME_DATA,
  SITE_DESCRIPTION,
  SITE_LAST_MODIFIED,
  SITE_TITLE,
  SITE_URL,
  buildPersonJsonLd,
} from '@/data/resume'

describe('resume data module', () => {
  it('exposes core resume facts derived from existing site data (name, role, 5 employers, 5 skill groups, profile links, download paths)', () => {
    expect(SITE_URL).toBe('https://personal-terminal-styled.vercel.app')
    expect(SITE_TITLE).toBe('Wong Zhen Kai - Full Stack Developer')
    expect(SITE_DESCRIPTION).toBe(
      'Personal terminal-styled website showcasing my skills and experience as a full-stack developer.'
    )
    expect(GOOGLE_SITE_VERIFICATION).toBe('m-UcC8aSR0OV2U9Hqxdzi0iKFDephELAjzNNIZFi-f8')

    expect(RESUME_DATA.name).toBe('Wong Zhen Kai')
    expect(RESUME_DATA.jobTitle).toBe('Full Stack Developer')
    expect(RESUME_DATA.location).toBe('Petaling Jaya, Selangor, Malaysia')
    expect(RESUME_DATA.about).toContain('Full-stack developer with 5+ years experience')

    expect(RESUME_DATA.experience).toHaveLength(5)
    expect(RESUME_DATA.experience.map((e) => e.company)).toEqual([
      'MetaKore',
      'UP DevLabs',
      'Flow Digital',
      '123RF',
      'J Star Berhad',
    ])

    expect(RESUME_DATA.skills).toHaveLength(5)
    expect(RESUME_DATA.education).toHaveLength(2)
    expect(RESUME_DATA.education.map((e) => e.institution)).toEqual([
      'Multimedia University, Melaka',
      'Multimedia University, Melaka',
    ])

    expect(RESUME_DATA.links).toEqual({
      github: 'https://github.com/zhenkai-dev',
      x: 'https://x.com/0x_wzhenkai',
      xHandle: '@0x_wzhenkai',
      email: 'zk.wong96@gmail.com',
      whatsapp: 'https://wa.me/60166206903',
    })

    expect(RESUME_DATA.downloads).toEqual({
      pdf: '/downloads/wzhenkai_resume.pdf',
      markdown: '/downloads/wzhenkai_resume.md',
    })
  })

  it('builds valid Schema.org Person JSON-LD with exact sameAs profile links and no invented profiles', () => {
    const jsonLd = buildPersonJsonLd()

    expect(jsonLd).toEqual({
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
    expect(jsonLd.sameAs).toHaveLength(2)
    expect(JSON.stringify(jsonLd).toLowerCase()).not.toContain('linkedin')
  })

  it('uses a fixed ISO date constant for SITE_LAST_MODIFIED', () => {
    expect(SITE_LAST_MODIFIED).toBe('2025-08-16')
    expect(SITE_LAST_MODIFIED).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
