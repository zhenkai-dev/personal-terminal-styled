'use client'

import { useState, useEffect, useRef } from 'react'
import TerminalHeader from './TerminalHeader'
import WelcomeBox from './WelcomeBox'
import CommandInput from './CommandInput'
import { COMMANDS, getCommandResponse } from '@/utils/commands'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { getCurrentTimestamp } from '@/utils/greetings'

interface CommandHistory {
  command: string
  response: string
  timestamp: string
}

export default function Terminal() {
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([])
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [nickname, setNickname, isClient] = useLocalStorage('nickname', '')
  const [waitingForNickname, setWaitingForNickname] = useState(false)
  const [lastLoginTime, setLastLoginTime] = useState('')
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isClient) {
      const hasVisited = localStorage.getItem('hasVisited')
      if (hasVisited) {
        setIsFirstVisit(false)
      } else {
        localStorage.setItem('hasVisited', 'true')
      }
      // Set login time after hydration to avoid SSR mismatch
      setLastLoginTime(getCurrentTimestamp())
    }
  }, [isClient])

  const scrollToBottom = () => {
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 100)
  }

  const getTimestamp = () => {
    return isClient ? getCurrentTimestamp() : ''
  }

  const handleCommandExecute = (command: string) => {
    if (waitingForNickname) {
      // User is providing their nickname
      setNickname(command)
      setWaitingForNickname(false)
      
      const response = `Nice to meet you, ${command}! 👋\n\nNow you can explore all the available commands. Type '/help' to get started!`
      
      setCommandHistory(prev => [...prev, {
        command: `nickname: ${command}`,
        response,
        timestamp: getTimestamp()
      }])
      
      scrollToBottom()
      return
    }

    // Handle regular commands
    let response = ''
    
    // Check if this is the first command and no nickname is set
    if (commandHistory.length === 0 && !nickname && command !== '/help') {
      setWaitingForNickname(true)
      response = `Hello there! 👋\n\nBefore we continue, how should I address you?\nPlease type your preferred name/nickname:`
    } else {
      // Handle file downloads
      if (command === '/download-resume-pdf') {
        // Trigger PDF download
        const link = document.createElement('a')
        link.href = '/downloads/wzhenkai_resume.pdf'
        link.download = 'wzhenkai_resume.pdf'
        link.click()
        response = getCommandResponse(command)
      } else if (command === '/download-resume-md') {
        // Trigger MD download
        const link = document.createElement('a')
        link.href = '/downloads/wzhenkai_resume.md'
        link.download = 'wzhenkai_resume.md'
        link.click()
        response = getCommandResponse(command)
      } else {
        response = getCommandResponse(command)
      }
    }
    
    setCommandHistory(prev => [...prev, {
      command,
      response,
      timestamp: getTimestamp()
    }])
    
    scrollToBottom()
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const getPromptText = () => {
    if (waitingForNickname) {
      return "Please enter your name:"
    }
    return "Type a command..."
  }

  return (
    <div className="min-h-screen bg-terminal-bg p-2 sm:p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Terminal Window */}
        <div className="bg-terminal-bg border border-terminal-border rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <TerminalHeader onRefresh={handleRefresh} />
          
          {/* Terminal Content */}
          <div 
            ref={terminalRef}
            className="p-3 sm:p-4 lg:p-6 max-h-[75vh] sm:max-h-[70vh] overflow-y-auto"
          >
            {/* Welcome Box */}
            <WelcomeBox isFirstVisit={isFirstVisit} />
            
            {/* Last Login Time */}
            {lastLoginTime && (
              <div className="text-sm text-gray-500 mb-6">
                Last login: {lastLoginTime}
              </div>
            )}
            
            {/* Command History */}
            <div className="space-y-4 mb-6">
              {commandHistory.map((entry, index) => (
                <div key={index} className="space-y-2">
                  {/* Command */}
                  <div className="flex items-center text-terminal-text">
                    <span className="text-primary mr-2">&gt;</span>
                    <span className="font-mono">{entry.command}</span>
                  </div>
                  
                  {/* Response */}
                  <div className="ml-4 text-terminal-text whitespace-pre-wrap text-sm leading-relaxed">
                    {entry.response}
                  </div>
                </div>
              ))}
              
              {/* Nickname prompt if waiting */}
              {waitingForNickname && commandHistory.length > 0 && (
                <div className="ml-4 text-yellow-400 text-sm">
                  Waiting for your response...
                </div>
              )}
            </div>
            
            {/* Command Input */}
            <CommandInput 
              onCommandExecute={handleCommandExecute}
              commands={COMMANDS}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Built with ❤️ by Wong Zhen Kai • Terminal-styled personal website</p>
        </div>
      </div>
    </div>
  )
}