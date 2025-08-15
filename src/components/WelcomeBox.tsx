'use client'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { getTimeBasedGreeting } from '@/utils/greetings'
import { useEffect, useState } from 'react'

interface WelcomeBoxProps {
  isFirstVisit: boolean
}

export default function WelcomeBox({ isFirstVisit }: WelcomeBoxProps) {
  const [nickname] = useLocalStorage('nickname', '')
  const [greetingInfo, setGreetingInfo] = useState(getTimeBasedGreeting())

  useEffect(() => {
    // Update greeting every minute
    const interval = setInterval(() => {
      setGreetingInfo(getTimeBasedGreeting())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const getWelcomeMessage = () => {
    if (isFirstVisit || !nickname) {
      return '✳️ Welcome!'
    }
    return `✳️ ${greetingInfo.greeting}, ${nickname} ${greetingInfo.emoji}`
  }

  return (
    <div className="border border-primary rounded-lg p-4 mb-4 bg-terminal-bg">
      <div className="text-terminal-text">
        <div className="text-lg mb-3">
          {getWelcomeMessage()}
        </div>
        
        <div className="text-sm text-gray-400 mb-3">
          /help for help
        </div>
        
        <div className="text-sm text-gray-500">
          domain: zhenkai-dev.com
        </div>
      </div>
    </div>
  )
}