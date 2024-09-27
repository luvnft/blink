'use client'

import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration?: number
}

interface UseToastReturn {
  toasts: Toast[]
  addToast: (message: string, type: ToastType, duration?: number) => void
  removeToast: (id: number) => void
}

const toastVariants = cva(
  "fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg shadow-lg p-4 text-white font-syne transition-all duration-300",
  {
    variants: {
      type: {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
        warning: "bg-yellow-500",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
)

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType, duration = 5000) => {
    const id = Date.now()
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}

interface ToastComponentProps extends VariantProps<typeof toastVariants> {
  toast: Toast
  onClose: () => void
}

function ToastComponent({ toast, onClose, type }: ToastComponentProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, toast.duration ? toast.duration - 300 : 4700)

    return () => clearTimeout(timer)
  }, [toast.duration])

  return (
    <div 
      className={cn(
        toastVariants({ type: toast.type }),
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        'transform transition-all duration-300 ease-in-out'
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex justify-between items-center">
        <p className="pr-2">{toast.message}</p>
        <button 
          onClick={onClose} 
          className="ml-4 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1 transition-colors duration-200"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: number) => void }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) {
    return null
  }

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <ToastComponent 
          key={toast.id} 
          toast={toast} 
          onClose={() => removeToast(toast.id)} 
          type={toast.type}
        />
      ))}
    </div>,
    document.body
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, addToast, removeToast } = useToast()

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  )
}