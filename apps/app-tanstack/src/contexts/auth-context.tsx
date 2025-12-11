'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { getSupabase } from '@/lib/supabase'

type AuthContextType = {
  user: User | null
  signIn: (
    email: string,
    password: string,
    captchaToken: string,
  ) => Promise<void>
  signUp: (
    email: string,
    password: string,
    captchaToken: string,
  ) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    try {
      const supabase = getSupabase()
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null)
        },
      )

      return () => {
        authListener.subscription.unsubscribe()
      }
    } catch {
      // Supabase not configured, ignore
      console.warn('Supabase not configured')
    }
  }, [])

  const signIn = async (
    email: string,
    password: string,
    captchaToken: string,
  ) => {
    const supabase = getSupabase()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken,
      },
    })
    if (error) throw error
  }

  const signUp = async (
    email: string,
    password: string,
    captchaToken: string,
  ) => {
    const supabase = getSupabase()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://app.entropretty.com/login',
        captchaToken,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

