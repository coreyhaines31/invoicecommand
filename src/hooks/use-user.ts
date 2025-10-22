'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  full_name?: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Since auth is disabled, we'll always return null for now
    // This can be easily updated when auth is re-enabled
    setUser(null)
    setLoading(false)
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user
  }
}