'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { usePathname, useRouter } from 'next/navigation'
import { AccountSetupDialog } from '@/components/account-setup-dialog'
import { useToast } from '@/hooks/use-toast'
import { AuthContextProps, ReactChildrenProps } from '@/interfaces'
import { COOKIE_USER_DATA_KEY } from '@/lib/constants/app-constants'
import CookiesService from '@/lib/cookie.lib'
import { UserService } from '@/lib/services/user-service'

const initialAuthState: AuthContextProps = {
  isLoggedIn: false,
  user: null,
  setUser: () => null,
  isUserLoading: true,
}

export const AuthContext = createContext<AuthContextProps>(initialAuthState)

export const useAuth = () => useContext(AuthContext)

export default function AuthContextProvider({ children }: ReactChildrenProps) {
  const { publicKey, connected, wallet } = useWallet()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(CookiesService.get(COOKIE_USER_DATA_KEY))
  const [isLoading, setIsLoading] = useState(true)

  const publicRoutes = ['/', '/hub']

  const handleSetUser = useCallback((passedUser: any) => {
    const newUser = { ...(user || {}), ...passedUser }
    CookiesService.setter(COOKIE_USER_DATA_KEY, newUser)
    setUser(newUser)
  }, [user])

  const logout = useCallback(() => {
    CookiesService.remove(COOKIE_USER_DATA_KEY)
    setIsLoggedIn(false)
    setUser(null)
  }, [])

  const fetchProfile = useCallback(async () => {
    if (!publicKey) return

    try {
      const getUser = await UserService.loginOrSignUp(publicKey.toString())
      if (!getUser.success) {
        throw new Error(getUser.message || 'Failed to fetch profile')
      }
      handleSetUser(getUser.data)
    } catch (error) {
      toast({
        title: 'Failed to fetch profile',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      })
    }
  }, [publicKey, handleSetUser, toast])

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      if (connected && publicKey) {
        await fetchProfile()
        setIsLoggedIn(true)
      } else {
        const savedUser = CookiesService.get(COOKIE_USER_DATA_KEY)
        if (savedUser) {
          setUser(savedUser)
          setIsLoggedIn(true)
        }
      }
      setIsLoading(false)
    }

    initAuth()

    if (wallet) {
      wallet.adapter.on('disconnect', logout)
      return () => {
        wallet.adapter.off('disconnect', logout)
      }
    }
  }, [connected, publicKey, wallet, logout, fetchProfile])

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !publicRoutes.includes(pathname)) {
      router.replace('/hub')
    }
  }, [isLoggedIn, isLoading, pathname, router])

  const authContextValue: AuthContextProps = {
    isLoggedIn,
    user,
    setUser: handleSetUser,
    isUserLoading: isLoading,
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {connected && publicKey && user && <AccountSetupDialog />}
      {children}
    </AuthContext.Provider>
  )
}