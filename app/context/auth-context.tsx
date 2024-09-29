/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { AccountSetupDialog } from '@/components/account-setup-dialog'
import { useToast } from '@/hooks/use-toast'
import { AuthContextProps, ReactChildrenProps } from '@/interfaces'
import { COOKIE_USER_DATA_KEY } from '@/lib/constants/app-constants'
import CookiesService from '@/lib/cookie.lib'
import { UserService } from '@/lib/services/user-service'
import { useWallet } from '@solana/wallet-adapter-react'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

//? initial context state
const initialAuthState: AuthContextProps = {
  isLoggedIn: false,
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUser: (user: any) => null,
  isUserLoading: true,
}

//? declaration of auth context
export const AuthContext = createContext<AuthContextProps>(initialAuthState)

//? utility function that returns the useContext
export const useAuth = () => {
  return useContext(AuthContext)
}

export default function AuthContextProvider({ children }: ReactChildrenProps) {
  const { publicKey, connected, wallet } = useWallet()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(CookiesService.get(COOKIE_USER_DATA_KEY))
  const [isLoading, setIsLoading] = useState(true)

  const publicRoutes = ['/', '/hub']

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
        } else {
          // logout()
        }
      }
      setIsLoading(false)
    }

    initAuth()

    if (wallet) {
      wallet.adapter.on('disconnect', logout)
    }
  }, [connected, publicKey])

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      if (!publicRoutes.includes(pathname)) {
        router.replace('/hub')
      }
    }
  }, [isLoggedIn, isLoading, pathname])

  //? function to log a user out
  const logout = () => {
    CookiesService.remove(COOKIE_USER_DATA_KEY)
    setIsLoggedIn(false)
    setUser(null)
    // router.replace('/hub')
  }

  // ? function to set user to cookie and state
  const handleSetUser = (passedUser: any) => {
    const newUser = { ...(user || {}), ...passedUser }
    CookiesService.setter(COOKIE_USER_DATA_KEY, newUser)
    setUser(newUser)
  }

  const fetchProfile = async () => {
    if (!publicKey) return

    const getUser = await UserService.loginOrSignUp(publicKey?.toString())
    if (!getUser.success)
      return toast({
        title: 'failed to fetch profile',
        description: getUser?.message || 'Error Occurred',
        variant: 'destructive',
      })

    console.log('user', getUser.data)
    handleSetUser(getUser.data)
  }

  //? declaring value that will be passed down the app through the AuthContext's provider.
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