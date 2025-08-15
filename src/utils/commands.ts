export interface Command {
  name: string
  description: string
}

export const COMMANDS: Command[] = [
  { name: '/about', description: 'summary of me in 100 words' },
  { name: '/experience', description: 'shows all of my working experiences' },
  { name: '/education', description: 'tell you about my education background' },
  { name: '/skill', description: 'not only showing my technical skills, u should check it out!' },
  { name: '/github', description: 'take a look into my public repos' },
  { name: '/past-project', description: 'few of my recent completed projects' },
  { name: '/language', description: 'Sawasdee krap!' },
  { name: '/download-resume-pdf', description: 'a detailed resume in PDF format' },
  { name: '/download-resume-md', description: 'a detailed resume in Markdown format, LLMs love .md the most!' },
  { name: '/contact', description: 'hit me up on WhatsApp for a date :3' },
  { name: '/help', description: 'show all available commands' }
]

export function getCommandResponse(command: string): string {
  switch (command) {
    case '/about':
      return `Full-stack developer with 5+ years experience specializing in React.js/Next.js and Node.js/Python. AWS certified professional passionate about end-to-end project management. First-class honors in IT Security. Currently freelancing at MetaKore, building scalable web applications and APIs. Philosophy: "The first step to solving a problem is facing it." Fluent in Mandarin, English, and Malay. Always excited to tackle new challenges and deliver exceptional user experiences.`

    case '/experience':
      return `🚀 WORK EXPERIENCE
      
• Freelancer at MetaKore (Current)
  - Full-stack development using React.js/Next.js and Node.js/Python
  - End-to-end project management and delivery
  - Building scalable web applications and APIs
  
• 5+ Years in Software Development
  - Specialized in modern web technologies
  - AWS cloud infrastructure management
  - Docker/Kubernetes containerization
  - API development and integration
  
• IT Security Background
  - First-class honors degree
  - Security-first development approach
  - Secure coding practices implementation`

    case '/education':
      return `🎓 EDUCATION
      
• Bachelor's Degree in IT Security
  - First-Class Honours
  - Specialized in cybersecurity and secure development
  - Strong foundation in computer science fundamentals
  
• Continuous Learning
  - AWS Certified Professional
  - Modern web development frameworks
  - Cloud architecture and DevOps practices
  - Always staying updated with latest technologies`

    case '/skill':
      return `💻 TECHNICAL SKILLS
      
Frontend:
• React.js & Next.js (Expert)
• TypeScript/JavaScript (Expert)
• Tailwind CSS, CSS3, HTML5
• Responsive & Mobile-first Design
• State Management (Redux, Zustand)

Backend:
• Node.js & Python (Expert)
• REST APIs & GraphQL
• Database Design (SQL/NoSQL)
• Microservices Architecture

Cloud & DevOps:
• AWS Certified (EC2, S3, Lambda, RDS)
• Docker & Kubernetes
• CI/CD Pipelines
• Infrastructure as Code

Other:
• Git Version Control
• Agile/Scrum Methodologies
• Test-Driven Development
• Security Best Practices

🌟 But wait, there's more! I also speak multiple programming languages fluently and can debug code in my sleep! 😴`

    case '/github':
      return `https://github.com/zhenkai-dev`

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
  你好！我的中文非常流利 🇨🇳
  
• English (Proficient)
  Hello! I'm fluent in English for international communication 🇬🇧
  
• Malay (Proficient)
  Selamat datang! Saya boleh berkomunikasi dalam Bahasa Malaysia 🇲🇾
  
• Programming Languages (Expert)
  console.log("I speak fluent JavaScript, Python, TypeScript...") 💻
  
Sawasdee krap! 🙏 (That's Thai for hello - I'm learning!)

Ready to communicate in any language for your project needs!`

    case '/download-resume-pdf':
      return `📄 DOWNLOADING RESUME (PDF)
      
Preparing your detailed PDF resume...
      
📁 File: wzhenkai_resume.pdf
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
      
📁 File: wzhenkai_resume.md
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
      
Ready to collaborate? Let's chat!
      
💬 WhatsApp: Hit me up for a coffee date! ☕
🌐 Website: zhenkai-dev.com
🐙 GitHub: @zhenkai-dev
🐦 X (Twitter): @0x_wzhenkai
      
🎯 Available for:
• Full-stack development projects
• Technical consultations
• Code reviews and mentoring
• Freelance opportunities
      
Don't be shy - I'm always excited to discuss new projects and opportunities! 
      
P.S. I promise I'm more fun in person than my code comments suggest! 😄`

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