export const SITE_URL = 'https://personal-terminal-styled.vercel.app'
export const SITE_TITLE = 'Wong Zhen Kai - Full Stack Developer'
export const SITE_DESCRIPTION =
  'Personal terminal-styled website showcasing my skills and experience as a full-stack developer.'
export const SITE_LAST_MODIFIED = '2025-08-16'
export const GOOGLE_SITE_VERIFICATION =
  'm-UcC8aSR0OV2U9Hqxdzi0iKFDephELAjzNNIZFi-f8'

export interface SkillGroup {
  emoji: string
  category: string
  rows: readonly (readonly string[])[]
}

export interface ExperienceEntry {
  emoji: string
  company: string
  role: string
  period: string
  bullets: readonly string[]
}

export interface EducationEntry {
  emoji: string
  institution: string
  degree: string
  graduated: string
  honours: string
  deansList: string
  details: readonly string[]
}

export interface ResumeLinks {
  github: string
  x: string
  xHandle: string
  email: string
  whatsapp: string
}

export interface ResumeDownloads {
  pdf: string
  markdown: string
}

export interface ResumeData {
  name: string
  jobTitle: string
  location: string
  about: string
  skills: readonly SkillGroup[]
  experience: readonly ExperienceEntry[]
  education: readonly EducationEntry[]
  links: ResumeLinks
  downloads: ResumeDownloads
}

export const RESUME_DATA: ResumeData = {
  name: 'Wong Zhen Kai',
  jobTitle: 'Full Stack Developer',
  location: 'Petaling Jaya, Selangor, Malaysia',
  about:
    'Full-stack developer with 5+ years experience specializing in React.js/Next.js and Node.js/Python. AWS certified professional passionate about end-to-end project management. First-class honors in IT Security. Currently freelancing at MetaKore, building scalable web applications and APIs. Philosophy: "The first step to solving a problem is facing it." Fluent in Mandarin, English, and Malay. Always excited to tackle new challenges and deliver exceptional user experiences.',
  skills: [
    {
      emoji: '🚀',
      category: 'Frontend Magic',
      rows: [
        ['React.js & Next.js (Expert)', 'TypeScript/JavaScript (Expert)'],
        ['Tailwind CSS, CSS3, HTML5', 'Responsive & Mobile-first Design'],
        ['State Management (Redux, Zustand)', 'Component Architecture'],
      ],
    },
    {
      emoji: '⚙️',
      category: 'Backend Wizardry',
      rows: [
        ['Node.js & Python (Expert)', 'Golang (Microservices)'],
        ['REST APIs & GraphQL', 'Database Design (SQL/NoSQL)'],
        ['Microservices Architecture', 'Event-driven Systems'],
      ],
    },
    {
      emoji: '🤖',
      category: 'AI & Machine Learning (Recent Deep Dive)',
      rows: [
        ['LLMs & Foundation Models', 'Pre-training & Fine-tuning'],
        ['RAG (Retrieval-Augmented Generation)', 'Post-training Techniques'],
        ['Unsupervised Learning', 'Prompt Engineering'],
        ['AI Model Integration', 'Following AI trends daily on 𝕏'],
      ],
    },
    {
      emoji: '☁️',
      category: 'Cloud & DevOps',
      rows: [
        ['AWS (EC2, S3, Lambda, RDS)', 'Docker & Kubernetes'],
        ['Apache Kafka', 'CI/CD Pipelines', 'Infrastructure as Code'],
      ],
    },
    {
      emoji: '🛡️',
      category: 'Security & Others',
      rows: [
        ['IT Security', 'Secure Development Practices'],
        ['Git Version Control', 'Agile/Scrum', 'Test-Driven Development'],
      ],
    },
  ],
  experience: [
    {
      emoji: '🚀',
      company: 'MetaKore',
      role: 'Freelancer',
      period: 'Nov 2021 - Present',
      bullets: [
        'End-to-end project management & full-stack dev with Next.js/React/Node.js/Python',
        'Published APIs on RapidAPI & created MCP servers for public use',
        'Multi-project management with tight deadlines & strong client relationships',
      ],
    },
    {
      emoji: '🏢',
      company: 'UP DevLabs',
      role: 'Backend Developer',
      period: 'Sep 2022 - May 2024, Singapore',
      bullets: [
        'Built microservices with Golang beego & comprehensive OpenAPI docs',
        'Event-driven architecture with Apache Kafka, MySQL/MongoDB sync',
        'Solved Kubernetes concurrency issues using Redis solutions',
      ],
    },
    {
      emoji: '🌐',
      company: 'Flow Digital',
      role: 'Full Stack Developer',
      period: 'May - Nov 2021, Selangor',
      bullets: [
        'E-commerce development with WordPress, WooCommerce & Shopify',
        'Led UI/UX designers & developers, conducted code reviews',
        'Enhanced PHP systems & managed deployments on multiple platforms',
      ],
    },
    {
      emoji: '📸',
      company: '123RF',
      role: 'Web Application Developer',
      period: 'May 2020 - Apr 2021, Selangor',
      bullets: [
        'Migrated legacy PHP to Laravel framework module by module',
        'Built user auth & image search modules with REST API documentation',
        'Agile scrum methodology with weekly sprints & Docker environments',
      ],
    },
    {
      emoji: '🏗️',
      company: 'J Star Berhad',
      role: 'Web Developer',
      period: 'Jun 2019 - Feb 2020, KL',
      bullets: [
        'ASP.NET web development with SMS & payment gateway integrations',
        'Client interface customization & project coordination with tight timelines',
        'Debugging & optimization for enhanced user experience',
      ],
    },
  ],
  education: [
    {
      emoji: '🏛️',
      institution: 'Multimedia University, Melaka',
      degree: 'Bachelor of Information Technology (Security Technology)',
      graduated: 'Mar 2019',
      honours: 'First-Class Honours',
      deansList: "Dean's List",
      details: [
        '🔬 Final Year Project: Blockchain-based online sharing platform',
        '🛡️ Specialized in cybersecurity, secure development & computer science fundamentals',
        '🌟 Participated in Golden Key Society',
      ],
    },
    {
      emoji: '🏫',
      institution: 'Multimedia University, Melaka',
      degree: 'Diploma in Information Technology',
      graduated: 'Oct 2016',
      honours: 'First-Class Honours',
      deansList: "Dean's List",
      details: [
        '🔬 Final Year Project: Web-based food ordering system',
        '🤝 Active in 30-Hour Famine 2015, Chinese Language Society & Golden Key Society',
      ],
    },
  ],
  links: {
    github: 'https://github.com/zhenkai-dev',
    x: 'https://x.com/0x_wzhenkai',
    xHandle: '@0x_wzhenkai',
    email: 'zk.wong96@gmail.com',
    whatsapp: 'https://wa.me/60166206903',
  },
  downloads: {
    pdf: '/downloads/wzhenkai_resume.pdf',
    markdown: '/downloads/wzhenkai_resume.md',
  },
}

export interface PersonJsonLd {
  '@context': 'https://schema.org'
  '@type': 'Person'
  name: string
  jobTitle: string
  url: string
  sameAs: string[]
}

/** Builds Schema.org Person structured data from existing site facts only. */
export function buildPersonJsonLd(): PersonJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: RESUME_DATA.name,
    jobTitle: RESUME_DATA.jobTitle,
    url: `${SITE_URL}/`,
    sameAs: [RESUME_DATA.links.github, RESUME_DATA.links.x],
  }
}
