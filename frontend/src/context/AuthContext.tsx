import React, { createContext, useContext, useState, useEffect } from 'react'
import { UserProfile } from '../types'
import { initialProfile } from '../data/mockData'
import { storage } from '../utils/storage'

interface AuthContextValue {
  user: UserProfile | null
  isAuthenticated: boolean
  login: (email: string, pass: string) => Promise<boolean>
  register: (name: string, email: string, pass: string) => Promise<boolean>
  logout: () => void
  updateProfile: (profile: Partial<UserProfile>) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const AUTH_STORAGE_KEY = 'student_life_os_auth_user'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    return storage.get<UserProfile | null>(AUTH_STORAGE_KEY, initialProfile)
  })

  useEffect(() => {
    if (user) {
      storage.set(AUTH_STORAGE_KEY, user)
    } else {
      storage.remove(AUTH_STORAGE_KEY)
    }
  }, [user])

  const login = async (email: string): Promise<boolean> => {
    const loggedUser: UserProfile = {
      ...initialProfile,
      email,
      name: email.split('@')[0] || 'Aayu Makadia',
    }
    setUser(loggedUser)
    return true
  }

  const register = async (name: string, email: string): Promise<boolean> => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      email,
      college: 'Institute of Technology & Engineering',
      course: 'Computer Science & Engineering',
      semester: 'Semester 1',
    }
    setUser(newUser)
    return true
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...profile } : null))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
