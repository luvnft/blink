import { useState, useCallback } from 'react'

export type ToastVariant = 'default' | 'destructive' | 'success'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

export interface UseToastReturn {
  toast: (props: Omit<Toast, 'id'>) => void
  toasts: Toast[]
  dismissToast: (id: string) => void
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID() // Using a more robust method for generating unique IDs
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant }])

    // Automatically dismiss the toast after 5 seconds
    setTimeout(() => dismissToast(id), 5000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return { toast, toasts, dismissToast }
}