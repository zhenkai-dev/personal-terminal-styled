-- Personal Terminal Backend Database Schema
-- Designed for MySQL with focus on performance and analytics

-- Users table for tracking visitors
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    first_visit_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_visit_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    total_commands INT DEFAULT 0,
    timezone VARCHAR(50),
    country VARCHAR(2),
    INDEX idx_session_id (session_id),
    INDEX idx_last_visit (last_visit_at)
);

-- Commands table for storing available commands and their metadata
CREATE TABLE commands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50),
    response_type ENUM('static', 'dynamic', 'file_download') DEFAULT 'static',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_category (category)
);

-- Command executions table for analytics and tracking
CREATE TABLE command_executions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36),
    command_name VARCHAR(50) NOT NULL,
    execution_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_time_ms INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (command_name) REFERENCES commands(name) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_command_name (command_name),
    INDEX idx_execution_time (execution_time),
    INDEX idx_success (success)
);

-- Command responses table for dynamic content and versioning
CREATE TABLE command_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    command_name VARCHAR(50) NOT NULL,
    version INT DEFAULT 1,
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'text/plain',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (command_name) REFERENCES commands(name) ON DELETE CASCADE,
    UNIQUE KEY unique_command_version (command_name, version),
    INDEX idx_command_name (command_name),
    INDEX idx_is_active (is_active)
);

-- File downloads table for tracking resume downloads
CREATE TABLE file_downloads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    download_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_file_type (file_type),
    INDEX idx_download_time (download_time)
);

-- Analytics summary table for quick dashboard queries
CREATE TABLE analytics_daily (
    date DATE PRIMARY KEY,
    unique_visitors INT DEFAULT 0,
    total_commands INT DEFAULT 0,
    total_downloads INT DEFAULT 0,
    most_popular_command VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date)
);

-- Insert default commands
INSERT INTO commands (name, description, category, response_type) VALUES
('/about', 'summary of me in 100 words', 'personal', 'static'),
('/experience', 'shows all of my working experiences', 'professional', 'static'),
('/education', 'tell you about my education background', 'professional', 'static'),
('/skill', 'not only showing my technical skills, u should check it out!', 'professional', 'static'),
('/github', 'take a look into my public repos', 'professional', 'static'),
('/past-project', 'few of my recent completed projects', 'professional', 'static'),
('/language', 'Sawasdee krap!', 'personal', 'static'),
('/download-resume-pdf', 'a detailed resume in PDF format', 'download', 'file_download'),
('/download-resume-md', 'a detailed resume in Markdown format, LLMs love .md the most!', 'download', 'file_download'),
('/contact', 'hit me up on WhatsApp for a date :3', 'contact', 'static'),
('/help', 'show all available commands', 'system', 'dynamic');

-- Insert initial command responses (matching current frontend responses)
INSERT INTO command_responses (command_name, content, content_type) VALUES
('/about', 'Full-stack developer with 5+ years experience specializing in React.js/Next.js and Node.js/Python. AWS certified professional passionate about end-to-end project management. First-class honors in IT Security. Currently freelancing at MetaKore, building scalable web applications and APIs. Philosophy: "The first step to solving a problem is facing it." Fluent in Mandarin, English, and Malay. Always excited to tackle new challenges and deliver exceptional user experiences.', 'text/plain'),
('/experience', '🚀 WORK EXPERIENCE\n\n• Freelancer at MetaKore (Current)\n  - Full-stack development using React.js/Next.js and Node.js/Python\n  - End-to-end project management and delivery\n  - Building scalable web applications and APIs\n\n• 5+ Years in Software Development\n  - Specialized in modern web technologies\n  - AWS cloud infrastructure management\n  - Docker/Kubernetes containerization\n  - API development and integration\n\n• IT Security Background\n  - First-class honors degree\n  - Security-first development approach\n  - Secure coding practices implementation', 'text/plain'),
('/education', '🎓 EDUCATION\n\n• Bachelor''s Degree in IT Security\n  - First-Class Honours\n  - Specialized in cybersecurity and secure development\n  - Strong foundation in computer science fundamentals\n\n• Continuous Learning\n  - AWS Certified Professional\n  - Modern web development frameworks\n  - Cloud architecture and DevOps practices\n  - Always staying updated with latest technologies', 'text/plain'),
('/skill', '💻 TECHNICAL SKILLS\n\nFrontend:\n• React.js & Next.js (Expert)\n• TypeScript/JavaScript (Expert)\n• Tailwind CSS, CSS3, HTML5\n• Responsive & Mobile-first Design\n• State Management (Redux, Zustand)\n\nBackend:\n• Node.js & Python (Expert)\n• REST APIs & GraphQL\n• Database Design (SQL/NoSQL)\n• Microservices Architecture\n\nCloud & DevOps:\n• AWS Certified (EC2, S3, Lambda, RDS)\n• Docker & Kubernetes\n• CI/CD Pipelines\n• Infrastructure as Code\n\nOther:\n• Git Version Control\n• Agile/Scrum Methodologies\n• Test-Driven Development\n• Security Best Practices\n\n🌟 But wait, there''s more! I also speak multiple programming languages fluently and can debug code in my sleep! 😴', 'text/plain'),
('/github', '🐙 GITHUB PROFILE\n\nGitHub: @zhenkai-dev\nWebsite: zhenkai-dev.com\n\n📈 Public Repositories:\n• Various open-source projects\n• Full-stack web applications\n• API implementations\n• Code examples and tutorials\n\n🔥 Recent Activity:\n• Building modern React.js applications\n• Contributing to open-source projects\n• Sharing knowledge through code examples\n\nVisit my GitHub to explore my latest projects and contributions!\nLink: https://github.com/zhenkai-dev', 'text/plain'),
('/past-project', '🚀 RECENT PROJECTS\n\n1. RoundNSurge CMS\n   • https://roundnsurge.com\n   • Full-featured CMS built with Laravel\n   • Content management and publishing platform\n\n2. ASEAN Lottery Results API\n   • https://rapidapi.com/zhenkaidev-vnKI5xDH8HR/api/asean-lottery-results-api1\n   • Real-time lottery data aggregation\n   • RESTful API serving multiple countries\n\n3. SlotKubai - AI Slot Prediction\n   • https://slotkubai.com\n   • Machine learning for slot game predictions\n   • Advanced algorithms and data analysis\n\n4. AI Football Prediction Platform\n   • https://peaceful-liskov.209-127-228-182.plesk.page\n   • Sports analytics and prediction engine\n   • Real-time data processing\n\n...and many more! Each project showcases different aspects of my full-stack capabilities.', 'text/plain'),
('/language', '🌍 LANGUAGES\n\n• Mandarin (Native)\n  你好！我的中文非常流利 🇨🇳\n\n• English (Proficient)\n  Hello! I''m fluent in English for international communication 🇬🇧\n\n• Malay (Proficient)\n  Selamat datang! Saya boleh berkomunikasi dalam Bahasa Malaysia 🇲🇾\n\n• Programming Languages (Expert)\n  console.log("I speak fluent JavaScript, Python, TypeScript...") 💻\n\nSawasdee krap! 🙏 (That''s Thai for hello - I''m learning!)\n\nReady to communicate in any language for your project needs!', 'text/plain'),
('/contact', '📞 LET''S CONNECT!\n\nReady to collaborate? Let''s chat!\n\n💬 WhatsApp: Hit me up for a coffee date! ☕\n🌐 Website: zhenkai-dev.com\n🐙 GitHub: @zhenkai-dev\n🐦 X (Twitter): @0x_wzhenkai\n\n🎯 Available for:\n• Full-stack development projects\n• Technical consultations\n• Code reviews and mentoring\n• Freelance opportunities\n\nDon''t be shy - I''m always excited to discuss new projects and opportunities!\n\nP.S. I promise I''m more fun in person than my code comments suggest! 😄', 'text/plain');