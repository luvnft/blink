'use client'

import React, { useEffect } from 'react'
import { useToast, Toast } from './use-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, dismissToast } = useToast()

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dismissToast(toast.id)
      }, 5000) // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer)
    })
  }, [toasts, dismissToast])

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
        <AnimatePresence>
          {toasts.map((toast: Toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className={`w-full max-w-sm overflow-hidden rounded-lg shadow-lg ${
                toast.variant === 'destructive' ? 'bg-red-500' :
                toast.variant === 'success' ? 'bg-green-500' : 'bg-blue-500'
              } text-white`}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{toast.title}</h3>
                    {toast.description && (
                      <p className="mt-1 text-sm opacity-90">{toast.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => dismissToast(toast.id)}
                    className="ml-4 inline-flex shrink-0 rounded-md p-1.5 text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}