'use client'

import { useState } from 'react'

interface TerminalHeaderProps {
  onRefresh: () => void
}

export default function TerminalHeader({ onRefresh }: TerminalHeaderProps) {
  const [hovering, setHovering] = useState(false)

  const handleControlClick = () => {
    onRefresh()
  }

  return (
    <div 
      className="h-8 bg-primary flex items-center px-4 relative rounded-t-lg"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* macOS window controls */}
      <div className="flex space-x-2">
        <button
          onClick={handleControlClick}
          className={`w-3 h-3 rounded-full bg-red-500 transition-opacity duration-200 ${
            hovering ? 'opacity-100' : 'opacity-60'
          }`}
          aria-label="Close"
        />
        <button
          onClick={handleControlClick}
          className={`w-3 h-3 rounded-full bg-yellow-500 transition-opacity duration-200 ${
            hovering ? 'opacity-100' : 'opacity-60'
          }`}
          aria-label="Minimize"
        />
        <button
          onClick={handleControlClick}
          className={`w-3 h-3 rounded-full bg-green-500 transition-opacity duration-200 ${
            hovering ? 'opacity-100' : 'opacity-60'
          }`}
          aria-label="Expand"
        />
      </div>
      
      {/* Terminal title - center aligned */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-1 sm:space-x-2">
        <span className="text-xs sm:text-sm font-medium text-white">📁</span>
        <span className="text-xs sm:text-sm font-medium text-white hidden sm:inline">0x_wzhenkai — —zsh — 80×24</span>
        <span className="text-xs font-medium text-white sm:hidden">terminal</span>
      </div>
    </div>
  )
}