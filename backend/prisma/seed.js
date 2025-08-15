"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    const commands = [
        {
            name: '/about',
            description: 'summary of me in 100 words',
            category: 'personal',
            responseType: 'STATIC'
        },
        {
            name: '/experience',
            description: 'shows all of my working experiences',
            category: 'professional',
            responseType: 'STATIC'
        },
        {
            name: '/education',
            description: 'tell you about my education background',
            category: 'professional',
            responseType: 'STATIC'
        },
        {
            name: '/skill',
            description: 'not only showing my technical skills, u should check it out!',
            category: 'professional',
            responseType: 'STATIC'
        },
        {
            name: '/github',
            description: 'take a look into my public repos',
            category: 'professional',
            responseType: 'STATIC'
        },
        {
            name: '/past-project',
            description: 'few of my recent completed projects',
            category: 'professional',
            responseType: 'STATIC'
        },
        {
            name: '/language',
            description: 'Sawasdee krap!',
            category: 'personal',
            responseType: 'STATIC'
        },
        {
            name: '/download-resume-pdf',
            description: 'a detailed resume in PDF format',
            category: 'download',
            responseType: 'FILE_DOWNLOAD'
        },
        {
            name: '/download-resume-md',
            description: 'a detailed resume in Markdown format, LLMs love .md the most!',
            category: 'download',
            responseType: 'FILE_DOWNLOAD'
        },
        {
            name: '/contact',
            description: 'hit me up on WhatsApp for a date :3',
            category: 'contact',
            responseType: 'STATIC'
        },
        {
            name: '/help',
            description: 'show all available commands',
            category: 'system',
            responseType: 'DYNAMIC'
        }
    ];
    console.log('📝 Seeding commands...');
    for (const command of commands) {
        await prisma.command.upsert({
            where: { name: command.name },
            update: command,
            create: command
        });
    }
    const commandResponses = [
        {
            commandName: '/about',
            content: `Full-stack developer with 5+ years experience specializing in React.js/Next.js and Node.js/Python. AWS certified professional passionate about end-to-end project management. First-class honors in IT Security. Currently freelancing at MetaKore, building scalable web applications and APIs. Philosophy: "The first step to solving a problem is facing it." Fluent in Mandarin, English, and Malay. Always excited to tackle new challenges and deliver exceptional user experiences.`,
            contentType: 'text/plain'
        },
        {
            commandName: '/experience',
            content: `🚀 WORK EXPERIENCE

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
  - Secure coding practices implementation`,
            contentType: 'text/plain'
        },
        {
            commandName: '/education',
            content: `🎓 EDUCATION

• Bachelor's Degree in IT Security
  - First-Class Honours
  - Specialized in cybersecurity and secure development
  - Strong foundation in computer science fundamentals

• Continuous Learning
  - AWS Certified Professional
  - Modern web development frameworks
  - Cloud architecture and DevOps practices
  - Always staying updated with latest technologies`,
            contentType: 'text/plain'
        },
        {
            commandName: '/skill',
            content: `💻 TECHNICAL SKILLS

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

🌟 But wait, there's more! I also speak multiple programming languages fluently and can debug code in my sleep! 😴`,
            contentType: 'text/plain'
        },
        {
            commandName: '/github',
            content: `🐙 GITHUB PROFILE

GitHub: @zhenkai-dev
Website: zhenkai-dev.com

📈 Public Repositories:
• Various open-source projects
• Full-stack web applications
• API implementations
• Code examples and tutorials

🔥 Recent Activity:
• Building modern React.js applications
• Contributing to open-source projects
• Sharing knowledge through code examples

Visit my GitHub to explore my latest projects and contributions!
Link: https://github.com/zhenkai-dev`,
            contentType: 'text/plain'
        },
        {
            commandName: '/past-project',
            content: `🚀 RECENT PROJECTS

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

...and many more! Each project showcases different aspects of my full-stack capabilities.`,
            contentType: 'text/plain'
        },
        {
            commandName: '/language',
            content: `🌍 LANGUAGES

• Mandarin (Native)
  你好！我的中文非常流利 🇨🇳

• English (Proficient)
  Hello! I'm fluent in English for international communication 🇬🇧

• Malay (Proficient)
  Selamat datang! Saya boleh berkomunikasi dalam Bahasa Malaysia 🇲🇾

• Programming Languages (Expert)
  console.log("I speak fluent JavaScript, Python, TypeScript...") 💻

Sawasdee krap! 🙏 (That's Thai for hello - I'm learning!)

Ready to communicate in any language for your project needs!`,
            contentType: 'text/plain'
        },
        {
            commandName: '/contact',
            content: `📞 LET'S CONNECT!

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

P.S. I promise I'm more fun in person than my code comments suggest! 😄`,
            contentType: 'text/plain'
        }
    ];
    console.log('💬 Seeding command responses...');
    for (const response of commandResponses) {
        await prisma.commandResponse.upsert({
            where: {
                commandName_version: {
                    commandName: response.commandName,
                    version: 1
                }
            },
            update: response,
            create: response
        });
    }
    console.log('✅ Database seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map