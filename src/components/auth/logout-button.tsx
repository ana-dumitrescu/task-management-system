'use client'

import { signOut } from 'next-auth/react'
import { useState } from 'react'

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await signOut({ redirect: true, callbackUrl: '/login' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      {isLoading ? 'Signing out...' : 'Sign out'}
    </button>
  )
}