'use client'

import { useState } from 'react'

interface TerminalHeaderProps {
  onRefresh: () => void
}

export default function TerminalHeader({ onRefresh }: TerminalHeaderProps) {
  const [hovering, setHovering] = useState(false)
  const [hoveringClose, setHoveringClose] = useState(false)
  const [hoveringMinimize, setHoveringMinimize] = useState(false)
  const [hoveringExpand, setHoveringExpand] = useState(false)

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
          onMouseEnter={() => setHoveringClose(true)}
          onMouseLeave={() => setHoveringClose(false)}
          className={`w-4 h-4 rounded-full bg-red-500 transition-opacity duration-200 flex items-center justify-center ${
            hovering ? 'opacity-100' : 'opacity-60'
          }`}
          aria-label="Close"
        >
          {hoveringClose && (
            <svg width="8" height="8" viewBox="0 0 8 8" className="text-black">
              <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          )}
        </button>
        <button
          onClick={handleControlClick}
          onMouseEnter={() => setHoveringMinimize(true)}
          onMouseLeave={() => setHoveringMinimize(false)}
          className={`w-4 h-4 rounded-full bg-yellow-500 transition-opacity duration-200 flex items-center justify-center ${
            hovering ? 'opacity-100' : 'opacity-60'
          }`}
          aria-label="Minimize"
        >
          {hoveringMinimize && (
            <svg width="8" height="8" viewBox="0 0 8 8" className="text-black">
              <path d="M1 4H7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          )}
        </button>
        <button
          onClick={handleControlClick}
          onMouseEnter={() => setHoveringExpand(true)}
          onMouseLeave={() => setHoveringExpand(false)}
          className={`w-4 h-4 rounded-full bg-green-500 transition-opacity duration-200 flex items-center justify-center ${
            hovering ? 'opacity-100' : 'opacity-60'
          }`}
          aria-label="Expand"
        >
          {hoveringExpand && (
            <svg width="8" height="8" viewBox="0 0 24 24" className="text-black">
              <polyline fill="none" points="3 17.3 3 21 6.7 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="10" x2="3.8" y1="14" y2="20.2"/>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14" x2="20.2" y1="10" y2="3.8"/>
              <polyline fill="none" points="21 6.7 21 3 17.3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            </svg>
          )}
        </button>
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