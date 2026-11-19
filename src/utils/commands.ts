import { RESUME_DATA } from '@/data/resume'

export interface Command {
  name: string
  description: string
}

// Visible commands that show up in autocomplete and help
export const COMMANDS: Command[] = [
  { name: '/about', description: 'a summary of me in less than 100 words' },
  { name: '/experience', description: 'shows all my working experiences' },
  { name: '/education', description: 'tells you about my education background' },
  { name: '/skill', description: 'not only shows my technical skills, you should check it out!' },
  { name: '/github', description: 'take a look at my public repos' },
  { name: '/past-project', description: 'a few of my recently completed projects' },
  { name: '/language', description: 'Sawasdee krap!' },
  { name: '/download-resume-pdf', description: 'a detailed resume in PDF format' },
  { name: '/download-resume-md', description: 'a detailed resume in Markdown format, LLMs love .md the most!' },
  { name: '/contact', description: 'hit me up on WhatsApp for a date :3' },
  { name: '/help', description: 'shows all available commands' }
]

// Hidden commands that work but don't show in autocomplete/help
const HIDDEN_COMMANDS: Command[] = [
  { name: '/clear', description: 'clears all terminal messages' },
  { name: '/hello', description: 'greets you back with good vibes' },
  { name: '/hi', description: 'says hi back to you' },
  { name: '/hey', description: 'responds with a friendly hey' }
]

function formatExperienceResponse(): string {
  const entries = RESUME_DATA.experience
    .map((entry) => {
      // Preserve legacy trailing spaces on 123RF header for byte-identical output.
      const trailing = entry.company === '123RF' ? '  ' : ''
      const header = `${entry.emoji} ${entry.company} / ${entry.role} (${entry.period})${trailing}`
      const bullets = entry.bullets.map((bullet) => `   • ${bullet}`).join('\n')
      return `${header}\n${bullets}`
    })
    .join('\n\n')

  return `💼 WORK EXPERIENCE\n\n${entries}`
}

function formatEducationResponse(): string {
  const entries = RESUME_DATA.education
    .map((entry) => {
      // Preserve legacy trailing spaces on Diploma header for byte-identical output.
      const trailing = entry.degree.startsWith('Diploma') ? '  ' : ''
      const header = `${entry.emoji} ${entry.institution} / ${entry.degree}${trailing}`
      const summary = `   📅 Graduated ${entry.graduated} • 🏆 ${entry.honours} • 📚 ${entry.deansList}`
      const details = entry.details.map((line) => `   ${line}`).join('\n')
      return `${header}\n${summary}\n${details}`
    })
    .join('\n\n')

  return `🎓 EDUCATION\n\n${entries}`
}

function formatSkillsResponse(): string {
  const groups = RESUME_DATA.skills
    .map((group) => {
      const rows = group.rows
        .map((row) => row.map((item) => `• ${item}`).join(' '))
        .join('\n')
      return `${group.emoji} ${group.category}:\n${rows}`
    })
    .join('\n\n')

  return `💻 TECHNICAL SKILLS

${groups}

🌟 But wait, there's more! I speak multiple programming languages fluently, debug code in my sleep, and stay updated with the latest AI breakthroughs! 😴

#keepbuilding`
}

function getBasename(filePath: string): string {
  return filePath.split('/').pop() ?? filePath
}

export function getCommandResponse(command: string): string {
  switch (command) {
    case '/about':
      return RESUME_DATA.about

    case '/experience':
      return formatExperienceResponse()

    case '/education':
      return formatEducationResponse()

    case '/skill':
      return formatSkillsResponse()

    case '/github':
      return RESUME_DATA.links.github

    case '/past-project':
      return `🚀 RECENT PROJECTS
      
1. RoundNSurge CMS
   • https://roundnsurge.com
   • Full-featured CMS built with Laravel
   • Content management and publishing platform
   
2. ASEAN Lottery Results API
   • https://rapidapi.com/zhenkaidev-vnKI5xDH8HR/api/asean-lottery-results-api1
   • Real-time lottery data aggregation
   • RESTful API serving multiple countries
   
3. SlotKubai - AI Slot Prediction
   • https://slotkubai.com
   • Machine learning for slot game predictions
   • Advanced algorithms and data analysis
   
4. AI Football Prediction Platform
   • https://peaceful-liskov.209-127-228-182.plesk.page
   • Sports analytics and prediction engine
   • Real-time data processing
   
...and many more! Each project showcases different aspects of my full-stack capabilities.`

    case '/language':
      return `🌍 LANGUAGES
      
• Mandarin (Native)
  你好！我的中文非常流利
  
• English (Proficient)
  Hello! I'm fluent in English for international communication
  
• Malay (Proficient)
  Selamat datang! Saya boleh berkomunikasi dalam Bahasa Malaysia
  
• Thai (Basic)
  Sawasdee krap! I can handle basic communication
  
• Programming Languages (Expert)
  console.log("I speak fluent JavaScript, Python, TypeScript...")

Ready to communicate in any language for your project needs!`

    case '/download-resume-pdf':
      return `📄 DOWNLOADING RESUME (PDF)
      
Preparing your detailed PDF resume...
      
📁 File: ${getBasename(RESUME_DATA.downloads.pdf)}
📊 Size: Professional & Comprehensive
🎯 Format: ATS-friendly PDF
      
✅ Download initiated!
      
This resume includes:
• Complete work experience
• Technical skills breakdown
• Project portfolios
• Education background
• Certifications and achievements
      
Perfect for HR systems and hiring managers!`

    case '/download-resume-md':
      return `📝 DOWNLOADING RESUME (MARKDOWN)
      
Preparing your detailed Markdown resume...
      
📁 File: ${getBasename(RESUME_DATA.downloads.markdown)}
🤖 Format: LLM-friendly Markdown
🎯 Purpose: Perfect for AI analysis
      
✅ Download initiated!
      
This markdown version includes:
• Structured data for easy parsing
• Complete technical documentation
• Project details and links
• Machine-readable format
      
LLMs absolutely love this format! 🤖💕`

    case '/contact':
      return `📞 LET'S CONNECT!

<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48"><path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path></svg> WhatsApp: ${RESUME_DATA.links.whatsapp}

<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48"><path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"></path><path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"></path><polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"></polygon><path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"></path><path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"></path></svg> Email: ${RESUME_DATA.links.email}

<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48"><path fill="#212121" fill-rule="evenodd" d="M38,42H10c-2.209,0-4-1.791-4-4V10c0-2.209,1.791-4,4-4h28c2.209,0,4,1.791,4,4v28C42,40.209,40.209,42,38,42z" clip-rule="evenodd"></path><path fill="#fff" d="M34.257,34h-6.437L13.829,14h6.437L34.257,34z M28.587,32.304h2.563L19.499,15.696h-2.563 L28.587,32.304z"></path><polygon fill="#fff" points="15.866,34 23.069,25.656 22.127,24.407 13.823,34"></polygon><polygon fill="#fff" points="24.45,21.721 25.355,23.01 33.136,14 31.136,14"></polygon></svg> X/Twitter: ${RESUME_DATA.links.x}
      
Don't be shy - I'm always excited to discuss new projects and opportunities! 
      
P.S. I promise I'm more fun in person than my code comments suggest! 😄`

    case '/clear':
      return 'CLEAR_TERMINAL'

    case '/hello':
      return `/hello back to you! 👋 Have a great day ahead! ✨`

    case '/hi':
      return `/hi there! 😊 Have a great day ahead! 🌟`

    case '/hey':
      return `/hey! 👋 Have a great day ahead! 🚀`

    case '/help':
      return `🔧 AVAILABLE COMMANDS
      
${COMMANDS.map(cmd => `${cmd.name.padEnd(25)} - ${cmd.description}`).join('\n')}
      
💡 Tips:
• Type '/' to see all commands
• Use arrow keys to navigate suggestions
• Press Tab to autocomplete
• Press Enter to execute
      
Happy exploring! 🚀`

    default:
      return `Command not found: ${command}
      
Type '/help' to see all available commands.`
  }
}
