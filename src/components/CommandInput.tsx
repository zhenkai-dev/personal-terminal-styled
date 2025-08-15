'use client'

import { useState, useRef, useEffect } from 'react'

interface Command {
  name: string
  description: string
}

interface CommandInputProps {
  onCommandExecute: (command: string) => void
  commands: Command[]
}

export default function CommandInput({ onCommandExecute, commands }: CommandInputProps) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (input.startsWith('/') && input.length > 1) {
      const filtered = commands.filter(cmd => 
        cmd.name.toLowerCase().includes(input.toLowerCase().slice(1))
      )
      setFilteredCommands(filtered)
      setShowSuggestions(filtered.length > 0)
      setSelectedIndex(-1)
    } else if (input === '/') {
      setFilteredCommands(commands)
      setShowSuggestions(true)
      setSelectedIndex(-1)
    } else {
      setShowSuggestions(false)
      setFilteredCommands([])
      setSelectedIndex(-1)
    }
  }, [input, commands])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && filteredCommands[selectedIndex]) {
        const selectedCommand = filteredCommands[selectedIndex].name
        setInput(selectedCommand)
        setShowSuggestions(false)
        onCommandExecute(selectedCommand)
      } else if (input.trim()) {
        onCommandExecute(input.trim())
        setShowSuggestions(false)
      }
      setInput('')
      setSelectedIndex(-1)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (showSuggestions) {
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        )
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (showSuggestions) {
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        )
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (selectedIndex >= 0 && filteredCommands[selectedIndex]) {
        setInput(filteredCommands[selectedIndex].name)
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }
  }

  const handleSuggestionClick = (command: Command) => {
    setInput(command.name)
    setShowSuggestions(false)
    onCommandExecute(command.name)
    setInput('')
    inputRef.current?.focus()
  }

  useEffect(() => {
    // Auto-focus the input
    inputRef.current?.focus()
  }, [])

  return (
    <div className="relative">
      {/* Command Input */}
      <div className="flex items-center bg-terminal-bg border border-terminal-border rounded p-3 touch-manipulation">
        <span className="text-terminal-text mr-2">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-terminal-text outline-none font-mono text-base sm:text-sm"
          placeholder="Type a command..."
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredCommands.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-terminal-bg border border-terminal-border rounded-b max-h-64 overflow-y-auto z-10 touch-manipulation">
          {filteredCommands.map((command, index) => (
            <div
              key={command.name}
              onClick={() => handleSuggestionClick(command)}
              className={`px-3 sm:px-4 py-3 sm:py-2 cursor-pointer text-sm touch-manipulation ${
                index === selectedIndex 
                  ? 'bg-primary bg-opacity-20 text-primary' 
                  : 'text-terminal-text hover:bg-gray-800 active:bg-gray-700'
              }`}
            >
              <div className="font-mono text-primary text-sm sm:text-sm">{command.name}</div>
              <div className="text-xs text-gray-400 mt-1 leading-relaxed">{command.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}