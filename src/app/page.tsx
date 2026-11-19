import Terminal from '@/components/Terminal'
import ResumeSummary from '@/components/ResumeSummary'

export default function Home() {
  return (
    <main className="min-h-screen bg-terminal-bg">
      <Terminal />
      <ResumeSummary />
      <footer className="text-center pb-8 px-4 text-gray-500 text-sm">
        Built with ❤️ by Wong Zhen Kai • Terminal-styled personal website
      </footer>
    </main>
  )
}