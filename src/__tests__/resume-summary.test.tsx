import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import Home from '@/app/page'
import ResumeSummary from '@/components/ResumeSummary'
import { RESUME_DATA } from '@/data/resume'

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
}

describe('ResumeSummary', () => {
  it('renders ResumeSummary as visible static HTML containing name in a single h1, role, about, skills, all 5 employers, education, and links', () => {
    const html = renderToStaticMarkup(createElement(ResumeSummary))
    const text = decodeHtmlEntities(html.replace(/<[^>]+>/g, ' '))

    expect(html).toContain('<section aria-labelledby="resume-summary-heading"')

    const h1Matches = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) ?? []
    expect(h1Matches).toHaveLength(1)
    const h1 = h1Matches[0] ?? ''
    expect(h1).toContain('id="resume-summary-heading"')
    expect(decodeHtmlEntities(h1.replace(/<[^>]+>/g, '')).trim()).toBe(RESUME_DATA.name)

    expect(text).toContain(RESUME_DATA.jobTitle)
    expect(text).toContain(RESUME_DATA.location)
    expect(text).toContain('/help')
    expect(text).toContain(RESUME_DATA.about)

    // All 5 skill groups and items
    for (const group of RESUME_DATA.skills) {
      expect(text).toContain(group.category)
      for (const row of group.rows) {
        for (const item of row) {
          expect(text).toContain(item)
        }
      }
    }

    // All 5 employers, roles, periods, and bullets
    for (const exp of RESUME_DATA.experience) {
      expect(text).toContain(exp.company)
      expect(text).toContain(exp.role)
      expect(text).toContain(exp.period)
      for (const bullet of exp.bullets) {
        expect(text).toContain(bullet)
      }
    }

    // Both education entries
    for (const edu of RESUME_DATA.education) {
      expect(text).toContain(edu.institution)
      expect(text).toContain(edu.degree)
      expect(text).toContain(edu.graduated)
      expect(text).toContain(edu.honours)
      expect(text).toContain(edu.deansList)
      for (const detail of edu.details) {
        expect(text).toContain(detail)
      }
    }

    // Heading hierarchy uses h2 and h3 with no skipped heading levels
    expect(html).toContain('<h2')
    expect(html).toContain('<h3')
    expect(html).not.toContain('<h4')
  })

  it('includes GitHub, X, email, and PDF/Markdown resume download links matching site data', () => {
    const html = renderToStaticMarkup(createElement(ResumeSummary))

    expect(html).toContain(`href="${RESUME_DATA.links.github}"`)
    expect(html).toContain(`href="${RESUME_DATA.links.x}"`)
    expect(html).toContain(`href="mailto:${RESUME_DATA.links.email}"`)
    expect(html).toContain(`href="${RESUME_DATA.links.whatsapp}"`)
    expect(html).toContain(`href="${RESUME_DATA.downloads.pdf}"`)
    expect(html).toContain(`href="${RESUME_DATA.downloads.markdown}"`)

    // Ensure download links do not have a trailing slash or double slash
    expect(html).not.toContain(`${RESUME_DATA.downloads.pdf}/`)
    expect(html).not.toContain(`${RESUME_DATA.downloads.markdown}/`)
  })

  it('does not use sr-only, hidden, display:none, visibility:hidden, opacity-0, or noscript cloaking', () => {
    const html = renderToStaticMarkup(createElement(ResumeSummary))

    const forbiddenPatterns = [
      /\bsr-only\b/i,
      /\bhidden\b/i,
      /\binvisible\b/i,
      /\bopacity-0\b/i,
      /display\s*:\s*none/i,
      /visibility\s*:\s*hidden/i,
      /aria-hidden\s*=\s*"true"/i,
      /-left-/i,
      /-top-/i,
      /<noscript\b/i,
    ]

    for (const pattern of forbiddenPatterns) {
      expect(html).not.toMatch(pattern)
    }
  })

  it('renders Home with Terminal above ResumeSummary, a single footer, and exactly one h1', () => {
    const html = renderToStaticMarkup(createElement(Home))

    const h1Matches = html.match(/<h1\b[^>]*>/gi) ?? []
    expect(h1Matches).toHaveLength(1)

    const terminalIndex = html.indexOf('domain: personal-terminal-styled.vercel.app')
    const summaryIndex = html.indexOf('id="resume-summary-heading"')
    const footerIndex = html.indexOf('<footer')
    expect(terminalIndex).toBeGreaterThan(-1)
    expect(summaryIndex).toBeGreaterThan(terminalIndex)
    expect(footerIndex).toBeGreaterThan(summaryIndex)

    // Footer appears only once (moved out of Terminal into page.tsx)
    expect(html.match(/Built with ❤️ by Wong Zhen Kai/g)).toHaveLength(1)
    // Only <main> carries min-h-screen (removed from Terminal outer wrapper)
    expect(html.match(/min-h-screen/g)).toHaveLength(1)
  })
})
