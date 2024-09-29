'use client'

import React from 'react'
import { useToast, Toast } from './use-toast'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, dismissToast } = useToast()

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        {toasts.map((toast: Toast) => (
          <div
            key={toast.id}
            className={`mb-2 p-4 rounded-md shadow-md ${
              toast.variant === 'destructive' ? 'bg-red-500' :
              toast.variant === 'success' ? 'bg-green-500' : 'bg-blue-500'
            } text-white`}
          >
            <h3 className="font-bold">{toast.title}</h3>
            {toast.description && <p>{toast.description}</p>}
            <button
              onClick={() => dismissToast(toast.id)}
              className="mt-2 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </>
  )
}