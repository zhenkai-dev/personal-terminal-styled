'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isClient, setIsClient] = useState(false)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Get value from localStorage on client side
  useEffect(() => {
    if (isClient) {
      try {
        const item = window.localStorage.getItem(key)
        if (item) {
          const parsedItem = JSON.parse(item)
          
          // Check for TTL expiration for nickname
          if (key === 'nickname' && parsedItem && typeof parsedItem === 'object' && parsedItem.timestamp) {
            const now = Date.now()
            const ttl = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
            
            if (now - parsedItem.timestamp > ttl) {
              // TTL expired, remove from localStorage
              window.localStorage.removeItem(key)
              setStoredValue(initialValue)
              return
            }
            
            // TTL not expired, use the stored value
            setStoredValue(parsedItem.value)
          } else {
            setStoredValue(parsedItem)
          }
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error)
      }
    }
  }, [key, isClient, initialValue])

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Save state
      setStoredValue(valueToStore)
      
      // Save to localStorage only on client side
      if (isClient) {
        // For nickname, store with timestamp for TTL
        if (key === 'nickname') {
          const dataWithTimestamp = {
            value: valueToStore,
            timestamp: Date.now()
          }
          window.localStorage.setItem(key, JSON.stringify(dataWithTimestamp))
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue, isClient] as const
}