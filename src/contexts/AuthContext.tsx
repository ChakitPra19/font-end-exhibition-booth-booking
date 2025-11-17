'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface User {
  _id: string
  name: string
  email: string
  role?: string // Make role optional since backend might not include it
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token in localStorage
    const checkAuth = () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      console.log('Checking auth - storedToken:', storedToken) // Debug
      console.log('Checking auth - storedUser:', storedUser) // Debug

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setToken(storedToken)
          setUser(userData)
          console.log('Auth restored from localStorage:', userData) // Debug log
        } catch (error) {
          console.error('Error parsing stored user data:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      } else {
        console.log('No stored auth data found') // Debug
      }
      setLoading(false)
    }

    checkAuth()
  }, []) // Remove forceUpdate dependency

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()
      console.log('Full login response:', data) // Debug log

      if (data.success && data.token) {
        const userToken = data.token

        // After successful login, get complete user info including role
        try {
          const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${userToken}`,
              'Content-Type': 'application/json',
            },
          })

          if (!userResponse.ok) {
            throw new Error('Failed to get user info')
          }

          const userInfoData = await userResponse.json()
          console.log('User info response:', userInfoData) // Debug log

          let completeUserData
          if (userInfoData.success && userInfoData.data) {
            completeUserData = userInfoData.data
          } else {
            // Fallback to login response data if /auth/me fails
            completeUserData = data.data || data.user || {
              _id: data._id || data.id,
              name: data.name,
              email: data.email,
            }
          }

          console.log('Complete user data:', completeUserData) // Debug log

          if (completeUserData && (completeUserData._id || completeUserData.id)) {
            // Normalize user data
            const normalizedUser = {
              _id: completeUserData._id || completeUserData.id,
              name: completeUserData.name,
              email: completeUserData.email,
              role: completeUserData.role // Should now have the correct role from /auth/me
            }
            
            // Update state first
            setUser(normalizedUser)
            setToken(userToken)

            // Then store in localStorage
            localStorage.setItem('token', userToken)
            localStorage.setItem('user', JSON.stringify(normalizedUser))

            console.log('Auth state updated successfully with complete user:', normalizedUser) // Debug log
          } else {
            throw new Error('Invalid user data received from /auth/me')
          }
        } catch (userInfoError) {
          console.error('Error fetching user info:', userInfoError)
          // Continue with basic user data from login if /auth/me fails
          const basicUserData = data.data || data.user || {
            _id: data._id || data.id,
            name: data.name,
            email: data.email,
          }

          const normalizedUser = {
            _id: basicUserData._id || basicUserData.id,
            name: basicUserData.name,
            email: basicUserData.email,
            role: basicUserData.role
          }

          setUser(normalizedUser)
          setToken(userToken)
          localStorage.setItem('token', userToken)
          localStorage.setItem('user', JSON.stringify(normalizedUser))
        }
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const value = {
    user,
    token,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}