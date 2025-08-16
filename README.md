# Personal Terminal-Styled Portfolio

A modern, interactive terminal-styled personal portfolio website built with Next.js and Tailwind CSS for Wong Zhen Kai.

## 🚀 Features

- **Terminal-Style Interface**: Authentic macOS terminal appearance with interactive window controls
- **Time-Based Greetings**: Dynamic greetings that change based on local time
- **Smart Command System**: Autocomplete dropdown with navigation support
- **Mobile Responsive**: Optimized for all devices with touch-friendly interactions
- **Local Storage**: Remembers user preferences and nickname
- **Interactive Commands**: 10+ commands showcasing skills, experience, and projects
- **File Downloads**: Direct download of resume in PDF and Markdown formats

## 🎨 Design

Based on macOS terminal design with:
- Primary orange color (#ff8c1a) for branding
- Dark terminal background for authenticity
- Responsive typography using SF Mono font family
- Touch-optimized UI elements for mobile devices

## 🛠 Tech Stack

- **Framework**: Next.js 15.4.6 with App Router (Static Export Ready)
- **Styling**: Tailwind CSS with custom terminal theme
- **Language**: TypeScript for type safety
- **State Management**: React hooks with localStorage integration
- **Architecture**: Client-side only, no backend dependencies

## 📱 Mobile Features

- Touch-friendly command suggestions
- Optimized text sizes for mobile screens
- Responsive layout that works on all devices
- Proper viewport configuration
- Touch manipulation optimizations

## 🎯 Available Commands

- `/about` - Personal summary
- `/experience` - Work experience
- `/education` - Educational background
- `/skill` - Technical skills showcase
- `/github` - GitHub profile and repositories
- `/past-project` - Recent completed projects
- `/language` - Language proficiencies
- `/download-resume-pdf` - Download PDF resume
- `/download-resume-md` - Download Markdown resume
- `/contact` - Contact information
- `/help` - Show all commands

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧪 Testing

### Manual Testing Checklist

1. **Terminal Interface**:
   - [ ] Header displays with correct orange color
   - [ ] Window controls show on hover
   - [ ] Clicking controls refreshes the page

2. **Welcome System**:
   - [ ] First visit shows "Welcome!"
   - [ ] Subsequent visits show time-based greeting
   - [ ] Nickname is requested after first command
   - [ ] Nickname persists across sessions

3. **Command System**:
   - [ ] Typing '/' shows all commands
   - [ ] Autocomplete works correctly
   - [ ] Arrow keys navigate suggestions
   - [ ] Enter executes selected command
   - [ ] All 10 commands return proper responses

4. **Mobile Experience**:
   - [ ] Touch interactions work smoothly
   - [ ] Text is readable on small screens
   - [ ] Command suggestions are touch-friendly
   - [ ] No horizontal scrolling issues

5. **File Downloads**:
   - [ ] PDF resume downloads correctly
   - [ ] Markdown resume downloads correctly

## 📦 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Static Export (for hosting on GitHub Pages, Netlify, etc.)
```bash
npm run build
npm run export
```

The built static files will be in the `out/` directory, ready for deployment to any static hosting service.

## 🎨 Customization

The terminal theme can be customized in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#ff8c1a', // Brand color
      terminal: {
        bg: '#1e1e1e',     // Terminal background
        text: '#e5e5e5',   // Terminal text
        border: '#444444', // Terminal borders
      }
    }
  }
}
```

## 📄 License

See LICENSE file for details.

---

Built with ❤️ by Wong Zhen Kai • Terminal-styled personal website