'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 100)
  }, [])

  const getTimestamp = () => {
    return isClient ? getCurrentTimestamp() : ''
  }

  const renderResponseWithLinks = (text: string) => {
    // Split by SVG tags first, then handle URLs within non-SVG parts
    const svgRegex = /(<svg[^>]*>.*?<\/svg>)/g
    const svgParts = text.split(svgRegex)
    
    return svgParts.map((part, index) => {
      // If this part is an SVG, render it as HTML
      if (svgRegex.test(part)) {
        return (
          <span
            key={index}
            dangerouslySetInnerHTML={{ __html: part }}
            className="inline-block align-middle mr-2"
          />
        )
      }
      
      // Handle URLs and email addresses in non-SVG parts
      const urlRegex = /(https?:\/\/[^\s]+)/g
      const emailRegex = /([\w\.-]+@[\w\.-]+\.\w+)/g
      
      // First handle URLs
      const urlParts = part.split(urlRegex)
      
      return urlParts.map((urlPart, urlIndex) => {
        if (urlRegex.test(urlPart)) {
          return (
            <a
              key={`${index}-${urlIndex}`}
              href={urlPart}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {urlPart}
            </a>
          )
        }
        
        // Handle email addresses in non-URL parts
        const emailParts = urlPart.split(emailRegex)
        
        return emailParts.map((emailPart, emailIndex) => {
          if (emailRegex.test(emailPart)) {
            return (
              <a
                key={`${index}-${urlIndex}-${emailIndex}`}
                href={`mailto:${emailPart}`}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {emailPart}
              </a>
            )
          }
          return emailPart
        })
      })
    })
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
      } else if (command === '/clear') {
        // Clear terminal history
        setCommandHistory([])
        return // Don't add this command to history
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
            className="p-3 sm:p-4 lg:p-6 overflow-y-auto max-h-[75vh] sm:max-h-[70vh] pb-12"
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
                    {renderResponseWithLinks(entry.response)}
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
            <div className="mt-6">
              <CommandInput 
                onCommandExecute={handleCommandExecute}
                commands={COMMANDS}
                onScrollToBottom={scrollToBottom}
                terminalRef={terminalRef}
              />
            </div>
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