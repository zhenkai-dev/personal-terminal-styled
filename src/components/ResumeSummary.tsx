import { RESUME_DATA } from '@/data/resume'

/** Server-rendered, visible terminal-themed summary of Wong Zhen Kai's resume. */
export default function ResumeSummary() {
  return (
    <section
      aria-labelledby="resume-summary-heading"
      className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 pb-8"
    >
      <div className="bg-terminal-bg border border-terminal-border rounded-lg p-4 sm:p-6 text-terminal-text font-mono min-w-0 space-y-6">
        <header className="border-b border-terminal-border pb-4 min-w-0">
          <h1
            id="resume-summary-heading"
            className="text-2xl sm:text-3xl font-bold text-primary break-words"
          >
            {RESUME_DATA.name}
          </h1>
          <p className="text-base sm:text-lg text-terminal-text mt-1 break-words">
            {RESUME_DATA.jobTitle} • {RESUME_DATA.location}
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 break-words">
            You can also explore this resume using the interactive terminal above (try{' '}
            <code className="text-primary">/help</code>).
          </p>
        </header>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-primary mb-2">About</h2>
          <p className="text-sm leading-relaxed text-terminal-text break-words">
            {RESUME_DATA.about}
          </p>
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-primary mb-3">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
            {RESUME_DATA.skills.map((group) => (
              <div
                key={group.category}
                className="border border-terminal-border rounded p-3 sm:p-4 min-w-0"
              >
                <h3 className="text-sm font-semibold text-terminal-text mb-2 break-words">
                  {group.emoji} {group.category}
                </h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  {group.rows.flat().map((skill) => (
                    <li key={skill} className="break-words">
                      • {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-primary mb-3">Work Experience</h2>
          <div className="space-y-4 min-w-0">
            {RESUME_DATA.experience.map((exp) => (
              <article
                key={`${exp.company}-${exp.period}`}
                className="border border-terminal-border rounded p-3 sm:p-4 min-w-0"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2 min-w-0">
                  <h3 className="text-base font-semibold text-terminal-text break-words">
                    {exp.emoji} {exp.company} — {exp.role}
                  </h3>
                  <span className="text-xs sm:text-sm text-gray-400 break-words">
                    {exp.period}
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet} className="break-words">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-primary mb-3">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
            {RESUME_DATA.education.map((edu) => (
              <article
                key={`${edu.institution}-${edu.degree}`}
                className="border border-terminal-border rounded p-3 sm:p-4 min-w-0"
              >
                <h3 className="text-sm sm:text-base font-semibold text-terminal-text break-words">
                  {edu.emoji} {edu.degree}
                </h3>
                <p className="text-sm text-gray-300 mt-1 break-words">
                  {edu.institution} • {edu.graduated}
                </p>
                <p className="text-xs text-primary mt-1 break-words">
                  {edu.honours} • {edu.deansList}
                </p>
                <ul className="space-y-1 text-sm text-gray-300 mt-2">
                  {edu.details.map((detail) => (
                    <li key={detail} className="break-words">
                      {detail}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-primary mb-3">Links &amp; Resume</h2>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm min-w-0">
            <a
              href={RESUME_DATA.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline break-words"
            >
              GitHub
            </a>
            <a
              href={RESUME_DATA.links.x}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline break-words"
            >
              X ({RESUME_DATA.links.xHandle})
            </a>
            <a
              href={`mailto:${RESUME_DATA.links.email}`}
              className="text-blue-400 hover:text-blue-300 underline break-words"
            >
              {RESUME_DATA.links.email}
            </a>
            <a
              href={RESUME_DATA.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline break-words"
            >
              WhatsApp
            </a>
            <a
              href={RESUME_DATA.downloads.pdf}
              download="wzhenkai_resume.pdf"
              className="text-blue-400 hover:text-blue-300 underline break-words"
            >
              Download Resume (PDF)
            </a>
            <a
              href={RESUME_DATA.downloads.markdown}
              download="wzhenkai_resume.md"
              className="text-blue-400 hover:text-blue-300 underline break-words"
            >
              Download Resume (Markdown)
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
