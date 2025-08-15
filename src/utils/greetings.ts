export interface GreetingInfo {
  greeting: string
  emoji: string
}

export function getTimeBasedGreeting(): GreetingInfo {
  const now = new Date()
  const hours = now.getHours()
  
  if (hours >= 6 && hours < 12) {
    return {
      greeting: 'Good morning',
      emoji: '☀️'
    }
  } else if (hours >= 12 && hours < 18) {
    return {
      greeting: 'Good afternoon', 
      emoji: '☕'
    }
  } else {
    return {
      greeting: 'Good evening',
      emoji: '🌙'
    }
  }
}

export function getCurrentTimestamp(): string {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }
  
  return now.toLocaleDateString('en-US', options).replace(',', '')
}